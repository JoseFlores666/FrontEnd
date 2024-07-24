import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from '../schemas/RegisterTecPage2'
import Swal from "sweetalert2";
import "../css/solicitud.css";
import "../css/Animaciones.css";

export const RegisterTecPage2 = () => {

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm(
        {
        resolver: zodResolver(formSchema)
    }
    );

    const { id } = useParams();
    const { user } = useAuth();
    const { createDEPInforme, historialOrden, traeFolioInternoInforme, traeHistorialOrden, myFolioInternoInfo } = useSoli();
    const [recentSuggestions, setRecentSuggestions] = useState([]);
    const [fechaOrden, setFechaOrden] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    const [folioExterno, setFolioExterno] = useState("");
    const [items, setItems] = useState([{ cantidad: "", descripcion: "" }]);
    const refs = useRef([]);
    const [observaciones, setObservaciones] = useState("");

    const onSubmit = async (data, e) => {
        e.preventDefault();
        try {
            const formData = {
                ...data,
                fechaOrden,
                observaciones,
                user: user.id,
            };
            console.log('Form Data:', formData);
            await createDEPInforme(id, formData);
            limpiar()
            Swal.fire({
                title: "Completado!",
                text: "Registro técnico completado",
                icon: "success",
                confirmButtonText: "Cool",
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error al enviar la solicitud",
                icon: "error",
                confirmButtonText: "OK",
            });
            console.error("Error submitting form: ", error);
        }
    };

    const limpiar = () => {
        reset();
        setFechaOrden(() => {
            const today = new Date();
            return today.toISOString().split("T")[0];
        });
        setFolioExterno("");
        setItems([{ cantidad: "", descripcion: "" }]);
        setObservaciones("");
    };


    useEffect(() => {
        traeHistorialOrden();
        traeFolioInternoInforme();
    }, []);

    useEffect(() => {
        if (!folioExterno) {
            setFolioExterno(myFolioInternoInfo);
        }
    }, [folioExterno, myFolioInternoInfo]);

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

    const agregarItem = (e) => {
        e.preventDefault();
        if (items.length < 4) {
            setItems([...items, { cantidad: "", descripcion: "" }]);
        } else {
            alert("No se pueden agregar más de 4 items.");
        }
    };

    const duplicarItem = async (index, e) => {
        e.preventDefault();
        const itemToDuplicate = items[index];
        const duplicatedItem = { ...itemToDuplicate };
        const newItems = [...items, duplicatedItem];
        setItems(newItems);
    };

    const eliminarItem = (index, e) => {
        e.preventDefault();
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="mx-auto max-w-4xl p-4 text-black">
            <form onSubmit={handleSubmit(onSubmit)} className="slide-down">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="flex items-center justify-center w-full h-11 p-3 rounded-md">
                        <label className="text-2xl text-transform uppercase font-bold text-center text-black">
                            Llenado Exclusivo para el DEP MSG:
                        </label>
                    </div>
                    <div className="p-4 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1 leading-none" htmlFor="fechaOrden">
                                    Fecha
                                </label>
                                <input
                                    className="flex h-10 w-2/5 rounded-md border-input px-3 py-2 border-gray-400 bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                    id="fechaOrden"
                                    type="date"
                                    value={fechaOrden}
                                    onChange={(e) => setFechaOrden(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col items-end">
                                <label className="text-sm mb-1 font-medium leading-none text-right mr-20" htmlFor="folioExterno">
                                    No. de folio Externo:
                                </label>
                                <div className="flex items-center">
                                    <input
                                        className="flex h-10 w-3/4 rounded-md border border-input px-3 py-2 border-gray-400 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                        id="folioExterno"
                                        type="number"
                                        placeholder="Ingrese el folio"
                                        {...register("folioExterno", { required: true })}
                                        value={folioExterno}
                                        onChange={(e) => setFolioExterno(e.target.value)}
                                    />
                                </div>
                                {errors.folioExterno && (
                                    <span className="text-red-500 mr-16">{errors.folioExterno.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="border rounded-lg bg-white overflow-x-auto">
                            <div className="relative w-full">
                                <table className="w-full caption-bottom text-sm border">
                                    <thead className="[&_tr]:border border-gray-400">
                                        <tr className="border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                                            <th className="h-12 text-center px-4 align-middle font-medium text-black border-gray-400">
                                                Cantidad
                                            </th>
                                            <th className="h-12 px-4 text-center align-middle font-medium text-black border-gray-400">
                                                Descripción
                                            </th>
                                            <th className="h-12 px-4 align-middle font-medium text-black border-gray-400">
                                                Acción
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0 border-gray-400">
                                        {items.map((item, index) => (
                                            <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                                                <td className="align-middle border border-gray-400">
                                                    <div className="flex justify-center">
                                                        <input
                                                            className="h-10 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-2/4 text-center rounded-md border border-input border-gray-400 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                                            type="number"
                                                            placeholder="Ingrese la cantidad"
                                                            onChange={(e) => handleCantidadChange(index, e.target.value)}
                                                            {...register(`items[${index}].cantidad`, { required: true })}
                                                            defaultValue={item.cantidad}
                                                            name={`items[${index}].cantidad`}
                                                        />
                                                    </div>
                                                    {errors.items && errors.items[index] && errors.items[index].cantidad && (
                                                        <span className="text-red-500">{errors.items[index].cantidad.message}</span>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle border border-gray-400">
                                                    <AutocompleteInput
                                                        index={index}
                                                        value={item.descripcion}
                                                        onChange={(value) => handleInputChange(index, value, "descripcion")}
                                                        data={historialOrden}
                                                        recentSuggestions={recentSuggestions}
                                                        setRecentSuggestions={setRecentSuggestions}
                                                        inputRefs={refs}
                                                        placeholder="Ingrese una descripción"
                                                        fieldsToCheck={['Observacionestecnicas', 'descripcionDelServicio', 'soliInsumosDescripcion']}
                                                        inputProps={{
                                                            type: "text",
                                                            maxLength: 200,
                                                            className: "w-full resize-none text-black p-3 border border-gray-400 bg-gray-50 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                                                            onBlur: () => setValue(`items[${index}].descripcion`, item.descripcion, { shouldValidate: true })
                                                        }}
                                                    />
                                                    {errors.items && errors.items[index] && errors.items[index].descripcion && (
                                                        <span className="text-red-500">{errors.items[index].descripcion.message}</span>
                                                    )}
                                                </td>
                                                <td className=" border border-gray-400">
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            onClick={(e) => eliminarItem(index, e)}
                                                            className="inline-flex text-red-500 hover:text-red-700 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </button>
                                                        <button className="text-blue-500 hover:text-blue-700" onClick={(e) => duplicarItem(index, e)}>
                                                            <FontAwesomeIcon icon={faClone} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-white border-b border-r border-l border-gray-400 rounded-b-md">
                                <button
                                    onClick={(e) => agregarItem(e)}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-green-600 hover:text-white border-gray-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white h-10 px-4 py-2 w-full">
                                    Agregar más
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm mb-1 font-medium leading-none" htmlFor="observaciones">
                                Observaciones
                            </label>
                            <AutocompleteInput
                                index={items.length}
                                value={observaciones}
                                onChange={(newValue) => setObservaciones(newValue)}
                                data={historialOrden}
                                recentSuggestions={recentSuggestions}
                                setRecentSuggestions={setRecentSuggestions}
                                inputRefs={refs}
                                placeholder="Ingrese sus Observaciones"
                                fieldsToCheck={['Observacionestecnicas', 'descripcionDelServicio', 'soliInsumosDescripcion']}
                                inputProps={{
                                    type: "text",
                                    maxLength: 200,
                                    className: "w-full resize-none text-black p-3 border border-gray-400 bg-gray-50 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                                    onBlur: () => setValue("observaciones", observaciones, { shouldValidate: true })
                                }}
                            />
                            {errors.observaciones && (
                                <span className="text-red-500">{errors.observaciones.message}</span>
                            )}
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
                                type="submit"
                            >
                                Guardar Registro
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
