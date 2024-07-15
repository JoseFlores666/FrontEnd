import React, { useRef, useState, useEffect } from "react";
import { Label } from "../components/ui";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { schemaFolioExterno } from "../schemas/registerSoliPage";
import Swal from "sweetalert2";
import { useSoli } from "../context/SolicitudContext";

export const FolioExterno = () => {
    const { id } = useParams();
    const formRef = useRef(null);
    const { unasoli, getunSolitud, actualizarSoliFolioExterno } = useSoli();
    const [loading, setLoading] = useState(true);
    const [datosCargados, setDatosCargados] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        // resolver: zodResolver(schemaFolioExterno),
    });

    useEffect(() => {
        const cargarSolicitud = async () => {
            try {
                await getunSolitud(id);
                setDatosCargados(true);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener la solicitud:", error);
            }
        };

        if (id && !datosCargados) {
            cargarSolicitud();
        }
    }, [id, datosCargados, getunSolitud]);

    useEffect(() => {
        if (unasoli && datosCargados) {
            llenaSolicitud();
        }
    }, [unasoli, datosCargados]);

    const llenaSolicitud = () => {
        try {
            if (unasoli) {
                //
                setValue("folioExterno", unasoli.folioExterno || "");
                setValue("nombreProyecto", unasoli.proyecto.nombre || "");
                setValue("nombreActividades", unasoli.actividades.map(act => act.nombre).join(", ") || "");
                setValue("estado", unasoli.estado || "");
                setValue("areaSolicitante", unasoli.areaSolicitante || "");
                setValue("tipoSuministro", unasoli.tipoSuministro || "");
                setValue("procesoClave", unasoli.procesoClave || "");
            }
        } catch (error) {
            console.error("Error al llenar los datos:", error);
        }
    };

    const onSubmit = async (data) => {
        try {
            data.id = id;
            data.estado = "Asignada";
            await actualizarSoliFolioExterno(id, data);

            Swal.fire({
                title: "¡Enviado!",
                text: "Los datos se han enviado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            navigate(-1);
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="relative mx-auto max-w-5xl p-4">
            <div className="absolute top-0 right-0 p-4 text-sm text-gray-600">
                {unasoli ? new Date(unasoli.fecha).toLocaleDateString() : ""}
            </div>
            <div className="division"></div>
            <form ref={formRef} method="post" target="_blank" onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="mb-6">
                        <h1 className="titulo mb-6 bg-green-500 p-3 rounded-md text-white">Asignar Folio</h1>
                    </div>
                    <div className="division"></div>
                    <div className="body2">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-black w-full text-black">
                            <div className="flex flex-wrap gap-6 mb-4">
                                <div className="flex-1 min-w-[150px]">
                                    <Label
                                        htmlFor="fecha"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Selecciona la fecha:
                                    </Label>
                                    <input
                                        type="date"
                                        disabled
                                        id="fecha"
                                        name="fecha"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                        value={unasoli ? new Date(unasoli.fecha).toISOString().split('T')[0] : ""}
                                    />
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <Label
                                        htmlFor="folio"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        No. de folio:
                                    </Label>
                                    <input
                                        type="text"
                                        disabled
                                        id="folio"
                                        name="folio"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed"
                                        value={unasoli?.folio || ""}
                                    />
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <Label
                                        htmlFor="folioExterno"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        No. de folio externo:
                                    </Label>
                                    <input
                                        type="text"
                                        id="folioExterno"
                                        name="folioExterno"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        {...register("folioExterno")}
                                    />
                                    {errors.folioExterno && (
                                        <p className="text-red-500 text-xs mt-1">{errors.folioExterno.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

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
