export const ValidacionOrden = (fields) => {
    const errors2 = {};

    if (!fields.fecha) errors.fecha = "La fecha es requerida.";
    if (!fields.areasoli) errors.areasoli = "El tipo de suministro es requerido.";
    if (!fields.solicita) errors.solicita = "El Proceso Clave (PC) es requerido.";
    if (!fields.edificio) errors.edificio = "El proyecto es requerido.";
    if (!fields.descripcion) errors.descripcion = "La actividad es requerida.";
  
    return errors2;
  };
