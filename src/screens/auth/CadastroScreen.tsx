import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Botao } from '../../components/Botao';
import { Campo } from '../../components/Campo';
import { Tela } from '../../components/Tela';
import { Texto } from '../../components/Texto';
import { useAuth } from '../../contexts/AuthContext';
import { cores, espacos, raios } from '../../theme';
import { mensagemDeErro } from '../../utils/erros';
import { validarConfirmacao, validarEmail, validarNome, validarSenha } from '../../utils/validacao';

type ErrosCadastro = Partial<Record<'nome' | 'email' | 'senha' | 'confirmacao', string | null>>;

export default function CadastroScreen() {
  const { cadastrar } = useAuth();
  const campoEmail = useRef<TextInput>(null);
  const campoSenha = useRef<TextInput>(null);
  const campoConfirmacao = useRef<TextInput>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erros, setErros] = useState<ErrosCadastro>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function aoCadastrar() {
    const novosErros: ErrosCadastro = {
      nome: validarNome(nome),
      email: validarEmail(email),
      senha: validarSenha(senha),
      confirmacao: validarConfirmacao(senha, confirmacao),
    };
    setErros(novosErros);
    setErroGeral(null);
    if (Object.values(novosErros).some(Boolean)) return;

    setEnviando(true);
    try {
      // Depois do cadastro a API ja devolve o token: o usuario entra direto no app.
      await cadastrar({ nome, email, senha });
    } catch (erro) {
      setErroGeral(mensagemDeErro(erro));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tela>
      <Texto cor="textoSuave">
        Crie sua conta de cidadão para buscar remédios nas UBS e receber aviso quando chegarem.
      </Texto>

      <View style={estilos.formulario}>
        <Campo
          rotulo="Nome completo"
          icone="person-outline"
          placeholder="Maria da Silva"
          autoComplete="name"
          returnKeyType="next"
          value={nome}
          onChangeText={setNome}
          onSubmitEditing={() => campoEmail.current?.focus()}
          erro={erros.nome}
        />
        <Campo
          ref={campoEmail}
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
          erro={erros.email}
        />
        <Campo
          ref={campoSenha}
          rotulo="Senha"
          icone="lock-closed-outline"
          placeholder="Mínimo de 6 caracteres"
          senha
          autoComplete="new-password"
          returnKeyType="next"
          value={senha}
          onChangeText={setSenha}
          onSubmitEditing={() => campoConfirmacao.current?.focus()}
          erro={erros.senha}
        />
        <Campo
          ref={campoConfirmacao}
          rotulo="Confirme a senha"
          icone="lock-closed-outline"
          placeholder="Repita a senha"
          senha
          returnKeyType="done"
          value={confirmacao}
          onChangeText={setConfirmacao}
          onSubmitEditing={aoCadastrar}
          erro={erros.confirmacao}
        />
        {erroGeral && (
          <View style={estilos.erro} accessibilityRole="alert">
            <Texto variante="rotulo" cor="erro">
              {erroGeral}
            </Texto>
          </View>
        )}
        <Botao
          titulo="Criar conta"
          icone="person-add-outline"
          carregando={enviando}
          aoPressionar={aoCadastrar}
        />
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  formulario: {
    gap: espacos.md,
    backgroundColor: cores.superficie,
    padding: espacos.lg,
    borderRadius: raios.lg,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  erro: { backgroundColor: cores.erroClaro, padding: espacos.md, borderRadius: raios.md },
});
