import type { AlertaReposicao, AlertaRequisicao, Pagina, PaginaSpring } from '../types/api';
import type { AlertResponse, NotificationResponse } from '../types/apiJava';
import { normalizar } from './conversores';
import { converterPagina, http } from './http';
import { medicamentoService } from './medicamentoService';
import { ubsService } from './ubsService';

/**
 * Alertas de reposicao do usuario logado.
 * O "Chegou!" vem das notificacoes que a API grava quando o RabbitMQ avisa que o estoque subiu
 * ("<remedio> is available at <UBS>.").
 */
async function listar(pagina = 0, tamanho = 50): Promise<Pagina<AlertaReposicao>> {
  const [alertas, notificacoes, medicamentos, listaUbs] = await Promise.all([
    http.get<PaginaSpring<AlertResponse>>('/alerts', {
      params: { page: pagina, size: tamanho, sort: 'createdAt,desc' },
    }),
    http.get<PaginaSpring<NotificationResponse>>('/notifications', {
      params: { page: 0, size: 100, sort: 'createdAt,desc' },
    }),
    medicamentoService.listarTodos(),
    ubsService.listar(),
  ]);
  const medicamentoPorId = new Map(medicamentos.map((m) => [m.id, m]));
  const ubsPorId = new Map(listaUbs.map((u) => [u.id, u]));
  const avisos = converterPagina(notificacoes.data).itens;

  const pag = converterPagina(alertas.data);
  return {
    ...pag,
    itens: pag.itens.map((alerta) => {
      const ubs = alerta.ubsId != null ? (ubsPorId.get(alerta.ubsId) ?? null) : null;
      const aviso = avisos.find((n) => {
        const msg = normalizar(n.message);
        return (
          n.createdAt >= alerta.createdAt &&
          msg.startsWith(normalizar(alerta.medicationName)) &&
          (!ubs || msg.includes(normalizar(ubs.nome)))
        );
      });
      return {
        id: alerta.id,
        medicamento: medicamentoPorId.get(alerta.medicationId) ?? {
          id: alerta.medicationId,
          nome: alerta.medicationName,
          principioAtivo: '',
          dosagem: '',
          farmaciaPopular: false,
        },
        ubs,
        ativo: alerta.active,
        criadoEm: alerta.createdAt,
        avisadoEm: aviso?.createdAt ?? null,
      };
    }),
  };
}

async function criar(alerta: AlertaRequisicao): Promise<void> {
  await http.post('/alerts', {
    medicationId: alerta.medicamentoId,
    ubsId: alerta.ubsId ?? undefined,
  });
}

async function excluir(id: number): Promise<void> {
  await http.delete(`/alerts/${id}`);
}

export const alertaService = {
  listar,
  criar,
  excluir,

  /** A API nao tem GET por id: procura o alerta na lista do usuario. */
  async obter(id: number): Promise<AlertaReposicao> {
    const { itens } = await listar(0, 200);
    const alerta = itens.find((a) => a.id === id);
    if (!alerta) throw new Error('Alerta não encontrado.');
    return alerta;
  },

  /** A API nao tem PUT: trocar a UBS = encerrar o alerta antigo e criar o novo. */
  async atualizar(id: number, alerta: AlertaRequisicao): Promise<void> {
    await criar(alerta);
    await excluir(id);
  },
};
