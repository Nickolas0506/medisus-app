import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Botao } from '../../components/Botao';
import { Campo } from '../../components/Campo';
import { Logo } from '../../components/Logo';
import { Tela } from '../../components/Tela';
import { Texto } from '../../components/Texto';
import { useAuth } from '../../contexts/AuthContext';
import { cores, espacos, raios } from '../../theme';
import { mensagemDeErro } from '../../utils/erros';
import { validarEmail } from '../../utils/validacao';

export default function LoginScreen() {
  const navegacao = useNavigation();
  const { entrar } = useAuth();
  const campoSenha = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errosCampos, setErrosCampos] = useState<{ email?: string | null; senha?: string | null }>(
    {}
  );
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEntrar() {
    const erros = { email: validarEmail(email), senha: senha ? null : 'Informe sua senha.' };
    setErrosCampos(erros);
    setErroGeral(null);
    if (erros.email || erros.senha) return;

    setEnviando(true);
    try {
      await entrar(email, senha);
    } catch (erro) {
      setErroGeral(mensagemDeErro(erro));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tela bordas={['top', 'left', 'right', 'bottom']}>
      <View style={estilos.topo}>
        <Logo />
      </View>

      <View style={estilos.formulario}>
        <Texto variante="subtitulo">Entrar</Texto>
        <Campo
          rotulo="E-mail"
          icone="mail-outline"
          placeholder="voce@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="next"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={() => campoSenha.current?.focus()}
          erro={errosCampos.email}
        />
        <Campo
          ref={campoSenha}
          rotulo="Senha"
          icone="lock-closed-outline"
          placeholder="Sua senha"
          senha
          autoComplete="password"
          returnKeyType="done"
          value={senha}
          onChangeText={setSenha}
          onSubmitEditing={aoEntrar}
          erro={errosCampos.senha}
        />
        {erroGeral && (
          <View style={estilos.erro} accessibilityRole="alert">
            <Texto variante="rotulo" cor="erro">
              {erroGeral}
            </Texto>
          </View>
        )}
        <Botao
          titulo="Entrar"
          icone="log-in-outline"
          carregando={enviando}
          aoPressionar={aoEntrar}
        />
      </View>

      <View style={estilos.rodape}>
        <Texto cor="textoSuave">Ainda não tem conta?</Texto>
        <Botao
          titulo="Criar conta grátis"
          tipo="contorno"
          aoPressionar={() => navegacao.navigate('Cadastro')}
        />
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  topo: { alignItems: 'center', marginTop: espacos.xl, marginBottom: espacos.md },
  formulario: {
    gap: espacos.md,
    backgroundColor: cores.superficie,
    padding: espacos.lg,
    borderRadius: raios.lg,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  erro: { backgroundColor: cores.erroClaro, padding: espacos.md, borderRadius: raios.md },
  rodape: { gap: espacos.sm, alignItems: 'stretch', marginTop: espacos.md },
});
