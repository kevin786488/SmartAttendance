import { calcularAsistencia } from '../controllers/asistenciaController';
import { obtenerEstudiantes } from '../models/estudiantes';

export const exportarCSV = (clases) => {

  const estudiantes = obtenerEstudiantes();

  let csv = 'ID,Nombre,Asistencias,%\n';

  estudiantes.forEach(e => {
    const porcentaje = calcularAsistencia(e.id, clases.length);
    csv += `${e.id},${e.nombre},${clases.length},${porcentaje}%\n`;
  });

  console.log(csv);
  alert('CSV generado (ver consola)');
};