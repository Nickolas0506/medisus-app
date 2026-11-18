import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Botao } from '../components/Botao';
import { CartaoMedicamento } from '../components/CartaoMedicamento';
import { CartaoUbs } from '../components/CartaoUbs';
import { Carregando, EstadoVazio, MensagemErro } from '../components/Estados';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { useEstoquesDoMedicamento, useMedicamento } from '../hooks/useMedicamentos';
import type { RotasApp } from '../navigation/tipos';
import { cores, espacos, imagens, raios } from '../theme';
import { mensagemDeErro } from '../utils/erros';

/** Mostra em quais UBS o remedio esta disponivel e oferece o alerta quando falta. */
export default function OndeTemScreen() {
  const navegacao = useNavigation();
  const { params } = useRoute<RouteProp<RotasApp, 'OndeTem'>>();
  const medicamento = useMedicamento(params.medicamentoId);
  const estoques = useEstoquesDoMedicamento(params.medicamentoId);

  if (medicamento.isLoading || estoques.isLoading) {
    return <Carregando mensagem="Consultando o estoque das UBS..." />;
  }

  const erro = medicamento.error ?? estoques.error;
  if (erro || !medicamento.data) {
    return (
      <Tela>
        <MensagemErro
          mensagem={mensagemDeErro(erro)}
          aoTentarDeNovo={() => {
            void medicamento.refetch();
            void estoques.refetch();
          }}
        />
      </Tela>
    );
  }

  const remedio = medicamento.data;
  const comEstoque = (estoques.data ?? []).filter((estoque) => estoque.quantidade > 0);
  const semEstoque = (estoques.data ?? []).filter((estoque) => estoque.quantidade <= 0);

  return (
    <Tela>
      <CartaoMedicamento medicamento={remedio} />

      <View style={estilos.acoes}>
        <View style={estilos.acao}>
          <Botao
            titulo="Me avise"
            tipo={comEstoque.length ? 'contorno' : 'primario'}
            icone="notifications-outline"
            aoPressionar={() => navegacao.navigate('AlertaForm', { medicamentoId: remedio.id })}
          />
        </View>
        <View style={estilos.acao}>
          <Botao
            titulo="Tirar dúvida"
            tipo="secundario"
            icone="chatbubble-ellipses-outline"
            aoPressionar={() =>
              navegacao.navigate('Bula', { medicamentoId: remedio.id, nome: remedio.nome })
            }
          />
        </View>
      </View>

      {comEstoque.length > 0 ? (
        <>
          <Texto variante="subtitulo">Disponível em {comEstoque.length} UBS</Texto>
          {comEstoque.map((estoque) => (
            <CartaoUbs key={estoque.id} estoque={estoque} />
          ))}
        </>
      ) : (
        <View style={estilos.semEstoque}>
          <EstadoVazio
            imagem={imagens.ubs}
            titulo="Em falta em todas as UBS"
            descricao={
              remedio.farmaciaPopular
                ? 'Você pode retirar no Farmácia Popular com a receita. Toque em "Me avise" para saber quando chegar na UBS.'
                : 'Toque em "Me avise" e o MediSUS te avisa quando o remédio chegar.'
            }
          />
        </View>
      )}

      {semEstoque.length > 0 && (
        <>
          <Texto variante="rotulo" cor="textoSuave">
            Em falta em {semEstoque.length} UBS
          </Texto>
          {semEstoque.map((estoque) => (
            <CartaoUbs key={estoque.id} estoque={estoque} />
          ))}
        </>
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  acoes: { flexDirection: 'row', gap: espacos.sm },
  acao: { flex: 1 },
  semEstoque: { backgroundColor: cores.superficie, borderRadius: raios.lg },
});
