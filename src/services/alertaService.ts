import type { AlertaReposicao, AlertaRequisicao, Pagina, PaginaSpring } from '../types/api';
import { converterPagina, http } from './http';

/** CRUD dos alertas de reposicao do usuario logado. */
export const alertaService = {
  async listar(pagina = 0, tamanho = 50): Promise<Pagina<AlertaReposicao>> {
    const { data } = await http.get<PaginaSpring<AlertaReposicao>>('/alertas', {
      params: { page: pagina, size: tamanho, sort: 'criadoEm,desc' },
    });
    return converterPagina(data);
  },

  async obter(id: number): Promise<AlertaReposicao> {
    const { data } = await http.get<AlertaReposicao>(`/alertas/${id}`);
    return data;
  },

  async criar(alerta: AlertaRequisicao): Promise<AlertaReposicao> {
    const { data } = await http.post<AlertaReposicao>('/alertas', alerta);
    return data;
  },

  async atualizar(id: number, alerta: AlertaRequisicao): Promise<AlertaReposicao> {
    const { data } = await http.put<AlertaReposicao>(`/alertas/${id}`, alerta);
    return data;
  },

  async excluir(id: number): Promise<void> {
    await http.delete(`/alertas/${id}`);
  },
};
