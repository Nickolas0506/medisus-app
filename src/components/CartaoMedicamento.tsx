import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { cores, espacos } from '../theme';
import type { Medicamento } from '../types/api';
import { Cartao } from './Cartao';
import { Etiqueta } from './Etiqueta';
import { Texto } from './Texto';

type Props = {
  medicamento: Medicamento;
  aoPressionar?: () => void;
};

export function CartaoMedicamento({ medicamento, aoPressionar }: Props) {
  return (
    <Cartao
      aoPressionar={aoPressionar}
      rotuloAcessivel={`${medicamento.nome} ${medicamento.dosagem}. Ver onde tem.`}
    >
      <View style={estilos.linha}>
        <View style={estilos.icone}>
          <Ionicons name="medkit-outline" size={22} color={cores.primaria} />
        </View>
        <View style={estilos.textos}>
          <Texto variante="subtitulo">{medicamento.nome}</Texto>
          <Texto variante="legenda" cor="textoSuave">
            {medicamento.principioAtivo} · {medicamento.dosagem}
          </Texto>
        </View>
        {aoPressionar && <Ionicons name="chevron-forward" size={20} color={cores.textoSuave} />}
      </View>
      {medicamento.farmaciaPopular && (
        <Etiqueta texto="Também no Farmácia Popular" tom="info" icone="storefront-outline" />
      )}
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.md },
  icone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1 },
});
