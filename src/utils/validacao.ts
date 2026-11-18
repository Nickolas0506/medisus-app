const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmail(email: string): string | null {
  if (!email.trim()) return 'Informe seu e-mail.';
  if (!REGEX_EMAIL.test(email.trim())) return 'E-mail inválido.';
  return null;
}

export function validarSenha(senha: string): string | null {
  if (!senha) return 'Informe sua senha.';
  if (senha.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.';
  return null;
}

export function validarNome(nome: string): string | null {
  if (nome.trim().length < 3) return 'Informe seu nome completo.';
  return null;
}

export function validarConfirmacao(senha: string, confirmacao: string): string | null {
  if (senha !== confirmacao) return 'As senhas não conferem.';
  return null;
}
