import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { useSoli } from "../context/SolicitudContext";

export const FolioExterno = () => {
    const { id: paramId } = useParams();
    const formRef = useRef(null);
    const { unasoli, getunSolitud, actualizarSoliFolioExterno } = useSoli();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (paramId) {
            cargarSolicitud(paramId);
        }
    }, [paramId]);

    const cargarSolicitud = async (paramId) => {
        try {
            await getunSolitud(paramId);

            if (unasoli) {
                setValue("folioExterno", unasoli.folioExterno || "");
                setValue("nombreProyecto", unasoli.proyecto.nombre || "");
                setValue("nombreActividades", unasoli.actividades.map(act => act.nombre).join(", ") || "");
                setValue("estado", unasoli.estado || "");
                setValue("areaSolicitante", unasoli.areaSolicitante || "");
                setValue("tipoSuministro", unasoli.tipoSuministro || "");
                setValue("procesoClave", unasoli.procesoClave || "");
            }

            setLoading(false);
        } catch (error) {
            console.error("Error al obtener la solicitud:", error);
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            data.id = paramId;
            data.estado = "Asignada";
            await actualizarSoliFolioExterno(paramId, data);

            Swal.fire({
                title: "¡Enviado!",
                text: "Los datos se han enviado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });

            cargarSolicitud(paramId);
            navigate(-1);

        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="flex items-center justify-center mx-auto max-w-8 xl p-4 text-black" style={{ height: '90vh' }}>
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="titulo mb-6 bg-green-500 p-3 rounded-md text-white">
                        <h1 className="text-2xl font-bold text-white text-center">Asignar Folio:</h1>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Selecciona la fecha:
                            </label>
                            <input
                                type="date"
                                disabled
                                id="fecha"
                                name="fecha"
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                value={unasoli ? new Date(unasoli.fecha).toISOString().split('T')[0] : ""}
                            />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                No. de folio:
                            </label>
                            <input
                                type="text"
                                disabled
                                id="folio"
                                name="folio"
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed"
                                value={unasoli?.folio || ""}
                            />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label
                                htmlFor="folioExterno"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                No. de folio externo:
                            </label>
                            <input
                                type="text"
                                id="folioExterno"
                                name="folioExterno"
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                {...register("folioExterno")}
                            />
                            {errors.folioExterno && (
                                <p className="text-red-500 text-xs mt-1">{errors.folioExterno.message}</p>
                            )}
                        </div>
                        <div className="col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Suministros:
                            </label>
                            {unasoli?.suministros.map((suministro, index) => (
                                <div key={index} className="grid grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cantidad:
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                            value={suministro.cantidad || ""}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Unidad:
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                            value={suministro.unidad || ""}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción:
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                            value={suministro.descripcion || ""}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cantidad acumulada:
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                            value={suministro.cantidadAcumulada || ""}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cantidad entregada:
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                            value={suministro.cantidadEntregada || ""}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Número de entregas:
                                        </label>
                                        <input
                                            type="text"

                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 "
                                            value={suministro.NumeroDeEntregas || ""}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center items-center text-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 px-6 py-2 rounded-md"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
