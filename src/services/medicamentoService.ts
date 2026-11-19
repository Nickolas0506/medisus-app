import type { Estoque, Medicamento, Pagina, PaginaSpring } from '../types/api';
import type { MedicationResponse, StockResponse } from '../types/apiJava';
import { normalizar, paraEstoque, paraMedicamento } from './conversores';
import { converterPagina, http } from './http';
import { ubsService } from './ubsService';

async function listarTodos(): Promise<Medicamento[]> {
  const { data } = await http.get<PaginaSpring<MedicationResponse>>('/medications', {
    params: { page: 0, size: 500, sort: 'name' },
  });
  return converterPagina(data).itens.map(paraMedicamento);
}

export const medicamentoService = {
  listarTodos,

  /** A API nao filtra por nome: busca a lista e filtra por nome ou principio ativo no app. */
  async buscar(nome: string, pagina = 0, tamanho = 20): Promise<Pagina<Medicamento>> {
    const termo = normalizar(nome);
    const todos = await listarTodos();
    const encontrados = termo
      ? todos.filter(
          (m) => normalizar(m.nome).includes(termo) || normalizar(m.principioAtivo).includes(termo)
        )
      : todos;
    const inicio = pagina * tamanho;
    return {
      itens: encontrados.slice(inicio, inicio + tamanho),
      pagina,
      totalPaginas: Math.max(1, Math.ceil(encontrados.length / tamanho)),
      totalItens: encontrados.length,
    };
  },

  async obter(id: number): Promise<Medicamento> {
    const { data } = await http.get<MedicationResponse>(`/medications/${id}`);
    return paraMedicamento(data);
  },

  /** Estoque do remedio em cada UBS cadastrada pela farmacia (inclusive as zeradas). */
  async estoquesPorUbs(medicamentoId: number): Promise<Estoque[]> {
    const [resposta, listaUbs, medicamento] = await Promise.all([
      http.get<PaginaSpring<StockResponse>>('/stocks', {
        params: { medicationId: medicamentoId, page: 0, size: 200 },
      }),
      ubsService.listar(),
      medicamentoService.obter(medicamentoId),
    ]);
    const ubsPorId = new Map(listaUbs.map((ubs) => [ubs.id, ubs]));
    const medicamentoPorId = new Map([[medicamento.id, medicamento]]);
    return converterPagina(resposta.data).itens.map((estoque) =>
      paraEstoque(estoque, ubsPorId, medicamentoPorId)
    );
  },
};
