import { useRoute, type RouteProp } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Cartao } from '../components/Cartao';
import { Campo } from '../components/Campo';
import { Carregando, MensagemErro } from '../components/Estados';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import type { RotasApp } from '../navigation/tipos';
import { bulaService } from '../services/bulaService';
import { cores, espacos, raios } from '../theme';
import { mensagemDeErro } from '../utils/erros';

const SUGESTOES = [
  'Posso tomar com outro remédio?',
  'E se eu esquecer uma dose?',
  'Posso tomar com bebida alcoólica?',
];

/** Duvida respondida pela IA com base no texto da bula oficial (RAG na API Java). */
export default function BulaScreen() {
  const { params } = useRoute<RouteProp<RotasApp, 'Bula'>>();
  const [pergunta, setPergunta] = useState('');
  const [erroPergunta, setErroPergunta] = useState<string | null>(null);
  const consulta = useMutation({
    mutationFn: (texto: string) => bulaService.perguntar(params.medicamentoId, texto),
  });

  function perguntar(texto = pergunta) {
    if (texto.trim().length < 5) {
      setErroPergunta('Escreva sua dúvida com um pouco mais de detalhe.');
      return;
    }
    setErroPergunta(null);
    setPergunta(texto);
    consulta.mutate(texto.trim());
  }

  return (
    <Tela>
      <Texto variante="subtitulo">{params.nome}</Texto>
      <Texto cor="textoSuave">
        Pergunte sobre o remédio. A resposta vem da bula oficial da Anvisa.
      </Texto>

      <View style={estilos.sugestoes}>
        {SUGESTOES.map((sugestao) => (
          <Pressable
            key={sugestao}
            accessibilityRole="button"
            onPress={() => perguntar(sugestao)}
            style={estilos.sugestao}
          >
            <Texto variante="legenda" cor="secundaria">
              {sugestao}
            </Texto>
          </Pressable>
        ))}
      </View>

      <Campo
        rotulo="Sua dúvida"
        icone="help-circle-outline"
        placeholder="Ex.: posso tomar em jejum?"
        multiline
        value={pergunta}
        onChangeText={setPergunta}
        erro={erroPergunta}
      />
      <Botao
        titulo="Perguntar"
        icone="send-outline"
        tipo="secundario"
        carregando={consulta.isPending}
        aoPressionar={() => perguntar()}
      />

      {consulta.isPending && <Carregando mensagem="Consultando a bula..." />}
      {consulta.isError && (
        <MensagemErro
          mensagem={mensagemDeErro(consulta.error)}
          aoTentarDeNovo={() => perguntar()}
        />
      )}
      {consulta.data && (
        <Cartao>
          <Texto variante="rotulo" cor="primariaEscura">
            Resposta
          </Texto>
          <Texto>{consulta.data.resposta}</Texto>
          {consulta.data.fontes?.length > 0 && (
            <Texto variante="legenda" cor="textoSuave">
              Fonte: {consulta.data.fontes.join(' · ')}
            </Texto>
          )}
        </Cartao>
      )}

      <Texto variante="legenda" cor="textoSuave" centralizado>
        Esta resposta não substitui o médico ou o farmacêutico.
      </Texto>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  sugestoes: { flexDirection: 'row', flexWrap: 'wrap', gap: espacos.sm },
  sugestao: {
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.sm,
    borderRadius: raios.pilula,
    backgroundColor: cores.secundariaClara,
  },
});
