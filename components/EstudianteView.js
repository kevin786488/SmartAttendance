import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { calcularAsistencia, registrarAsistencia } from '../controllers/asistenciaController';
import { obtenerClases } from '../models/clases';

export default function EstudianteView() {

  // Estados del formulario de registro
  const [id, setId] = useState('');
  const [celular, setCelular] = useState('');
  const [qr, setQr] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [porcentaje, setPorcentaje] = useState('');

  // Registra la asistencia del estudiante usando el código QR
  const registrar = () => {
    const clases = obtenerClases();

    if (clases.length === 0) {
      setMensaje('No hay clases creadas');
      return;
    }

    const clase = clases[0];

    const resultado = registrarAsistencia({
      estudianteId: id,
      celular,
      clase,
      qr
    });

    setMensaje(resultado.mensaje);

    // Calcula y actualiza el porcentaje de asistencia
    const total = clases.length;
    const porc = calcularAsistencia(id, total);
    setPorcentaje(porc);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={true}
    >

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Panel Estudiante</Text>
        <Text style={styles.headerSubtitle}>Registro de Asistencia QR</Text>
      </View>

      {/* Formulario de Registro */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Registro de Asistencia</Text>

        <TextInput 
          placeholder="ID del Estudiante" 
          value={id} 
          onChangeText={setId} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Número de Celular" 
          value={celular} 
          onChangeText={setCelular} 
          style={styles.input} 
          keyboardType="phone-pad"
        />
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

      {/* Resultado del Registro */}
      <View style={styles.resultCard}>
        <Text style={styles.cardTitle}>Resultado del Registro</Text>
        
        {mensaje !== '' && (
          <Text style={[
            styles.message,
            mensaje.toLowerCase().includes('registrada') ? styles.success : styles.error
          ]}>
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

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Header
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -1,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 18,
    fontSize: 17,
    color: '#0f172a',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  qrInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  message: {
    fontSize: 17.5,
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 26,
  },
  success: {
    color: '#10b981',
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    fontWeight: '600',
  },
  percentage: {
    fontSize: 20,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
  },
  percentageNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  }
};