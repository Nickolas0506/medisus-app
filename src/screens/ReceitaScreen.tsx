import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Cartao } from '../components/Cartao';
import { Carregando, EstadoVazio, MensagemErro } from '../components/Estados';
import { Etiqueta } from '../components/Etiqueta';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { receitaService, type FotoReceita } from '../services/receitaService';
import { cores, espacos, imagens, raios } from '../theme';
import type { ItemReceita } from '../types/api';
import { mensagemDeErro } from '../utils/erros';

/** Foto da receita -> IA da API le os remedios -> mostra quais UBS tem cada um. */
export default function ReceitaScreen() {
  const [foto, setFoto] = useState<FotoReceita | null>(null);
  const [avisoPermissao, setAvisoPermissao] = useState<string | null>(null);
  const leitura = useMutation({ mutationFn: receitaService.ler });

  async function escolherFoto(origem: 'camera' | 'galeria') {
    setAvisoPermissao(null);
    const permissao =
      origem === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      setAvisoPermissao(
        origem === 'camera'
          ? 'Permita o uso da câmera nas configurações para fotografar a receita.'
          : 'Permita o acesso às fotos nas configurações para escolher a receita.'
      );
      return;
    }

    const opcoes: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7 };
    const resultado =
      origem === 'camera'
        ? await ImagePicker.launchCameraAsync(opcoes)
        : await ImagePicker.launchImageLibraryAsync(opcoes);
    if (resultado.canceled) return;

    const imagem = resultado.assets[0];
    const novaFoto = { uri: imagem.uri, mimeType: imagem.mimeType, nomeArquivo: imagem.fileName };
    setFoto(novaFoto);
    leitura.mutate(novaFoto);
  }

  function recomecar() {
    setFoto(null);
    leitura.reset();
  }

  return (
    <Tela>
      {!foto ? (
        <View style={estilos.inicio}>
          <Image source={imagens.receita} style={estilos.ilustracao} resizeMode="contain" />
          <Texto variante="subtitulo" centralizado>
            Fotografe sua receita
          </Texto>
          <Texto cor="textoSuave" centralizado>
            A inteligência artificial lê os remédios (até letra de médico) e mostra em qual UBS cada
            um está disponível.
          </Texto>
        </View>
      ) : (
        <Image
          source={{ uri: foto.uri }}
          style={estilos.foto}
          accessibilityLabel="Foto da receita enviada"
        />
      )}

      {avisoPermissao && (
        <Texto variante="rotulo" cor="erro" centralizado>
          {avisoPermissao}
        </Texto>
      )}

      {!leitura.isPending && (
        <View style={estilos.botoes}>
          <Botao
            titulo={foto ? 'Fotografar outra' : 'Tirar foto'}
            icone="camera-outline"
            aoPressionar={() => void escolherFoto('camera')}
          />
          <Botao
            titulo="Escolher da galeria"
            tipo="contorno"
            icone="images-outline"
            aoPressionar={() => void escolherFoto('galeria')}
          />
        </View>
      )}

      {leitura.isPending && (
        <Carregando mensagem="Lendo a receita com IA... pode levar alguns segundos." />
      )}

      {leitura.isError && (
        <MensagemErro
          mensagem={mensagemDeErro(leitura.error)}
          aoTentarDeNovo={() => foto && leitura.mutate(foto)}
        />
      )}

      {leitura.data &&
        (leitura.data.itens.length === 0 ? (
          <EstadoVazio
            titulo="Não conseguimos ler a receita"
            descricao="Tente outra foto, com boa luz e a receita inteira no quadro."
          />
        ) : (
          <>
            <Texto variante="subtitulo">{leitura.data.itens.length} remédio(s) na receita</Texto>
            {leitura.data.itens.map((item, indice) => (
              <ItemLido key={`${item.textoLido}-${indice}`} item={item} />
            ))}
            <Texto variante="legenda" cor="textoSuave" centralizado>
              A leitura é feita por IA e pode errar. Confira com o farmacêutico da UBS.
            </Texto>
            <Botao titulo="Nova receita" tipo="contorno" icone="refresh" aoPressionar={recomecar} />
          </>
        ))}
    </Tela>
  );
}

function ItemLido({ item }: { item: ItemReceita }) {
  const navegacao = useNavigation();
  const { medicamento } = item;
  const ubsComEstoque = item.estoques.filter((estoque) => estoque.quantidade > 0);

  if (!medicamento) {
    return (
      <Cartao>
        <Texto variante="subtitulo">{item.textoLido}</Texto>
        {item.dose && <Texto cor="textoSuave">{item.dose}</Texto>}
        <Etiqueta texto="Não distribuído pelo SUS" tom="neutro" icone="help-circle-outline" />
      </Cartao>
    );
  }

  return (
    <Cartao
      aoPressionar={() =>
        navegacao.navigate('OndeTem', { medicamentoId: medicamento.id, nome: medicamento.nome })
      }
      rotuloAcessivel={`${medicamento.nome}: disponível em ${ubsComEstoque.length} UBS`}
    >
      <View style={estilos.itemTopo}>
        <View style={estilos.itemTextos}>
          <Texto variante="subtitulo">
            {medicamento.nome} {medicamento.dosagem}
          </Texto>
          <Texto variante="legenda" cor="textoSuave">
            Lido na receita: “{item.textoLido}”{item.dose ? ` · ${item.dose}` : ''}
          </Texto>
        </View>
        <Ionicons name="chevron-forward" size={20} color={cores.textoSuave} />
      </View>
      {ubsComEstoque.length > 0 ? (
        <Etiqueta
          texto={`Disponível em ${ubsComEstoque.length} UBS · ${ubsComEstoque[0].ubs.nome}`}
          tom="sucesso"
          icone="checkmark-circle"
        />
      ) : (
        <Etiqueta texto="Em falta nas UBS" tom="perigo" icone="close-circle" />
      )}
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  inicio: { alignItems: 'center', gap: espacos.sm, paddingTop: espacos.md },
  ilustracao: { width: 260, height: 182 },
  foto: {
    width: '100%',
    height: 220,
    borderRadius: raios.lg,
    backgroundColor: cores.borda,
  },
  botoes: { gap: espacos.sm },
  itemTopo: { flexDirection: 'row', alignItems: 'center', gap: espacos.sm },
  itemTextos: { flex: 1 },
});
