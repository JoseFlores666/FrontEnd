import axios from "./axios";

export const VerApis_Keys = async () => axios.get(`/api_key/`);

export const CrearApi_key = async (api_key) =>
  axios.post(`/api_key/crearApi_key/`, api_key);

export const actualizaApi_key = async (id, myApi_key) =>
  axios.put(`/api_key/editarApi_key/${id}`, myApi_key);
