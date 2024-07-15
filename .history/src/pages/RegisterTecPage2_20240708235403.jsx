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
        // Implementa la lógica para manejar el clic en una sugerencia
        const newItems = [...items];
        const index = newItems.findIndex(item => item.descripcion === selectedWord);
        if (index !== -1) {
            newItems[index].descripcion = word;
            setItems(newItems);
            setValue(`items[${index}].descripcion`, word);
        }

        setShowHistorial(null);

        // Actualiza las sugerencias recientes
        if (!recentSuggestions.includes(word)) {
            if (recentSuggestions.length >= 5) {
                setRecentSuggestions([...recentSuggestions.slice(1), word]);
            } else {
                setRecentSuggestions([...recentSuggestions, word]);
            }
        }
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
                                    <label className="block text-sm font-medium mb-1">
                                        Descripción:
                                    </label>
                                    <input
                                        type="text"
                                        id={`items[${index}][descripcion]`}
                                        name={`items[${index}][descripcion]`}
                                        placeholder="Ingrese una descripción"
                                        className="w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        value={item.descripcion}
                                        ref={el => descripcionRefs.current[index] = el}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onChange={(e) => handleDescripcionChange(index, e.target.value)}
                                    />
                                    {showHistorial === index && (
                                        <div className="absolute mt-2 bg-white w-full rounded-md shadow-lg z-10">
                                            <ul>
                                                {filteredWords.map((word, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="cursor-pointer text-sm hover:bg-gray-100 p-2"
                                                        onClick={() => handleSuggestionClick(word)}
                                                    >
                                                        {word}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-3 flex justify-center items-end">
                                    <button
                                        type="button"
                                        className="focus:outline-none text-gray-500 hover:text-green-500"
                                        onClick={(e) => duplicarItem(index, e)}
                                    >
                                        <FontAwesomeIcon icon={faClone} />
                                    </button>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            className="focus:outline-none ml-2 text-gray-500 hover:text-red-500"
                                            onClick={(e) => eliminarItem(index, e)}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mb-8">
                        <button
                            type="button"
                            className="bg-gray-300 p-2 rounded-lg mr-2"
                            onClick={agregarItem}
                        >
                            Agregar Item
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-green-500 p-3 rounded-lg text-white text-sm focus:outline-none focus:bg-green-600"
                            disabled={!isValid}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
