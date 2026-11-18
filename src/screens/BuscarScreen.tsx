import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Campo } from '../components/Campo';
import { CartaoMedicamento } from '../components/CartaoMedicamento';
import { Carregando, EstadoVazio, MensagemErro } from '../components/Estados';
import { Texto } from '../components/Texto';
import { useAuth } from '../contexts/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { useBuscaMedicamentos } from '../hooks/useMedicamentos';
import { cores, espacos } from '../theme';
import { mensagemDeErro } from '../utils/erros';
import { primeiroNome } from '../utils/formatacao';

export default function BuscarScreen() {
  const navegacao = useNavigation();
  const { usuario } = useAuth();
  const [busca, setBusca] = useState('');
  const buscaAtrasada = useDebounce(busca.trim());
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useBuscaMedicamentos(buscaAtrasada);

  const cabecalho = (
    <View style={estilos.cabecalho}>
      <Texto variante="subtitulo">Olá, {primeiroNome(usuario?.nome ?? '')}!</Texto>
      <Texto cor="textoSuave">Qual remédio você precisa? Veja em qual UBS tem antes de sair.</Texto>
      <Campo
        rotulo="Nome do remédio"
        icone="search"
        placeholder="Ex.: losartana, dipirona..."
        autoCapitalize="none"
        returnKeyType="search"
        value={busca}
        onChangeText={setBusca}
      />
      {data && (
        <Texto variante="legenda" cor="textoSuave">
          {data.totalItens} remédio(s) encontrado(s)
        </Texto>
      )}
    </View>
  );

  return (
    <FlatList
      style={estilos.lista}
      contentContainerStyle={estilos.conteudo}
      data={data?.itens ?? []}
      keyExtractor={(medicamento) => String(medicamento.id)}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={cabecalho}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={[cores.primaria]}
          tintColor={cores.primaria}
        />
      }
      renderItem={({ item }) => (
        <CartaoMedicamento
          medicamento={item}
          aoPressionar={() =>
            navegacao.navigate('OndeTem', { medicamentoId: item.id, nome: item.nome })
          }
        />
      )}
      ListEmptyComponent={
        isLoading ? (
          <Carregando mensagem="Buscando remédios..." />
        ) : isError ? (
          <MensagemErro mensagem={mensagemDeErro(error)} aoTentarDeNovo={refetch} />
        ) : (
          <EstadoVazio
            titulo="Nenhum remédio encontrado"
            descricao="Confira a grafia ou tente pelo princípio ativo."
          />
        )
      }
    />
  );
}

const estilos = StyleSheet.create({
  lista: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espacos.md, gap: espacos.md },
  cabecalho: { gap: espacos.sm, marginBottom: espacos.xs },
});
