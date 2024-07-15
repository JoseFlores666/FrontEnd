import React, { useState, useRef, useEffect } from "react";
import { Label } from "../components/ui";
import { useSoli } from "../context/SolicitudContext";
import "../css/solicitud.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { abonoSolicitudSchema } from "../schemas/Abono";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { faL } from "@fortawesome/free-solid-svg-icons";

export const AbonoSolicitud = () => {
    const { id } = useParams();
    const { handleSubmit, register, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(abonoSolicitudSchema),
    });

    const formRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [datosCargados, setDatosCargados] = useState(false);
    const [showItems, setShowItems] = useState(false);
    const { unasoli, getunSolitud, RealizarAbono } = useSoli();
    const [items, setItems] = useState([]);

    useEffect(() => {
        const cargarSolicitud = async () => {
            try {
                await getunSolitud(id);
                setDatosCargados(true);
            } catch (error) {
                console.error("Error al obtener la solicitud:", error);
            }
        };

        if (id && !datosCargados) {
            cargarSolicitud();
        }
    }, [id, datosCargados, getunSolitud]);

    useEffect(() => {
        if (datosCargados) {
            llenaSolicitud();
        }
    }, [datosCargados]);

    const llenaSolicitud = () => {
        try {
            console.log(unasoli)
            setValue("folio", unasoli.folio || "");
            setValue("folioExterno", unasoli.folioExterno || "");
            setValue("fecha", unasoli.fecha ? new Date(unasoli.fecha).toISOString().slice(0, 10) : "");
            setValue("NumEntregas", unasoli.NumeroDeEntregas || "");
            setValue("items", unasoli.suministros || []);
            setItems(unasoli.suministros || []);

            if (unasoli.folioExterno) {
                setShowItems(true);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error al llenar los datos:", error);
        }
    };

    const onSubmit = async (data) => {
        try {
            data.id = id;
            console.log(data)
            for (const item of data.items) {
                const totalCantidad = item.cantidadAcumulada + parseInt(item.cantidadEntregada);
                if (totalCantidad > item.cantidad) {
                    Swal.fire({
                        title: "Error",
                        text: `La cantidad acumulada para el suministro ${item.descripcion} excede la cantidad permitida.`,
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    return;
                }
            }

            const response = await RealizarAbono(id, data);

            if (!response) {
                Swal.fire({
                    title: "Error",
                    text: "Error al abonar",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } else {
                Swal.fire({
                    title: "Completado!",
                    text: response.mensaje,
                    icon: "success",
                    confirmButtonText: "Cool",
                });
            }
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            Swal.fire({
                title: "Error!",
                text: "Hubo un problema al realizar el abono",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center mt-50">
                    <div className="mb-4">Cargando...</div>
                    <FontAwesomeIcon className="animate-spin text-gray-500 text-6xl" icon={faL} />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl p-4">
            <div className="division"></div>
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="mb-6">
                        <h1 className="titulo mb-6 bg-green-500 p-3 rounded-md text-white">Area de Entregas</h1>
                    </div>
                    <div className="division"></div>
                    <div className="body2">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-black w-full text-black">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
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
                                        {...register("folio")}
                                    />
                                    {errors.folio && <p>{errors.folio.message}</p>}
                                </div>
                                <div>
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

                                    {errors.folioExterno && <p>{errors.folioExterno.message}</p>}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="fecha"
                                        className="block text-sm font-medium text-gray-700 mb-1">
                                        Selecciona la fecha:
                                    </Label>
                                    <input
                                        type="date"
                                        disabled
                                        id="fecha"
                                        name="fecha"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                        {...register("fecha")}
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="NumEntregas"
                                        className="block text-sm font-medium text-gray-700 mb-1">
                                        Numero De Entregas
                                    </Label>
                                    <input
                                        type="number"
                                        disabled
                                        id="NumEntregas"
                                        name="NumEntregas"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            {showItems && items.map((item, index) => (
                                <div key={index} className="space-y-4 mb-4">
                                    <div className="flex flex-wrap space-x-4 mb-4">
                                        <div className="flex-1 min-w-[150px]">
                                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cantidad:
                                            </Label>
                                            <input
                                                disabled
                                                type="number"
                                                placeholder="Ingrese una cantidad"
                                                className="Inputs w-full"
                                                {...register(`items.${index}.cantidad`)}
                                                required
                                            />
                                            {errors.items?.[index]?.cantidad && (
                                                <p className="text-red-500 text-xs mt-1">{errors.items[index].cantidad.message}</p>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-[150px]">
                                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                                Unidad de medida:
                                            </Label>
                                            <select
                                                className="Inputs w-full"
                                                disabled
                                                {...register(`items.${index}.unidad`)}
                                            >
                                                <option value="">Unidad</option>
                                                <option value="Paquete">Paquete</option>
                                                <option value="Rollo">Rollo</option>
                                                <option value="Caja">Caja</option>
                                            </select>
                                            {errors.items?.[index]?.unidad && (
                                                <p className="text-red-500 text-xs mt-1">{errors.items[index].unidad.message}</p>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-[150px]">
                                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cantidad Acumulada:
                                            </Label>
                                            <input
                                                type="number"
                                                disabled
                                                className="Inputs w-full cursor-not-allowed"
                                                {...register(`items.${index}.cantidadAcumulada`)}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-[150px]">
                                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cantidad a entregar:
                                            </Label>
                                            <input
                                                type="number"
                                                className="Inputs w-full"
                                                {...register(`items.${index}.cantidadEntregada`)}
                                            />
                                            {errors.items?.[index]?.cantidadEntregada && (
                                                <p className="text-red-500 text-xs mt-1">{errors.items[index].cantidadEntregada.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="min-w-[150px]">
                                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción:
                                        </Label>
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Ingrese la descripción"
                                            {...register(`items.${index}.descripcion`)}
                                            disabled
                                        ></textarea>
                                        {errors.items?.[index]?.descripcion && (
                                            <p className="text-red-500 text-xs mt-1">{errors.items[index].descripcion.message}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-center mt-8">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
