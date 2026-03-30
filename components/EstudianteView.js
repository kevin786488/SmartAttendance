import { useState } from 'react';
import { Button, ScrollView, Text, TextInput, View } from 'react-native';

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
    <ScrollView style={{ padding: 15, backgroundColor: '#f5f5f5' }}>

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
         Panel Estudiante
      </Text>

      {/* FORMULARIO */}
      <View style={styles.card}>
        <Text style={styles.title}>Registro de Asistencia</Text>

        <TextInput
          placeholder="ID Estudiante"
          value={id}
          onChangeText={setId}
          style={styles.input}
        />

        <TextInput
          placeholder="Celular"
          value={celular}
          onChangeText={setCelular}
          style={styles.input}
        />

        <TextInput
          placeholder="Pegar QR aquí"
          value={qr}
          onChangeText={setQr}
          style={styles.input}
        />

        <Button title="Registrar Asistencia" onPress={registrar} />
      </View>

      {/* RESULTADO */}
      <View style={styles.card}>
        <Text style={styles.title}>Resultado</Text>

        <Text style={{ fontSize: 16 }}>
          {mensaje}
        </Text>

        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
           % Asistencia: {porcentaje}%
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16
  }
};