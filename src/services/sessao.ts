import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { Usuario } from '../types/api';

// Token JWT guardado no armazenamento seguro do aparelho (Keystore/Keychain).
// No navegador (expo web) nao existe SecureStore, entao usa o localStorage.
const CHAVE_TOKEN = 'medisus_token';
const CHAVE_USUARIO = 'medisus_usuario';

let tokenEmMemoria: string | null = null;

async function ler(chave: string): Promise<string | null> {
  if (Platform.OS === 'web') return globalThis.localStorage?.getItem(chave) ?? null;
  return SecureStore.getItemAsync(chave);
}

async function gravar(chave: string, valor: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(chave, valor);
    return;
  }
  await SecureStore.setItemAsync(chave, valor);
}

async function apagar(chave: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(chave);
    return;
  }
  await SecureStore.deleteItemAsync(chave);
}

export function obterToken(): string | null {
  return tokenEmMemoria;
}

export async function salvarSessao(token: string, usuario: Usuario): Promise<void> {
  tokenEmMemoria = token;
  await gravar(CHAVE_TOKEN, token);
  await gravar(CHAVE_USUARIO, JSON.stringify(usuario));
}

export async function carregarSessao(): Promise<{ token: string; usuario: Usuario } | null> {
  const [token, usuarioJson] = await Promise.all([ler(CHAVE_TOKEN), ler(CHAVE_USUARIO)]);
  if (!token || !usuarioJson) return null;
  tokenEmMemoria = token;
  return { token, usuario: JSON.parse(usuarioJson) as Usuario };
}

export async function limparSessao(): Promise<void> {
  tokenEmMemoria = null;
  await Promise.all([apagar(CHAVE_TOKEN), apagar(CHAVE_USUARIO)]);
}
