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

export const actualizarInformes = async (id, informe) =>
  axios.put(`/informe/actualizarInformes/${id}`, informe);

export const evaluacionDelInfome = async (id, idTecnico) =>
  axios.put(`/informe/AsignarTecnico/${id}`, { idTecnico });

export const capturarDiagnostico = async (id, diagnostico) =>
  axios.put(`/informe/capturarDiagnostico/${id}`, diagnostico);

export const AsignarlePersonalDEPMSG = async (id, personalDEP) =>
  axios.put(`/informe/AsignarlePersonalDEPMSG/${id}`, {personalDEP});

export const eliminarUnaImagen = async (id, public_id) =>
  axios.delete(`/informe/eliminarUnaImagen/${id}`, { data: { public_id } });

//estado
export const editarEstadoInforme = async (id) =>
  axios.put(`/informe/editarEstadoInforme/${id}`);

export const getEstadosOrdenTrabajo = async () =>
  axios.get(`/estadosOrdenTrabajo`);

export const crearEstadosOrdenTrabajo = async (estados) =>
  axios.post(`/estadosOrdenTrabajo/crear`, estados);

export const actualizarEstadosOrdenTrabajo = async (EstadosAActualizar) =>
  axios.put(`/estadosOrdenTrabajo/actualizar`, EstadosAActualizar);

export const declinarSoliOrdenTrabajo = async (id, user) =>
  axios.put(`/solicitud/estado/${id}`, { user });
//En un endpoint GET, típicamente se utilizan req.query

export const getCantidadTotalOrdenTrabajoEstados = async (mesAnioIdestado) =>
  axios.get(`/estadosOrdenTrabajo/cantidadTotal`, {
    params: mesAnioIdestado,
  });

// Técnicos
export const getTecnicos = async () => axios.get("/tecnicos");

export const createTecnico = async (tecnico) =>
  axios.post(`/tecnicos`, tecnico);

export const getTecnicoPorId = async (id) => axios.get(`/tecnicos/${id}`);

export const updateTecnico = async (id, tecnico) =>
  axios.put(`/tecnicos/${id}`, tecnico);

export const deleteTecnico = async (id) => axios.delete(`/tecnicos/${id}`);

export const getTecnicosPorInforme = async (id) =>
  axios.get(`/informe/${id}/descripcion`);
