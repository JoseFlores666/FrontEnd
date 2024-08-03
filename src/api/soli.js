import axios from "./axios";

export const getSolitudes = async () => axios.get("/solicitud");

export const createSoli = async (soli) => axios.post(`/solicitud`, soli);

export const updateSoli = async (id, datosSolicitud) =>
  axios.put(`/solicitud/${id}`, datosSolicitud);

export const updateSoliFolioExterno = async (id, datosSolicitud) =>
  axios.put(`/solicitud/folioExterno/${id}`, datosSolicitud);

export const deleteSoli = async (id, user) =>
  axios.delete(`/solicitud/eliminar/${id}`, {
    data: { user },
  });

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

//estados
export const getFiltroEstado = async (estado) =>
  axios.get(`/solicitud/estado/${estado}`);

export const getEstados = async () => axios.get(`/estados`);

export const getVercantidadTotalEstados = async () =>
  axios.get(`/estados/VercantidadTotal`);

export const actualizaEstado = async (EstadosAActualizar) =>
  axios.put(`/estados/actualizar`, EstadosAActualizar);

export const declinarSoli = async (id, user) =>
  axios.put(`/solicitud/estado/${id}`, { user });

//historialSolicitudes

export const hisorialSolicitud = async () => axios.get(`/hisorialSolicitud`);
export const hisorialDeUnaSoli = async (id) =>
  axios.get(`/hisorialSolicitud/verDeUnUsuario/${id}`);

export const deleteUnHistorialSoli = async (id, data) =>
  axios.delete(`/hisorialSolicitud/eliminarUnHistorialSoli/${id}`, {
    data: data,
  });

//proyecto

export const getProyecto = async () => axios.get(`/proyecto`);

export const getUnProyectoActividades = async (id) =>
  axios.get(`/proyecto/${id}`);

export const asignarActividadesProyecto = async (proyectoAct) =>
  axios.post(`/proyecto`, proyectoAct);

export const postProyecto = async (nombre) =>
  axios.post(`/proyecto`, { nombre });
export const ProyectCrearActYAsignarle = async (id, actividades) =>
  axios.post(`/proyecto/ProyectCrearActYAsignarle/${id}`, { actividades });

export const asignarActividadProyect = async (id, idActividades) =>
  axios.put(`/proyecto/asignarActividadProyect/${id}`, { idActividades });

export const desenlazarActividadProyec = async (id, idActividad) =>
  axios.put(`/proyecto/desenlazarActividadProyec/${id}`, { idActividad });

export const editarProyecto = async (id, nombre) =>
  axios.put(`/proyecto/editarProyecto/${id}`, { nombre });

export const deleteProyecto = async (id) => axios.delete(`/proyecto/${id}`);

//Actividades

export const getActividad = async () => axios.get(`/actividad/`);

export const getActSinAsignar = async () =>
  axios.get(`/proyecto/getActSinAsignar`);

export const postActividad = async (actividad) =>
  axios.post(`/actividad`, actividad);

export const putActividad = async (id, data) =>
  axios.put(`/actividad/actualizarAct/${id}`, data);

export const deleteActividad = async (id) => axios.delete(`/actividad/${id}`);
