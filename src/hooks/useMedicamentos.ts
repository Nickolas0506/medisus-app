import { useQuery } from '@tanstack/react-query';
import { medicamentoService } from '../services/medicamentoService';
import { ubsService } from '../services/ubsService';
import { chaves } from './chaves';

export function useBuscaMedicamentos(busca: string) {
  return useQuery({
    queryKey: chaves.medicamentos(busca),
    queryFn: () => medicamentoService.buscar(busca),
  });
}

export function useMedicamento(id: number) {
  return useQuery({
    queryKey: chaves.medicamento(id),
    queryFn: () => medicamentoService.obter(id),
    enabled: id > 0,
  });
}

/** UBS que tem o remedio, da que tem mais para a que tem menos. */
export function useEstoquesDoMedicamento(medicamentoId: number) {
  return useQuery({
    queryKey: chaves.estoques(medicamentoId),
    queryFn: () => medicamentoService.estoquesPorUbs(medicamentoId),
    select: (estoques) => [...estoques].sort((a, b) => b.quantidade - a.quantidade),
  });
}

export function useListaUbs() {
  return useQuery({ queryKey: chaves.ubs, queryFn: ubsService.listar, staleTime: 5 * 60_000 });
}
