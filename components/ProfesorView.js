// ProfesorView.js

import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Clipboard,
  FlatList,
  Platform,
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

  // Estados para crear clase
  const [nombre, setNombre] = useState('');
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFin, setHoraFin] = useState(new Date());
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);

  // Estados para gestión de clases y QR
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [qr, setQr] = useState('');

  // Estados para registro manual
  const [estudianteManual, setEstudianteManual] = useState('');
  const [mensajeManual, setMensajeManual] = useState('');

  // Estados para agregar estudiante
  const [idEst, setIdEst] = useState('');
  const [nombreEst, setNombreEst] = useState('');
  const [celularEst, setCelularEst] = useState('');
  const [listaEstudiantes, setListaEstudiantes] = useState([]);

  // Refresca la lista de clases y selecciona la primera si es necesario
  const refrescarClases = () => {
    const lista = obtenerClases();
    setClases(lista);
    if (lista.length > 0 && (!claseSeleccionada || !lista.find(c => c.id === claseSeleccionada?.id))) {
      setClaseSeleccionada(lista[0]);
    }
  };

  // Formatea hora a "HH:mm"
  const formatHora = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Crear nueva clase
  const crearClase = () => {
    if (!nombre) return Alert.alert('Error', 'Nombre de la clase es obligatorio');

    const nuevaClase = {
      id: Date.now().toString(),
      nombre,
      horaInicio: formatHora(horaInicio),
      horaFin: formatHora(horaFin),
    };

    agregarClase(nuevaClase);
    refrescarClases();
    setNombre('');
    Alert.alert('Éxito', 'Clase creada correctamente');
  };

  // Generar código QR para la clase seleccionada
  const crearQR = () => {
    if (!claseSeleccionada) 
      return Alert.alert('Error', 'Primero selecciona una clase');

    const qrGenerado = generarQR(claseSeleccionada.id);
    setQr(qrGenerado);
  };

  // Copiar QR al portapapeles
  const copiarQR = async () => {
    if (!qr) return Alert.alert('Sin QR', 'Primero genera un código QR');
    try {
      await Clipboard.setString(qr);
      Alert.alert('¡Copiado!', 'Código QR copiado al portapapeles');
    } catch (error) {
      Alert.alert('Error', 'No se pudo copiar');
    }
  };

  // Registro manual de asistencia
  const registrarManual = () => {
    if (!claseSeleccionada) return setMensajeManual('Primero selecciona una clase');
    if (!estudianteManual) return setMensajeManual('Ingresa el ID del estudiante');

    const res = registrarAsistenciaManual({ 
      estudianteId: estudianteManual, 
      clase: claseSeleccionada 
    });
    setMensajeManual(res.mensaje);
  };

  // Crear nuevo estudiante
  const crearEstudiante = () => {
    if (!idEst || !nombreEst || !celularEst) 
      return Alert.alert('Error', 'Todos los campos son obligatorios');

    try {
      agregarEstudiante({ id: idEst, nombre: nombreEst, celular: celularEst });
      setListaEstudiantes(obtenerEstudiantes());
      setIdEst(''); 
      setNombreEst(''); 
      setCelularEst('');
      Alert.alert('Éxito', 'Estudiante agregado correctamente');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Cargar lista de estudiantes
  const cargarEstudiantes = () => setListaEstudiantes(obtenerEstudiantes());

  // Cargar clases al montar el componente
  useEffect(() => {
    refrescarClases();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Panel Profesor</Text>
        <Text style={styles.headerSubtitle}>Gestión de Clases y Asistencia</Text>
      </View>

      {/* Crear Nueva Clase */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Crear Nueva Clase</Text>
        
        <TextInput 
          placeholder="Nombre de la clase" 
          value={nombre} 
          onChangeText={setNombre} 
          style={styles.input} 
        />

        <Text style={styles.label}>Hora de Inicio</Text>
        <TouchableOpacity style={styles.timeButton} onPress={() => setShowInicioPicker(true)}>
          <Text style={styles.timeText}>{formatHora(horaInicio)}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Hora de Fin</Text>
        <TouchableOpacity style={styles.timeButton} onPress={() => setShowFinPicker(true)}>
          <Text style={styles.timeText}>{formatHora(horaFin)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={crearClase}>
          <Text style={styles.buttonText}>CREAR CLASE</Text>
        </TouchableOpacity>
      </View>

      {/* DateTimePickers */}
      {showInicioPicker && (
        <DateTimePicker
          value={horaInicio}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowInicioPicker(false);
            if (selectedDate) setHoraInicio(selectedDate);
          }}
        />
      )}

      {showFinPicker && (
        <DateTimePicker
          value={horaFin}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowFinPicker(false);
            if (selectedDate) setHoraFin(selectedDate);
          }}
        />
      )}

      {/* Seleccionar Clase y Generar QR */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={styles.cardTitle}>Seleccionar Clase</Text>
          <TouchableOpacity style={styles.smallButton} onPress={refrescarClases}>
            <Text style={styles.smallButtonText}>Refrescar</Text>
          </TouchableOpacity>
        </View>

        {clases.length === 0 ? (
          <Text style={styles.emptyText}>Aún no hay clases creadas</Text>
        ) : (
          <View style={styles.pickerContainer}>
            {clases.map((clase) => (
              <TouchableOpacity
                key={clase.id}
                style={[
                  styles.claseItem,
                  claseSeleccionada?.id === clase.id && styles.claseItemSelected
                ]}
                onPress={() => setClaseSeleccionada(clase)}
              >
                <Text style={[
                  styles.claseText,
                  claseSeleccionada?.id === clase.id && styles.claseTextSelected
                ]}>
                  {clase.nombre} ({clase.horaInicio} - {clase.horaFin})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={[styles.primaryButton, { marginTop: 20 }]} 
          onPress={crearQR}
          disabled={!claseSeleccionada}
        >
          <Text style={styles.buttonText}>GENERAR CÓDIGO QR</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar QR generado */}
      {qr !== '' && (
        <View style={styles.card}>
          <View style={styles.qrContainer}>
            <QRCode value={qr} size={210} />
            <Text selectable style={styles.qrText}>{qr}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={copiarQR}>
              <Text style={styles.buttonText}>COPIAR CÓDIGO QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Exportar CSV */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => exportarCSV(clases)}>
          <Text style={styles.secondaryButtonText}>EXPORTAR CSV</Text>
        </TouchableOpacity>
      </View>

      {/* Registro Manual */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Registro Manual</Text>
        <Text style={styles.subtitle}>
          Clase: {claseSeleccionada ? claseSeleccionada.nombre : 'Ninguna seleccionada'}
        </Text>
        
        <TextInput 
          placeholder="ID del Estudiante" 
          value={estudianteManual} 
          onChangeText={setEstudianteManual} 
          style={styles.input} 
        />
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={registrarManual}
          disabled={!claseSeleccionada}
        >
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

// ==================== ESTILOS ====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerContainer: { alignItems: 'center', marginBottom: 32, paddingVertical: 12 },
  headerTitle: { fontSize: 34, fontWeight: '800', color: '#0f172a', letterSpacing: -1.2 },
  headerSubtitle: { fontSize: 16, color: '#64748b', fontWeight: '500' },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: { fontSize: 21, fontWeight: '700', color: '#1e2937', marginBottom: 18 },
  label: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 17,
    fontSize: 17,
    color: '#0f172a',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  timeButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 17,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    marginBottom: 16,
    alignItems: 'center',
  },
  timeText: { fontSize: 18, fontWeight: '600', color: '#1e2937' },

  pickerContainer: { gap: 10 },
  claseItem: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  claseItemSelected: { backgroundColor: '#dbeafe', borderColor: '#3b82f6' },
  claseText: { fontSize: 16, color: '#334155' },
  claseTextSelected: { color: '#1e40af', fontWeight: '600' },

  smallButton: {
    backgroundColor: '#64748b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  smallButtonText: { color: '#f8fafc', fontSize: 15, fontWeight: '600' },

  qrContainer: {
    alignItems: 'center',
    marginTop: 24,
    padding: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  qrText: { fontSize: 13, color: '#64748b', marginVertical: 18, textAlign: 'center' },

  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#64748b',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
  secondaryButtonText: { color: '#f8fafc', fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 12 },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    fontSize: 16,
    color: '#334155',
  },
  emptyText: { color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: 20 },
  message: { marginTop: 14, fontSize: 17, textAlign: 'center' },
  success: { color: '#10b981', fontWeight: '600' },
  error: { color: '#ef4444', fontWeight: '600' },
});