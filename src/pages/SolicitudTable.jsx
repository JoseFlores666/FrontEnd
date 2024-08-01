import React, { useEffect, useState, useRef } from "react";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFileAlt, faEdit, faTruck, faTimesCircle, faCopy, faHistory } from "@fortawesome/free-solid-svg-icons";
import { ImFileEmpty } from "react-icons/im";
import { TablaVistaSolicitud } from "./TablaVistaSolicitud";

export function SolicitudTable({ }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [solicitudesPerPage, setSolicitudesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'folio', direction: 'des' });
  const [selectedId, setSelectedId] = useState(null);
  const [rejectedSolicitudes, setRejectedSolicitudes] = useState([]);

  const [solicitudToReject, setSolicitudToReject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const { soli, getSoli, deleteSolitud, declinarmySoi, cantidadestados, VercantTotalEstado, verMisEstados, estados, } = useSoli();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [solicitudesFetched, setSolicitudesFetched] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  //estados
  const [estadoInicial, setEstadoInicial] = useState(false);
  const [estadoConfolio, setEstadoConfolio] = useState(false);
  const [estadoAbonando, setEstadoAbonando] = useState(false);
  const [estadoCompletado, setEstadoCompletado] = useState(false);
  const [estadoRechazada, setEstadoRechazada] = useState(false);



  const abrirModal = () => {
    setIsModalOpen2(true);
  };

  const cerrarModal = () => {
    setIsModalOpen2(false);
  };

  useEffect(() => {

    const fetchSoliYEstados = async () => {
      try {
        await getSoli();
        console.log(soli)
        await verMisEstados();

        setSolicitudesFetched(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching solicitudes:", error);
      }
    };

    if (!solicitudesFetched) {
      fetchSoliYEstados();
    }
  }, [solicitudesFetched, getSoli, verMisEstados]);

  useEffect(() => {
    if (Array.isArray(estados)) {
      setEstadoInicial(estados.find(estado => estado.id === 1));
      setEstadoConfolio(estados.find(estado => estado.id === 2));
      setEstadoAbonando(estados.find(estado => estado.id === 3));
      setEstadoCompletado(estados.find(estado => estado.id === 4));
      setEstadoRechazada(estados.find(estado => estado.id === 5));
    } else {
      console.error("estados no es un array:", estados);
    }
  }, [estados]);

  const refetchData = async () => {
    setSolicitudesFetched(false)
  };

  const [filteredSolicitudes, setFilteredSolicitudes] = useState(soli);

<<<<<<< HEAD

=======
>>>>>>> c8883812ad2a59b3f233cc82a3a9c332a81459a0
useEffect(() => {
  if (estadoRechazada) {
    const rechazadasIds = soli.filter(solicitud =>
      solicitud.estado && solicitud.estado.id === estadoRechazada.id
    ).map(solicitud => solicitud._id);

    setRejectedSolicitudes(rechazadasIds);
  }
}, [soli, estadoRechazada]);


  useEffect(() => {
    const results = soli.filter((solicitud) =>
      solicitud.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.areaSolicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.tipoSuministro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.procesoClave.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (solicitud.proyecto?.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (solicitud.actividades?.map(a => a.nombre).join(' ').toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      solicitud.estado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredSolicitudes(results);
    setCurrentPage(1);
  }, [searchTerm, soli]);

  const sortedSolicitudes = React.useMemo(() => {
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

  const paginate = (pageNumber, id) => {
    setCurrentPage(pageNumber);
    setSelectedId(id);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleDelete = async (id, user) => {
    try {

      await deleteSolitud(id, user);
      await getSoli();
    } catch (error) {
      console.error("Error deleting solicitud:", error);
    }
  };

  const handleOpenModal = (id) => {
    setSolicitudToReject(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSolicitudToReject(null);
  };

  const handleReject = async () => {
    try {
      if (solicitudToReject) {
        // Actualizar el estado local de las solicitudes rechazadas
        setRejectedSolicitudes([...rejectedSolicitudes, solicitudToReject]);

        await declinarmySoi(solicitudToReject, user);
        await getSoli();
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error updating solicitud state:", error);
      alert("Hubo un error al rechazar la solicitud. Intenta nuevamente.");
      console.error("Error updating solicitud state:", error);
    }
  };
  // Listener para cerrar el modal al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center mt-50 text-cool-gray-50 font-bold  ">
          <div className="mb-4">Cargando...</div>
          <ImFileEmpty className="animate-spin text-purple-50-500 text-6xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <div className="mb-1 flex justify-between items-center">
        <div className="relative">
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
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 8.586l3.707-3.707a1 1 0 011.414 1.414L11.414 10l3.707 3.707a1 1 0 01-1.414 1.414L10 11.414l-3.707 3.707a1 1 0 01-1.414-1.414L8.586 10 4.879 6.293a1 1 0 011.414-1.414L10 8.586z" clipRule="evenodd"></path>
                </svg>
              </button>
            )}
          </div>
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
            <th className=" font-medium border text-center cursor-pointer w-1/12" onClick={() => requestSort('folio')}>FOLIO</th>
            <th className=" font-medium border text-center cursor-pointer w-1/12" onClick={() => requestSort('fecha')}>FECHA</th>
            <th className="px-3 py-1 font-medium border text-center cursor-pointer w-1/12" onClick={() => requestSort('tipoSuministro')}>TIPO DE SUMINISTRO</th>
            <th className=" font-medium border text-center cursor-pointer w-1/12" onClick={() => requestSort('procesoClave')}>PROCESO CLAVE</th>
            <th className=" font-medium border text-center w-2/12" >PROYECTO</th>
            <th className=" font-medium border text-center w-2/12" >ACTIVIDADES</th>
            <th className=" font-medium border text-center cursor-pointer w-1/12" onClick={() => requestSort('estado')}>ESTADO</th>
            <th className=" font-medium border text-center w-1/12">ACCIONES</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-black">
          {currentSolicitudes.map((solicitud, index) => (
            <tr key={index} className={`text-left ${rejectedSolicitudes.includes(solicitud._id) ? 'border-red-500' : ''}`}>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{solicitud.folio}</td>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{solicitud.fecha}</td>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{solicitud.tipoSuministro}</td>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{solicitud.procesoClave}</td>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{solicitud.proyecto?.nombre}</td>
              <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">{solicitud.actividades?.map((actividad, idx) => (
                <span key={idx}>{actividad.nombre}{idx < solicitud.actividades.length - 1 ? ', ' : ''}</span>
              ))}</td>
              <td className="px-3 py-2 whitespace-normal break-words border border-gray-400 text-center">
                {rejectedSolicitudes.includes(solicitud._id) ? (
                  <button className="text-red-500 border border-red-500 px-2 py-1 rounded-lg">Rechazado</button>
                ) : (
                  solicitud.estado.nombre
                )}
              </td>
              <td className="px-3 py-2 whitespace-normal break-words border border-gray-400 text-center">
                {rejectedSolicitudes.includes(solicitud._id) ? (
                  <button className="text-red-500 border border-red-500 px-2 py-1 rounded-lg">Rechazado</button>
                ) : (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handleDelete(solicitud._id, user)}
                      className="text-red-500 hover"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <Link
                      to={`/soli/registro/${solicitud._id}?editar=true`}
                      className="text-blue-600 hover:text-blue-800 "
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <Link
                      to={`/soli/folioExterno/${solicitud._id}?`}
                      className="text-blue-600 hover:text-blue-800 "
                    >
                      <FontAwesomeIcon icon={faFileAlt} />
                    </Link>
                    {solicitud.estado.id !== estadoInicial.id && (
                      <Link
                        to={`/soli/abonar/${solicitud._id}?`}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FontAwesomeIcon icon={faTruck} />
                      </Link>
                    )}
                    <Link
                      to={`/soli/registro/${solicitud._id}?duplicar=true`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </Link>
                    <Link
                      to={`/historial/${solicitud._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FontAwesomeIcon icon={faHistory} />
                    </Link>
                    <button
                      onClick={() => handleOpenModal(solicitud._id, user)}
                      className="text-red-500 border border-red-500 px-2 y-1 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav className="flex items-center justify-between pt-2">
        <span className="text-sm font-normal text-white dark:text-black-400">
          Mostrando <span className="font-semibold text-white black:text-black">{indexOfFirstSolicitud + 1}-{indexOfLastSolicitud}</span> Total de Solicitudes: <span className="font-semibold text-white dark:text-white">{filteredSolicitudes.length}</span>
        </span>
        <ul className="inline-flex items-center h-8 text-sm">
          <li>
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1, selectedId)}
              className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === 1
                ? "text-gray-400 border-gray-400 cursor-not-allowed" : "text-gray-500 bg-white border border-gray-400 hover:bg-gray-100 hover:text-gray-700"
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
                ? "text-gray-400 border-gray-400 cursor-not-allowed" : "text-gray-500 bg-white border border-gray-400 hover:bg-gray-100 hover:text-gray-700"
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
        isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-md w-full" ref={modalRef}>
              <h2 className="text-xl font-semibold mb-6">Confirmar Rechazo</h2>
              <p className="mb-6 text-gray-600">¿Estás seguro que deseas rechazar esta solicitud?</p>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                  onClick={handleReject}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )
      }
      {
        isModalOpen2 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              <TablaVistaSolicitud data={estados} misSoli={soli} refetchData={refetchData} D />
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
}
