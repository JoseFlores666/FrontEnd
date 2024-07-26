import axios from "./axios";

export const getInfome = async () => axios.get("/informe");

export const createInfome= async (info) => axios.post(`/informe`, info);

export const llenadoDEPInforme= async (id,info) => axios.post(`/informe/llenadoDEPInforme/${id}`, info);

export const updateInfome = async (info) =>axios.put(`/informe/${info._id}`, info);

export const deleteInfome = async (id) => axios.delete(`/informe/${id}`);

export const getUnaInfome = async (id) => axios.get(`/informe/${id}`);

export const getImagenInfome = async (id) => axios.get(`/informe/traerImagenes/${id}`);

export const evaluacionDelInfome = async (id,info) =>axios.put(`/informe/AsignarTecnico/${id}`, info);

//estado
export const editarEstadoInforme = async (id) =>axios.put(`/informe/editarEstadoInforme/${id}`);


//Tecnicos

export const getTecnicos = async () => axios.get("/tecnicos");