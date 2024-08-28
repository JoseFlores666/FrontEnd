export const ValidacionOrden = (fields) => {
    const errors = {};

    if (!fields.fecha) errors.fecha = "La fecha es requerida.";
    if (!fields.areasoli) errors.areasoli = "El area solicitante es requerida.";
    if (!fields.solicita) errors.solicita = "El solicitante es requerido.";
    if (!fields.edificio) errors.edificio = "El edificio es requerido.";
    if (!fields.descripcion) errors.descripcion = "La descripcion es requerida.";
  
     if (!fields.tipoMantenimiento) errors.tipoMantenimiento = "El tipo de manteniiento es requerido.";
     if (!fields.tipoTrabajo) errors.tipoTrabajo = "El tipo de trabajo es requerido.";
     if (!fields.tipoSolicitud) errors.tipoSolicitud = "El tipo de solicitud es requerido.";
    return errors;
  };
