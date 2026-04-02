// controllers/asistenciaController.js   

import { buscarEstudiante } from '../models/estudiantes';
import { estaEnHorario } from '../utils/time';

// Arrays en memoria para guardar asistencias y logs 
let asistencias = [];
let logs = [];

// Función interna para registrar logs de intentos (útil para depuración)
const registrarLog = (motivo, estudianteId = null, claseId = null) => {
  logs.push({
    estudianteId,
    claseId,
    motivo,
    fecha: new Date().toISOString()
  });

  console.log(logs);   // Muestra los logs en consola
};

// =============================================
// REGISTRO DE ASISTENCIA CON QR
// =============================================
export const registrarAsistencia = ({ estudianteId, celular, clase, qr }) => {

  let dataQR;

  // Intentar parsear el QR (debe ser JSON válido)
  try {
    dataQR = JSON.parse(qr);
  } catch (e) {
    registrarLog('QR inválido', estudianteId);
    return { ok: false, mensaje: 'QR inválido' };
  }

  // Validar que el QR corresponde a la clase actual
  if (dataQR.classId !== clase.id) {
    registrarLog('QR incorrecto', estudianteId, clase.id);
    return { ok: false, mensaje: 'QR no pertenece a esta clase' };
  }

  // Validar que el QR no haya expirado
  if (Date.now() > dataQR.exp) {
    registrarLog('QR expirado', estudianteId, clase.id);
    return { ok: false, mensaje: 'QR expirado' };
  }

  // Validar que tenga token
  if (!dataQR.token) {
    registrarLog('Token inválido', estudianteId, clase.id);
    return { ok: false, mensaje: 'Token inválido' };
  }

  // Buscar si el estudiante existe
  const estudiante = buscarEstudiante(estudianteId);

  if (!estudiante) {
    registrarLog('Estudiante no existe', estudianteId);
    return { ok: false, mensaje: 'Estudiante no existe' };
  }

  // Verificar que el celular coincida con el registrado
  if (estudiante.celular !== celular) {
    registrarLog('Celular incorrecto', estudianteId, clase.id);
    return { ok: false, mensaje: 'Celular incorrecto' };
  }

  // Verificar que esté dentro del horario de la clase
  if (!estaEnHorario(clase.horaInicio, clase.horaFin)) {
    registrarLog('Fuera de horario', estudianteId, clase.id);
    return { ok: false, mensaje: 'Fuera de horario' };
  }

  // Evitar duplicados (misma clase)
  const yaExiste = asistencias.find(
    a => a.estudianteId === estudianteId && a.claseId === clase.id
  );

  if (yaExiste) {
    registrarLog('Duplicado', estudianteId, clase.id);
    return { ok: false, mensaje: 'Ya registró asistencia' };
  }

  // Registrar asistencia exitosa
  asistencias.push({
    estudianteId,
    claseId: clase.id,
    fecha: new Date(),
    tipo: 'qr'
  });

  return { ok: true, mensaje: 'Asistencia registrada' };
};

// =============================================
// REGISTRO MANUAL (desde ProfesorView)
// =============================================
export const registrarAsistenciaManual = ({ estudianteId, clase }) => {

  const estudiante = buscarEstudiante(estudianteId);

  if (!estudiante) {
    registrarLog('Estudiante no existe (manual)', estudianteId, clase.id);
    return { ok: false, mensaje: 'Estudiante no existe' };
  }

  // Evitar duplicados
  const yaExiste = asistencias.find(
    a => a.estudianteId === estudianteId && a.claseId === clase.id
  );

  if (yaExiste) {
    registrarLog('Duplicado manual', estudianteId, clase.id);
    return { ok: false, mensaje: 'Ya registró asistencia' };
  }

  // Registrar asistencia manual
  asistencias.push({
    estudianteId,
    claseId: clase.id,
    fecha: new Date(),
    tipo: 'manual'
  });

  return { ok: true, mensaje: 'Asistencia manual registrada' };
};

// =============================================
// CALCULAR PORCENTAJE DE ASISTENCIA
// =============================================
export const calcularAsistencia = (estudianteId, totalClases) => {

  const asistenciasEstudiante = asistencias.filter(
    a => a.estudianteId === estudianteId
  ).length;

  if (totalClases === 0) return 0;

  return ((asistenciasEstudiante / totalClases) * 100).toFixed(2);
};