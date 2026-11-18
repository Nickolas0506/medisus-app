import * as Linking from 'expo-linking';
import { StyleSheet, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Cartao } from '../components/Cartao';
import { Logo } from '../components/Logo';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { obterUrlApi } from '../config/api';
import { versaoApp } from '../config/versao';
import { cores, espacos, fontes } from '../theme';
import { formatarDataHora } from '../utils/formatacao';

const INTEGRANTES = ['Nickolas', 'Rodrigo', 'Otávio', 'Natália', 'Samara'];

/** Tela "Sobre o App": mostra o commit exato do codigo que gerou esta versao. */
export default function SobreScreen() {
  const linkDoCommit = versaoApp.repositorio
    ? `${versaoApp.repositorio}/commit/${versaoApp.commit}`
    : null;

  return (
    <Tela>
      <Logo tamanho={80} />

      <Cartao>
        <Texto variante="rotulo">Versão</Texto>
        <Texto>
          {versaoApp.versao} (build {versaoApp.versionCode ?? '-'})
        </Texto>

        <Texto variante="rotulo">Commit de referência</Texto>
        <Texto style={estilos.hash} selectable>
          {versaoApp.commitCurto}
        </Texto>
        <Texto variante="legenda" cor="textoSuave" selectable style={estilos.hashCompleto}>
          {versaoApp.commit}
        </Texto>
        <Texto variante="legenda" cor="textoSuave">
          Data do commit: {formatarDataHora(versaoApp.commitData)}
        </Texto>
        {versaoApp.alteracoesPendentes && (
          <Texto variante="legenda" cor="erro">
            Build gerado com alterações sem commit (não é a versão oficial).
          </Texto>
        )}
        {linkDoCommit && (
          <Botao
            titulo="Ver commit no GitHub"
            tipo="contorno"
            icone="logo-github"
            aoPressionar={() => void Linking.openURL(linkDoCommit)}
          />
        )}
      </Cartao>

      <Cartao>
        <Texto variante="rotulo">Servidor</Texto>
        <Texto variante="legenda" cor="textoSuave" selectable>
          {obterUrlApi()}
        </Texto>
      </Cartao>

      <Cartao>
        <Texto variante="rotulo">Grupo Urbis · Global Solution 2026/2 · FIAP</Texto>
        <View style={estilos.integrantes}>
          {INTEGRANTES.map((nome) => (
            <Texto key={nome} cor="textoSuave">
              • {nome}
            </Texto>
          ))}
        </View>
        <Texto variante="legenda" cor="textoSuave">
          ODS 3 (Saúde e bem-estar) e ODS 10 (Redução das desigualdades).
        </Texto>
      </Cartao>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  hash: { fontFamily: fontes.extraNegrito, fontSize: 28, color: cores.primaria, letterSpacing: 2 },
  hashCompleto: { fontFamily: 'monospace' },
  integrantes: { gap: 2, marginVertical: espacos.xs },
});
