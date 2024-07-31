import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ImFileEmpty } from "react-icons/im";
import { TablaVistaSolicitud } from "./TablaVistaSolicitud";

export function Historial() {
    const [searchTerm, setSearchTerm] = useState("");
    const [solicitudesPerPage, setSolicitudesPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);

    const abrirModal = () => {
        setIsModalOpen(true);
    };

    const cerrarModal = () => {
        setIsModalOpen(false);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

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
            <table className="w-full min-w-full divide-y divide-white-200 text-sm text-black rounded-lg overflow-hidden">
                <thead className="bg-black text-white">
                    <tr>
                        <th className="text-left font-medium border text-center cursor-pointer w-1/12">USUARIO</th>
                        <th className="text-left font-medium border text-center cursor-pointer w-1/12">FECHA</th>
                        <th className="text-left font-medium border text-center cursor-pointer w-1/12">HORA</th>
                        <th className="text-left font-medium border text-center cursor-pointer w-1/12">NO. DE SOLICITUD</th>
                        <th className="text-left font-medium border text-center w-1/12">FOLIO</th>
                        <th className="text-left font-medium border text-center w-1/12">NÚMERO DE ENTREGAS</th>
                        <th className="text-left font-medium border text-center cursor-pointer w-2/12">DESCRIPCIÓN</th>
                        <th className="text-left font-medium border text-center w-1/12">ACCIONES</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-black">
                    <tr>
                        <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">Ejemplo Usuario</td>
                        <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">01/01/2024</td>
                        <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">12:00 PM</td>
                        <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">12345</td>
                        <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">Folio Ejemplo</td>
                        <td className="p-1 whitespace-normal break-words border border-gray-400 text-center">3</td>
                        <td className="px-3 py-2 whitespace-normal break-words border border-gray-400 text-center">Descripción Ejemplo</td>
                        <td className="px-3 py-2 whitespace-normal break-words border border-gray-400 text-center">
                            <div className="flex justify-center items-center space-x-2">
                                <button onClick={abrirModal} className="text-red-500 hover">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <nav className="flex items-center justify-between pt-2">
                <span className="text-sm font-normal text-white dark:text-black-400">
                    Mostrando 1-10 Total de Movimientos: <span className="font-semibold text-white dark:text-white">0</span>
                </span>
                <ul className="inline-flex items-center h-8 text-sm">
                    <li>
                        <button
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-400 border-gray-400 cursor-not-allowed"
                        >
                            <span className="sr-only">Previous</span>
                            <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button
                            className="flex items-center justify-center px-3 h-8 leading-tight text-black border border-black bg-blue-400 hover:bg-blue hover:text-black"
                        >
                            1
                        </button>
                    </li>
                    <li>
                        <button
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-400 border-gray-400 cursor-not-allowed"
                        >
                            <span className="sr-only">Next</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white text-black p-8 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold">Eliminar Solicitud</h2>
                        <p>¿Estás seguro de que deseas eliminar esta solicitud?</p>
                        <div className="mt-4 flex justify-end">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2" onClick={cerrarModal}>Cancelar</button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={cerrarModal}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
