import React, { useState, useEffect } from 'react';
import { useOrden } from '../../context/ordenDeTrabajoContext';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faLock , faEdit,faClone } from '@fortawesome/free-solid-svg-icons';
import { Label, Title } from '../../components/ui';

export const TecnicosTable = () => {
  const [form, setForm] = useState({
    nombreCompleto: '',
    edad: '',
    telefono: '',
    correo: '',
  });
  const [editId, setEditId] = useState(null);
  const [datosCargados, setDatosCargados] = useState(false);
  const {
    crearTecnico,
    desactivarElTecnico,
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
      
      });
    } else {
      setForm({
        nombreCompleto: '',
        edad: '',
        telefono: '',
        correo: '',

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

    if (form.nombreCompleto.trim() && form.edad.toString().trim() && form.telefono.trim() && form.correo.trim()) {
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

  const handleDesactivar = async (id) => {
    try {
      const res = await desactivarElTecnico(id);
      if (res && res.data?.mensaje) {
        Swal.fire('Completado', res.data?.mensaje, 'success');
        await traerTecnicos();
      } else {
        Swal.fire('Error', res?.error || 'Error desconocido', 'error');
      }
    } catch (error) {
      console.error('Error al desactivar al técnico:', error);
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
    <div className="container mx-auto p-4 max-w-4xl text-black">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-2 pb-8 mb-6">
        <Title showBackButton={true}>Gestión de Personal Técnico</Title>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <Label>Nombre:</Label>
            <input
              type="text"
              name="nombreCompleto"
              placeholder='Ingrese su nombre completo'
              value={form.nombreCompleto}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <Label>Edad:</Label>
            <input
              min={18}
              max={112}
              type="number"
              name="edad"
              placeholder='Ingrese su edad (debe ser mayor de 18)'
              value={form.edad}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <Label>Número de Tel:</Label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              placeholder='Ingrese su numero de telefono'
              onChange={handleChange}
              required
              maxLength={10}
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <Label>Correo:</Label>
            <input
              type="email"
              name="correo"
              placeholder='Ingrese su correo'
              value={form.correo}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          {editId && (
            <button
              type="button"
              onClick={limpiar}
              className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          >
            {editId ? 'Actualizar' : 'Agregar Tecnico'}
          </button>
        </div>
      </form>

      <table className="min-w-full bg-white border shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-black uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nombre Completo</th>
            <th className="py-3 px-6 text-left">Edad</th>
            <th className="py-3 px-6 text-left">Teléfono</th>
            <th className="py-3 px-6 text-left">Correo</th>
            <th className="py-3 px-6 text-center">Acción</th>
          </tr>
        </thead>
        <tbody className="text-black text-sm font-medium">
        {tecnicos.map((tecnico) => (
            <tr key={tecnico._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{tecnico.nombreCompleto}</td>
              <td className="py-3 px-6 text-left">{tecnico.edad}</td>
              <td className="py-3 px-6 text-left">{tecnico.telefono}</td>
              <td className="py-3 px-6 text-left">{tecnico.correo}</td>
              <td className="py-3 px-6 text-center">
                {!tecnico.activo ? (
                  <button
                    className="text-gray-500 cursor-not-allowed px-2 py-1 rounded-lg"
                    title="Técnico inactivo"
                    disabled
                  >
                    <FontAwesomeIcon icon={faLock} />
                  </button>
                ) : (
                  <>
                    <button
                      className="text-red-600 hover:text-red-800 mx-1"
                      onClick={() => handleDesactivar(tecnico._id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 mx-1"
                      onClick={() => handleEdit(tecnico._id)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};