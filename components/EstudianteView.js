// EstudianteView.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAsistencia } from '../context/AsistenciaContext';
import { obtenerClases } from '../models/clases';
import { obtenerEstudiantes } from '../models/estudiantes';

export default function EstudianteView() {

  const [id, setId] = useState('');
  const [celular, setCelular] = useState('');
  const [qr, setQr] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [porcentaje, setPorcentaje] = useState('');

  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);   // Lista de estudiantes válidos

  const { refrescarResultados } = useAsistencia();

  // Cargar clases y estudiantes al iniciar
  useEffect(() => {
    setClases(obtenerClases());
    setEstudiantes(obtenerEstudiantes());
    
    // Selecciona la primera clase por defecto
    const listaClases = obtenerClases();
    if (listaClases.length > 0) setClaseSeleccionada(listaClases[0]);
  }, []);

  // Autocompleta celular cuando escriben el ID
  const buscarEstudiante = (idIngresado) => {
    setId(idIngresado);
    const encontrado = estudiantes.find(est => est.id === idIngresado.trim());
    setCelular(encontrado ? encontrado.celular || '' : '');
  };

  // Registrar asistencia
  const registrar = async () => {
    if (!id || !celular || !claseSeleccionada) {
      setMensaje('Completa ID, celular y selecciona clase');
      return;
    }

    // Validación clave: el estudiante debe existir
    const existe = estudiantes.some(est => est.id === id.trim());
    if (!existe) {
      setMensaje(' Este estudiante no existe. El profesor debe crearlo primero.');
      Alert.alert('Estudiante no registrado', 'Este ID no está dado de alta.');
      return;
    }

    try {
      const nuevaAsistencia = {
        estudianteId: id.trim(),
        celular: celular.trim(),
        claseId: claseSeleccionada.id,
        claseNombre: claseSeleccionada.nombre,
        qr: qr.trim(),
        fecha: new Date().toISOString(),
      };

      // Obtener y guardar asistencias
      const asistenciasGuardadas = await AsyncStorage.getItem('asistencias');
      let asistencias = asistenciasGuardadas ? JSON.parse(asistenciasGuardadas) : [];

      // Evitar duplicado mismo día
      const yaRegistrado = asistencias.some(a => 
        a.estudianteId === nuevaAsistencia.estudianteId && 
        a.claseId === nuevaAsistencia.claseId &&
        new Date(a.fecha).toDateString() === new Date().toDateString()
      );

      if (yaRegistrado) {
        setMensaje('Ya registraste asistencia hoy en esta clase');
        return;
      }

      asistencias.push(nuevaAsistencia);
      await AsyncStorage.setItem('asistencias', JSON.stringify(asistencias));

      setMensaje(`¡Asistencia registrada en ${claseSeleccionada.nombre}!`);
      setPorcentaje('100');

      // Limpiar
      setId('');
      setCelular('');
      setQr('');

      refrescarResultados();

    } catch (error) {
      setMensaje('Error al guardar la asistencia');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Panel Estudiante</Text>
        <Text style={styles.headerSubtitle}>Registro de Asistencia QR</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Registro de Asistencia</Text>

        {/* Selector de Clase */}
        <Text style={styles.label}>Seleccionar Clase</Text>
        {clases.length === 0 ? (
          <Text style={{ color: '#ef4444', marginBottom: 12 }}>No hay clases disponibles</Text>
        ) : (
          clases.map((clase) => (
            <TouchableOpacity
              key={clase.id}
              style={[styles.claseOption, claseSeleccionada?.id === clase.id && styles.claseOptionSelected]}
              onPress={() => setClaseSeleccionada(clase)}
            >
              <Text style={[styles.claseOptionText, claseSeleccionada?.id === clase.id && styles.claseOptionTextSelected]}>
                {clase.nombre} ({clase.horaInicio} - {clase.horaFin})
              </Text>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.label}>ID del Estudiante</Text>
        <TextInput 
          placeholder="Ingresa tu ID" 
          value={id} 
          onChangeText={buscarEstudiante}
          style={styles.input} 
        />

        <Text style={styles.label}>Número de Celular</Text>
        <TextInput 
          placeholder="Celular" 
          value={celular} 
          onChangeText={setCelular} 
          style={styles.input} 
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Código QR (opcional)</Text>
        <TextInput 
          placeholder="Pegar código QR aquí..." 
          value={qr} 
          onChangeText={setQr} 
          style={[styles.input, styles.qrInput]} 
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={registrar}>
          <Text style={styles.buttonText}>REGISTRAR ASISTENCIA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.cardTitle}>Resultado</Text>
        
        {mensaje !== '' && (
          <Text style={[styles.message, 
            mensaje.includes('registrada') || mensaje.includes('correctamente') 
              ? styles.success : styles.error]}>
            {mensaje}
          </Text>
        )}

        <Text style={styles.percentage}>
          Asistencia: <Text style={styles.percentageNumber}>{porcentaje || '0'}%</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

// Estilos (sin cambios)
const styles = {
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerContainer: { alignItems: 'center', marginBottom: 32, paddingVertical: 10 },
  headerTitle: { fontSize: 34, fontWeight: '800', color: '#1e2937', letterSpacing: -1 },
  headerSubtitle: { fontSize: 16, color: '#64748b' },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#1e2937', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 12 },
  
  claseOption: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  claseOptionSelected: { backgroundColor: '#dbeafe', borderColor: '#3b82f6' },
  claseOptionText: { fontSize: 16, color: '#334155' },
  claseOptionTextSelected: { color: '#1e40af', fontWeight: '600' },

  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 18,
    fontSize: 17,
    color: '#1e2937',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
  },
  qrInput: { height: 100, textAlignVertical: 'top' },

  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },

  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  message: { fontSize: 17.5, textAlign: 'center', marginVertical: 12, lineHeight: 26 },
  success: { color: '#10b981', fontWeight: '600' },
  error: { color: '#ef4444', fontWeight: '600' },
  percentage: { fontSize: 20, color: '#64748b', textAlign: 'center', marginTop: 16 },
  percentageNumber: { fontSize: 32, fontWeight: 'bold', color: '#3b82f6' },
};