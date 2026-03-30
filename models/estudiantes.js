let estudiantes = [];

export const agregarEstudiante = (estudiante) => {
  estudiantes.push(estudiante);
};

export const obtenerEstudiantes = () => estudiantes;

export const buscarEstudiante = (id) => {
  return estudiantes.find(e => e.id === id);
};

export const actualizarEstudiante = (id, nuevosDatos) => {
  const index = estudiantes.findIndex(e => e.id === id);
  if (index !== -1) {
    estudiantes[index] = { ...estudiantes[index], ...nuevosDatos };
  }
};