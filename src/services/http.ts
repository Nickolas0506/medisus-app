import { create } from 'axios';
import { obterUrlApi } from '../config/api';
import type { Pagina, PaginaSpring } from '../types/api';
import { obterToken } from './sessao';

/** Cliente Axios unico do app: base da API, timeout e token JWT em toda chamada. */
export const http = create({
  timeout: 20_000,
  headers: { Accept: 'application/json' },
});

http.interceptors.request.use((config) => {
  config.baseURL = obterUrlApi();
  const token = obterToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type AoExpirar = () => void;
let aoSessaoExpirar: AoExpirar | null = null;

/** O AuthContext registra aqui o logout automatico quando a API responde 401. */
export function registrarAoSessaoExpirar(callback: AoExpirar | null) {
  aoSessaoExpirar = callback;
}

http.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const rotaDeAuth = String(erro?.config?.url ?? '').startsWith('/auth/');
    if (erro?.response?.status === 401 && !rotaDeAuth) aoSessaoExpirar?.();
    return Promise.reject(erro);
  }
);

/** Converte a pagina do Spring Data para o formato usado nas telas. */
export function converterPagina<T>(pagina: PaginaSpring<T>): Pagina<T> {
  const meta = pagina.page;
  return {
    itens: pagina.content ?? [],
    pagina: meta?.number ?? pagina.number ?? 0,
    totalPaginas: meta?.totalPages ?? pagina.totalPages ?? 1,
    totalItens: meta?.totalElements ?? pagina.totalElements ?? pagina.content?.length ?? 0,
  };
}
