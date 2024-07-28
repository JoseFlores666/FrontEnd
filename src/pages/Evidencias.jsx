import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSoli } from '../context/SolicitudContext';

export const Evidencias = () => {
  const { id } = useParams();
  const { traeImagenInfo, imagenInfo } = useSoli();
  const [cargarDatos, setDatosCargados] = useState(false);

  useEffect(() => {
    const trayendoImagenes = async () => {
      try {
        await traeImagenInfo(id);
        setDatosCargados(true);
      } catch (error) {
        console.error("Error al ejecutar la función (trayendoImagenes)", error);
      }
    };
    if (!cargarDatos) {
      trayendoImagenes();
    }
  }, [id, traeImagenInfo, cargarDatos]);

  const dividirEnPares = (arr) => {
    const pares = [];
    for (let i = 0; i < arr.length; i += 2) {
      pares.push(arr.slice(i, i + 2));
    }
    return pares;
  };

  const imagenesPares = dividirEnPares(imagenInfo);

  return (
    <div className="mx-auto max-w-5xl p-4 text-center text-black">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4">EVIDENCIAS</h1>
        <table className="w-full caption-bottom text-sm border border-t border-gray-400 bg-white rounded-b-lg mb-6">
          <thead className="[&_tr]:border border-gray-400">
            <tr className="border transition-colors hover:bg-gray-100 border-b border-gray-400 hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th colSpan="2" className="h-12 text-center px-4 hover:bg-gray-100 border-b border-gray-400 align-middle font-medium text-black">
                Solicitud: (En esta parte aparecerá la solicitud que corresponde y las imágenes que le pertenecen)
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0 border-b border-gray-400">
            {imagenesPares.length > 0 ? (
              imagenesPares.map((par, index) => (
                <tr key={index} className=" border-b border-gray-400">
                  {par.map((imagen) => (
                    <td key={imagen._id} className="p-4 border border-gray-400 w-1/4 bg-light-50">
                      <img src={imagen.secure_url} alt="Evidencia" className="w-48 h-48 object-cover mx-auto" />
                    </td>
                  ))}
                  {par.length < 2 && (
                    <td className="p-4 border border-gray-400 w-1/4 bg-light-50"></td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center bg-light-50 border-b border-gray-400" colSpan="3">
                  No se encontraron imágenes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button type='submit' className="px-4 py-2 border border-black bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Descargar Evidencias</button>
      </div>
    </div>
  );
};