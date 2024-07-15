import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import { useSoli } from "../context/SolicitudContext";
import Swal from "sweetalert2";
import "../css/solicitud.css";
import "../css/Animaciones.css";

const RegisterTecPage2 = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const { createInfo, historialOrden, traeFolioInternoInforme, traeHistorialOrden, myFolioInternoInfo } = useSoli();
    const [recentSuggestions, setRecentSuggestions] = useState([]);


    const [fechaOrden, setFechaOrden] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    const [folioExterno, setFolioExterno] = useState("");
    const [items, setItems] = useState([{ cantidad: "", descripcion: "" }]);
    const descripcionRefs = useRef([]);

    const [observaciones, setObservaciones] = useState("");

    const onSubmit = async (data, e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("folio", folioExterno);
            formData.append("fechaOrden", fechaOrden);
            formData.append("observaciones", observaciones);
            formData.append("items", JSON.stringify(items));

            await createInfo(formData);
            Swal.fire({
                title: "Completado!",
                text: "Registro técnico completado",
                icon: "success",
                confirmButtonText: "Cool",
            });
            navigate("/soli/registro/:id");
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

    const agregarItem = () => {
        if (items.length < 4) {
            setItems([...items, { cantidad: "", descripcion: "" }]);
        } else {
            alert("No se pueden agregar más de 4 items.");
        }
    };

    const eliminarItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full max-w-1xl mx-auto p-6 md:p-8">
            <div className="border rounded-lg  ">
                <div className="bg-muted p-4 md:p-6">
                    <h2 className="text-xl font-semibold">Llenado Exclusivo para el DEP</h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="slide-down">
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
                                    value={folioExterno}
                                    onChange={(e) => setFolioExterno(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="border rounded-lg ">
                            <div className="relative w-full">
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
                                        {items.map((item, index) => (
                                            <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                    <input
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        type="number"
                                                        value={item.cantidad}
                                                        onChange={(e) => handleCantidadChange(index, e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                    <AutocompleteInput
                                                        index={index}
                                                        value={item.descripcion}
                                                        onChange={(value) => handleInputChange(index, value, "descripcion")}
                                                        data={historialOrden}
                                                        recentSuggestions={recentSuggestions}
                                                        setRecentSuggestions={setRecentSuggestions}
                                                        inputRefs={descripcionRefs}
                                                        placeholder="Ingrese una descripción"
                                                        fieldsToCheck={['Observacionestecnicas', 'descripcionDelServicio', 'soliInsumosDescripcion']}
                                                        inputProps={{
                                                            type: "text",
                                                            maxLength: 200,
                                                            className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                                    <button
                                                        onClick={() => eliminarItem(index)}
                                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                                                    >
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-muted">
                                <button
                                    onClick={agregarItem}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                                >
                                    Agregar más
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium leading-none" htmlFor="observaciones">
                                Observaciones
                            </label>
                            <AutocompleteInput
                                index={items.length} // Usamos un índice fuera del rango de items
                                value={observaciones}
                                onChange={(newValue) => setObservaciones(newValue)}
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
                </form>
            </div>
        </div>
    );
};

export default RegisterTecPage2;
