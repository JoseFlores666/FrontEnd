import React, { useState, useEffect, useRef } from "react";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "../css/solicitud.css";
import "../css/Animaciones.css";
import { useSoli } from "../context/SolicitudContext";
import SubiendoImagenes from "../components/ui/SubiendoImagenes";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";

export const RegisterTecPage2 = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [fechaOrden, setFechaOrden] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    const navigate = useNavigate();
    const inputRef = useRef([]);
    const subiendoImagenesRef = useRef(null);

    const { createInfo, getIdsProyect, myFolioInternoInfo, traeFolioInternoInforme, historialOrden, traeHistorialOrden } = useSoli();
    const [folioInterno, setFolioInterno] = useState("");
    const [areasoli, setAreasoli] = useState("");
    const [solicita, setSolicita] = useState("");
    const [edificio, setEdificio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [recentSuggestions, setRecentSuggestions] = useState([]);
    const [projectsLoaded, setProjectsLoaded] = useState(false);
    const [cargarDatos, setCargarDatos] = useState(false);

    useEffect(() => {
        if (!projectsLoaded) {
            getIdsProyect()
                .then(() => setProjectsLoaded(true))
                .catch((error) => console.error("Error fetching projects:", error));
        }
    }, [projectsLoaded, getIdsProyect]);

    useEffect(() => {
        const traerDatos = async () => {
            try {
                await traeFolioInternoInforme();
                await traeHistorialOrden();
                setCargarDatos(true);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        if (!cargarDatos) {
            traerDatos();
        }
    }, [traeFolioInternoInforme, cargarDatos]);

    useEffect(() => {
        if (!folioInterno) {
            setFolioInterno(myFolioInternoInfo);
        }
    }, [myFolioInternoInfo, folioInterno]);

    const onSubmit = async (data, e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("folio", data.folio);
            formData.append("fechaOrden", fechaOrden);
            formData.append("folioExterno", data.folioExterno);
            formData.append("areasoli", areasoli);
            formData.append("solicita", solicita);
            formData.append("edificio", edificio);
            formData.append("tipoMantenimiento", data.tipoMantenimiento);
            formData.append("tipoTrabajo", data.tipoTrabajo);
            formData.append("tipoSolicitud", data.tipoSolicitud);
            formData.append("descripcion", descripcion);

            const files = subiendoImagenesRef.current.getFiles();
            for (let i = 0; i < files.length; i++) {
                formData.append(`imagen-${i}`, files[i]);
            }

            await createInfo(formData);
            navigate("/soli/registro/:id");
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6 md:p-8">
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 md:p-6">
                    <h2 className="text-xl font-semibold">Llenado Exclusivo para el DEP</h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-4 md:p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="folio">
                                    No. de folio Interno:
                                </label>
                                <input
                                    type="text"
                                    id="folio"
                                    name="folio"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={folioInterno || ""}
                                    onChange={(e) => setFolioInterno(e.target.value)}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="fechaOrden">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    id="fechaOrden"
                                    name="fechaOrden"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={fechaOrden}
                                    onChange={(e) => setFechaOrden(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="folioExterno">
                                    No. de folio Externo:
                                </label>
                                <input
                                    type="number"
                                    id="folioExterno"
                                    name="folioExterno"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    {...register("folioExterno", { required: true })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="areasoli">
                                    Area solicitante:
                                </label>
                                <AutocompleteInput
                                    index={0}
                                    value={areasoli}
                                    onChange={(newValue) => setAreasoli(newValue)}
                                    data={historialOrden}
                                    recentSuggestions={recentSuggestions}
                                    setRecentSuggestions={setRecentSuggestions}
                                    inputRefs={inputRef}
                                    placeholder="Ingrese el área solicitante"
                                    fieldsToCheck={['areaSolicitante']}
                                    ConvertirAInput={true}
                                    inputProps={{
                                        type: "text",
                                        maxLength: 200,
                                        className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="solicita">
                                    Solicita:
                                </label>
                                <AutocompleteInput
                                    index={1}
                                    value={solicita}
                                    onChange={(newValue) => setSolicita(newValue)}
                                    data={historialOrden}
                                    recentSuggestions={recentSuggestions}
                                    setRecentSuggestions={setRecentSuggestions}
                                    inputRefs={inputRef}
                                    placeholder="Ingrese quien solicita"
                                    fieldsToCheck={['nombre']}
                                    ConvertirAInput={true}
                                    inputProps={{
                                        type: "text",
                                        maxLength: 200,
                                        className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="edificio">
                                    Edificio:
                                </label>
                                <AutocompleteInput
                                    index={2}
                                    value={edificio}
                                    onChange={(newValue) => setEdificio(newValue)}
                                    data={historialOrden}
                                    recentSuggestions={recentSuggestions}
                                    setRecentSuggestions={setRecentSuggestions}
                                    inputRefs={inputRef}
                                    placeholder="Ingrese el edificio"
                                    fieldsToCheck={['edificio']}
                                    ConvertirAInput={true}
                                    inputProps={{
                                        type: "text",
                                        maxLength: 200,
                                        className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="tipoMantenimiento">
                                    Tipo de Mantenimiento:
                                </label>
                                <select
                                    id="tipoMantenimiento"
                                    {...register("tipoMantenimiento", { required: true })}
                                    name="tipoMantenimiento"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">Seleccione un tipo de mantenimiento</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Urgente">Urgente</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="tipoTrabajo">
                                    Tipo de Trabajo:
                                </label>
                                <select
                                    id="tipoTrabajo"
                                    {...register("tipoTrabajo", { required: true })}
                                    name="tipoTrabajo"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">Seleccione el tipo de trabajo</option>
                                    <option value="preventivo">Preventivo</option>
                                    <option value="correctivo">Correctivo</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="tipoSolicitud">
                                    Tipo de Solicitud:
                                </label>
                                <select
                                    id="tipoSolicitud"
                                    {...register("tipoSolicitud", { required: true })}
                                    name="tipoSolicitud"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">Seleccione el tipo de solicitud</option>
                                    <option value="Educativo">PC Educativo</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                        </div>
                        <SubiendoImagenes ref={subiendoImagenesRef} />
                        <div>
                            <label className="text-sm font-medium leading-none" htmlFor="descripcion">
                                Descripción:
                            </label>
                            <AutocompleteInput
                                index={3}
                                value={descripcion}
                                onChange={(newValue) => setDescripcion(newValue)}
                                data={historialOrden}
                                recentSuggestions={recentSuggestions}
                                setRecentSuggestions={setRecentSuggestions}
                                inputRefs={inputRef}
                                placeholder="Ingrese una descripción"
                                fieldsToCheck={['soliInsumosDescripcion', 'nombre']}
                                ConvertirAInput={true}
                                inputProps={{
                                    type: "text",
                                    maxLength: 200,
                                    className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                                }}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}