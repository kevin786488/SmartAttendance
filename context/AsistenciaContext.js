// context/AsistenciaContext.js

import { createContext, useContext, useState } from 'react';

// Crear el contexto (contenedor que permite compartir datos entre componentes)
const AsistenciaContext = createContext();

// Proveedor del contexto (envuelve la aplicación o partes de ella)
export function AsistenciaProvider({ children }) {

  // Estado que actúa como "señal" para refrescar la pantalla de resultados
  const [actualizarTrigger, setActualizarTrigger] = useState(0);

  // Función que se llama después de registrar una asistencia
  // Aumenta el trigger para que ResultadosView se actualice automáticamente
  const refrescarResultados = () => {
    setActualizarTrigger(prev => prev + 1);
  };

  return (
    // Proporciona el trigger y la función a todos los componentes hijos
    <AsistenciaContext.Provider value={{ actualizarTrigger, refrescarResultados }}>
      {children}
    </AsistenciaContext.Provider>
  );
}

// Hook personalizado para usar el contexto fácilmente en cualquier componente
export const useAsistencia = () => useContext(AsistenciaContext);