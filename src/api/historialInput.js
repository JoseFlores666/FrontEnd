import axios from './axios';

export const gethistorialOrdenTrabajo = async () =>
  axios.get(`/historialInput/`);
  
export const gethistorialSoli = async () =>
  axios.get(`/historialInput/historialSoli`);
