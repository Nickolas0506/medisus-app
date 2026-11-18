import type { RespostaBula } from '../types/api';
import { http } from './http';

/** Pergunta sobre o remedio respondida pela IA com base na bula oficial (RAG). */
export const bulaService = {
  async perguntar(medicamentoId: number, pergunta: string): Promise<RespostaBula> {
    const { data } = await http.post<RespostaBula>(
      '/bulas/perguntar',
      { medicamentoId, pergunta },
      { timeout: 60_000 }
    );
    return data;
  },
};
