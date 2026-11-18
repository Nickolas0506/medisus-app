// Modelos devolvidos pela API Java do MediSUS (ver docs/contrato-api.md).

export type Papel = 'CIDADAO' | 'FARMACEUTICO' | 'GESTOR';

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  papel: Papel;
};

export type RespostaAuth = {
  token: string;
  usuario: Usuario;
};

export type Ubs = {
  id: number;
  nome: string;
  bairro: string;
  endereco: string;
  latitude: number | null;
  longitude: number | null;
};

export type Medicamento = {
  id: number;
  nome: string;
  principioAtivo: string;
  dosagem: string;
  farmaciaPopular: boolean;
};

export type Estoque = {
  id: number;
  ubs: Ubs;
  medicamento: Medicamento;
  quantidade: number;
  quantidadeMinima: number;
  atualizadoEm: string;
};

export type AlertaReposicao = {
  id: number;
  medicamento: Medicamento;
  ubs: Ubs | null;
  ativo: boolean;
  criadoEm: string;
  avisadoEm: string | null;
};

export type AlertaRequisicao = {
  medicamentoId: number;
  ubsId: number | null;
  ativo: boolean;
};

export type ItemReceita = {
  textoLido: string;
  dose: string | null;
  medicamento: Medicamento | null;
  estoques: Estoque[];
};

export type LeituraReceita = {
  itens: ItemReceita[];
};

export type RespostaBula = {
  resposta: string;
  fontes: string[];
};

/** Pagina do Spring Data (formato classico ou o "VIA_DTO" do Spring Boot 3.3+). */
export type PaginaSpring<T> = {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  page?: { size: number; number: number; totalElements: number; totalPages: number };
};

export type Pagina<T> = {
  itens: T[];
  pagina: number;
  totalPaginas: number;
  totalItens: number;
};

/** Corpo de erro padronizado pelo @RestControllerAdvice da API. */
export type ErroApi = {
  status?: number;
  erro?: string;
  mensagem?: string;
  campos?: { campo: string; mensagem: string }[];
};
