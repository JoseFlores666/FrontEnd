import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useOrden } from '../../context/ordenDeTrabajoContext';
import { Title } from "../../components/ui";
import scrollToTop from '../../util/Scroll';
import { LlenarEvidencias } from '../../components/ui';

export const Evidencias = () => {
  const { id } = useParams();
  const { traerImagenInfo, imagenInfo, traerUnaInfo, unaInfo } = useOrden();
  const [isOpen, setIsOpen] = useState(false);
  const [cargarDatos, setDatosCargados] = useState(false);
  const [solicitudInfo, setSolicitudInfo] = useState(null);

  useEffect(() => {
    const iniciarDatos = async () => {
      await traerUnaInfo(id);
      setSolicitudInfo(unaInfo);
      await traerImagenInfo(id);
      setDatosCargados(true);
    };

    if (!cargarDatos) {
      iniciarDatos();
    }
    scrollToTop();
  }, [id, cargarDatos, traerUnaInfo, traerImagenInfo]);

  const dividirEnPares = (arr) => {
    const pares = [];
    for (let i = 0; i < arr.length; i += 2) {
      pares.push(arr.slice(i, i + 2));
    }
    return pares;
  };

  const imagenesPares = dividirEnPares(imagenInfo);

  const enviarImagenes = async () => {
    if (imagenInfo.length === 0) {
      return;
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 text-center text-black">
      <form onSubmit={(e) => { e.preventDefault(); enviarImagenes(); }} encType="multipart/form-data">
        <div className="bg-white p-6 rounded-md shadow-md">
          <Title showBackButton={true}>Evidencias</Title>
          <table className="w-full caption-bottom text-sm border border-t border-gray-400 bg-white rounded-b-lg mb-6">
            <thead className="[&_tr]:border border-gray-400">
              <tr className="border transition-colors hover:bg-gray-100 border-b border-gray-400 hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th colSpan="2" className="h-12 text-center px-4 hover:bg-gray-100 border-b border-gray-400 align-middle font-medium text-black">
                  Solicitud: {solicitudInfo ? solicitudInfo.informe?.folio : 'Cargando...'}<br />
                  Descripción:<br /> {solicitudInfo ? solicitudInfo.informe?.descripcion : 'Cargando...'}
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0 border-b border-gray-400">
              {imagenesPares.length > 0 ? (
                imagenesPares.map((par, index) => (
                  <tr key={index} className="border-b border-gray-400">
                  {par.map((imagen) => (
                      <td key={imagen._id} className="p-4 border border-gray-400 w-1/2 bg-light-50">
                        <img src={imagen.secure_url} alt="Evidencia" className="w-[300px] h-[200px] object-contain mx-auto  drop-shadow-custom"
                        />
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
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 border border-black bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            disabled={imagenInfo.length === 0}
          >
            Descargar Evidencias
          </button>
        </div>
        {isOpen && (
          <LlenarEvidencias
          solicitud={solicitudInfo ? solicitudInfo.informe?.folio : ''}
          descripcion={solicitudInfo ? solicitudInfo.informe?.descripcion : ''}
          imagenesPares={imagenesPares}
        />
        )}
      </form>
    </div>
  );
};
