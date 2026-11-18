import type { Estoque } from '../types/api';

export function formatarDataHora(iso?: string | null): string {
  if (!iso) return '-';
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '-';
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export function formatarData(iso?: string | null): string {
  if (!iso) return '-';
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '-';
  return data.toLocaleDateString('pt-BR');
}

export type SituacaoEstoque = 'disponivel' | 'baixo' | 'emFalta';

export function situacaoDoEstoque(estoque: Pick<Estoque, 'quantidade' | 'quantidadeMinima'>) {
  if (estoque.quantidade <= 0) return 'emFalta';
  if (estoque.quantidade <= estoque.quantidadeMinima) return 'baixo';
  return 'disponivel';
}

export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? nome;
}
