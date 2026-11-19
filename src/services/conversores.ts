import type { Estoque, Medicamento, Papel, Ubs } from '../types/api';
import type { MedicationResponse, RoleJava, StockResponse, UbsResponse } from '../types/apiJava';

/** Converte os DTOs em ingles da API Java para os modelos usados pelas telas. */

const papelPorRole: Record<RoleJava, Papel> = {
  CITIZEN: 'CIDADAO',
  PHARMACIST: 'FARMACEUTICO',
  MANAGER: 'GESTOR',
};

export function paraPapel(role: RoleJava): Papel {
  return papelPorRole[role] ?? 'CIDADAO';
}

export function paraUbs(ubs: UbsResponse): Ubs {
  return {
    id: ubs.id,
    nome: ubs.name,
    endereco: ubs.address,
    bairro: [ubs.city, ubs.state].filter(Boolean).join(' - '),
    latitude: ubs.latitude ?? null,
    longitude: ubs.longitude ?? null,
  };
}

export function paraMedicamento(medicamento: MedicationResponse): Medicamento {
  return {
    id: medicamento.id,
    nome: medicamento.name,
    principioAtivo: medicamento.activeIngredient ?? '',
    // A API nao separa dosagem nem Farmacia Popular: a descricao faz o papel da dosagem.
    dosagem: medicamento.description ?? '',
    farmaciaPopular: false,
  };
}

/**
 * O estoque da API traz so os ids e nomes; a UBS completa (endereco, mapa) vem da lista de UBS
 * e o remedio completo, da lista de remedios.
 */
export function paraEstoque(
  estoque: StockResponse,
  ubsPorId: Map<number, Ubs>,
  medicamentoPorId: Map<number, Medicamento>
): Estoque {
  return {
    id: estoque.id,
    ubs: ubsPorId.get(estoque.ubsId) ?? {
      id: estoque.ubsId,
      nome: estoque.ubsName,
      endereco: '',
      bairro: '',
      latitude: null,
      longitude: null,
    },
    medicamento: medicamentoPorId.get(estoque.medicationId) ?? {
      id: estoque.medicationId,
      nome: estoque.medicationName,
      principioAtivo: '',
      dosagem: '',
      farmaciaPopular: false,
    },
    quantidade: estoque.quantity,
    // A API nao tem estoque minimo: so diferencia "tem" de "em falta".
    quantidadeMinima: 0,
    atualizadoEm: estoque.updatedAt,
  };
}

/** Busca sem diferenciar maiuscula nem acento. */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
