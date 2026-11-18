import { Image, StyleSheet, View } from 'react-native';
import { espacos, imagens } from '../theme';
import { Texto } from './Texto';

export function Logo({
  tamanho = 96,
  comSlogan = true,
}: {
  tamanho?: number;
  comSlogan?: boolean;
}) {
  return (
    <View style={estilos.container}>
      <Image
        source={imagens.logo}
        style={{ width: tamanho, height: tamanho }}
        accessibilityLabel="Logotipo do MediSUS"
      />
      <Texto variante="titulo" cor="primariaEscura">
        MediSUS
      </Texto>
      {comSlogan && (
        <Texto cor="textoSuave" centralizado>
          Seu remédio, na UBS certa, sem viagem perdida.
        </Texto>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { alignItems: 'center', gap: espacos.xs },
});
