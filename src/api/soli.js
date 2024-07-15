import axios from "./axios";

export const getSolitudes = async () => axios.get("/solicitud");

export const getFiltroEstado = async (estado) =>
  axios.get(`/solicitud/estado/${estado}`);

export const actualizaEstado = async (id) =>
  axios.put(`/solicitud/estado/${id}`);

export const createSoli = async (soli) => axios.post(`/solicitud`, soli);

export const updateSoli = async (id, datosSolicitud) =>
  axios.put(`/solicitud/${id}`, datosSolicitud);

export const updateSoliFolioExterno = async (id, datosSolicitud) =>
  axios.put(`/solicitud/folioExterno/${id}`, datosSolicitud);

export const deleteSoli = async (id) =>
  axios.delete(`/solicitud/eliminar/${id}`);

export const getUnaSoli = async (id) => axios.get(`/solicitud/${id}`);

//consulta de las firmas
export const nombreFirmas = async () => axios.get(`/firmas/`);

export const editarNombreFirmas = async (id, nombreFirmas) =>
  axios.put(`/firmas/${id}`, nombreFirmas);

// consultas de hacia el api para la collecion "proyectos"
export const idsProyect = async () => axios.get(`/proyecto/ids`);

export const traeUnProyectAct = async (id) => axios.get(`/proyecto/${id}`);

export const getUnProyectYAct = async (proyectoId, actividadId) =>
  axios.get(`/proyecto/${proyectoId}/actividad/${actividadId}`);

//abonos
export const putAbono = async (id, soli) => axios.put(`/abono/${id}`, soli);
