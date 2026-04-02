// ResultadosView.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAsistencia } from '../context/AsistenciaContext';

export default function ResultadosView() {

  const [estudiantes, setEstudiantes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [clasesTotales, setClasesTotales] = useState(8); // Puedes cambiar este número
  const [cargando, setCargando] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { actualizarTrigger } = useAsistencia();

  const cargarAsistencias = async () => {
    setCargando(true);
    try {
      const asistenciasGuardadas = await AsyncStorage.getItem('asistencias');
      const asistencias = asistenciasGuardadas ? JSON.parse(asistenciasGuardadas) : [];

      // Agrupar por estudiante y calcular porcentaje
      const estudiantesMap = new Map();

      asistencias.forEach(asistencia => {
        if (!estudiantesMap.has(asistencia.id)) {
          estudiantesMap.set(asistencia.id, {
            id: asistencia.id,
            celular: asistencia.celular,
            asistencias: 0,
            totalClases: clasesTotales,
          });
        }
        const est = estudiantesMap.get(asistencia.id);
        est.asistencias += 1;
      });

      const listaEstudiantes = Array.from(estudiantesMap.values()).map(est => ({
        ...est,
        nombre: `Estudiante ${est.id}`, // Temporal (puedes mejorar esto)
        porcentaje: Math.round((est.asistencias / est.totalClases) * 100)
      }));

      setEstudiantes(listaEstudiantes);
    } catch (error) {
      console.error("Error al cargar asistencias:", error);
    } finally {
      setCargando(false);
    }
  };

  // Cargar al montar y cuando se registre nueva asistencia
  useEffect(() => {
    cargarAsistencias();
  }, [actualizarTrigger]);

  // Pull to Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await cargarAsistencias();
    setRefreshing(false);
  };

  const estudiantesFiltrados = estudiantes.filter(est => 
    est.id?.toLowerCase().includes(filtro.toLowerCase()) ||
    est.nombre?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
      }
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Resultados de Asistencia</Text>
        <Text style={styles.headerSubtitle}>
          Total de clases: <Text style={{ color: '#3b82f6' }}>{clasesTotales}</Text>
        </Text>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar por ID o nombre..."
          value={filtro}
          onChangeText={setFiltro}
          style={styles.searchInput}
          placeholderTextColor="#64748b"
        />
      </View>

      {/* Botón Actualizar */}
      <TouchableOpacity 
        style={styles.updateButton} 
        onPress={cargarAsistencias}
        disabled={cargando}
      >
        <Text style={styles.updateButtonText}>
          {cargando ? "Actualizando..." : "🔄 ACTUALIZAR LISTA"}
        </Text>
      </TouchableOpacity>

      {/* Lista de Estudiantes */}
      <View style={styles.listContainer}>
        {cargando && estudiantes.length === 0 ? (
          <Text style={styles.loadingText}>Cargando asistencias...</Text>
        ) : estudiantesFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Aún no hay registros</Text>
            <Text style={styles.emptySubtitle}>
              Registra asistencias en la pantalla anterior para ver los resultados aquí
            </Text>
          </View>
        ) : (
          estudiantesFiltrados.map((est, index) => (
            <View key={index} style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentId}>{est.id}</Text>
                <Text style={styles.studentName}>{est.nombre}</Text>
                <Text style={styles.studentPhone}>{est.celular}</Text>
              </View>

              <View style={styles.asistenciaContainer}>
                <Text style={styles.asistenciaLabel}>Asistencia</Text>
                <Text style={[
                  styles.porcentajeText,
                  est.porcentaje >= 80 ? styles.success :
                  est.porcentaje >= 60 ? styles.warning : styles.danger
                ]}>
                  {est.porcentaje}%
                </Text>
                <Text style={styles.detalle}>
                  {est.asistencias} de {est.totalClases} clases
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

// === ESTILOS (Tema Blanco) ===
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e2937',
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 6,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1e2937',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  updateButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  updateButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '700',
  },
  listContainer: {
    gap: 16,
  },
  studentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  studentInfo: { flex: 1 },
  studentId: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e2937',
    marginBottom: 4,
  },
  studentPhone: {
    fontSize: 15,
    color: '#64748b',
  },
  asistenciaContainer: {
    alignItems: 'center',
  },
  asistenciaLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  porcentajeText: {
    fontSize: 28,
    fontWeight: '800',
  },
  detalle: {
    fontSize: 13,
    color: '#64748b',
  },
  success: { color: '#10b981' },
  warning: { color: '#f59e0b' },
  danger: { color: '#ef4444' },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 40,
  },
};