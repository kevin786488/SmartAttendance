import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

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

    const clase = clases[0]; // usamos la primera como prueba

    const resultado = registrarAsistencia({
      estudianteId: id,
      celular,
      clase,
      qr
    });

    setMensaje(resultado.mensaje);

    // calcular porcentaje
    const total = clases.length;
    const porc = calcularAsistencia(id, total);
    setPorcentaje(porc);
  };

  return (
    <View style={{ padding: 20 }}>

      <Text style={{ fontSize: 18 }}>Registro Estudiante</Text>

      <TextInput
        placeholder="ID"
        value={id}
        onChangeText={setId}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Celular"
        value={celular}
        onChangeText={setCelular}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Pegar QR"
        value={qr}
        onChangeText={setQr}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Registrar Asistencia" onPress={registrar} />

      <Text style={{ marginTop: 20 }}>
        {mensaje}
      </Text>

      <Text style={{ marginTop: 10 }}>
        % Asistencia: {porcentaje}%
      </Text>

    </View>
  );
}