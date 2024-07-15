import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from "../context/SolicitudContext";
import { Link } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ImFileEmpty } from "react-icons/im";

export const TecnicoPage = () => {

  const { getInfo, info, eliminarInfo } = useSoli();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [solicitudesPerPage, setSolicitudesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'folio', direction: 'des' });
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);

  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datosCargados, setDatosCargados] = useState(false);

  const [loading, setLoading] = useState(true);

  const modalContentRef = useRef(null);

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
    console.log(info);
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

  const openModal = (imagesArray) => {
    const modalImages = imagesArray.map(image => image.secure_url);
    setModalImages(modalImages);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImages([]);
    setCurrentImageIndex(0);
  };

  const handleClickOutside = (event) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
      closeModal();
    }
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
  }
  return (
    <div className="overflow-x-auto p-4">
      <div className="mb-1 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            id="table-search"
            className="block p-2 ps-10 text-sm text-black border border-black rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar"
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
        <div>
          <label htmlFor="entries-per-page" className="mr-2 text-black">Entradas por página:</label>
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
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('folio')}>Folio</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('fecha')}>Fecha</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('tipoDeMantenimiento')}>Tipo de Mantenimiento</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('tipoDeTrabajo')}>Tipo de Trabajo</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('tipoDeSolicitud')}>Tipo de Solicitud</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-2/12" onClick={() => requestSort('descripcionDelServicio')}>Descripción del Servicio</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('estado')}>Estado</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center w-1/12">Imágenes</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center w-1/12">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentSolicitudes.map((solicitud, index) => (
            <tr
              key={solicitud._id}
              className={index % 2 === 0 ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-200"}
            >
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.folio}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{new Date(solicitud.informe.fecha).toLocaleDateString()}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.informe.tipoDeMantenimiento}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.informe.tipoDeTrabajo}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.informe.tipoDeSolicitud}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.informe.descripcionDelServicio}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.estado}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">
                {solicitud.informe.imagenes.length > 0 ? (
                  <button
                    className="focus:outline-none"
                    onClick={() =>
                      openModal(solicitud.informe.imagenes) // Corrected to `solicitud.informe.imagenes`
                    }
                  >
                    Ver imágenes ({solicitud.informe.imagenes.length})
                  </button>
                ) : (
                  <span>No hay imágenes</span>
                )}
              </td>

              <td className="px-3 py-2 whitespace-normal break-words border text-center">
                <div className="flex justify-center items-center space-x-2">
                  <Link
                    className="text-blue-600 hover:text-blue-800 mx-2"
                    to={`/tecnico/${solicitud._id}?editar=true`} >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <button onClick={() => handleDelete(solicitud._id)}
                    className="text-red-500 hover mx-2">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <Link
                    className="text-blue-600 hover:text-blue-800 mx-2"
                    to={`/tecnico2/${solicitud._id}?`} >
                    <FontAwesomeIcon icon={faPlus} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-white" >
        <span>
          Página {currentPage} de {Math.ceil(filteredSolicitudes.length / solicitudesPerPage)}
        </span>
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(filteredSolicitudes.length / solicitudesPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleClickOutside}
        >
          <div ref={modalContentRef} className="relative bg-white p-4 rounded-lg">
            <button
              className="absolute top-0 right-0 m-2 text-black"
              onClick={closeModal}
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" /> {/* Ajusta el tamaño del icono aquí */}
            </button>
            <div className="flex justify-center items-center">
              <button
                className="text-black mx-2"
                onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : modalImages.length - 1))}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-2xl" /> {/* Ajusta el tamaño del icono aquí */}
              </button>
              <img
                src={modalImages[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="max-w-full h-auto rounded-lg max-h-96"
              />

              <button
                className="text-black mx-2"
                onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex < modalImages.length - 1 ? prevIndex + 1 : 0))}
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-2xl" /> {/* Ajusta el tamaño del icono aquí */}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
