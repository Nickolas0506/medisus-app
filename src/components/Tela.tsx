import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { cores, espacos } from '../theme';

type Props = {
  children: ReactNode;
  rolavel?: boolean;
  bordas?: Edge[];
};

/** Estrutura padrao das telas: area segura, fundo do tema e teclado sem cobrir campos. */
export function Tela({ children, rolavel = true, bordas = ['left', 'right'] }: Props) {
  return (
    <SafeAreaView style={estilos.area} edges={bordas}>
      <KeyboardAvoidingView
        style={estilos.area}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {rolavel ? (
          <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={[estilos.area, estilos.conteudoFixo]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  area: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espacos.md, gap: espacos.md, paddingBottom: espacos.xl },
  conteudoFixo: { paddingHorizontal: espacos.md, paddingTop: espacos.md },
});
