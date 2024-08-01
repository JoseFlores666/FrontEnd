import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSoli } from '../context/SolicitudContext';
import { useParams } from "react-router-dom";

export function Historial() {
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [solicitudesPerPage, setSolicitudesPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cargarDatos, setDatosCargados] = useState(false);

    const [filtroAno, setFiltroAno] = useState("");
    const [filtroMes, setFiltroMes] = useState("");
    const [filtroDia, setFiltroDia] = useState("");

    const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false);
    const [selectedFiltro, setSelectedFiltro] = useState("");

    const { historialUnaSoli, traehisorialDeUnaSoli } = useSoli();
    const modalRef = useRef(null);

    useEffect(() => {
        const iniciarDatos = async () => {
            try {
                await traehisorialDeUnaSoli(id);
                console.log(historialUnaSoli);
                setDatosCargados(true);
            } catch (error) {
                console.error("Error al cargar los datos", error);
            }
        };
        if (!cargarDatos) {
            iniciarDatos();
        }
    }, [cargarDatos, traehisorialDeUnaSoli, id]);

    const abrirModalFiltro = () => {
        setIsFiltroModalOpen(true);
    };

    const cerrarModalFiltro = () => {
        setIsFiltroModalOpen(false);
    };

    const aplicarFiltro = () => {
        setIsFiltroModalOpen(false);
    };

    const abrirModal = () => {
        setIsModalOpen(true);
    };

    const cerrarModal = () => {
        setIsModalOpen(false);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setFiltroAno("");
        setFiltroMes("");
        setFiltroDia("");
    };

    const filteredHistorial = historialUnaSoli.filter(historial => {
        const fecha = new Date(historial.fecha);
        const año = fecha.getFullYear().toString();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');

        return (
            (searchTerm === "" || historial.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                historial.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                historial.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filtroAno === "" || año === filtroAno) &&
            (filtroMes === "" || mes === filtroMes) &&
            (filtroDia === "" || dia === filtroDia)
        );
    });

    return (
        <div className="overflow-x-auto p-4">
            <div className="mb-8 flex justify-between items-center">
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
                            placeholder="Buscar..."
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
                <h1 className="text-2xl text-center font-bold">HISTORIAL DE MOVIMIENTOS</h1>
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
            <div className="mb-4">
                <label htmlFor="filtro-ano" className="mr-2 text-white">Año:</label>
                <input
                    type="text"
                    id="filtro-ano"
                    className="p-1 border border-black rounded-lg text-black"
                    value={filtroAno}
                    onChange={(e) => setFiltroAno(e.target.value)}
                    placeholder="YYYY"
                />
                <label htmlFor="filtro-mes" className="mr-2 text-white ml-4">Mes:</label>
                <input
                    type="text"
                    id="filtro-mes"
                    className="p-1 border border-black rounded-lg text-black"
                    value={filtroMes}
                    onChange={(e) => setFiltroMes(e.target.value)}
                    placeholder="MM"
                />
                <label htmlFor="filtro-dia" className="mr-2 text-white ml-4">Día:</label>
                <input
                    type="text"
                    id="filtro-dia"
                    className="p-1 border border-black rounded-lg text-black"
                    value={filtroDia}
                    onChange={(e) => setFiltroDia(e.target.value)}
                    placeholder="DD"
                />

                <button onClick={abrirModalFiltro} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Filtrar Movimientos</button>
            </div>
            <table className="w-full min-w-full divide-y divide-white-200 text-sm text-black rounded-lg overflow-hidden">
                <thead className="bg-black text-white">
                    <tr>
                        <th className="font-medium border text-center cursor-pointer w-1/12">USUARIO</th>
                        <th className="font-medium border text-center w-1/12">MOVIMIENTO</th>
                        <th className="font-medium border text-center cursor-pointer w-1/12">FECHA</th>
                        <th className="font-medium border text-center cursor-pointer w-1/12">HORA</th>
                        <th className="font-medium border text-center cursor-pointer w-1/12">NO. DE SOLICITUD</th>
                        <th className="font-medium border text-center w-1/12">FOLIO</th>
                        <th className="font-medium border text-center w-1/12">NÚMERO DE ENTREGAS</th>
                        <th className="font-medium border text-center cursor-pointer w-2/12">DESCRIPCIÓN</th>
                        <th className="font-medium border text-center w-1/12">ACCIONES</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-black">
                    {filteredHistorial.length > 0 ? filteredHistorial.slice(0, solicitudesPerPage).map((historial, index) => (
                        <tr key={index}>
                            <td className="text-center border p-2">{historial.user.username}</td>
                            <td className="text-center border p-2">{historial.accion}</td>
                            <td className="text-center border p-2">{new Date(historial.fecha).toLocaleDateString()}</td>
                            <td className="text-center border p-2">{new Date(historial.fecha).toLocaleTimeString()}</td>
                            <td className="text-center border p-2">{historial.numeroDeSolicitud.folio}</td>
                            <td className="text-center border p-2">{historial.folio}</td>
                            <td className="text-center border p-2">{historial.numeroDeEntrega}</td>
                            <td className="text-center border p-2">{historial.descripcion}</td>
                            <td className="text-center border p-2">
                                <button className="text-red-600" onClick={abrirModal}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>

                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="9" className="text-center border p-2">No hay registros</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {isModalOpen && (
                <div ref={modalRef} className="fixed inset-0 flex text-black items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold">Confirmar Acción</h2>
                        <p>¿Estás seguro de que quieres eliminar este registro?</p>
                        <div className="mt-4 flex justify-between">
                            <button onClick={cerrarModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancelar</button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
            {isFiltroModalOpen && (
                <div
                    className="fixed inset-0 text-black flex items-center justify-center bg-gray-800 bg-opacity-50"
                    onClick={cerrarModalFiltro}
                >
                    <div
                        className="bg-white p-4 rounded-lg w-1/2"
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <label htmlFor="filtro-movimiento" className="mr-2 text-white">Movimiento:</label>
                        <select
                            id="filtro-movimiento"
                            className="p-1 border border-black rounded-lg text-black"
                            value={selectedFiltro}
                            onChange={(e) => setSelectedFiltro(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="Entrega de materiales en la solicitud">Entrega de materiales en la solicitud</option>
                            <option value="Creación de la solicitud">Creación de la solicitud</option>
                            <option value="Eliminación de la solicitud">Eliminación de la solicitud</option>
                            <option value="Actualización de la solicitud">Actualización de la solicitud</option>
                            <option value="Asignación del folio">Asignación del folio</option>
                            <option value="Rechazo de la solicitud">Rechazo de la solicitud</option>
                        </select>
                  
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={aplicarFiltro}>Aplicar Filtro</button>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={cerrarModalFiltro}>Cerrar</button>
                    </div>
                </div>
            )
            }
        </div >
    );
}
