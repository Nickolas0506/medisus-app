import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { cores, espacos, fontes, raios, type Cor } from '../theme';
import { Texto } from './Texto';

type Tom = 'sucesso' | 'aviso' | 'perigo' | 'info' | 'neutro';

const paleta: Record<Tom, { fundo: string; texto: Cor }> = {
  sucesso: { fundo: cores.primariaClara, texto: 'primariaEscura' },
  aviso: { fundo: cores.destaqueClaro, texto: 'texto' },
  perigo: { fundo: cores.erroClaro, texto: 'erro' },
  info: { fundo: cores.secundariaClara, texto: 'secundaria' },
  neutro: { fundo: cores.fundo, texto: 'textoSuave' },
};

type Props = {
  texto: string;
  tom?: Tom;
  icone?: keyof typeof Ionicons.glyphMap;
};

export function Etiqueta({ texto, tom = 'neutro', icone }: Props) {
  const { fundo, texto: corTexto } = paleta[tom];
  return (
    <View style={[estilos.etiqueta, { backgroundColor: fundo }]}>
      {icone && <Ionicons name={icone} size={14} color={cores[corTexto]} />}
      <Texto variante="legenda" cor={corTexto} style={estilos.texto}>
        {texto}
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: espacos.xs,
    paddingHorizontal: espacos.sm,
    paddingVertical: 3,
    borderRadius: raios.pilula,
  },
  texto: { fontFamily: fontes.negrito },
});
