import type { NavigatorScreenParams } from '@react-navigation/native';

export type RotasAuth = {
  Login: undefined;
  Cadastro: undefined;
};

export type RotasAbas = {
  Buscar: undefined;
  Receita: undefined;
  Alertas: undefined;
  Perfil: undefined;
};

export type RotasApp = {
  Abas: NavigatorScreenParams<RotasAbas>;
  OndeTem: { medicamentoId: number; nome?: string };
  AlertaForm: { alertaId?: number; medicamentoId?: number } | undefined;
  Bula: { medicamentoId: number; nome: string };
  Sobre: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RotasApp, RotasAuth {}
  }
}
