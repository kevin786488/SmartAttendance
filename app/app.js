import { useState } from 'react';
import { Button, View } from 'react-native';

import EstudianteView from '../components/EstudianteView';
import ProfesorView from '../components/ProfesorView';
import ResultadoView from '../components/ResultadoView';

export default function Index() {

  // Estado que controla qué vista se muestra actualmente
  const [vista, setVista] = useState('profesor');

  return (
    <View style={{ flex: 1, marginTop: 50 }}>

      {/* Botones de navegación entre vistas */}
      <Button title="Profesor" onPress={() => setVista('profesor')} />
      <Button title="Estudiante" onPress={() => setVista('estudiante')} />

      {/* Renderizado condicional de las vistas */}
      {vista === 'profesor' && <ProfesorView />}
      {vista === 'estudiante' && <EstudianteView />}
      {vista === 'resultado' && <ResultadoView />}

    </View>
  );
}