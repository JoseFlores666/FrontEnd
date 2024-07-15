import React, { useRef, useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from "../context/SolicitudContext";

export const RegisterTecPage2 = () => {
    const [fechaAtencion, setFechaAtencion] = useState("");
    const { historialOrden, traeHistorialOrden } = useSoli(); // Obtienes historialOrden y traeHistorialOrden desde el contexto
    const [showHistorial, setShowHistorial] = useState(null);
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            items: [{ cantidad: "", descripcion: "", historial: [] }]
        }
    });
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const descripcionRefs = useRef([]);

    useEffect(() => {
        traeHistorialOrden(); // Cargas los datos iniciales del historial al montar el componente
    }, []);

    const handleClickOutside = (event) => {
        if (descripcionRefs.current.every((ref) => ref && !ref.contains(event.target))) {
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

    const handleSelectHistorial = (index, selectedText) => {
        setValue(`items[${index}].descripcion`, selectedText);
        setShowHistorial(null); // Cerrar el historial seleccionado
    };

    const onSubmit = (data) => {
        const formData = {
            fechaAtencion: fechaAtencion,
            items: data.items,
            obs: data.obs,
        };

        console.log(formData); // Aquí puedes enviar formData a tu backend o hacer cualquier otra operación con él
    };

    const agregarItem = () => {
        if (fields.length < 4) {
            append({ cantidad: "", descripcion: "", historial: [] });
        } else {
            alert("No se pueden agregar más de 4 items.");
        }
    };

    return (
        <div className="mx-auto max-w-6xl p-4 text-black">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="flex items-center justify-center mb-6 w-full h-11mb-6 bg-green-500 p-3 rounded-md text-white">
                        <label className="text-2xl font-bold text-white text-center">Llenado Exclusivo para el DEP MSG:</label>
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
                            onChange={(e) => setFechaAtencion(e.target.value)}
                            required
                        />
                    </div>

                    <div className="bg-white p-6 text-black">
                        {fields.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-12 gap-6 mb-4">
                                <div className="col-span-3">
                                    <label className="block text-sm font-medium mb-1">Cantidad:</label>
                                    <input
                                        type="number"
                                        {...register(`items[${index}].cantidad`, { required: true })}
                                        className="w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        defaultValue={item.cantidad}
                                    />
                                    {errors.items && errors.items[index] && errors.items[index].cantidad && (
                                        <span className="text-red-500">Este campo es requerido.</span>
                                    )}
                                </div>
                                <div className="col-span-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción del bien solicitado:
                                    </label>
                                    <textarea
                                        {...register(`items[${index}].descripcion`, { required: true })}
                                        className="p-3 text-black w-full rounded-md resize-none border border-gray-400"
                                        defaultValue={item.descripcion}
                                        ref={(el) => (descripcionRefs.current[index] = el)}
                                        onClick={() => toggleHistorial(index)}
                                    />
                                    {showHistorial === index && (
                                        <div
                                            className="absolute z-10 bg-white p-3 rounded-md border border-gray-300 shadow-lg mt-2 max-h-40 overflow-y-auto"
                                            style={{ width: descripcionRefs.current[index]?.offsetWidth }}
                                        >
                                            {historialOrden.map((histItem, histIndex) => (
                                                <div key={histIndex} className="mb-2">
                                                    <span
                                                        className="text-sm cursor-pointer"
                                                        onClick={() => handleSelectHistorial(index, histItem.informe.descripcionDelServicio)}
                                                    >
                                                        {histItem.informe.descripcionDelServicio}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-3 flex flex-col items-center">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Acción:</label>
                                    <div className="space-x-5">
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => remove(index)}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                        <button
                                            type="button"
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => append({ ...item })}
                                        >
                                            <FontAwesomeIcon icon={faClone} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
                                onClick={agregarItem}
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
                        {...register("obs", { required: true })}
                        className="p-3 text-black w-full rounded-md resize-none border border-gray-400"
                    />
                    {errors.obs && <span className="text-red-500">Este campo es requerido.</span>}
                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 px-6 py-3 rounded-md border border-black"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
