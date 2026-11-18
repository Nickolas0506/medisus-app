import type { RespostaAuth } from '../types/api';
import { http } from './http';

export type DadosCadastro = { nome: string; email: string; senha: string };

export const authService = {
  async entrar(email: string, senha: string): Promise<RespostaAuth> {
    const { data } = await http.post<RespostaAuth>('/auth/login', { email, senha });
    return data;
  },

  async cadastrar(dados: DadosCadastro): Promise<RespostaAuth> {
    const { data } = await http.post<RespostaAuth>('/auth/cadastro', dados);
    return data;
  },
};
