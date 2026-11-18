import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { alertaService } from '../services/alertaService';
import type { AlertaRequisicao } from '../types/api';
import { chaves } from './chaves';

export function useAlertas() {
  return useQuery({
    queryKey: chaves.alertas,
    queryFn: () => alertaService.listar(),
    select: (pagina) => pagina.itens,
  });
}

export function useAlerta(id: number | undefined) {
  return useQuery({
    queryKey: chaves.alerta(id ?? 0),
    queryFn: () => alertaService.obter(id!),
    enabled: id != null,
  });
}

/** Criar, editar e excluir alerta. Toda alteracao recarrega a lista vinda da API. */
export function useMutacoesAlerta() {
  const cliente = useQueryClient();
  const recarregar = () => cliente.invalidateQueries({ queryKey: chaves.alertas });

  const criar = useMutation({
    mutationFn: (alerta: AlertaRequisicao) => alertaService.criar(alerta),
    onSuccess: recarregar,
  });

  const atualizar = useMutation({
    mutationFn: ({ id, alerta }: { id: number; alerta: AlertaRequisicao }) =>
      alertaService.atualizar(id, alerta),
    onSuccess: recarregar,
  });

  const excluir = useMutation({
    mutationFn: (id: number) => alertaService.excluir(id),
    onSuccess: recarregar,
  });

  return { criar, atualizar, excluir };
}
