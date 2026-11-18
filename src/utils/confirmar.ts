import { Alert, Platform } from 'react-native';

/** Pergunta de confirmacao que funciona no celular (Alert) e no navegador (confirm). */
export function confirmar(titulo: string, mensagem: string, textoConfirmar = 'Confirmar') {
  return new Promise<boolean>((resolver) => {
    if (Platform.OS === 'web') {
      resolver(globalThis.confirm?.(`${titulo}\n\n${mensagem}`) ?? false);
      return;
    }
    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolver(false) },
      { text: textoConfirmar, style: 'destructive', onPress: () => resolver(true) },
    ]);
  });
}
