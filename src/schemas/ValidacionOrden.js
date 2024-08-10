export const ValidacionOrden = (fields) => {
    const errors2 = {};

    if (!fields.fecha) errors2.fecha = "La fecha es requerida.";
    if (!fields.areasoli) errors2.areasoli = "El tipo de suministro es requerido.";
    if (!fields.solicita) errors2.solicita = "El Proceso Clave (PC) es requerido.";
    if (!fields.edificio) errors2.edificio = "El proyecto es requerido.";
    if (!fields.descripcion) errors2.descripcion = "La actividad es requerida.";
  
    if (!fields.tipoMantenimiento) errors2.tipoMantenimiento = "El Proceso Clave (PC) es requerido.";
    if (!fields.tipoTrabajo) errors2.tipoTrabajo = "El proyecto es requerido.";
    if (!fields.tipoSolicitud) errors2.tipoSolicitud = "La actividad es requerida.";
    return errors2;
  };
