let clases = [];

// Agrega una nueva clase a la lista
export const agregarClase = (clase) => {
  clases.push(clase);
};

// Retorna la lista completa de clases
export const obtenerClases = () => {
  return clases;
};