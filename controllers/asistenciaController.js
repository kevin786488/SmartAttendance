import { buscarEstudiante } from '../models/estudiantes';
import { estaEnHorario } from '../utils/time';

let asistencias = [];
let logs = [];

const registrarLog = (motivo, estudianteId = null, claseId = null) => {
  logs.push({
    estudianteId,
    claseId,
    motivo,
    fecha: new Date().toISOString()
  });

  console.log(logs);
};

export const registrarAsistencia = ({ estudianteId, celular, clase, qr }) => {

  let dataQR;

  try {
    dataQR = JSON.parse(qr);
  } catch (e) {
    registrarLog('QR inválido', estudianteId);
    return { ok: false, mensaje: 'QR inválido' };
  }

  if (dataQR.classId !== clase.id) {
    registrarLog('QR incorrecto', estudianteId, clase.id);
    return { ok: false, mensaje: 'QR no pertenece a esta clase' };
  }

  if (Date.now() > dataQR.exp) {
    registrarLog('QR expirado', estudianteId, clase.id);
    return { ok: false, mensaje: 'QR expirado' };
  }

  if (!dataQR.token) {
    registrarLog('Token inválido', estudianteId, clase.id);
    return { ok: false, mensaje: 'Token inválido' };
  }

  const estudiante = buscarEstudiante(estudianteId);

  if (!estudiante) {
    registrarLog('Estudiante no existe', estudianteId);
    return { ok: false, mensaje: 'Estudiante no existe' };
  }

  if (estudiante.celular !== celular) {
    registrarLog('Celular incorrecto', estudianteId, clase.id);
    return { ok: false, mensaje: 'Celular incorrecto' };
  }

  if (!estaEnHorario(clase.horaInicio, clase.horaFin)) {
    registrarLog('Fuera de horario', estudianteId, clase.id);
    return { ok: false, mensaje: 'Fuera de horario' };
  }

  const yaExiste = asistencias.find(
    a => a.estudianteId === estudianteId && a.claseId === clase.id
  );

  if (yaExiste) {
    registrarLog('Duplicado', estudianteId, clase.id);
    return { ok: false, mensaje: 'Ya registró asistencia' };
  }

  asistencias.push({
    estudianteId,
    claseId: clase.id,
    fecha: new Date(),
    tipo: 'qr'
  });

  return { ok: true, mensaje: 'Asistencia registrada' };
};

export const registrarAsistenciaManual = ({ estudianteId, clase }) => {

  const estudiante = buscarEstudiante(estudianteId);

  if (!estudiante) {
    registrarLog('Estudiante no existe (manual)', estudianteId, clase.id);
    return { ok: false, mensaje: 'Estudiante no existe' };
  }

  const yaExiste = asistencias.find(
    a => a.estudianteId === estudianteId && a.claseId === clase.id
  );

  if (yaExiste) {
    registrarLog('Duplicado manual', estudianteId, clase.id);
    return { ok: false, mensaje: 'Ya registró asistencia' };
  }

  asistencias.push({
    estudianteId,
    claseId: clase.id,
    fecha: new Date(),
    tipo: 'manual'
  });

  return { ok: true, mensaje: 'Asistencia manual registrada' };
};

export const calcularAsistencia = (estudianteId, totalClases) => {

  const asistenciasEstudiante = asistencias.filter(
    a => a.estudianteId === estudianteId
  ).length;

  if (totalClases === 0) return 0;

  return ((asistenciasEstudiante / totalClases) * 100).toFixed(2);
};