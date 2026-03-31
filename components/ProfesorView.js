import { useState } from 'react';
import {
  Alert,
  Clipboard,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { registrarAsistenciaManual } from '../controllers/asistenciaController';
import { agregarClase, obtenerClases } from '../models/clases';
import { agregarEstudiante, obtenerEstudiantes } from '../models/estudiantes';
import { exportarCSV } from '../utils/exportExcel';
import { generarQR } from '../utils/qrGenerator';

import QRCode from 'react-native-qrcode-svg';

export default function ProfesorView() {

  const [nombre, setNombre] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [clases, setClases] = useState([]);
  const [qr, setQr] = useState('');

  const [estudianteManual, setEstudianteManual] = useState('');
  const [mensajeManual, setMensajeManual] = useState('');

  const [idEst, setIdEst] = useState('');
  const [nombreEst, setNombreEst] = useState('');
  const [celularEst, setCelularEst] = useState('');
  const [listaEstudiantes, setListaEstudiantes] = useState([]);

  const refrescarClases = () => setClases(obtenerClases());

  const crearClase = () => {
    if (!nombre) return Alert.alert('Error', 'Nombre obligatorio');
    if (horaInicio >= horaFin) return Alert.alert('Error', 'Hora inválida');

    const nuevaClase = { id: Date.now().toString(), nombre, horaInicio, horaFin };
    agregarClase(nuevaClase);
    refrescarClases();

    setNombre('');
    setHoraInicio('');
    setHoraFin('');
  };

  const crearQR = () => {
    if (clases.length === 0) return Alert.alert('Error', 'No hay clases creadas');
    const qrGenerado = generarQR(clases[0].id);
    setQr(qrGenerado);
  };

  const copiarQR = async () => {
    if (!qr) return Alert.alert('Sin QR', 'Primero genera un código QR');
    try {
      await Clipboard.setString(qr);
      Alert.alert('¡Copiado!', 'Código QR copiado al portapapeles');
    } catch (error) {
      Alert.alert('Error', 'No se pudo copiar');
    }
  };

  const registrarManual = () => {
    if (clases.length === 0) return setMensajeManual('No hay clases');
    const res = registrarAsistenciaManual({ estudianteId: estudianteManual, clase: clases[0] });
    setMensajeManual(res.mensaje);
  };

  const crearEstudiante = () => {
    if (!idEst || !nombreEst || !celularEst) 
      return Alert.alert('Error', 'Todos los campos son obligatorios');

    agregarEstudiante({ id: idEst, nombre: nombreEst, celular: celularEst });
    setListaEstudiantes(obtenerEstudiantes());

    setIdEst(''); 
    setNombreEst(''); 
    setCelularEst('');
  };

  const cargarEstudiantes = () => setListaEstudiantes(obtenerEstudiantes());

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      
      {/* ==================== HEADER MODERNO ==================== */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Panel Profesor</Text>
        <Text style={styles.headerSubtitle}>Gestión de Clases y Asistencia</Text>
      </View>
      {/* ======================================================= */}

      {/* Crear Clase */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Crear Nueva Clase</Text>
        <TextInput placeholder="Nombre de la clase" value={nombre} onChangeText={setNombre} style={styles.input} />
        <TextInput placeholder="Hora inicio (08:00)" value={horaInicio} onChangeText={setHoraInicio} style={styles.input} />
        <TextInput placeholder="Hora fin (10:00)" value={horaFin} onChangeText={setHoraFin} style={styles.input} />

        <TouchableOpacity style={styles.primaryButton} onPress={crearClase}>
          <Text style={styles.buttonText}>CREAR CLASE</Text>
        </TouchableOpacity>
      </View>

      {/* Clases Creadas */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={styles.cardTitle}>Clases Creadas</Text>
          <TouchableOpacity style={styles.smallButton} onPress={refrescarClases}>
            <Text style={styles.smallButtonText}>Refrescar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={clases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text style={styles.item}>{item.nombre} ({item.horaInicio} - {item.horaFin})</Text>}
          scrollEnabled={false}
        />
      </View>

      {/* QR */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.primaryButton} onPress={crearQR}>
          <Text style={styles.buttonText}>GENERAR CÓDIGO QR</Text>
        </TouchableOpacity>

        {qr !== '' && (
          <View style={styles.qrContainer}>
            <QRCode value={qr} size={210} />
            <Text selectable style={styles.qrText}>{qr}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={copiarQR}>
              <Text style={styles.buttonText}>COPIAR CÓDIGO QR</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Exportar */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => exportarCSV(clases)}>
          <Text style={styles.secondaryButtonText}>EXPORTAR CSV</Text>
        </TouchableOpacity>
      </View>

      {/* Registro Manual */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Registro Manual</Text>
        <TextInput 
          placeholder="ID del Estudiante" 
          value={estudianteManual} 
          onChangeText={setEstudianteManual} 
          style={styles.input} 
        />
        <TouchableOpacity style={styles.primaryButton} onPress={registrarManual}>
          <Text style={styles.buttonText}>REGISTRAR ASISTENCIA MANUAL</Text>
        </TouchableOpacity>
        {mensajeManual !== '' && (
          <Text style={[styles.message, mensajeManual.includes('registrada') ? styles.success : styles.error]}>
            {mensajeManual}
          </Text>
        )}
      </View>

      {/* Agregar Estudiante */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Agregar Estudiante</Text>
        <TextInput placeholder="ID" value={idEst} onChangeText={setIdEst} style={styles.input} />
        <TextInput placeholder="Nombre completo" value={nombreEst} onChangeText={setNombreEst} style={styles.input} />
        <TextInput 
          placeholder="Celular" 
          value={celularEst} 
          onChangeText={setCelularEst} 
          style={styles.input} 
          keyboardType="phone-pad" 
        />
        <TouchableOpacity style={styles.primaryButton} onPress={crearEstudiante}>
          <Text style={styles.buttonText}>AGREGAR ESTUDIANTE</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Estudiantes */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.secondaryButton} onPress={cargarEstudiantes}>
          <Text style={styles.secondaryButtonText}>CARGAR LISTA DE ESTUDIANTES</Text>
        </TouchableOpacity>

        <FlatList
          data={listaEstudiantes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item.id} — {item.nombre} ({item.celular})</Text>
          )}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  // ==================== HEADER MODERNO ====================
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1.2,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500',
  },
  // =======================================================

  card: {
    backgroundColor: '#1e2937',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 17,
    fontSize: 17,
    color: '#f1f5f9',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#475569',
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    fontSize: 16,
    color: '#cbd5e1',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 24,
    padding: 24,
    backgroundColor: '#334155',
    borderRadius: 20,
  },
  qrText: {
    fontSize: 13,
    color: '#94a3b8',
    marginVertical: 18,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  secondaryButton: {
    backgroundColor: '#475569',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  smallButton: {
    backgroundColor: '#475569',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  smallButtonText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '600',
  },
  message: {
    marginTop: 14,
    fontSize: 17,
    textAlign: 'center',
  },
  success: { color: '#34d399', fontWeight: '600' },
  error: { color: '#f87171', fontWeight: '600' },
});