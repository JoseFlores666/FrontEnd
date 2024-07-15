import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from "../context/SolicitudContext";
import { useParams } from "react-router-dom";
import AutocompleteInput from '../components/ui/AutocompleteTextArea';

export const RegisterTecPage2 = () => {

    const { id } = useParams();
    const [fechaAtencion, setFechaAtencion] = useState("");
    const { historialOrden, traeHistorialOrden, createDEPInforme } = useSoli();
    const [items, setItems] = useState([{ cantidad: "", descripcion: "", historial: [] }]);
    const [recentSuggestions, setRecentSuggestions] = useState([]);
    const descripcionRefs = useRef([]);

    const { register, handleSubmit, setValue, formState: { isValid } } = useForm({ mode: 'onTouched' });

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

    const handleDescripcionChange = (index, value) => {
        const newItems = [...items];
        newItems[index].descripcion = value;
        setItems(newItems);
    };

    const onSubmit = (data) => {
        const formData = {
            fechaAtencion: fechaAtencion,
            items: items.map(item => ({ cantidad: item.cantidad, descripcion: item.descripcion })),
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
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].cantidad = e.target.value;
                                            setItems(newItems);
                                        }}
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción del bien solicitado:
                                    </label>
                                    <AutocompleteInput
                                        index={index}
                                        value={item.descripcion}
                                        onChange={(value) => handleDescripcionChange(index, value)}
                                        data={historialOrden}
                                        recentSuggestions={recentSuggestions}
                                        setRecentSuggestions={setRecentSuggestions}
                                        descripcionRefs={descripcionRefs}
                                        inputProps={register(`items[${index}].descripcion`)}
                                        placeholder="Ingrese una descripción"
                                    />
                                </div>
                                <div className="col-span-1 flex items-end">
                                    <button
                                        onClick={(e) => eliminarItem(index, e)}
                                        className="p-2 border border-transparent rounded-md shadow-sm bg-red-600 text-white hover:bg-red-700"
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </div>
                                <div className="col-span-1 flex items-end">
                                    <button
                                        onClick={(e) => duplicarItem(index, e)}
                                        className="p-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        <FontAwesomeIcon icon={faClone} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="col-span-12">
                            <button
                                onClick={agregarItem}
                                className="p-2 border border-transparent rounded-md shadow-sm bg-green-600 text-white hover:bg-green-700"
                            >
                                Agregar otro Item
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones
                    </label>
                    <textarea
                        id="obs"
                        name="obs"
                        placeholder="Escriba aquí las observaciones"
                        className="w-full p-3 text-black border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4"
                        {...register("obs")}
                    />
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    );
};
