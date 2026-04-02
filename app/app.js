// app/app.js   (o Index.js)

import { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { AsistenciaProvider } from '../context/AsistenciaContext';

import EstudianteView from '../components/EstudianteView';
import ProfesorView from '../components/ProfesorView';
import ResultadoView from '../components/ResultadoView'; // Nota: antes estaba como ResultadosView

const { width } = Dimensions.get('window');

export default function Index() {

  // Estado que controla qué pantalla se muestra
  const [vista, setVista] = useState('profesor');

  // Estado para controlar si el menú hamburguesa está abierto
  const [menuAbierto, setMenuAbierto] = useState(false);

  const abrirMenu = () => setMenuAbierto(true);
  const cerrarMenu = () => setMenuAbierto(false);

  // Cambia de vista y cierra el menú automáticamente
  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista);
    cerrarMenu();
  };

  // Devuelve el título según la vista actual
  const getTitle = () => {
    if (vista === 'profesor') return 'Vista Profesor';
    if (vista === 'estudiante') return 'Vista Estudiante';
    if (vista === 'resultado') return 'Vista Resultado';
    return 'Smart Attendance';
  };

  return (
    // Envuelve toda la app con el proveedor de contexto
    <AsistenciaProvider>

      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>

        {/* Header con botón de menú */}
        <View style={styles.header}>
          <TouchableOpacity onPress={abrirMenu} style={styles.hamburger}>
            <Text style={styles.hamburgerText}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {getTitle()}
          </Text>
        </View>

        {/* Muestra la vista seleccionada */}
        <View style={{ flex: 1 }}>
          {vista === 'profesor' && <ProfesorView />}
          {vista === 'estudiante' && <EstudianteView />}
          {vista === 'resultado' && <ResultadoView />}
        </View>

        {/* Menú Hamburguesa (se muestra solo cuando menuAbierto es true) */}
        {menuAbierto && (
          <View style={styles.overlay}>

            {/* Fondo oscuro que cierra el menú al tocarlo */}
            <TouchableOpacity 
              style={styles.overlayBackground} 
              activeOpacity={1}
              onPress={cerrarMenu}
            />

            {/* Panel del menú */}
            <View style={styles.menu}>
              <Text style={styles.menuTitle}>Menú</Text>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => cambiarVista('profesor')}
              >
                <Text style={styles.menuText}>Profesor</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => cambiarVista('estudiante')}
              >
                <Text style={styles.menuText}>Estudiante</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => cambiarVista('resultado')}
              >
                <Text style={styles.menuText}>Resultado</Text>
              </TouchableOpacity>

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

    </AsistenciaProvider>
  );
}

// ==================== ESTILOS ====================
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
    ...StyleSheet.absoluteFillObject,   // Cubre toda la pantalla
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