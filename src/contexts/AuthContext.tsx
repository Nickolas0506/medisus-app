import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { queryClient } from '../config/queryClient';
import { authService, type DadosCadastro } from '../services/authService';
import { registrarAoSessaoExpirar } from '../services/http';
import { carregarSessao, limparSessao, salvarSessao } from '../services/sessao';
import type { Usuario } from '../types/api';

type AuthValor = {
  usuario: Usuario | null;
  restaurandoSessao: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (dados: DadosCadastro) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthValor | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [restaurandoSessao, setRestaurandoSessao] = useState(true);

  useEffect(() => {
    carregarSessao()
      .then((sessao) => setUsuario(sessao?.usuario ?? null))
      .catch(() => setUsuario(null))
      .finally(() => setRestaurandoSessao(false));
  }, []);

  const valor = useMemo<AuthValor>(() => {
    async function sair() {
      await limparSessao();
      queryClient.clear();
      setUsuario(null);
    }

    return {
      usuario,
      restaurandoSessao,
      async entrar(email, senha) {
        const { token, usuario: logado } = await authService.entrar(email.trim(), senha);
        await salvarSessao(token, logado);
        setUsuario(logado);
      },
      async cadastrar(dados) {
        const { token, usuario: criado } = await authService.cadastrar({
          ...dados,
          nome: dados.nome.trim(),
          email: dados.email.trim(),
        });
        await salvarSessao(token, criado);
        setUsuario(criado);
      },
      sair,
    };
  }, [usuario, restaurandoSessao]);

  // Token vencido ou invalido (401): encerra a sessao e volta para o login.
  useEffect(() => {
    registrarAoSessaoExpirar(() => void valor.sair());
    return () => registrarAoSessaoExpirar(null);
  }, [valor]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return contexto;
}
