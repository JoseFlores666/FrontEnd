import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from "../context/SolicitudContext";

export const RegisterTecPage2 = () => {
    const [fechaAtencion, setFechaAtencion] = useState("");
    const { historialOrden, traeHistorialOrden } = useSoli();
    const [items, setItems] = useState([{ cantidad: "", descripcion: "", historial: [] }]);
    const [showHistorial, setShowHistorial] = useState(null);
    const [filteredWords, setFilteredWords] = useState([]);
    const descripcionRefs = useRef([]);
    const [recentSuggestions, setRecentSuggestions] = useState([]);
    const [selectedWord, setSelectedWord] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isValid },
    } = useForm({ mode: 'onTouched' });

    useEffect(() => {
        traeHistorialOrden();
    }, []);

    const eliminarItem = (index, e) => {
        e.preventDefault();
        setItems(items.filter((_, i) => i !== index));
    };

    const handleClickOutside = (event) => {
        if (
            descripcionRefs.current.every((ref, idx) => ref && !ref.contains(event.target)) &&
            !event.target.classList.contains('text-sm') &&
            !event.target.classList.contains('cursor-pointer') &&
            !event.target.classList.contains('hover:text-blue-500')
        ) {
            setShowHistorial(null);
        }
    };


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleHistorial = (index) => {
        setShowHistorial(showHistorial === index ? null : index);
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

    const handleSelectWord = (index, selectedWord) => {
        const newItems = [...items];
        newItems[index].descripcion = newItems[index].descripcion.replace(/\S+$/, selectedWord);
        setItems(newItems);
        setValue(`items[${index}].descripcion`, newItems[index].descripcion);

        setShowHistorial(null);

        // Agregar la palabra seleccionada a las sugerencias recientes
        if (!recentSuggestions.includes(selectedWord)) {
            if (recentSuggestions.length >= 5) {
                // Si ya hay 5 sugerencias recientes, eliminar la más antigua (la primera)
                setRecentSuggestions([...recentSuggestions.slice(1), selectedWord]);
            } else {
                // Si hay menos de 5 sugerencias, agregar la nueva sugerencia
                setRecentSuggestions([...recentSuggestions, selectedWord]);
            }
        }

        setTimeout(() => {
            descripcionRefs.current[index].focus();
        }, 0);
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Tab") {
            if (filteredWords.length > 0) {
                event.preventDefault();
                handleSelectWord(index, filteredWords[0]); // Autocompletar con la primera sugerencia
            }
            setShowHistorial(null); // Siempre ocultar historial al presionar Tab
        }
    };
    const handleSuggestionClick = (word) => {
        setDescripcion(selectedWord + ' ' + word);
        setSelectedWord(word); // Guardar la palabra seleccionada
        setFilteredWords([]); // Limpiar las sugerencias
    };

    const handleDescripcionChange = (index, value) => {
        const newItems = [...items];
        newItems[index].descripcion = value;
        setItems(newItems);

        if (value.trim() === "") {
            // Mostrar las primeras 5 palabras más comunes si no hay sugerencias recientes
            const allWords = historialOrden.flatMap(histItem =>
                histItem.informe.descripcionDelServicio.toLowerCase().split(' ')
            );
            const uniqueWords = [...new Set(allWords)];
            const suggestions = uniqueWords.slice(0, 5);
            setFilteredWords(suggestions);
            setShowHistorial(null); // Ocultar sugerencias si el campo está vacío
        } else {
            const words = value.toLowerCase().split(' ');
            const lastWord = words[words.length - 1];
            const allWords = historialOrden.flatMap(histItem =>
                histItem.informe.descripcionDelServicio.toLowerCase().split(' ')
            );
            const uniqueWords = [...new Set(allWords)];
            const suggestions = uniqueWords.filter(word => word.startsWith(lastWord));
            setFilteredWords(suggestions.slice(0, 5)); // Limitar a 5 sugerencias
            setShowHistorial(index); // Mostrar sugerencias cuando se escriba
        }
    };


    const onSubmit = (data) => {
        const formData = {
            fechaAtencion: fechaAtencion,
            items: items,
            obs: data.obs,
        };
        console.log(formData);
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
                                    <textarea
                                        name={`items[${index}].descripcion`}
                                        className="p-3 text-black w-full rounded-md resize-none border border-gray-400"
                                        placeholder="Ingrese la descripción"
                                        required
                                        value={item.descripcion}
                                        ref={(el) => (descripcionRefs.current[index] = el)}
                                        onClick={() => toggleHistorial(index)}
                                        onChange={(e) => handleDescripcionChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                    />

                                    {showHistorial === index && (
                                        <div
                                            className="absolute z-10 bg-white p-3 rounded-md border border-gray-300 shadow-lg mt-2 max-h-40 overflow-y-auto"
                                            style={{ width: descripcionRefs.current[index]?.offsetWidth }}
                                        >
                                            {item.descripcion.trim() === "" ? (
                                                <div className="text-sm text-gray-500 mt-1">Comienza a escribir para ver sugerencias.</div>
                                            ) : filteredWords.length > 0 && filteredWords.map((word, wordIndex) => (
    <div key={wordIndex} className="mb-2">
        <span
            className="text-sm cursor-pointer"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelectWord(index, word);
            }}
        >
            {word}
        </span>
    </div>
))}
                                            ) : (
                                                <div className="text-sm text-gray-500 mt-1">No hay sugerencias disponibles.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-3 flex flex-col items-center">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Acción:
                                    </label>
                                    <div className="space-x-5">
                                        <button className="text-red-500 hover:text-red-700" onClick={(e) => eliminarItem(index, e)}>
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                        <button className="text-blue-500 hover:text-blue-700" onClick={(e) => duplicarItem(index, e)}>
                                            <FontAwesomeIcon icon={faClone} />
                                        </button>
                                    </div>
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
                    <textarea
                        className="p-3 text-black w-full rounded-md resize-none border border-gray-400"
                        id="obs"
                        required
                        name="obs"
                        {...register("obs")}
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
            </form >
        </div >
    );
};