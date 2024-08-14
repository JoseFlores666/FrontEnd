import axios from './axios';

export const gethistorialOrdenTrabajo = async () =>
  axios.get(`/historialInput/`);
  
export const gethistorialSoli = async () =>
  axios.get(`/historialInput/historialSoli`);
export const getHistorialNombreFirmas = async () =>
  axios.get(`/historialInput/historialNombreFirmas`);
