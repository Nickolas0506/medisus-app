import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Cartao } from '../components/Cartao';
import { Tela } from '../components/Tela';
import { Texto } from '../components/Texto';
import { useAuth } from '../contexts/AuthContext';
import { cores, espacos } from '../theme';
import type { Papel } from '../types/api';
import { confirmar } from '../utils/confirmar';

const nomeDoPapel: Record<Papel, string> = {
  CIDADAO: 'Cidadão',
  FARMACEUTICO: 'Farmacêutico da UBS',
  GESTOR: 'Gestor de saúde',
};

export default function PerfilScreen() {
  const navegacao = useNavigation();
  const { usuario, sair } = useAuth();
  const [saindo, setSaindo] = useState(false);

  async function aoSair() {
    const ok = await confirmar('Sair da conta', 'Você precisará entrar de novo.', 'Sair');
    if (!ok) return;
    setSaindo(true);
    await sair();
  }

  if (!usuario) return null;

  return (
    <Tela>
      <Cartao style={estilos.perfil}>
        <View style={estilos.avatar}>
          <Texto variante="titulo" cor="textoInverso">
            {usuario.nome.charAt(0).toUpperCase()}
          </Texto>
        </View>
        <Texto variante="subtitulo" centralizado>
          {usuario.nome}
        </Texto>
        <Texto cor="textoSuave" centralizado>
          {usuario.email}
        </Texto>
        <Texto variante="rotulo" cor="primaria">
          {nomeDoPapel[usuario.papel] ?? usuario.papel}
        </Texto>
      </Cartao>

      <Cartao>
        <ItemMenu
          icone="information-circle-outline"
          texto="Sobre o App"
          aoPressionar={() => navegacao.navigate('Sobre')}
        />
      </Cartao>

      <Botao
        titulo="Sair"
        tipo="perigo"
        icone="log-out-outline"
        carregando={saindo}
        aoPressionar={() => void aoSair()}
      />
    </Tela>
  );
}

function ItemMenu({
  icone,
  texto,
  aoPressionar,
}: {
  icone: keyof typeof Ionicons.glyphMap;
  texto: string;
  aoPressionar: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={aoPressionar} style={estilos.item}>
      <Ionicons name={icone} size={22} color={cores.primaria} />
      <Texto variante="rotulo" style={estilos.textoItem}>
        {texto}
      </Texto>
      <Ionicons name="chevron-forward" size={20} color={cores.textoSuave} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  perfil: { alignItems: 'center', paddingVertical: espacos.lg },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: espacos.md, paddingVertical: 4 },
  textoItem: { flex: 1 },
});
