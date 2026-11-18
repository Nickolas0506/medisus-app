import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, View } from 'react-native';
import { cores, espacos } from '../theme';
import type { Estoque } from '../types/api';
import { formatarDataHora, situacaoDoEstoque } from '../utils/formatacao';
import { Cartao } from './Cartao';
import { Etiqueta } from './Etiqueta';
import { Texto } from './Texto';

const etiquetaPorSituacao = {
  disponivel: { texto: 'Disponível', tom: 'sucesso', icone: 'checkmark-circle' },
  baixo: { texto: 'Últimas unidades', tom: 'aviso', icone: 'alert-circle' },
  emFalta: { texto: 'Em falta', tom: 'perigo', icone: 'close-circle' },
} as const;

function abrirNoMapa(estoque: Estoque) {
  const { ubs } = estoque;
  const destino =
    ubs.latitude != null && ubs.longitude != null
      ? `${ubs.latitude},${ubs.longitude}`
      : `${ubs.nome}, ${ubs.endereco}`;
  void Linking.openURL(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destino)}`
  );
}

export function CartaoUbs({ estoque }: { estoque: Estoque }) {
  const situacao = etiquetaPorSituacao[situacaoDoEstoque(estoque)];

  return (
    <Cartao>
      <View style={estilos.cabecalho}>
        <View style={estilos.textos}>
          <Texto variante="subtitulo">{estoque.ubs.nome}</Texto>
          <Texto variante="legenda" cor="textoSuave">
            {estoque.ubs.endereco} · {estoque.ubs.bairro}
          </Texto>
        </View>
        <View style={estilos.quantidade}>
          <Texto variante="titulo" cor={estoque.quantidade > 0 ? 'primaria' : 'erro'}>
            {estoque.quantidade}
          </Texto>
          <Texto variante="legenda" cor="textoSuave">
            unid.
          </Texto>
        </View>
      </View>
      <View style={estilos.rodape}>
        <Etiqueta texto={situacao.texto} tom={situacao.tom} icone={situacao.icone} />
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Como chegar na ${estoque.ubs.nome}`}
          onPress={() => abrirNoMapa(estoque)}
          style={estilos.mapa}
          hitSlop={8}
        >
          <Ionicons name="navigate-outline" size={16} color={cores.secundaria} />
          <Texto variante="rotulo" cor="secundaria">
            Como chegar
          </Texto>
        </Pressable>
      </View>
      <Texto variante="legenda" cor="textoSuave">
        Atualizado em {formatarDataHora(estoque.atualizadoEm)}
      </Texto>
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  cabecalho: { flexDirection: 'row', gap: espacos.md },
  textos: { flex: 1, gap: 2 },
  quantidade: { alignItems: 'center', minWidth: 56 },
  rodape: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mapa: { flexDirection: 'row', alignItems: 'center', gap: espacos.xs },
});
