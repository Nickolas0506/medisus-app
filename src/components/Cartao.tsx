import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { cores, espacos, raios, sombra } from '../theme';

type Props = {
  children: ReactNode;
  aoPressionar?: () => void;
  rotuloAcessivel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Cartao({ children, aoPressionar, rotuloAcessivel, style }: Props) {
  if (!aoPressionar) return <View style={[estilos.cartao, style]}>{children}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      onPress={aoPressionar}
      style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado, style]}
    >
      {children}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    padding: espacos.md,
    gap: espacos.sm,
    borderWidth: 1,
    borderColor: cores.borda,
    ...sombra,
  },
  pressionado: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
