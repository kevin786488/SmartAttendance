import { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import EstudianteView from '../components/EstudianteView';
import ProfesorView from '../components/ProfesorView';
import ResultadoView from '../components/ResultadoView';

// Obtenemos el ancho de la pantalla para calcular el tamaño del menú
const { width } = Dimensions.get('window');

export default function Index() {

  // Estado que controla qué vista se muestra actualmente (profesor, estudiante o resultado)
  const [vista, setVista] = useState('profesor');

  // Estado que controla si el menú hamburguesa está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Función para abrir el menú hamburguesa
  const abrirMenu = () => setMenuAbierto(true);

  // Función para cerrar el menú hamburguesa
  const cerrarMenu = () => setMenuAbierto(false);

  // Función que cambia la vista y cierra automáticamente el menú
  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista);
    cerrarMenu();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>

      {/* Header superior con botón de menú hamburguesa y título dinámico */}
      <View style={styles.header}>
        <TouchableOpacity onPress={abrirMenu} style={styles.hamburger}>
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {vista === 'profesor' && 'Vista Profesor'}
          {vista === 'estudiante' && 'Vista Estudiante'}
          {vista === 'resultado' && 'Vista Resultado'}
        </Text>
      </View>

      {/* Área principal donde se muestra la vista seleccionada */}
      <View style={{ flex: 1 }}>
        {vista === 'profesor' && <ProfesorView />}
        {vista === 'estudiante' && <EstudianteView />}
        {vista === 'resultado' && <ResultadoView />}
      </View>

      {/* Menú Hamburguesa (se muestra solo cuando menuAbierto es true) */}
      {menuAbierto && (
        <View style={styles.overlay}>

          {/* Fondo semi-transparente que cubre toda la pantalla (al tocarlo se cierra el menú) */}
          <TouchableOpacity 
            style={styles.overlayBackground} 
            activeOpacity={1}
            onPress={cerrarMenu}
          />

          {/* El menú que se desliza desde la izquierda */}
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Menú</Text>

            {/* Opción para ir a la vista Profesor */}
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => cambiarVista('profesor')}
            >
              <Text style={styles.menuText}>Profesor</Text>
            </TouchableOpacity>

            {/* Opción para ir a la vista Estudiante */}
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => cambiarVista('estudiante')}
            >
              <Text style={styles.menuText}>Estudiante</Text>
            </TouchableOpacity>

            {/* Opción para ir a la vista Resultado */}
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => cambiarVista('resultado')}
            >
              <Text style={styles.menuText}>Resultado</Text>
            </TouchableOpacity>

            {/* Botón para cerrar el menú manualmente */}
            <TouchableOpacity 
              style={[styles.menuItem, { marginTop: 30 }]}
              onPress={cerrarMenu}
            >
              <Text style={[styles.menuText, { color: 'red' }]}>Cerrar menú</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 4,
  },
  hamburger: {
    padding: 10,
  },
  hamburgerText: {
    fontSize: 28,
    color: 'white',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,        // 75% del ancho de la pantalla
    backgroundColor: 'white',
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
});