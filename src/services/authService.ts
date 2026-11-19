import type { RespostaAuth } from '../types/api';
import type { TokenResponse } from '../types/apiJava';
import { paraPapel } from './conversores';
import { http } from './http';

export type DadosCadastro = { nome: string; email: string; senha: string };

export const authService = {
  async entrar(email: string, senha: string): Promise<RespostaAuth> {
    const { data } = await http.post<TokenResponse>('/auth/login', { email, password: senha });
    return {
      token: data.token,
      usuario: { nome: data.name, email, papel: paraPapel(data.role) },
    };
  },

  /** A API so cria a conta (CITIZEN); o token vem do login logo em seguida. */
  async cadastrar(dados: DadosCadastro): Promise<RespostaAuth> {
    await http.post('/auth/register', {
      name: dados.nome,
      email: dados.email,
      password: dados.senha,
    });
    return authService.entrar(dados.email, dados.senha);
  },
};
