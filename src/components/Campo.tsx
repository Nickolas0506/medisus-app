import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { cores, espacos, fontes, raios } from '../theme';
import { Texto } from './Texto';

type Props = TextInputProps & {
  rotulo: string;
  erro?: string | null;
  icone?: keyof typeof Ionicons.glyphMap;
  senha?: boolean;
};

/** Campo de formulario com rotulo, icone, mensagem de erro e olho para senha. */
export const Campo = forwardRef<TextInput, Props>(function Campo(
  { rotulo, erro, icone, senha, style, ...props },
  ref
) {
  const [focado, setFocado] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  return (
    <View style={estilos.container}>
      <Texto variante="rotulo">{rotulo}</Texto>
      <View style={[estilos.caixa, focado && estilos.caixaFocada, !!erro && estilos.caixaComErro]}>
        {icone && <Ionicons name={icone} size={20} color={cores.textoSuave} />}
        <TextInput
          ref={ref}
          accessibilityLabel={rotulo}
          placeholderTextColor={cores.textoSuave}
          secureTextEntry={senha && !senhaVisivel}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          style={[estilos.input, style]}
          {...props}
        />
        {senha && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={senhaVisivel ? 'Esconder senha' : 'Mostrar senha'}
            onPress={() => setSenhaVisivel((visivel) => !visivel)}
            hitSlop={10}
          >
            <Ionicons
              name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={cores.textoSuave}
            />
          </Pressable>
        )}
      </View>
      {!!erro && (
        <Texto variante="legenda" cor="erro">
          {erro}
        </Texto>
      )}
    </View>
  );
});

const estilos = StyleSheet.create({
  container: { gap: espacos.xs },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    minHeight: 50,
    paddingHorizontal: espacos.md,
    borderRadius: raios.md,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  caixaFocada: { borderColor: cores.primaria },
  caixaComErro: { borderColor: cores.erro },
  input: {
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: 15,
    color: cores.texto,
    paddingVertical: espacos.sm,
  },
});
