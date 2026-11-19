import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Cartao } from '../components/Cartao';
import { Carregando, EstadoVazio, MensagemErro } from '../components/Estados';
import { Etiqueta } from '../components/Etiqueta';
import { Texto } from '../components/Texto';
import { useAlertas, useMutacoesAlerta } from '../hooks/useAlertas';
import { cores, espacos } from '../theme';
import type { AlertaReposicao } from '../types/api';
import { confirmar } from '../utils/confirmar';
import { mensagemDeErro } from '../utils/erros';
import { formatarData, formatarDataHora } from '../utils/formatacao';

/** Lista (Read) dos alertas, com editar (Update) e excluir (Delete). */
export default function AlertasScreen() {
  const navegacao = useNavigation();
  const { data: alertas, isLoading, isError, error, refetch, isRefetching } = useAlertas();
  const { excluir } = useMutacoesAlerta();
  const erroMutacao = excluir.error;

  async function aoExcluir(alerta: AlertaReposicao) {
    const ok = await confirmar(
      'Excluir alerta',
      `Você não será mais avisado sobre ${alerta.medicamento.nome}.`,
      'Excluir'
    );
    if (ok) excluir.mutate(alerta.id);
  }

  return (
    <FlatList
      style={estilos.lista}
      contentContainerStyle={estilos.conteudo}
      data={alertas ?? []}
      keyExtractor={(alerta) => String(alerta.id)}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={[cores.primaria]}
          tintColor={cores.primaria}
        />
      }
      ListHeaderComponent={
        <View style={estilos.cabecalho}>
          <Texto cor="textoSuave">
            Quando o remédio chegar na UBS, o alerta muda para “Chegou!”.
          </Texto>
          <Botao
            titulo="Novo alerta"
            icone="add-circle-outline"
            aoPressionar={() => navegacao.navigate('AlertaForm')}
          />
          {erroMutacao && (
            <Texto variante="rotulo" cor="erro" accessibilityRole="alert">
              {mensagemDeErro(erroMutacao)}
            </Texto>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <Cartao>
          <View style={estilos.topo}>
            <View style={estilos.textos}>
              <Texto variante="subtitulo">
                {item.medicamento.nome} {item.medicamento.dosagem}
              </Texto>
              <Texto variante="legenda" cor="textoSuave">
                {item.ubs ? item.ubs.nome : 'Qualquer UBS'} · criado em{' '}
                {formatarData(item.criadoEm)}
              </Texto>
            </View>
          </View>

          {item.avisadoEm ? (
            <Etiqueta
              texto={`Chegou! ${formatarDataHora(item.avisadoEm)}`}
              tom="sucesso"
              icone="checkmark-done"
            />
          ) : (
            <Etiqueta texto="Aguardando reposição" tom="aviso" icone="time-outline" />
          )}

          <View style={estilos.acoes}>
            <BotaoIcone
              icone="location-outline"
              texto="Onde tem"
              aoPressionar={() =>
                navegacao.navigate('OndeTem', {
                  medicamentoId: item.medicamento.id,
                  nome: item.medicamento.nome,
                })
              }
            />
            <BotaoIcone
              icone="create-outline"
              texto="Editar"
              aoPressionar={() => navegacao.navigate('AlertaForm', { alertaId: item.id })}
            />
            <BotaoIcone
              icone="trash-outline"
              texto="Excluir"
              perigo
              aoPressionar={() => void aoExcluir(item)}
            />
          </View>
        </Cartao>
      )}
      ListEmptyComponent={
        isLoading ? (
          <Carregando mensagem="Carregando seus alertas..." />
        ) : isError ? (
          <MensagemErro mensagem={mensagemDeErro(error)} aoTentarDeNovo={refetch} />
        ) : (
          <EstadoVazio
            titulo="Nenhum alerta ainda"
            descricao="Busque um remédio em falta e toque em “Me avise”."
          />
        )
      }
    />
  );
}

function BotaoIcone({
  icone,
  texto,
  aoPressionar,
  perigo,
}: {
  icone: keyof typeof Ionicons.glyphMap;
  texto: string;
  aoPressionar: () => void;
  perigo?: boolean;
}) {
  const cor = perigo ? cores.erro : cores.secundaria;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={texto}
      onPress={aoPressionar}
      style={estilos.botaoIcone}
      hitSlop={6}
    >
      <Ionicons name={icone} size={18} color={cor} />
      <Texto variante="rotulo" style={{ color: cor }}>
        {texto}
      </Texto>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  lista: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espacos.md, gap: espacos.md },
  cabecalho: { gap: espacos.sm },
  topo: { flexDirection: 'row', alignItems: 'center', gap: espacos.sm },
  textos: { flex: 1 },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    paddingTop: espacos.sm,
  },
  botaoIcone: { flexDirection: 'row', alignItems: 'center', gap: espacos.xs, padding: espacos.xs },
});
