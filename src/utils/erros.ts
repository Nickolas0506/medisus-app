import { isAxiosError } from 'axios';
import type { ErroApi } from '../types/api';

const nomeDoCampo: Record<string, string> = {
  name: 'nome',
  email: 'e-mail',
  password: 'senha (mínimo 8 caracteres)',
};

/** Transforma qualquer falha de chamada em uma frase que o usuario entende. */
export function mensagemDeErro(erro: unknown): string {
  if (isAxiosError<ErroApi>(erro)) {
    if (erro.code === 'ECONNABORTED') {
      return 'O servidor demorou para responder. Tente de novo em instantes.';
    }
    if (!erro.response) {
      return 'Sem conexão com o servidor do MediSUS. Verifique sua internet.';
    }

    // A API responde em ingles; o app traduz pelo status e so repete o campo invalido.
    const corpo = erro.response.data;
    const primeiroCampo = Object.keys(corpo?.fieldErrors ?? {})[0];

    switch (erro.response.status) {
      case 400:
        return primeiroCampo
          ? `Confira o campo ${nomeDoCampo[primeiroCampo] ?? primeiroCampo}.`
          : 'Dados inválidos. Confira os campos e tente de novo.';
      case 401:
        return 'E-mail ou senha incorretos.';
      case 403:
        return 'Você não tem permissão para esta ação.';
      case 404:
        return 'Não encontramos o que você procurou.';
      case 409:
        return 'Este registro já existe.';
      case 503:
        return 'A leitura de receita por IA está desligada no servidor agora. Busque o remédio pelo nome.';
      default:
        return `Erro no servidor (${erro.response.status}). Tente mais tarde.`;
    }
  }
  if (erro instanceof Error) return erro.message;
  return 'Algo deu errado. Tente de novo.';
}
