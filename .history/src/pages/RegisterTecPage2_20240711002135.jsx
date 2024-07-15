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
            formData.append("tipoMantenimiento", data.tipoMantenimiento);
            formData.append("tipoTrabajo", data.tipoTrabajo);
            formData.append("tipoSolicitud", data.tipoSolicitud);
            formData.append("descripcion", descripcion);


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
                                <label className="text-sm font-medium leading-none" htmlFor="fechaOrden">
                                    Fecha
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="fechaOrden"
                                    type="date"
                                    value={fechaOrden}
                                    onChange={(e) => setFechaOrden(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium leading-none" htmlFor="folioExterno">
                                    No. de folio Externo:
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="folioExterno"
                                    type="number"
                                    {...register("folioExterno", { required: true })}
                                />
                            </div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                                Cantidad
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                                Descripción
                                            </th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right">
                                                Acción
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <input
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    type="number"
                                                />
                                            </td>
                                          
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="h-5 w-5"
                                                    >
                                                        <path d="M3 6h18"></path>
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                               
                                            </td>
                                        </tr>
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <input
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    type="number"
                                                />
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="h-5 w-5"
                                                    >
                                                        <path d="M3 6h18"></path>
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="h-5 w-5"
                                                    >
                                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-muted">
                                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                                    Agregar más
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium leading-none" htmlFor="observations">
                                Observaciones
                            </label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                id="observations"
                                rows="4"
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                type="submit"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </form >
            </div>
        </div>
    );
}
