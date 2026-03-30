import { useState } from 'react';
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      contentContainerStyle={{ padding: 15 }}
      showsVerticalScrollIndicator={true}
    >
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>
        Panel Profesor
      </Text>

      {/* CREAR CLASE */}
      <View style={styles.card}>
        <Text style={styles.title}>Crear Clase</Text>

        <TextInput 
          placeholder="Nombre de la clase" 
          value={nombre} 
          onChangeText={setNombre} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Hora inicio (08:00)" 
          value={horaInicio} 
          onChangeText={setHoraInicio} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Hora fin (10:00)" 
          value={horaFin} 
          onChangeText={setHoraFin} 
          style={styles.input} 
        />

        <Button title="Crear Clase" onPress={crearClase} />
      </View>

      {/* CLASES */}
      <View style={styles.card}>
        <Text style={styles.title}>Clases Creadas</Text>

        <FlatList
          data={clases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item.nombre} ({item.horaInicio}-{item.horaFin})
            </Text>
          )}
          scrollEnabled={false} // Para evitar conflicto de scroll con ScrollView
        />
      </View>

      {/* QR */}
      <View style={styles.card}>
        <Button title="Generar QR para la clase actual" onPress={crearQR} />

        {qr !== '' && (
          <View style={{ alignItems: 'center', marginTop: 15 }}>
            <QRCode value={qr} size={180} />
            <Text selectable style={{ fontSize: 10, marginTop: 10, textAlign: 'center' }}>
              {qr}
            </Text>
          </View>
        )}
      </View>

      {/* EXPORTAR */}
      <View style={styles.card}>
        <Button title="Exportar CSV" onPress={() => exportarCSV(clases)} />
      </View>

      {/* REGISTRO MANUAL */}
      <View style={styles.card}>
        <Text style={styles.title}>Registro Manual de Asistencia</Text>

        <TextInput 
          placeholder="ID Estudiante" 
          value={estudianteManual} 
          onChangeText={setEstudianteManual} 
          style={styles.input} 
        />
        <Button title="Registrar Asistencia" onPress={registrarManual} />
        {mensajeManual !== '' && <Text style={{ marginTop: 8, color: 'blue' }}>{mensajeManual}</Text>}
      </View>

      {/* AGREGAR ESTUDIANTE */}
      <View style={styles.card}>
        <Text style={styles.title}>Agregar Estudiante</Text>

        <TextInput 
          placeholder="ID" 
          value={idEst} 
          onChangeText={setIdEst} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Nombre completo" 
          value={nombreEst} 
          onChangeText={setNombreEst} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Celular" 
          value={celularEst} 
          onChangeText={setCelularEst} 
          style={styles.input} 
          keyboardType="phone-pad"
        />

        <Button title="Agregar Estudiante" onPress={crearEstudiante} />
      </View>

      {/* LISTA ESTUDIANTES */}
      <View style={styles.card}>
        <Button title="Cargar / Actualizar Lista de Estudiantes" onPress={cargarEstudiantes} />

        <FlatList
          data={listaEstudiantes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item.id} - {item.nombre} ({item.celular})
            </Text>
          )}
          scrollEnabled={false}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  item: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    fontSize: 15,
  }
});