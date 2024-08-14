export const ValidacionOrden = (fields) => {
    const errors2 = {};

    if (!fields.fecha) errors2.fecha = "La fecha es requerida.";
    if (!fields.areasoli) errors2.areasoli = "El area solicitante es requerida.";
    if (!fields.solicita) errors2.solicita = "El solicitante es requerido.";
    if (!fields.edificio) errors2.edificio = "El edificio es requerido.";
    if (!fields.descripcion) errors2.descripcion = "La descripcion es requerida.";
  
    // if (!fields.tipoMantenimiento) errors2.tipoMantenimiento = "El tipo de manteniiento es requerido.";
    // if (!fields.tipoTrabajo) errors2.tipoTrabajo = "El tipo de trabajo es requerido.";
    // if (!fields.tipoSolicitud) errors2.tipoSolicitud = "El tipo de solicitud es requerido.";
    return errors2;
  };
