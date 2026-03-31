export const generarQR = (claseId) => {
  // Establece una expiración de 60 segundos para el código QR
  const expiracion = Date.now() + 60000;

  const data = {
    classId: claseId,
    token: Math.random().toString(36).substring(7), // Token aleatorio para seguridad
    exp: expiracion
  };

  // Devuelve los datos en formato JSON para ser usados en el código QR
  return JSON.stringify(data);
};