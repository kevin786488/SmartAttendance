export const estaEnHorario = (horaInicio, horaFin) => {
  const ahora = new Date();

  const [hInicio, mInicio] = horaInicio.split(':').map(Number);
  const [hFin, mFin] = horaFin.split(':').map(Number);

  const inicio = new Date();
  inicio.setHours(hInicio, mInicio, 0);

  const fin = new Date();
  fin.setHours(hFin, mFin, 0);

  return ahora >= inicio && ahora <= fin;
};