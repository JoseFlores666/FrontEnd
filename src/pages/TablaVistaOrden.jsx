import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useOrden } from '../context/ordenDeTrabajoContext';

export const TablaVistaOrden = ({ data, refetchData }) => {
    
    const { actualizarEstadosOrden } = useOrden();
    const [datos, setDatos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState([]);
    const [año, setAño] = useState("");
    const [mes, setMes] = useState("");

    useEffect(() => {
        // Asume que `data` es una lista de objetos
        setDatos(data);
        setEditedData(data);
    }, [data]);

    const handleEditClick = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleSaveClick = useCallback(async () => {
        setIsEditing(false);
        try {
            const res = await actualizarEstadosOrden(editedData);
            if (res) {
                Swal.fire("Datos guardados", res.mensaje, "success");
                await refetchData();
                setDatos(editedData);
            }
        } catch (error) {
            console.error("Error actualizando estados:", error);
            Swal.fire("Error", "No se pudieron guardar los datos. Inténtalo nuevamente.", "error");
        }
    }, [actualizarEstadosOrden, editedData, refetchData]);

    const handleCancelClick = useCallback(() => {
        setIsEditing(false);
        setEditedData(datos); // Revertir cambios
    }, [datos]);

    const handleChange = useCallback((index, key, value) => {
        setEditedData(prevData => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                [key]: value
            };
            return newData;
        });
    }, []);

    const handleFilterChange = useCallback(() => {
        // Lógica para filtrar datos según el año y mes seleccionados
        // Este es un ejemplo simple; ajusta según tus necesidades
        const filteredData = data.filter(item => {
            // Aquí podrías implementar la lógica de filtrado
            if (año && mes) {
                // Filtra según año y mes si ambos están presentes
                return item.fecha.includes(año) && item.fecha.includes(mes);
            } else if (año) {
                // Filtra solo por año
                return item.fecha.includes(año);
            } else if (mes) {
                // Filtra solo por mes
                return item.fecha.includes(mes);
            } else {
                // Sin filtros aplicados
                return true;
            }
        });

        setDatos(filteredData);
    }, [data, año, mes]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-center text-black mb-4">Órdenes de Trabajo</h2>

            {!isEditing && (
                <div className="flex justify-between mb-4">
                    <div>
                        <label className="block text-black">Año:</label>
                        <input
                            type="number"
                            value={año}
                            onChange={(e) => setAño(e.target.value)}
                            className="border text-black border-gray-300 rounded p-1"
                            min="1900"
                            max={new Date().getFullYear()}
                        />
                    </div>
                    <div>
                        <label className="block text-black">Mes:</label>
                        <select
                            value={mes}
                            onChange={(e) => setMes(e.target.value)}
                            className="border text-black border-gray-300 rounded p-1"
                        >
                            <option value="">Seleccionar Mes</option>
                            {[
                                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                            ].map((mesNombre, index) => (
                                <option key={index} value={mesNombre}>{mesNombre}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleFilterChange}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Filtrar
                    </button>
                </div>
            )}

            <table className="w-full text-black text-left border-collapse bg-white">
                <thead>
                    <tr>
                        <th className="border-b border-black px-4 py-2">Estado</th>
                        <th className="border-b border-black px-4 py-2">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((item, index) => (
                        <tr key={item.id}>
                            <td className="border-b border-black px-4 py-2">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedData[index].nombre}
                                        onChange={(e) => handleChange(index, 'nombre', e.target.value)}
                                        className="border border-gray-300 rounded p-1"
                                    />
                                ) : (
                                    item.nombre
                                )}
                            </td>
                            <td className="border-b border-black px-4 py-2">
                                {item.cantidadTotal}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="text-center mt-4">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSaveClick}
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                            <FontAwesomeIcon icon={faSave} /> Guardar Cambios
                        </button>
                        <button
                            onClick={handleCancelClick}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            <FontAwesomeIcon icon={faTimes} /> Cancelar
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleEditClick}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        <FontAwesomeIcon icon={faEdit} /> Editar
                    </button>
                )}
            </div>
        </div>
    );
};

export default TablaVistaOrden;
