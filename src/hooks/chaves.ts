/** Chaves de cache do TanStack Query, centralizadas para invalidar depois do CRUD. */
export const chaves = {
  medicamentos: (busca: string) => ['medicamentos', busca] as const,
  medicamento: (id: number) => ['medicamento', id] as const,
  estoques: (medicamentoId: number) => ['estoques', medicamentoId] as const,
  ubs: ['ubs'] as const,
  alertas: ['alertas'] as const,
  alerta: (id: number) => ['alertas', id] as const,
};
