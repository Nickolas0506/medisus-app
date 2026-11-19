import { Platform } from 'react-native';
import type { LeituraReceita, Medicamento } from '../types/api';
import type { PrescriptionCandidates } from '../types/apiJava';
import { normalizar } from './conversores';
import { http } from './http';
import { medicamentoService } from './medicamentoService';

export type FotoReceita = { uri: string; mimeType?: string | null; nomeArquivo?: string | null };

/** Remedio do cadastro cujo nome ou principio ativo aparece no texto lido pela IA. */
function encontrarNoCadastro(textoLido: string, cadastro: Medicamento[]): Medicamento | null {
  const lido = normalizar(textoLido);
  return (
    cadastro.find((m) => {
      const nome = normalizar(m.nome);
      const ativo = normalizar(m.principioAtivo);
      return (
        (nome && (lido.includes(nome) || nome.includes(lido))) ||
        (ativo && (lido.includes(ativo) || ativo.includes(lido)))
      );
    }) ?? null
  );
}

/** Envia a foto da receita para a IA da API (Spring AI) e liga cada remedio lido ao estoque. */
export const receitaService = {
  async ler(foto: FotoReceita): Promise<LeituraReceita> {
    const formulario = new FormData();
    const tipo = foto.mimeType ?? 'image/jpeg';
    const nome = foto.nomeArquivo ?? 'receita.jpg';

    if (Platform.OS === 'web') {
      const blob = await (await fetch(foto.uri)).blob();
      formulario.append('image', blob, nome);
    } else {
      // No React Native o FormData recebe o arquivo local por uri, nome e tipo.
      formulario.append('image', { uri: foto.uri, name: nome, type: tipo } as unknown as Blob);
    }

    const [{ data }, cadastro] = await Promise.all([
      http.post<PrescriptionCandidates>('/prescriptions/identify', formulario, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 90_000,
      }),
      medicamentoService.listarTodos(),
    ]);

    const itens = await Promise.all(
      (data.candidates ?? []).map(async (textoLido) => {
        const medicamento = encontrarNoCadastro(textoLido, cadastro);
        const estoques = medicamento ? await medicamentoService.estoquesPorUbs(medicamento.id) : [];
        return { textoLido, dose: null, medicamento, estoques };
      })
    );
    return { itens };
  },
};
