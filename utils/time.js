// utils/time.js

/**
 * Verifica si la hora actual está dentro del horario de la clase
 * Versión con modo desarrollo (fácil de activar/desactivar)
 */
export const estaEnHorario = (horaInicio, horaFin) => {
  
  // ==================== MODO DESARROLLO ====================
  // Cambia a "false" cuando quieras activar la validación real
  const MODO_DESARROLLO = true;

  if (MODO_DESARROLLO) {
    console.log(`[DEV] estaEnHorario - Modo desarrollo activado → Siempre permite registro`);
    console.log(`Clase: ${horaInicio} - ${horaFin}`);
    return true;
  }
  // ========================================================

  // ==================== VERSIÓN REAL (cuando termines de probar) ====================
  try {
    const ahora = new Date();
    const minutosActual = ahora.getHours() * 60 + ahora.getMinutes();

    // Convertir horaInicio y horaFin a minutos
    const [hInicio, mInicio = 0] = horaInicio.split(':').map(n => parseInt(n, 10));
    const [hFin, mFin = 0] = horaFin.split(':').map(n => parseInt(n, 10));

    const minutosInicio = hInicio * 60 + mInicio;
    const minutosFin = hFin * 60 + mFin;

    const estaDentro = minutosActual >= minutosInicio && minutosActual <= minutosFin;

    console.log(`[PROD] estaEnHorario → Actual: ${minutosActual} min | Clase: ${minutosInicio}-${minutosFin} min → ${estaDentro ? 'DENTRO' : 'FUERA'}`);

    return estaDentro;

  } catch (error) {
    console.error("Error en estaEnHorario:", error);
    return false;
  }
};