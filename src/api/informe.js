import axios from "./axios";

export const getInfome = async () => axios.get("/informe");

export const createInfome = async (info) => axios.post(`/informe`, info);

export const llenadoDEPInforme = async (id, info) =>
  axios.post(`/informe/llenadoDEPInforme/${id}`, info, console.log(info));

export const updateInfome = async (info) =>
  axios.put(`/informe/${info._id}`, info);

export const deleteInfome = async (id) => axios.delete(`/informe/${id}`);

export const getUnaInfome = async (id) => axios.get(`/informe/${id}`);

export const getImagenInfome = async (id) =>
  axios.get(`/informe/traerImagenes/${id}`);

export const evaluacionDelInfome = async (id, idTecnico) =>
  axios.put(`/informe/AsignarTecnico/${id}`, { idTecnico });

export const capturarDiagnostico = async (id, diagnostico) =>
  axios.put(`/informe/capturarDiagnostico/${id}`, diagnostico);

//estado
export const editarEstadoInforme = async (id) =>
  axios.put(`/informe/editarEstadoInforme/${id}`);

export const getEstadosOrdenTrabajo = async () =>
  axios.get(`/estadosOrdenTrabajo`);

export const getCantidadTotalOrdenTrabajoEstados = async () =>
  axios.get(`/estadosOrdenTrabajo/cantidadTotal`);

export const crearEstadosOrdenTrabajo = async (estados) =>
  axios.post(`/estadosOrdenTrabajo/crear`, estados);


export const actualizarEstadosOrdenTrabajo = async (EstadosAActualizar) =>
  axios.put(`/estadosOrdenTrabajo/actualizar`, EstadosAActualizar);


export const declinarSoliOrdenTrabajo = async (id, user) =>
  axios.put(`/solicitud/estado/${id}`, { user });

//Tecnicos

export const getTecnicos = async () => axios.get("/tecnicos");

export const getEncabezado = async (id) =>
  axios.get(`/tecnicos/Encabezado/${id}`);
