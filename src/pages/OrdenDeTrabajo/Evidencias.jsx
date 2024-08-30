import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useOrden } from '../../context/ordenDeTrabajoContext';
import { Title, LlenarEvidencias } from "../../components/ui";
import scrollToTop from '../../util/Scroll';

export const Evidencias = () => {
  const { id } = useParams();
  const { traerImagenInfo, imagenInfo, traerUnaInfo, unaInfo } = useOrden();
  const [isOpen, setIsOpen] = useState(false);
  const [cargarDatos, setDatosCargados] = useState(false);
  const [solicitudInfo, setSolicitudInfo] = useState(null);
  const hasInforme = unaInfo && unaInfo.informe;

  const handleCloseModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const iniciarDatos = async () => {
      await traerUnaInfo(id);
      setSolicitudInfo(unaInfo);
      await traerImagenInfo(id);
      console.log(imagenInfo);
      setDatosCargados(true);
    };

    if (!cargarDatos) {
      iniciarDatos();
    }
    scrollToTop();
  }, [id, cargarDatos, traerUnaInfo, traerImagenInfo]);

  // Establece el número fijo de celdas por fila
  const CELDAS_POR_FILA = 2;

  const dividirEnPares = (arr) => {
    const pares = [];
    for (let i = 0; i < arr.length; i += CELDAS_POR_FILA) {
      pares.push(arr.slice(i, i + CELDAS_POR_FILA));
    }
    return pares;
  };

  const imagenesPares = dividirEnPares(imagenInfo);

  const enviarImagenes = async () => {
    if (imagenInfo.length === 0) {
      return;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
    }
  };
  return (
    <div className="mx-auto max-w-5xl p-4 text-center text-black">
      <form onSubmit={(e) => { e.preventDefault(); enviarImagenes(); }} onKeyDown={handleKeyDown} encType="multipart/form-data">
        <div className="bg-white p-6 rounded-md shadow-md">
          <Title showBackButton={true}>Evidencias</Title>
          <table className="w-full caption-bottom text-sm  bg-white rounded-b-lg mb-6">
            <thead>
              <tr className="text-center col-span-2">
                <th className=" text-center border-none  font-medium text-black">
                  <strong>Solicitud: </strong>{solicitudInfo ? solicitudInfo.informe?.folio : 'Cargando...'}
                </th>
                <th className=" text-center border-none align-middle font-medium text-black">
                  <strong>Tecnico Encargado: </strong>{hasInforme ? unaInfo.informe?.solicitud?.tecnicos?.nombreCompleto : 'Técnico no disponible'}
                </th>
              </tr>

              <tr>
                <th className=" text-center border-none align-middle font-medium text-black">
                  <strong>Area Solicitante: </strong>{solicitudInfo ? solicitudInfo.informe?.Solicita.areaSolicitante : 'Cargando...'}
                </th>
                <th className=" text-center border-none align-middle font-medium text-black">
                 <strong>Edificio: </strong>{solicitudInfo ? solicitudInfo.informe?.Solicita.edificio : 'Cargando...'}
                </th>
              </tr>
              <tr>

              </tr>
              <tr className="">
                <th colSpan={CELDAS_POR_FILA} className=" text-center  border-none align-middle font-medium text-black">
                  <strong>Descripción: </strong>{solicitudInfo ? solicitudInfo.informe?.descripcion : 'Cargando...'}
                </th>
              </tr>
            </thead>

            <tbody>
              {imagenesPares.length > 0 ? (
                imagenesPares.map((par, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    {par.map((imagen) => (
                      <td key={imagen._id} className="p-4 border border-gray-400 w-1/2 bg-light-50">
                        <img src={imagen.secure_url} alt="Evidencia" className="w-[300px] h-[200px] object-contain mx-auto  drop-shadow-custom"
                        />
                      </td>
                    ))}
                    {par.length < CELDAS_POR_FILA && (
                      <td className="p-4 border border-gray-400 w-1/2 bg-light-50"></td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center bg-light-50 border-b border-gray-400" colSpan={CELDAS_POR_FILA}>
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
            tecnico={hasInforme ? unaInfo.informe?.solicitud?.tecnicos?.nombreCompleto : 'Técnico no disponible'}
            areaSolicitante={solicitudInfo ? solicitudInfo.informe?.Solicita.areaSolicitante : ''}
            edificio={solicitudInfo ? solicitudInfo.informe?.Solicita.edificio : ''}
            closeModal={handleCloseModal}
          />
        )}
      </form>
    </div>
  );
};
