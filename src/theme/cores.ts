/** Paleta do MediSUS: verde saude (SUS), azul confianca e ambar para avisos. */
export const cores = {
  primaria: '#0E7C66',
  primariaEscura: '#075E4D',
  primariaClara: '#E3F2EE',
  secundaria: '#1F5FBF',
  secundariaClara: '#E6EEFA',
  destaque: '#F2A93B',
  destaqueClaro: '#FDF3E2',
  fundo: '#F4F8F7',
  superficie: '#FFFFFF',
  texto: '#12312B',
  textoSuave: '#5B6F6A',
  textoInverso: '#FFFFFF',
  borda: '#DCE6E3',
  erro: '#C0392B',
  erroClaro: '#FBEAE8',
  sucesso: '#1E9E5A',
} as const;

export type Cor = keyof typeof cores;
