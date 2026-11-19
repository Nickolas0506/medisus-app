import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Carregando } from '../components/Estados';
import { useAuth } from '../contexts/AuthContext';
import AlertaFormScreen from '../screens/AlertaFormScreen';
import CadastroScreen from '../screens/auth/CadastroScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OndeTemScreen from '../screens/OndeTemScreen';
import SobreScreen from '../screens/SobreScreen';
import { cores, fontes } from '../theme';
import { AbasNavigator } from './AbasNavigator';
import type { RotasApp, RotasAuth } from './tipos';

const PilhaAuth = createNativeStackNavigator<RotasAuth>();
const PilhaApp = createNativeStackNavigator<RotasApp>();

const tema: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: cores.primaria,
    background: cores.fundo,
    card: cores.superficie,
    text: cores.texto,
    border: cores.borda,
  },
};

const cabecalho = {
  headerStyle: { backgroundColor: cores.primaria },
  headerTintColor: cores.textoInverso,
  headerTitleStyle: { fontFamily: fontes.negrito },
  headerBackButtonDisplayMode: 'minimal',
} as const;

/**
 * Protecao de rotas: sem usuario logado so existem as telas de Login e Cadastro.
 * As telas internas nem sao registradas, entao nao ha como abrir sem autenticar.
 */
export function AppNavigator() {
  const { usuario, restaurandoSessao } = useAuth();

  if (restaurandoSessao) return <Carregando mensagem="Abrindo o MediSUS..." />;

  return (
    <NavigationContainer theme={tema}>
      {usuario ? (
        <PilhaApp.Navigator screenOptions={cabecalho}>
          <PilhaApp.Screen name="Abas" component={AbasNavigator} options={{ headerShown: false }} />
          <PilhaApp.Screen
            name="OndeTem"
            component={OndeTemScreen}
            options={({ route }) => ({ title: route.params.nome ?? 'Onde tem' })}
          />
          <PilhaApp.Screen
            name="AlertaForm"
            component={AlertaFormScreen}
            options={({ route }) => ({
              title: route.params?.alertaId ? 'Editar alerta' : 'Novo alerta',
            })}
          />
          <PilhaApp.Screen
            name="Sobre"
            component={SobreScreen}
            options={{ title: 'Sobre o App' }}
          />
        </PilhaApp.Navigator>
      ) : (
        <PilhaAuth.Navigator screenOptions={{ ...cabecalho, headerShown: false }}>
          <PilhaAuth.Screen name="Login" component={LoginScreen} />
          <PilhaAuth.Screen
            name="Cadastro"
            component={CadastroScreen}
            options={{ headerShown: true, title: 'Criar conta' }}
          />
        </PilhaAuth.Navigator>
      )}
    </NavigationContainer>
  );
}
