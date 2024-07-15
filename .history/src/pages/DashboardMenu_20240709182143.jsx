import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEye, faEyeSlash, faSyncAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from "../context/SolicitudContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const DashboardMenu = ({ isOpen, toggleMenu }) => {
    const menuRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [datosCargados, setDatosCargados] = useState(false);

    const { EditarApis_keys, CrearUnaApi_key, api_Key, traeApis_keys, } = useSoli();
    const [esperarApiKeys, setEsperarApiKeys] = useState(false);

    const { handleSubmit, register, setValue, formState: { errors } } = useForm({

    });

    useEffect(() => {
        const llamaApi = async () => {
            try {
                await traeApis_keys();
                setEsperarApiKeys(true);
                setDatosCargados(true);
            } catch (error) {
                console.error("Error al consultar las API keys:", error);
                Swal.fire("Error al obtener las API keys", "", "error");
            }
        };
        if (!esperarApiKeys) {
            llamaApi();
        }
    }, [traeApis_keys, esperarApiKeys]);



    useEffect(() => {
        if (datosCargados) {
            llenaSolicitud();
        }
    }, [datosCargados]);

    const llenaSolicitud = () => {
        try {
            if (!api_Key) {
                console.log(api_Key); // Aquí puedes añadir la lógica para llenar el input con el valor de api_Key
                setValue(api_Key)
            } else {
                setEsperarApiKeys(false);
            }

        } catch (error) {
            console.error("Error al llenar los datos:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                toggleMenu(false);
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [toggleMenu]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        isOpen && (
            <div ref={menuRef} className="absolute w-full right-0 mt-5 bg-white text-black rounded-md shadow-lg z-10 flex items-center justify-between p-4">
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faKey} className="mr-2" />
                    Your API Key
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    className="ml-2 p-2 flex-grow border border-gray-300 rounded"
                    {...register("password")}
                />
                <button
                    onClick={toggleShowPassword}
                    className="ml-2 p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300"
                >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
                <button
                    onClick={handleOpenModal}
                    className="ml-2 p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300"
                >
                    <FontAwesomeIcon icon={faSyncAlt} />
                </button>
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="ml-2 p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        <FontAwesomeIcon icon={faUserPlus} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-md shadow-lg z-10">
                            <div className="px-4 py-2">
                                ¿No tienes API? <a href="https://pdf.co/" target='_blank' className="text-blue-600 hover:underline">Regístrate y obtén una</a>
                            </div>
                        </div>
                    )}
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-xl font-semibold mb-6">Confirmar cambio</h2>
                            <p className="mb-6 text-gray-600">¿Estás seguro que deseas cambiar el API Key?</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                                    onClick={handleCloseModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                                    onClick={handleCloseModal}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    );
};

export default DashboardMenu;
