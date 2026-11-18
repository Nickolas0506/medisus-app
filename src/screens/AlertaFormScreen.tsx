import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { Cartao } from '../components/Cartao';
import { CartaoMedicamento } from '../components/CartaoMedicamento';
import { Carregando, MensagemErro } from '../components/Estados';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { useAlerta, useMutacoesAlerta } from '../hooks/useAlertas';
import { useDebounce } from '../hooks/useDebounce';
import { useBuscaMedicamentos, useListaUbs, useMedicamento } from '../hooks/useMedicamentos';
import type { RotasApp } from '../navigation/tipos';
import { cores, espacos, fontes, raios } from '../theme';
import type { Medicamento } from '../types/api';
import { mensagemDeErro } from '../utils/erros';

type ValoresIniciais = {
  medicamento: Medicamento | null;
  ubsId: number | null;
  ativo: boolean;
};

/**
 * Create e Update do alerta de reposicao: remedio, UBS preferida e ligado/desligado.
 * Primeiro carrega o alerta (edicao) ou o remedio vindo da tela "Onde tem",
 * depois abre o formulario ja preenchido.
 */
export default function AlertaFormScreen() {
  const { params } = useRoute<RouteProp<RotasApp, 'AlertaForm'>>();
  const alertaId = params?.alertaId;
  const alertaExistente = useAlerta(alertaId);
  const medicamentoInicial = useMedicamento(params?.medicamentoId ?? 0);

  if (alertaExistente.isLoading || medicamentoInicial.isLoading) {
    return <Carregando mensagem="Carregando..." />;
  }

  const erro = alertaExistente.error ?? medicamentoInicial.error;
  if (erro) {
    return (
      <Tela>
        <MensagemErro
          mensagem={mensagemDeErro(erro)}
          aoTentarDeNovo={() => {
            void alertaExistente.refetch();
            void medicamentoInicial.refetch();
          }}
        />
      </Tela>
    );
  }

  const alerta = alertaExistente.data;
  const iniciais: ValoresIniciais = alerta
    ? { medicamento: alerta.medicamento, ubsId: alerta.ubs?.id ?? null, ativo: alerta.ativo }
    : { medicamento: medicamentoInicial.data ?? null, ubsId: null, ativo: true };

  return <FormularioAlerta alertaId={alertaId} iniciais={iniciais} />;
}

function FormularioAlerta({
  alertaId,
  iniciais,
}: {
  alertaId: number | undefined;
  iniciais: ValoresIniciais;
}) {
  const navegacao = useNavigation();
  const editando = alertaId != null;
  const listaUbs = useListaUbs();
  const { criar, atualizar } = useMutacoesAlerta();

  const [medicamento, setMedicamento] = useState(iniciais.medicamento);
  const [ubsId, setUbsId] = useState(iniciais.ubsId);
  const [ativo, setAtivo] = useState(iniciais.ativo);
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  const salvando = criar.isPending || atualizar.isPending;
  const erroSalvar = criar.error ?? atualizar.error;

  async function aoSalvar() {
    if (!medicamento) {
      setErroValidacao('Escolha o remédio que você quer acompanhar.');
      return;
    }
    setErroValidacao(null);
    const dados = { medicamentoId: medicamento.id, ubsId, ativo };
    try {
      if (alertaId != null) await atualizar.mutateAsync({ id: alertaId, alerta: dados });
      else await criar.mutateAsync(dados);
      navegacao.navigate('Abas', { screen: 'Alertas' });
    } catch {
      // a mensagem aparece pelo erroSalvar
    }
  }

  return (
    <Tela>
      <Texto variante="rotulo">Remédio</Texto>
      {medicamento ? (
        <View style={estilos.escolhido}>
          <CartaoMedicamento medicamento={medicamento} />
          {!editando && (
            <Botao
              titulo="Trocar remédio"
              tipo="contorno"
              icone="swap-horizontal"
              aoPressionar={() => setMedicamento(null)}
            />
          )}
        </View>
      ) : (
        <SeletorMedicamento aoEscolher={setMedicamento} />
      )}

      <Texto variante="rotulo">Em qual UBS?</Texto>
      {listaUbs.isLoading ? (
        <Carregando mensagem="Carregando UBS..." />
      ) : listaUbs.isError ? (
        <MensagemErro mensagem={mensagemDeErro(listaUbs.error)} aoTentarDeNovo={listaUbs.refetch} />
      ) : (
        <View style={estilos.chips}>
          <Chip
            texto="Qualquer UBS"
            selecionado={ubsId === null}
            aoPressionar={() => setUbsId(null)}
          />
          {(listaUbs.data ?? []).map((ubs) => (
            <Chip
              key={ubs.id}
              texto={`${ubs.nome} · ${ubs.bairro}`}
              selecionado={ubsId === ubs.id}
              aoPressionar={() => setUbsId(ubs.id)}
            />
          ))}
        </View>
      )}

      <Cartao style={estilos.linhaAtivo}>
        <View style={estilos.textosAtivo}>
          <Texto variante="rotulo">Alerta ligado</Texto>
          <Texto variante="legenda" cor="textoSuave">
            Desligue para pausar sem perder o alerta.
          </Texto>
        </View>
        <Switch
          accessibilityLabel="Alerta ligado"
          value={ativo}
          onValueChange={setAtivo}
          trackColor={{ true: cores.primaria, false: cores.borda }}
          thumbColor={cores.superficie}
        />
      </Cartao>

      {(erroValidacao || erroSalvar) && (
        <Texto variante="rotulo" cor="erro" accessibilityRole="alert">
          {erroValidacao ?? mensagemDeErro(erroSalvar)}
        </Texto>
      )}

      <Botao
        titulo={editando ? 'Salvar alterações' : 'Criar alerta'}
        icone="checkmark-circle-outline"
        carregando={salvando}
        aoPressionar={() => void aoSalvar()}
      />
    </Tela>
  );
}

function SeletorMedicamento({ aoEscolher }: { aoEscolher: (medicamento: Medicamento) => void }) {
  const [busca, setBusca] = useState('');
  const buscaAtrasada = useDebounce(busca.trim());
  const resultado = useBuscaMedicamentos(buscaAtrasada);

  return (
    <View style={estilos.seletor}>
      <Campo
        rotulo="Buscar remédio"
        icone="search"
        placeholder="Digite o nome"
        autoCapitalize="none"
        value={busca}
        onChangeText={setBusca}
      />
      {resultado.isLoading && <Carregando mensagem="Buscando..." />}
      {resultado.isError && (
        <MensagemErro
          mensagem={mensagemDeErro(resultado.error)}
          aoTentarDeNovo={resultado.refetch}
        />
      )}
      {(resultado.data?.itens ?? []).slice(0, 6).map((medicamento) => (
        <CartaoMedicamento
          key={medicamento.id}
          medicamento={medicamento}
          aoPressionar={() => aoEscolher(medicamento)}
        />
      ))}
    </View>
  );
}

function Chip({
  texto,
  selecionado,
  aoPressionar,
}: {
  texto: string;
  selecionado: boolean;
  aoPressionar: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: selecionado }}
      onPress={aoPressionar}
      style={[estilos.chip, selecionado && estilos.chipSelecionado]}
    >
      <Texto
        variante="legenda"
        style={[estilos.textoChip, selecionado && { color: cores.textoInverso }]}
      >
        {texto}
      </Texto>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  escolhido: { gap: espacos.sm },
  seletor: { gap: espacos.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espacos.sm },
  chip: {
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.sm,
    borderRadius: raios.pilula,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  chipSelecionado: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  textoChip: { fontFamily: fontes.semiBold },
  linhaAtivo: { flexDirection: 'row', alignItems: 'center' },
  textosAtivo: { flex: 1 },
});
