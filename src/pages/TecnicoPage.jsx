import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheck,faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from "../context/SolicitudContext";
import { Link } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ImFileEmpty } from "react-icons/im";
import TablaVistaOrden from './TablaVistaOrden';

export const TecnicoPage = () => {

  const { getInfo, info, eliminarInfo } = useSoli();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [solicitudesPerPage, setSolicitudesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'folio', direction: 'des' });
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);

  const [datosCargados, setDatosCargados] = useState(false);

  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const abrirModal = () => {
    setIsModalOpen2(true);
  };

  const cerrarModal = () => {
    setIsModalOpen2(false);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        await getInfo();
        setDatosCargados(true)
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los informes:", error);
      }
    };
    if (!datosCargados) {
      fetchInfo()
    }

  }, [getInfo, datosCargados]);

  const handleDelete = async (id) => {
    try {
      await eliminarInfo(id);
      setDatosCargados(false)
    } catch (error) {
      console.error("Error deleting solicitud:", error);
    }
  };

  useEffect(() => {
    setFilteredSolicitudes(info);

  }, [info]);

  useEffect(() => {
    if (!info) return;
    const results = info.filter((solicitud) =>
      (solicitud.folio && solicitud.folio.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.informe.Solicita.nombre && solicitud.informe.Solicita.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.informe.Solicita.areaSolicitante && solicitud.informe.Solicita.areaSolicitante.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.informe.tipoDeMantenimiento && solicitud.informe.tipoDeMantenimiento.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.informe.tipoDeTrabajo && solicitud.informe.tipoDeTrabajo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.informe.tipoDeSolicitud && solicitud.informe.tipoDeSolicitud.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.estado && solicitud.estado.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredSolicitudes(results);
    setCurrentPage(1);
  }, [searchTerm, info]);

  const sortedSolicitudes = useMemo(() => {
    let sortableSolicitudes = [...filteredSolicitudes];
    if (sortConfig.key !== null) {
      sortableSolicitudes.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableSolicitudes;
  }, [filteredSolicitudes, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastSolicitud = currentPage * solicitudesPerPage;
  const indexOfFirstSolicitud = indexOfLastSolicitud - solicitudesPerPage;
  const currentSolicitudes = sortedSolicitudes.slice(indexOfFirstSolicitud, indexOfLastSolicitud);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const countOrdenesByState = (ordenes, state) => {
    return ordenes.filter(ordenes => ordenes.estado === state).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center mt-50 text-cool-gray-50 font-bold  ">
          <div className="mb-4">Cargando...</div>
          <ImFileEmpty className="animate-spin text-purple-50-500 text-6xl" />
        </div>
      </div>
    );
  };

  const data = {
    recibidas: countOrdenesByState(info, 'Recibidas'),
    asignadas: countOrdenesByState(info, 'Asignada'),
    diagnosticadas: countOrdenesByState(info, 'Diagnosticada'),
    completadas: countOrdenesByState(info, 'Completada'),
    declinadas: countOrdenesByState(info, 'Declinada'),
    total: info.length
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="mb-1 flex justify-between items-center">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 ps-10 text-sm text-black border border-black rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={clearSearch}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
        <button onClick={abrirModal} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >Consultar solicitudes</button>
        <div>
          <label htmlFor="entries-per-page" className="mr-2 text-white">Entradas por página:</label>
          <select
            id="entries-per-page"
            className="p-1 border border-black rounded-lg text-black"
            value={solicitudesPerPage}
            onChange={(e) => setSolicitudesPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <table className="w-full min-w-full divide-y divide-white-200 text-sm text-black rounded-lg overflow-hidden">
        <thead className="bg-black text-white">
          <tr>
            <th className="text-left font-medium border text-center cursor-pointer w-1/12" onClick={() => requestSort('folio')}>FOLIO</th>
            <th className="text-left font-medium border text-center cursor-pointer w-1/12" onClick={() => requestSort('fecha')}>FECHA</th>
            <th className="text-left font-medium border text-center cursor-pointer w-1/12" onClick={() => requestSort('tipoDeMantenimiento')}>TIPO DE MANTENIMIENTO</th>
            <th className="text-left font-medium border text-center cursor-pointer w-1/12" onClick={() => requestSort('tipoDeTrabajo')}>TIPO DE TRABAJO</th>
            <th className="text-left font-medium border text-center cursor-pointer w-1/12" onClick={() => requestSort('tipoDeSolicitud')}>TIPO DE SOLICITUD</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-2/12" onClick={() => requestSort('descripcionDelServicio')}>DESCRIPCION DEL SERVICIO</th>
            <th className="text-left font-medium border text-center cursor-pointer w-1/12" onClick={() => requestSort('estado')}>ESTADO</th>
            <th className="text-left font-medium border text-center cursor-pointer w-1/12">IMÁGENES</th>
            <th className="text-left font-medium border text-center cursor-pointer w-1/12">ACCIONES</th>
            <th className="text-left font-medium border text-center cursor-pointer w-1/12">INFORME</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentSolicitudes.map((solicitud, index) => (
            <tr
              key={index}
              className={`text-left ${solicitud.estado === 'Declinado' ? 'border-red-500' : ''}`}
            >
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{solicitud.folio}</td>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{new Date(solicitud.informe.fecha).toLocaleDateString()}</td>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{solicitud.informe.tipoDeMantenimiento}</td>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{solicitud.informe.tipoDeTrabajo}</td>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{solicitud.informe.tipoDeSolicitud}</td>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{solicitud.informe.descripcionDelServicio}</td>
              <th className="p-1 whitespace-normal break-words border border-gray-400 text-center">
                <Link to={`/evidencias/${solicitud._id}?`} className="text-black">
                  Imágenes
                </Link>
              </th>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">
                {solicitud.estado === 'Declinada' ? (
                  <button className="text-red-500 border border-red-500 px-2 py-1 rounded-lg" disabled>Declinado</button>
                ) : (
                  solicitud.estado
                )}
              </td>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">
                {solicitud.estado === 'Declinada' ? (
                  <button className="text-red-500 border border-red-500 px-2 py-1 rounded-lg" disabled>Declinado</button>
                ) : (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handleDelete(solicitud._id)}
                      className="text-red-500 hover"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <Link
                      className="text-blue-600 hover:text-blue-800"
                      to={`/tecnico/${solicitud._id}?editar=true`}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <Link
                      className="text-blue-600 hover:text-blue-800"
                      to={`/asignarTec/${solicitud._id}?`}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </Link>
                    <Link
                      className="text-blue-600 hover:text-blue-800"
                      to={`/informacionOrden`}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </Link>
                    <Link
                      className="text-blue-600 hover:text-blue-800"
                      to={`/tecnico2/${solicitud._id}?`}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Link>

                  </div>)}
              </td>
              <th className="p-1 whitespace-normal break-words border border-gray-400 text-center">
                <Link to={`/verInforme/${solicitud._id}?`} className="text-black">
                  Ver
                </Link>
              </th>
            </tr>
          ))}
        </tbody>
      </table>

      <nav aria-label="Page navigation example" className="flex items-center justify-between pt-4">
        <span className="text-sm font-normal text-white dark:text-black-400">
          Mostrando <span className="font-semibold text-white black:text-black">{indexOfFirstSolicitud + 1}-{indexOfLastSolicitud}</span> Total de Solicitudes: <span className="font-semibold text-white dark:text-white">{filteredSolicitudes.length}</span>
        </span>
        <ul className="inline-flex items-center -space-x-px h-8 text-sm">
          <li>
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1, selectedId)}
              className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed" : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              <span className="sr-only">Previous</span>
              <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
              </svg>
            </button>
          </li>
          {Array.from({ length: Math.ceil(filteredSolicitudes.length / solicitudesPerPage) }, (_, i) => (
            <li key={i}>
              <button
                onClick={() => paginate(i + 1, selectedId)}
                className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === i + 1
                  ? "text-black border border-black bg-blue-400 hover:bg-blue hover:text-black" : "text-black bg-white border border-black hover:bg-gray-100 hover:text-gray-700"}`}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => paginate(currentPage < Math.ceil(filteredSolicitudes.length / solicitudesPerPage) ? currentPage + 1 : currentPage, selectedId)}
              className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === Math.ceil(filteredSolicitudes.length / solicitudesPerPage)
                ? "text-gray-400 border-gray-300 cursor-not-allowed" : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              <span className="sr-only">Next</span>
              <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
            </button>
          </li>
        </ul>
      </nav>

      {
        isModalOpen2 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg relative absolute"
              onClick={(e) => e.stopPropagation()}
            >
              <TablaVistaOrden data={data} />
              <button
                className="absolute top-2 right-2 text-red-500"
                onClick={cerrarModal}
              >
                X
              </button>
            </div>
          </div>)
      }
    </div >
  );
};
