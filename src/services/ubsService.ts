import type { PaginaSpring, Ubs } from '../types/api';
import type { UbsResponse } from '../types/apiJava';
import { paraUbs } from './conversores';
import { converterPagina, http } from './http';

export const ubsService = {
  async listar(): Promise<Ubs[]> {
    const { data } = await http.get<PaginaSpring<UbsResponse>>('/ubs', {
      params: { page: 0, size: 200, sort: 'name' },
    });
    return converterPagina(data).itens.map(paraUbs);
  },
};
