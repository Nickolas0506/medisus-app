import { Platform } from 'react-native';
import { versaoApp } from './versao';

/**
 * Endereco da API Java do MediSUS.
 * - App publicado: sempre a API em producao (extra.apiUrlProducao do app.json).
 * - Desenvolvimento: EXPO_PUBLIC_API_URL do .env ou a API local na porta 8080.
 */
export function obterUrlApi(): string {
  const doEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!__DEV__ && versaoApp.apiUrlProducao) return versaoApp.apiUrlProducao;
  if (doEnv) return doEnv;
  if (versaoApp.apiUrlProducao) return versaoApp.apiUrlProducao;
  return Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
}
