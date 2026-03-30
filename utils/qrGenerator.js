export const generarQR = (claseId) => {
  const expiracion = Date.now() + 60000; // 60 segundos

  const data = {
    classId: claseId,
    token: Math.random().toString(36).substring(7),
    exp: expiracion
  };

  return JSON.stringify(data);
};