import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from '../context/SolicitudContext';
import Swal from "sweetalert2";

export const TablaVistaSolicitud = ({ data, refetchData }) => {
    const { ActualizarEstados } = useSoli();
    const [datos, setDatos] = useState(data);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState([]);
    const [año, setAño] = useState("");
    const [mes, setMes] = useState("");

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    useEffect(() => {
        setDatos(data);
        setEditedData(data.map(estado => ({ ...estado })));
    }, [data]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        setIsEditing(false);

        try {
            const res = await ActualizarEstados(editedData);
            if (res) {
                Swal.fire("Datos guardados", res.mensaje, "success");
            }
            await refetchData();
            setDatos(data);
        } catch (error) {
            console.error("Error actualizando estados:", error);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedData(datos.map(estado => ({ ...estado })));
    };

    const handleChange = (index, e) => {
        const { value } = e.target;
        const newEditedData = [...editedData];
        newEditedData[index] = { ...newEditedData[index], nombre: value };
        setEditedData(newEditedData);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-black">Solicitudes</h2>

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
                            {meses.map((mesNombre, index) => (
                                <option key={index} value={mesNombre}>{mesNombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <table className="text-black w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border-b border-black px-4 py-2">Estado</th>
                        <th className="border-b border-black px-4 py-2">Cantidad Total</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((estado, index) => (
                        <tr key={estado.id}>
                            <td className="border-b border-black px-4 py-2 flex items-center">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedData[index].nombre}
                                        onChange={(e) => handleChange(index, e)}
                                        className="border border-gray-300 rounded p-1"
                                    />
                                ) : (
                                    estado.nombre
                                )}
                            </td>
                            <td className="border-b border-black px-4 py-2">
                                {estado.cantidadTotal}
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
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                )}
            </div>
        </div>
    );
};
