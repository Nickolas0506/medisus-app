import { StyleSheet, Text, type TextProps } from 'react-native';
import { cores, fontes, type Cor } from '../theme';

type Variante = 'titulo' | 'subtitulo' | 'corpo' | 'legenda' | 'rotulo';

type Props = TextProps & {
  variante?: Variante;
  cor?: Cor;
  centralizado?: boolean;
};

/** Texto com a fonte Nunito e a escala tipografica do app. */
export function Texto({ variante = 'corpo', cor = 'texto', centralizado, style, ...props }: Props) {
  return (
    <Text
      style={[estilos[variante], { color: cores[cor] }, centralizado && estilos.centro, style]}
      {...props}
    />
  );
}

const estilos = StyleSheet.create({
  titulo: { fontFamily: fontes.extraNegrito, fontSize: 26, lineHeight: 32 },
  subtitulo: { fontFamily: fontes.negrito, fontSize: 18, lineHeight: 24 },
  corpo: { fontFamily: fontes.regular, fontSize: 15, lineHeight: 22 },
  legenda: { fontFamily: fontes.regular, fontSize: 13, lineHeight: 18 },
  rotulo: { fontFamily: fontes.semiBold, fontSize: 14, lineHeight: 20 },
  centro: { textAlign: 'center' },
});
