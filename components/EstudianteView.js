import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { calcularAsistencia, registrarAsistencia } from '../controllers/asistenciaController';
import { obtenerClases } from '../models/clases';

export default function EstudianteView() {

  const [id, setId] = useState('');
  const [celular, setCelular] = useState('');
  const [qr, setQr] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [porcentaje, setPorcentaje] = useState('');

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

      {/* ==================== HEADER MODERNO ==================== */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Panel Estudiante</Text>
        <Text style={styles.headerSubtitle}>Registro de Asistencia QR</Text>
      </View>
      {/* ======================================================= */}

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
    backgroundColor: '#0f172a',
    // padding: 20,   ← quitado de aquí porque ahora está en contentContainerStyle
  },
  // ==================== HEADER MODERNO ====================
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
    marginBottom: 4,
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
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 18,
    fontSize: 17,
    color: '#f1f5f9',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#475569',
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
    shadowOpacity: 0.4,
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
    backgroundColor: '#1e2937',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  message: {
    fontSize: 17.5,
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 26,
  },
  success: {
    color: '#34d399',
    fontWeight: '600',
  },
  error: {
    color: '#f87171',
    fontWeight: '600',
  },
  percentage: {
    fontSize: 20,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 16,
  },
  percentageNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#60a5fa',
  }
};