export const ValidacionSoli = (fields, items) => {
    const errors = {};
    
    if (!fields.fecha) {
      errors.fecha = "La fecha es obligatoria";
    }
    if (!fields.suministro) {
      errors.suministro = "El tipo de suministro es obligatorio";
    }
    if (!fields.pc) {
      errors.pc = "El proceso clave es obligatorio";
    }
    if (!fields.proyecto) {
      errors.proyecto = "El proyecto es obligatorio";
    }
    if (!fields.actividad) {
      errors.actividad = "La actividad es obligatoria";
    }
  
    if (items.length === 0) {
        errors.items = "Debe haber al menos un ítem";
      } else {
        items.forEach((item, index) => {
          if (!item.cantidad) {
            errors[`items[${index}].cantidad`] = "La cantidad es obligatoria";
          }
          if (!item.unidad) {
            errors[`items[${index}].unidad`] = "La unidad es obligatoria";
          }
          if (!item.descripcion) {
            errors[`items[${index}].descripcion`] = "La descripción es obligatoria";
          }
        });
      }

    if (!fields.justificacion) {
        errors.justificacion = "La Justificacion es obligatoria";
      }
    
  
    return errors;
  }; 