import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AlertasScreen from '../screens/AlertasScreen';
import BuscarScreen from '../screens/BuscarScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ReceitaScreen from '../screens/ReceitaScreen';
import { cores, fontes } from '../theme';
import type { RotasAbas } from './tipos';

const Abas = createBottomTabNavigator<RotasAbas>();

type NomeIcone = keyof typeof Ionicons.glyphMap;

// [icone da aba selecionada, icone da aba inativa]
const iconePorAba: Record<keyof RotasAbas, [NomeIcone, NomeIcone]> = {
  Buscar: ['search', 'search-outline'],
  Receita: ['camera', 'camera-outline'],
  Alertas: ['notifications', 'notifications-outline'],
  Perfil: ['person', 'person-outline'],
};

export function AbasNavigator() {
  return (
    <Abas.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: cores.primaria },
        headerTintColor: cores.textoInverso,
        headerTitleStyle: { fontFamily: fontes.negrito },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSuave,
        tabBarLabelStyle: { fontFamily: fontes.semiBold, fontSize: 12 },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={iconePorAba[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
      })}
    >
      <Abas.Screen
        name="Buscar"
        component={BuscarScreen}
        options={{ title: 'Buscar remédio', tabBarLabel: 'Buscar' }}
      />
      <Abas.Screen
        name="Receita"
        component={ReceitaScreen}
        options={{ title: 'Ler receita', tabBarLabel: 'Receita' }}
      />
      <Abas.Screen
        name="Alertas"
        component={AlertasScreen}
        options={{ title: 'Meus alertas', tabBarLabel: 'Alertas' }}
      />
      <Abas.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ title: 'Meu perfil', tabBarLabel: 'Perfil' }}
      />
    </Abas.Navigator>
  );
}
