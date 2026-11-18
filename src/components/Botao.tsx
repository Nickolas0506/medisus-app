import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { cores, espacos, fontes, raios } from '../theme';
import { Texto } from './Texto';

type Tipo = 'primario' | 'secundario' | 'contorno' | 'perigo';

type Props = {
  titulo: string;
  aoPressionar: () => void;
  tipo?: Tipo;
  icone?: keyof typeof Ionicons.glyphMap;
  carregando?: boolean;
  desabilitado?: boolean;
};

const fundoPorTipo: Record<Tipo, string> = {
  primario: cores.primaria,
  secundario: cores.secundaria,
  contorno: 'transparent',
  perigo: cores.erro,
};

export function Botao({
  titulo,
  aoPressionar,
  tipo = 'primario',
  icone,
  carregando,
  desabilitado,
}: Props) {
  const inativo = desabilitado || carregando;
  const corConteudo = tipo === 'contorno' ? cores.primaria : cores.textoInverso;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: !!inativo, busy: !!carregando }}
      onPress={aoPressionar}
      disabled={inativo}
      style={({ pressed }) => [
        estilos.botao,
        { backgroundColor: fundoPorTipo[tipo] },
        tipo === 'contorno' && estilos.contorno,
        pressed && estilos.pressionado,
        inativo && estilos.inativo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corConteudo} />
      ) : (
        <View style={estilos.conteudo}>
          {icone && <Ionicons name={icone} size={20} color={corConteudo} />}
          <Texto style={[estilos.titulo, { color: corConteudo }]}>{titulo}</Texto>
        </View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: 50,
    borderRadius: raios.md,
    paddingHorizontal: espacos.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contorno: { borderWidth: 1.5, borderColor: cores.primaria },
  pressionado: { opacity: 0.85 },
  inativo: { opacity: 0.55 },
  conteudo: { flexDirection: 'row', alignItems: 'center', gap: espacos.sm },
  titulo: { fontFamily: fontes.negrito, fontSize: 16 },
});
