import { ActivityIndicator, Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { cores, espacos, imagens } from '../theme';
import { Botao } from './Botao';
import { Texto } from './Texto';

/** Indicador de carregamento com texto explicando o que esta acontecendo. */
export function Carregando({ mensagem = 'Carregando...' }: { mensagem?: string }) {
  return (
    <View style={estilos.centro} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={cores.primaria} />
      <Texto variante="legenda" cor="textoSuave" centralizado>
        {mensagem}
      </Texto>
    </View>
  );
}

/** Mensagem de erro com botao para tentar de novo. */
export function MensagemErro({
  mensagem,
  aoTentarDeNovo,
}: {
  mensagem: string;
  aoTentarDeNovo?: () => void;
}) {
  return (
    <View style={[estilos.centro, estilos.caixaErro]} accessibilityRole="alert">
      <Texto variante="rotulo" cor="erro" centralizado>
        {mensagem}
      </Texto>
      {aoTentarDeNovo && (
        <Botao
          titulo="Tentar de novo"
          tipo="contorno"
          icone="refresh"
          aoPressionar={aoTentarDeNovo}
        />
      )}
    </View>
  );
}

/** Lista vazia com ilustracao propria. */
export function EstadoVazio({
  titulo,
  descricao,
  imagem = imagens.vazio,
}: {
  titulo: string;
  descricao?: string;
  imagem?: ImageSourcePropType;
}) {
  return (
    <View style={estilos.centro}>
      <Image source={imagem} style={estilos.imagem} resizeMode="contain" />
      <Texto variante="subtitulo" centralizado>
        {titulo}
      </Texto>
      {descricao && (
        <Texto cor="textoSuave" centralizado>
          {descricao}
        </Texto>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacos.md,
    paddingVertical: espacos.xl,
    paddingHorizontal: espacos.md,
  },
  caixaErro: { backgroundColor: cores.erroClaro, borderRadius: 16 },
  imagem: { width: 220, height: 154 },
});
