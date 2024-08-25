import axios from "./axios";

export const registerRequest = async (user) =>
  axios.post(`/auth/register`, user);

export const loginRequest = async (user) => axios.post(`/auth/login`, user);

export const ActualizaUsuario = async (id,user) => axios.put(`/auth/ActualizarUsuario/${id}`, user);

export const verifyTokenRequest = async () => axios.get(`/auth/verify`);

export const getUsuarios = async () => axios.get(`/auth/traerUsuarios`);