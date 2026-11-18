import type { PaginaSpring, Ubs } from '../types/api';
import { converterPagina, http } from './http';

export const ubsService = {
  async listar(): Promise<Ubs[]> {
    const { data } = await http.get<PaginaSpring<Ubs>>('/ubs', {
      params: { page: 0, size: 100, sort: 'nome' },
    });
    return converterPagina(data).itens;
  },
};
