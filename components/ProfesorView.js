import { useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';

import { registrarAsistenciaManual } from '../controllers/asistenciaController';
import { agregarClase, obtenerClases } from '../models/clases';
import { agregarEstudiante } from '../models/estudiantes';
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

  // NUEVOS estados para estudiantes
  const [idEst, setIdEst] = useState('');
  const [nombreEst, setNombreEst] = useState('');
  const [celularEst, setCelularEst] = useState('');

  const crearClase = () => {

    if (!nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    if (horaInicio >= horaFin) {
      alert('Hora inicio debe ser menor que hora fin');
      return;
    }

    const nuevaClase = {
      id: Date.now().toString(),
      nombre,
      horaInicio,
      horaFin
    };

    agregarClase(nuevaClase);
    setClases(obtenerClases());

    setNombre('');
    setHoraInicio('');
    setHoraFin('');
  };

  const crearQR = () => {

    if (clases.length === 0) {
      alert('No hay clases');
      return;
    }

    const clase = clases[0];
    const qrGenerado = generarQR(clase.id);

    setQr(qrGenerado);
  };

  const registrarManual = () => {

    if (clases.length === 0) {
      setMensajeManual('No hay clases');
      return;
    }

    const clase = clases[0];

    const resultado = registrarAsistenciaManual({
      estudianteId: estudianteManual,
      clase
    });

    setMensajeManual(resultado.mensaje);
  };

  // NUEVA función agregar estudiante
  const crearEstudiante = () => {

    if (!idEst || !nombreEst || !celularEst) {
      alert('Todos los campos son obligatorios');
      return;
    }

    agregarEstudiante({
      id: idEst,
      nombre: nombreEst,
      celular: celularEst
    });

    alert('Estudiante agregado');

    setIdEst('');
    setNombreEst('');
    setCelularEst('');
  };

  return (
    <View style={{ padding: 20 }}>

      <Text style={{ fontSize: 18 }}>Panel Profesor</Text>

      {/* CREAR CLASE */}
      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={{ borderWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Hora inicio (08:00)" value={horaInicio} onChangeText={setHoraInicio} style={{ borderWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Hora fin (10:00)" value={horaFin} onChangeText={setHoraFin} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Button title="Crear Clase" onPress={crearClase} />

      <FlatList
        data={clases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.nombre} ({item.horaInicio} - {item.horaFin})</Text>
        )}
      />

      <Button title="Generar QR" onPress={crearQR} />

      {qr !== '' && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <QRCode value={qr} size={200} />
          <Text selectable>{qr}</Text>
        </View>
      )}

      <Button title="Exportar CSV" onPress={() => exportarCSV(clases)} />

      {/* REGISTRO MANUAL */}
      <Text style={{ marginTop: 20 }}>Registro Manual</Text>

      <TextInput
        placeholder="ID Estudiante"
        value={estudianteManual}
        onChangeText={setEstudianteManual}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Registrar Manual" onPress={registrarManual} />

      <Text>{mensajeManual}</Text>

      {/* NUEVO: AGREGAR ESTUDIANTE */}
      <Text style={{ marginTop: 20 }}>Agregar Estudiante</Text>

      <TextInput
        placeholder="ID"
        value={idEst}
        onChangeText={setIdEst}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Nombre"
        value={nombreEst}
        onChangeText={setNombreEst}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Celular"
        value={celularEst}
        onChangeText={setCelularEst}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Agregar Estudiante" onPress={crearEstudiante} />

    </View>
  );
}