import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useOrden } from '../context/ordenDeTrabajoContext';

export const Evidencias = () => {
  const { id } = useParams();
  const { traerImagenInfo, imagenInfo, traerUnaInfo, unaInfo } = useOrden();

  const [cargarDatos, setDatosCargados] = useState(false);
  const [solicitudInfo, setSolicitudInfo] = useState(null);

  useEffect(() => {
    const iniciarDatos = async () => {
      try {
        await traerUnaInfo(id);
        setSolicitudInfo(unaInfo);
        await traerImagenInfo(id);
        setDatosCargados(true);
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };
    if (!cargarDatos) {
      iniciarDatos();
    }
  }, [id, traerUnaInfo, traerImagenInfo, unaInfo, cargarDatos]);

  const dividirEnPares = (arr) => {
    const pares = [];
    for (let i = 0; i < arr.length; i += 2) {
      pares.push(arr.slice(i, i + 2));
    }
    return pares;
  };

  const imagenesPares = dividirEnPares(imagenInfo);

  const obtenerBlobDesdeUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };

  const enviarImagenes = async () => {
    if (imagenInfo.length === 0) {
      console.log('No hay imágenes para enviar');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('numero_de_imagenes', imagenInfo.length);

      for (let i = 0; i < imagenInfo.length; i++) {
        const imagen = imagenInfo[i];
        const blob = await obtenerBlobDesdeUrl(imagen.secure_url);
        formData.append('imagenes[]', blob, `imagen${i + 1}.jpg`);
      }

      if (solicitudInfo && solicitudInfo.folio) {
        formData.append('folio', solicitudInfo.folio);
        console.log('Folio enviado:', solicitudInfo.folio);
      } else {
        console.error('Folio no disponible');
      }

      await axios.post('http://localhost/PlantillasWordyPdf/DescargarEvidencias.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        console.log('Imágenes enviadas correctamente', response.data);

        axios.post('http://localhost/PlantillasWordyPdf/GuardarFolio.php', {
          folio: solicitudInfo.folio
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          console.log(response.data.message);
        }).catch(error => {
          console.error('Error al guardar el folio', error);
        });

        const save_as = '';
        const downloadUrl = `http://localhost/PlantillasWordyPdf/DescargarEvidencias.php?save_as=${save_as}`;
        window.location.href = downloadUrl;

        setTimeout(() => {
          eliminarImagenes();
        }, 3000); // 3000 milisegundos = 3 segundos

      }).catch(error => {
        console.error('Error al enviar las imágenes', error);
      });
    } catch (error) {
      console.error('Error al enviar las imágenes', error);
    }
  };

  const eliminarImagenes = async () => {
    try {
      await axios.post('http://localhost/PlantillasWordyPdf/EliminarImagenes.php');
      console.log('Imágenes eliminadas correctamente');
    } catch (error) {
      console.error('Error al eliminar las imágenes', error);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 text-center text-black">
      <form onSubmit={(e) => { e.preventDefault(); enviarImagenes(); }} encType='multipart/form-data'>
        <div className="bg-white p-6 rounded-md shadow-md">
          <h1 className="text-2xl font-bold mb-4">EVIDENCIAS</h1>
          <table className="w-full caption-bottom text-sm border border-t border-gray-400 bg-white rounded-b-lg mb-6">
            <thead className="[&_tr]:border border-gray-400">
              <tr className="border transition-colors hover:bg-gray-100 border-b border-gray-400 hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th colSpan="2" className="h-12 text-center px-4 hover:bg-gray-100 border-b border-gray-400 align-middle font-medium text-black">
                  Solicitud: {solicitudInfo ? solicitudInfo.informe?.folio : 'Cargando...'}
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
          <button
            type='submit'
            className="px-4 py-2 border border-black bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            disabled={imagenInfo.length === 0}
          >
            Descargar Evidencias
          </button>
        </div>
      </form>
    </div>
  );
};
