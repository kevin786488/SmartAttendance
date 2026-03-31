let estudiantes = [];

// Agrega un nuevo estudiante con validación de ID único
export const agregarEstudiante = (estudiante) => {
  const existe = estudiantes.some(e => e.id === estudiante.id);
  
  if (existe) {
    throw new Error('Ya existe un estudiante con este ID');
  }

  estudiantes.push(estudiante);
};

// Retorna la lista completa de estudiantes
export const obtenerEstudiantes = () => estudiantes;

// Busca un estudiante por su ID
export const buscarEstudiante = (id) => {
  return estudiantes.find(e => e.id === id);
};

// Actualiza los datos de un estudiante existente
export const actualizarEstudiante = (id, nuevosDatos) => {
  const index = estudiantes.findIndex(e => e.id === id);
  if (index !== -1) {
    estudiantes[index] = { ...estudiantes[index], ...nuevosDatos };
  }
};