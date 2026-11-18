import type { Estoque, Medicamento, Pagina, PaginaSpring } from '../types/api';
import { converterPagina, http } from './http';

export const medicamentoService = {
  async buscar(nome: string, pagina = 0, tamanho = 20): Promise<Pagina<Medicamento>> {
    const { data } = await http.get<PaginaSpring<Medicamento>>('/medicamentos', {
      params: { nome: nome || undefined, page: pagina, size: tamanho, sort: 'nome' },
    });
    return converterPagina(data);
  },

  async obter(id: number): Promise<Medicamento> {
    const { data } = await http.get<Medicamento>(`/medicamentos/${id}`);
    return data;
  },

  /** Estoque do remedio em cada UBS (inclusive as zeradas). */
  async estoquesPorUbs(medicamentoId: number): Promise<Estoque[]> {
    const { data } = await http.get<PaginaSpring<Estoque>>('/estoques', {
      params: { medicamentoId, page: 0, size: 100, sort: 'quantidade,desc' },
    });
    return converterPagina(data).itens;
  },
};
