import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from "../context/SolicitudContext";
import { useParams } from "react-router-dom";
import { AutocompleteInput } from "../components/ui/AutocompleteInput"; // Asegúrate de ajustar la ruta según tu estructura de archivos

export const RegisterTecPage2 = () => {
    const { id } = useParams();
    const [fechaAtencion, setFechaAtencion] = useState("");
    const { historialOrden, traeHistorialOrden, createDEPInforme } = useSoli();
    const [items, setItems] = useState([{ cantidad: "", descripcion: "", historial: [] }]);
    const descripcionRefs = useRef([]);
    const [recentSuggestions, setRecentSuggestions] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isValid },
    } = useForm({ mode: 'onTouched' });

    useEffect(() => {
        traeHistorialOrden();
        console.log(historialOrden)
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

    const handleInputChange = (index, value, field) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
        setValue(`items[${index}][${field}]`, value);
    };

    const onSubmit = (data) => {
        const cleanedItems = items.map(({ historial, ...rest }) => rest);

        const formData = {
            fechaAtencion: fechaAtencion,
            items: cleanedItems,
            obs: data.obs,
        };
        console.log(formData);
        createDEPInforme(id, formData);
    };

    return (
        <div className="mx-auto max-w-6xl p-4 text-black">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="flex items-center justify-center mb-6 w-full h-11 mb-6 bg-green-500 p-3 rounded-md text-white">
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
                                    <label className="block text-sm font-medium mb-1">
                                        Cantidad:
                                    </label>
                                    <input
                                        type="number"
                                        id={`items[${index}][cantidad]`}
                                        name={`items[${index}][cantidad]`}
                                        placeholder="Ingrese una cantidad"
                                        className="w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        value={item.cantidad}
                                        required
                                        onChange={(e) => handleInputChange(index, e.target.value, "cantidad")}
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
                                        data={historialOrden}
                                        recentSuggestions={recentSuggestions}
                                        setRecentSuggestions={setRecentSuggestions}
                                        refs={descripcionRefs}
                                        placeholder="Ingrese una descripción"
                                        extractWordsFromItem={(item) => item?.informe?.descripcionDelServicio || ''}
                                        inputProps={{
                                            type: "text",
                                            maxLength: 200,
                                            className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500", // Añade las clases necesarias para los estilos
                                        }}
                                    />
                                </div>
                                <div className="col-span-2 flex items-center space-x-2">
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
                        value={item.descripcion}
                        onChange={(value) => handleInputChange(index, value, "justificacion")}
                        data={historialOrden}
                        recentSuggestions={recentSuggestions}
                        setRecentSuggestions={setRecentSuggestions}
                        refs={descripcionRefs}
                        placeholder="Ingrese una justificación"
                        extractWordsFromItem={(item) => item?.solicitud?.Observacionestecnicas || ''}
                        inputProps={{
                            type: "text",
                            maxLength: 200,
                            className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500", // Añade las clases necesarias para los estilos
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
