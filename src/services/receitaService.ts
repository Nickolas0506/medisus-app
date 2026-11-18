import { Platform } from 'react-native';
import type { LeituraReceita } from '../types/api';
import { http } from './http';

export type FotoReceita = { uri: string; mimeType?: string | null; nomeArquivo?: string | null };

/** Envia a foto da receita para a IA da API (Spring AI) ler os remedios. */
export const receitaService = {
  async ler(foto: FotoReceita): Promise<LeituraReceita> {
    const formulario = new FormData();
    const tipo = foto.mimeType ?? 'image/jpeg';
    const nome = foto.nomeArquivo ?? 'receita.jpg';

    if (Platform.OS === 'web') {
      const blob = await (await fetch(foto.uri)).blob();
      formulario.append('foto', blob, nome);
    } else {
      // No React Native o FormData recebe o arquivo local por uri, nome e tipo.
      formulario.append('foto', { uri: foto.uri, name: nome, type: tipo } as unknown as Blob);
    }

    const { data } = await http.post<LeituraReceita>('/receitas/ler', formulario, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 90_000,
    });
    return data;
  },
};
