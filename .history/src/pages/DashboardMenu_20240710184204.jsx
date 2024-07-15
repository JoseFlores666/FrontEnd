import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEye, faEyeSlash, faEdit, faUserPlus, faRedo } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from "../context/SolicitudContext";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

export const DashboardMenu = ({ isOpen, toggleMenu }) => {
    const menuRef = useRef(null);

    const [showPassword, setShowPassword] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [datosCargados, setDatosCargados] = useState(false);
    const [isReloading, setIsReloading] = useState(false);

    const { traeApis_keys, api_Key, EditarApis_keys } = useSoli();
    const [esperarApiKeys, setEsperarApiKeys] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const llamaApi = async () => {
            try {
                await traeApis_keys();
                setEsperarApiKeys(true);
                setDatosCargados(true);
                setIsReloading(false);
            } catch (error) {
                Swal.fire("Error al guardar los datos", "", "error");
                setIsReloading(false);
            }
        };
        if (!esperarApiKeys) {
            llamaApi();
        }
    }, [traeApis_keys, esperarApiKeys]);

    useEffect(() => {
        if (datosCargados && api_Key && api_Key.length > 0) {
            llenaSolicitud();
        }
    }, [datosCargados, api_Key]);

    const llenaSolicitud = () => {
        try {
            const key = api_Key[0]?.api_key || "";
            setValue("apiKey", key);
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

    const handleUpdateApiKey = async (data) => {
        try {
            const api_key =
            console.log(data.newApiKey)
            await EditarApis_keys(data.newApiKey);
            setValue("apiKey", "");
            Swal.fire("API Key actualizada correctamente", "", "success");

            handleCloseModal();
        } catch (error) {
            Swal.fire("Error al actualizar la API Key", "", "error");
        }
    };

    const handleReloadApiKeys = async () => {
        setIsReloading(true);
        setEsperarApiKeys(false);
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
                    {...register("apiKey")}
                />
                <button
                    onClick={toggleShowPassword}
                    className="ml-2 p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300"
                >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
                <button
                    onClick={handleReloadApiKeys}
                    className={`ml-2 p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 ${isReloading ? 'animate-spin' : ''}`}
                >
                    <FontAwesomeIcon icon={faRedo} />
                </button>
                <button
                    onClick={handleOpenModal}
                    className="ml-2 p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300"
                >
                    <FontAwesomeIcon icon={faEdit} />
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
                            <p className="mb-6 text-gray-600">Introduce la nueva API Key:</p>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                {...register("newApiKey", { required: true })}
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                                    onClick={handleCloseModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                                    onClick={handleSubmit(handleUpdateApiKey)}
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
