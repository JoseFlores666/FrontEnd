import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubiendoImagenes from "../components/ui/SubiendoImagenes"
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from '../schemas/RegisterTecPage2'
import Swal from "sweetalert2";
import "../css/solicitud.css";
import "../css/Animaciones.css";

export const RegisterTecPage2 = () => {
    const subiendoImagenesRef = useRef(null);

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm(
        {
            resolver: zodResolver(formSchema)
        }
    );
    const { id } = useParams();
    const { user } = useAuth();
    const { createDEPInforme, historialOrden, traeFolioInternoInforme, traerEncabezado, encabezado, traeHistorialOrden,traeUnaInfo, unaInfo, myFolioInternoInfo } = useSoli();
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

            const files = subiendoImagenesRef.current.getFiles();
            for (let i = 0; i < files.length; i++) {
                formData.append(`imagen-${i}`, files[i]);
                console.log(`imagen - ${i}`, files[i]);
            }
            await createInfo(formData);
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
        traeUnaInfo(id);
        traerEncabezado(id);
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
        <div className="mx-auto max-w-5xl p-4 text-black">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-6xl">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold">Asignar Técnico</h1>
                      
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold mb-1">Folio: </label>
                            <p className="w-full rounded-md">{unaInfo.folio}</p>

                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Solicita:</label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.nombre}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Área solicitante:</label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.areaSolicitante}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold mb-1">Fecha:</label>
                            <p className="w-full rounded-md">{unaInfo.informe?.fecha}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Tipo de Mantenimiento:</label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeMantenimiento}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Tipo de Trabajo:</label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeTrabajo}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold mb-1">Tipo de Solicitud:</label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeSolicitud}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Edificio:</label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.edificio}</p>
                        </div>
                    </div>


                    <label className="block text-sm font-bold mb-1">Descripción:</label>
                    <p className='mb-4'>{encabezado.descripcionDelServicio}</p>

                    <label className="block text-sm font-bold mb-1">Técnico Encargado:</label>
                    {encabezado.tecnicos && encabezado.tecnicos.length > 0 ? (
                        <p className='mb-4'>{encabezado.tecnicos[0]?.nombreCompleto}</p>
                    ) : (
                        <p className='mb-4'>No asignado</p>
                    )}

                    {errors.tecnicos && (
                        <span className="text-red-500">{errors.tecnicos.message}</span>
                    )}
                    <div className="flex items-center justify-center w-full h-11 p-3 rounded-md">
                        <p className="font-bold">Llenado Exclusivo para el DEP MSG:</p>
                    </div>
                    <p className=" font-bold ">Rellene los detalles a continuación.</p>
                    <div className="p-4 space-y-">
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
                                <tbody className="[&_tr:last-child]:border-0  border-b border-r border-l border-gray-400">
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
                            <div className="p-4 bg-white mb-6 border-b border-r border-l border-gray-400 rounded-b-md">
                                <button
                                    onClick={(e) => agregarItem(e)}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-green-600 hover:text-white border-gray-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white h-10 px-4 py-2 w-full">
                                    Agregar más
                                </button>
                            </div>
                            {/* esta parte es Obligatorio en esta parte */}
                            <div>
                                <SubiendoImagenes />
                            </div>

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
