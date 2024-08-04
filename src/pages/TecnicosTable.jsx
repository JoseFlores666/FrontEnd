import React, { useState, useEffect } from 'react';
import { useOrden } from '../context/ordenDeTrabajoContext';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone,faEdit } from '@fortawesome/free-solid-svg-icons';

export const TecnicosTable = () => {
  const [form, setForm] = useState({
    nombreCompleto: '',
    edad: '',
    telefono: '',
    correo: '',
    area: ''
  });
  const [editId, setEditId] = useState(null);
  const [datosCargados, setDatosCargados] = useState(false);
  const {
    crearTecnico,
    eliminarTecnico,
    traerTecnicoPorId,
    traerTecnicos,
    actualizarTecnico,
    tecnicos = [],
    unTecnicos
  } = useOrden();

  useEffect(() => {
    if (editId && unTecnicos) {
      setForm({
        nombreCompleto: unTecnicos.nombreCompleto || '',
        edad: unTecnicos.edad || '',
        telefono: unTecnicos.telefono || '',
        correo: unTecnicos.correo || '',
        area: unTecnicos.area || ''
      });
    } else {
      setForm({
        nombreCompleto: '',
        edad: '',
        telefono: '',
        correo: '',
        area: ''
      });
    }
  }, [unTecnicos, editId]);

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        await traerTecnicos();
        setDatosCargados(true);
      } catch (error) {
        console.error('Error al traer los técnicos:', error);
      }
    };
    if (!datosCargados) {
      fetchTecnicos();
    }
  }, [traerTecnicos, datosCargados]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.nombreCompleto.trim() && form.edad.toString().trim() && form.telefono.trim() && form.correo.trim() && form.area.trim()) {
      try {
        if (editId) {
          const res = await actualizarTecnico(editId, form);
          if (res && res.data?.mensaje) {
            Swal.fire('Completado', res.data?.mensaje, 'success');
          } else {
            Swal.fire('Error', res?.error || 'Error desconocido', 'error');
          }
        } else {
          const res = await crearTecnico(form);
          if (res && res.data?.mensaje) {
            Swal.fire('Completado', res.data?.mensaje, 'success');
          } else {
            Swal.fire('Error', res?.error || 'Error desconocido', 'error');
          }
        }
        limpiar();
        await traerTecnicos();
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    } else {
      Swal.fire('Advertencia', 'Por favor, complete todos los campos', 'warning');
    }
  };

  const handleEdit = async (id) => {
    try {
      await traerTecnicoPorId(id);
      setEditId(id);
    } catch (error) {
      console.error('Error al editar técnico:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await eliminarTecnico(id);
      if (res && res.data?.mensaje) {
        Swal.fire('Completado', res.data?.mensaje, 'success');
        await traerTecnicos();
      } else {
        Swal.fire('Error', res?.error || 'Error desconocido', 'error');
      }
    } catch (error) {
      console.error('Error al eliminar técnico:', error);
    }
  };

  const limpiar = () => {
    setForm({
      nombreCompleto: '',
      edad: '',
      telefono: '',
      correo: '',
      area: ''
    });
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">Gestión de Técnicos</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nombreCompleto"
            value={form.nombreCompleto}
            onChange={handleChange}
            placeholder="Nombre Completo"
            required
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            type="number"
            name="edad"
            value={form.edad}
            onChange={handleChange}
            placeholder="Edad"
            required
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            required
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="Correo"
            required
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            type="text"
            name="area"
            value={form.area}
            onChange={handleChange}
            placeholder="Área"
            required
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          >
            {editId ? 'Actualizar' : 'Agregar'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={limpiar}
              className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            >
              Agregar Nuevo
            </button>
          )}
        </div>
      </form>

      <table className="min-w-full bg-white border shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nombre Completo</th>
            <th className="py-3 px-6 text-left">Edad</th>
            <th className="py-3 px-6 text-left">Teléfono</th>
            <th className="py-3 px-6 text-left">Correo</th>
            <th className="py-3 px-6 text-left">Área</th>
            <th className="py-3 px-6 text-center">Acción</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {tecnicos.map((tecnico, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{tecnico.nombreCompleto}</td>
              <td className="py-3 px-6 text-left">{tecnico.edad}</td>
              <td className="py-3 px-6 text-left">{tecnico.telefono}</td>
              <td className="py-3 px-6 text-left">{tecnico.correo}</td>
              <td className="py-3 px-6 text-left">{tecnico.area}</td>
              <td className="py-3 px-6 text-center">
                <button
                  className="text-red-600 hover:text-red-800 mx-1"
                  onClick={() => handleDelete(tecnico._id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                <button
                  className="text-blue-600 hover:text-blue-800 mx-1"
                  onClick={() => handleEdit(tecnico._id)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
