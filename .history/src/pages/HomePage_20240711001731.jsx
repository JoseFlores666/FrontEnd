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
                                import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import { useSoli } from "../context/SolicitudContext";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Swal from "sweetalert2";
import "../css/Animaciones.css";

export const RegisterTecPage2 = () => {
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors } } = useForm();


    const [fechaAtencion, setFechaAtencion] = useState("");
    const { historialOrden, traeHistorialOrden, createDEPInforme } = useSoli();
    const { user } = useAuth();
    const [items, setItems] = useState([{ cantidad: "", descripcion: "", historial: [] }]);
    const descripcionRefs = useRef([]);
    const [recentSuggestions, setRecentSuggestions] = useState([]);
    const [observacion, setObservacion] = useState("");

    useEffect(() => {
        traeHistorialOrden();
    }, []);

    const eliminarItem = (index, e) => {
        e.preventDefault();
        setItems(items.filter((_, i) => i !== index));
    };

    const duplicarItem = (index, e) => {
        e.preventDefault();
        const itemToDuplicate = items[index];
        const duplicatedItem = { ...itemToDuplicate };
        setItems([...items, duplicatedItem]);
    };

    const agregarItem = (e) => {
        e.preventDefault();
        if (items.length < 4) {
            setItems([...items, { cantidad: "", descripcion: "", historial: [] }]);
        } else {
            alert("No se pueden agregar más de 4 items.");
        }
    };
    const handleCantidadChange = (index, newValue) => {
        const newItems = [...items];
        newItems[index].cantidad = newValue;
        setItems(newItems);
    };

    const handleInputChange = (index, value, field) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const onSubmit = async () => {
        try {
            const cleanedItems = items.map(({ historial, ...rest }) => rest);
            const misdatos = {
                fechaAtencion,
                items: cleanedItems,
                observacion,
                user: user._id,
            };
            console.log(misdatos);
            createDEPInforme(id, misdatos);
            Swal.fire({
                title: "Completado!",
                text: "Orden de trabajo completado",
                icon: "success",
                confirmButtonText: "Cool",
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error al en la solicitud",
                icon: "error",
                confirmButtonText: "OK",
            });
            console.error("Error submitting form: ", error);
        }
    };

    return (
        <div className="mx-auto max-w-6xl p-4 text-black">
            <form onSubmit={handleSubmit(onSubmit)} className="slide-down">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="flex items-center justify-center w-full h-11 mb-6 bg-green-500 p-3 rounded-md text-white">
                        <label className="text-2xl font-bold text-white text-center">
                            Llenado Exclusivo para el DEP MSG:
                        </label>
                    </div>
                    <div className="text-center">
                        <div>
                            <label className="block text-center text-sm font-medium mb-1">
                                Seleccione la fecha de atención:
                            </label>
                        </div>
                        <input
                            type="date"
                            id="fechaAtencion"
                            name="fechaAtencion"
                            className="text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            value={fechaAtencion}
                            required
                            onChange={(e) => setFechaAtencion(e.target.value)}
                        />
                    </div>
                    <div className="bg-white p-6 text-black">
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-6 mb-4">
                                <div className="col-span-3">
                                    <label className="block text-sm font-medium mb-1 text-center">
                                        Cantidad:
                                    </label>
                                    <input
                                        type="number"
                                        id={`items[${index}].cantidad`}
                                        name={`items[${index}].cantidad`}
                                        placeholder="Ingrese una cantidad"
                                        className="w-3/4 mx-auto text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        value={item.cantidad}
                                        onChange={(e) => handleCantidadChange(index, e.target.value)}
                                    />
                                </div>
                                <div className="col-span-7">
                                    <label className="block text-sm font-medium mb-1">
                                        Descripción:
                                    </label>
                                    <AutocompleteInput
                                        index={index}
                                        value={item.descripcion}
                                        onChange={(value) => handleInputChange(index, value, "descripcion")}
                                        data={historialOrden} // Le pasamos los datos de nuestra consulta
                                        recentSuggestions={recentSuggestions}
                                        setRecentSuggestions={setRecentSuggestions}
                                        inputRefs={descripcionRefs}
                                        placeholder="Ingrese una descripción"
                                        fieldsToCheck={['Observacionestecnicas', 'descripcionDelServicio', 'soliInsumosDescripcion',]} // Especificar los campos específicos a consulta
                                        inputProps={{
                                            type: "text",
                                            maxLength: 200,
                                            className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                                        }}
                                    />
                                </div>
                                <div className="col-span-2 ">
                                    <label className="block text-sm font-medium mb-1">
                                        Accion
                                    </label>
                                    <button
                                        onClick={(e) => eliminarItem(index, e)}
                                        className="p-2 text-red-500 hover:text-red-700"
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                    <button
                                        onClick={(e) => duplicarItem(index, e)}
                                        className="p-2 text-green-500 hover:text-green-700"
                                    >
                                        <FontAwesomeIcon icon={faClone} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-center">

                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold mt-2 px-6 py-3 rounded-md border border-black"
                                onClick={(e) => agregarItem(e)}
                            >
                                Agregar Item
                            </button>
                        </div>
                    </div>

                    <div className="mb-1">
                        <label className="block text-sm font-medium mb-1">
                            Observaciones y/o diagnóstico técnico:
                        </label>
                    </div>
                    <AutocompleteInput
                        index={items.length} // Usamos un índice fuera del rango de items
                        value={observacion}
                        onChange={(newValue) => setObservacion(newValue)}
                        data={historialOrden}
                        recentSuggestions={recentSuggestions}
                        setRecentSuggestions={setRecentSuggestions}
                        inputRefs={descripcionRefs} // Asumiendo que `descripcionRefs` es un array de refs
                        placeholder="Ingrese sus Observaciones"
                        fieldsToCheck={['Observacionestecnicas', 'descripcionDelServicio', 'soliInsumosDescripcion',]} // Campos específicos a consultar
                        inputProps={{
                            type: "text",
                            maxLength: 200,
                            className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                        }}
                    />
                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
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
