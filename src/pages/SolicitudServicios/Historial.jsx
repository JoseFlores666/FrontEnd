import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSoli } from '../../context/SolicitudContext';
import { useAuth } from '../../context/authContext';
import { useParams } from "react-router-dom";
import { BackButton, Label, Td, Th } from "../../components/ui";

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

    const { historialUnaSoli, traehisorialDeUnaSoli, eliminarUnHistorialSoli } = useSoli();
    const { user } = useAuth();
    const modalRef = useRef(null);


    const [historialAEliminar, setHistorialAEliminar] = useState(null);


    useEffect(() => {
        const iniciarDatos = async (id) => {
            try {
                await traehisorialDeUnaSoli(id);
                setDatosCargados(true);
            } catch (error) {
                console.error("Error al cargar los datos", error);
            }
        };
        if (!cargarDatos) {
            iniciarDatos(id);
        }
    }, [cargarDatos, id, traehisorialDeUnaSoli,]);

    const abrirModalFiltro = () => setIsFiltroModalOpen(true);
    const cerrarModalFiltro = () => setIsFiltroModalOpen(false);

    const aplicarFiltro = (filtro) => {
        setSelectedFiltro(filtro);
        setIsFiltroModalOpen(false);
    };

    const abrirModal = (id) => {
        setHistorialAEliminar(id);
        setIsModalOpen(true);
    };

    const cerrarModal = () => setIsModalOpen(false);

    const EliminarElementoHistorial = async () => {
        try {
            const data = {
                idHistorial: historialAEliminar, user
            }
            await eliminarUnHistorialSoli(id, data);
            await traehisorialDeUnaSoli(id);
            setHistorialAEliminar(null);
            setIsModalOpen(false);

        } catch (error) {
            console.error("Error al eliminar el campo", error);
        }
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
            (filtroDia === "" || dia === filtroDia) &&
            (selectedFiltro === "" || historial.accion === selectedFiltro)

        );
    });

    return (
        <div className="overflow-x-auto p-4">
            <div className="mb-8 flex items-center">
                <div className="flex-1">
                    <BackButton />
                </div>
                <div className="flex-1 text-center">
                    <h1 className="text-2xl font-bold">HISTORIAL DE MOVIMIENTOS</h1>
                </div>
                <div className="flex-1"></div>
            </div>
            <div className="grid grid-cols-6 md:grid-cols-6 mb-2">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="table-search"
                        className="block p-2 ps-10 text-sm text-black border border-black rounded-lg w-64 bg-white focus:ring-blue-500 focus:border-blue-500"
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
                <div className="flex items-center space-x-1 justify-center">
                    <Label>Año:</Label>
                    <input
                        type="text"
                        id="filtro-ano"
                        className="p-1 border w-28 border-black rounded-lg text-black"
                        value={filtroAno}
                        onChange={(e) => setFiltroAno(e.target.value)}
                        placeholder="YYYY"
                    />
                </div>
                <div className="flex items-center space-x-1 justify-center">
                    <Label>Mes:</Label>
                    <input
                        type="text"
                        id="filtro-mes"
                        className="p-1 border w-28 border-black rounded-lg text-black"
                        value={filtroMes}
                        onChange={(e) => setFiltroMes(e.target.value)}
                        placeholder="MM"
                    />
                </div>

                <div className="flex items-center space-x-1 justify-center">
                    <Label>Día:</Label>
                    <input
                        type="text"
                        id="filtro-dia"
                        className="p-1 border w-28 border-black rounded-lg text-black"
                        value={filtroDia}
                        onChange={(e) => setFiltroDia(e.target.value)}
                        placeholder="DD"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button onClick={abrirModalFiltro} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Filtrar Movimientos</button>
                </div>
                <div>
                    <Label htmlFor="entries-per-page" className=" text-white">Entradas por página:</Label>
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
                        <Th sortable={false}>USUARIO</Th>
                        <Th sortable={false}>MOVIMIENTO</Th>
                        <Th sortable={false}>FECHA</Th>
                        <Th sortable={false}>HORA</Th>
                        <Th sortable={false}>NO. DE SOLICITUD</Th>
                        <Th sortable={false}>FOLIO</Th>
                        <Th sortable={false}>NÚMERO DE ENTREGAS</Th>
                        <Th sortable={false} extraClass="w-2/12">DESCRIPCIÓN</Th>
                        <Th sortable={false}>ACCIONES</Th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHistorial.length > 0 ? filteredHistorial.slice(0, solicitudesPerPage).map((historial, index) => (
                        <tr key={index}>
                            <Td>{historial.user.username}</Td>
                            <Td>{historial.accion}</Td>
                            <Td>{new Date(historial.fecha).toLocaleDateString()}</Td>
                            <Td>{new Date(historial.fecha).toLocaleTimeString()}</Td>
                            <Td>{historial.numeroDeSolicitud.folio}</Td>
                            <Td>{historial.folio}</Td>
                            <Td>{historial.numeroDeEntrega}</Td>
                            <Td>{historial.descripcion}</Td>
                            <Td>
                                <button className="text-red-600" onClick={() => abrirModal(historial._id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </Td>
                        </tr>
                    )) : (
                        <tr>
                            <Td colSpan="9">No hay registros</Td>
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
                            <button onClick={EliminarElementoHistorial} className="px-4 py-2 bg-red-500 text-white rounded-lg">Eliminar</button>
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
                        <h2 className="text-xl text-center font-bold  text-black mb-4">Seleccionar Movimiento</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => aplicarFiltro("")} className="bg-blue-500 text-white py-2 px-4 rounded">Ver Todos</button>
                            <button onClick={() => aplicarFiltro("Entrega de materiales")} className="bg-blue-500 text-white py-2 px-4 rounded">Entrega de materiales en la solicitud</button>
                            <button onClick={() => aplicarFiltro("Creación de la solicitud")} className="bg-blue-500 text-white py-2 px-4 rounded">Creación de la solicitud</button>
                            <button onClick={() => aplicarFiltro("Eliminación de la solicitud")} className="bg-blue-500 text-white py-2 px-4 rounded">Eliminación de la solicitud</button>
                            {/* <button onClick={() => aplicarFiltro("Actualización de la solicitud")} className="bg-blue-500 text-white py-2 px-4 rounded">Actualización de la solicitud</button> */}
                            <button onClick={() => aplicarFiltro("Asignación del folio")} className="bg-blue-500 text-white py-2 px-4 rounded">Asignación del folio</button>
                            <button onClick={() => aplicarFiltro("Rechazo de la solicitud")} className="bg-blue-500 text-white py-2 px-4 rounded">Rechazo de la solicitud</button>
                        </div>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={cerrarModalFiltro}>Cerrar</button>
                    </div>
                </div>
            )}
        </div >
    );
}
