import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { folioExternoSchema } from '../schemas/folio.js'
import Swal from "sweetalert2";
import { useSoli } from "../context/SolicitudContext";
import "../css/Animaciones.css";
import { GridContainer, Label, Title } from "../components/ui";

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
    } = useForm({ resolver: zodResolver(folioExternoSchema), });

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
            console.log(data)
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
        <div className="flex items-center justify-center mx-auto max-w-8xl p-4 text-black" style={{ height: '90vh' }}>
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="slide-down">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <Title>Asignar Folio</Title>
                    <GridContainer>
                        <div>
                            <Label>Selecciona la fecha:</Label>
                            <input
                                type="date"
                                disabled
                                id="fecha"
                                name="fecha"
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                value={unasoli ? new Date(unasoli.fecha).toISOString().split('T')[0] : ""}
                            />
                        </div>
                        <div>
                            <Label>No. de folio:</Label>
                            <input
                                type="text"
                                disabled
                                id="folio"
                                name="folio"
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed"
                                value={unasoli?.folio || ""}
                            />
                        </div>
                        <div>
                            <Label>No. de folio externo:</Label>
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
                    </GridContainer>

                    <Label>Proyecto:</Label>
                    <input
                        type="text"
                        disabled
                        className="w-full p-3 border mb-6 border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                        value={unasoli?.proyecto.nombre || ""}
                    />
                    <Label>Actividades:</Label>
                    <input
                        type="text"
                        disabled
                        className="w-full p-3 border mb-6 border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                        value={unasoli?.actividades.map(act => act.nombre).join(", ") || ""}
                    />
                    <div className="flex justify-center items-center text-center">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
