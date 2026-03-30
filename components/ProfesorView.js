import { useState } from 'react';
import { Button, FlatList, ScrollView, Text, TextInput, View } from 'react-native';

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

  const crearClase = () => {
    if (!nombre) return alert('Nombre obligatorio');
    if (horaInicio >= horaFin) return alert('Hora inválida');

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
    if (clases.length === 0) return alert('No hay clases');

    const qrGenerado = generarQR(clases[0].id);
    setQr(qrGenerado);
  };

  const registrarManual = () => {
    if (clases.length === 0) return setMensajeManual('No hay clases');

    const res = registrarAsistenciaManual({
      estudianteId: estudianteManual,
      clase: clases[0]
    });

    setMensajeManual(res.mensaje);
  };

  const crearEstudiante = () => {
    if (!idEst || !nombreEst || !celularEst)
      return alert('Campos obligatorios');

    agregarEstudiante({
      id: idEst,
      nombre: nombreEst,
      celular: celularEst
    });

    setListaEstudiantes(obtenerEstudiantes());

    setIdEst('');
    setNombreEst('');
    setCelularEst('');
  };

  const cargarEstudiantes = () => {
    setListaEstudiantes(obtenerEstudiantes());
  };

  return (
    <ScrollView style={{ padding: 15, backgroundColor: '#f5f5f5' }}>

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
         Panel Profesor
      </Text>

      {/* CREAR CLASE */}
      <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, marginBottom: 15 }}>
        <Text style={{ fontWeight: 'bold' }}>Crear Clase</Text>

        <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
        <TextInput placeholder="Hora inicio (08:00)" value={horaInicio} onChangeText={setHoraInicio} style={styles.input} />
        <TextInput placeholder="Hora fin (10:00)" value={horaFin} onChangeText={setHoraFin} style={styles.input} />

        <Button title="Crear Clase" onPress={crearClase} />
      </View>

      {/* LISTA CLASES */}
      <View style={styles.card}>
        <Text style={styles.title}> Clases</Text>

        <FlatList
          data={clases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item.nombre} ({item.horaInicio}-{item.horaFin})
            </Text>
          )}
        />
      </View>

      {/* QR */}
      <View style={styles.card}>
        <Button title="Generar QR" onPress={crearQR} />

        {qr !== '' && (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <QRCode value={qr} size={180} />
            <Text selectable style={{ fontSize: 10 }}>{qr}</Text>
          </View>
        )}
      </View>

      {/* EXPORTAR */}
      <View style={styles.card}>
        <Button title="Exportar CSV" onPress={() => exportarCSV(clases)} />
      </View>

      {/* REGISTRO MANUAL */}
      <View style={styles.card}>
        <Text style={styles.title}>Registro Manual</Text>

        <TextInput placeholder="ID Estudiante" value={estudianteManual} onChangeText={setEstudianteManual} style={styles.input} />
        <Button title="Registrar" onPress={registrarManual} />
        <Text>{mensajeManual}</Text>
      </View>

      {/* AGREGAR ESTUDIANTE */}
      <View style={styles.card}>
        <Text style={styles.title}> Agregar Estudiante</Text>

        <TextInput placeholder="ID" value={idEst} onChangeText={setIdEst} style={styles.input} />
        <TextInput placeholder="Nombre" value={nombreEst} onChangeText={setNombreEst} style={styles.input} />
        <TextInput placeholder="Celular" value={celularEst} onChangeText={setCelularEst} style={styles.input} />

        <Button title="Agregar" onPress={crearEstudiante} />
      </View>

      {/* LISTA ESTUDIANTES */}
      <View style={styles.card}>
        <Button title="Ver Estudiantes" onPress={cargarEstudiantes} />

        <FlatList
          data={listaEstudiantes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item.id} - {item.nombre} ({item.celular})
            </Text>
          )}
        />
      </View>

    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  item: {
    padding: 5,
    borderBottomWidth: 0.5
  }
};