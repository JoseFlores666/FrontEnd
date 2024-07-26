import React, { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import SubiendoImagenes from '../components/ui/SubiendoImagenes';
import { Link, useParams } from 'react-router-dom';
import { useSoli } from '../context/SolicitudContext';
import { asignarTecnicoSchema } from '../schemas/AsignarTecnico.js'
import { zodResolver } from '@hookform/resolvers/zod';
import { ImFileEmpty } from "react-icons/im";
import Swal from "sweetalert2";

export default function AsignarTecnico() {

    const { id } = useParams();
    const { historialOrden, traeHistorialOrden, evaluarInfor, traerTecnicos, tecnicos, editarEstadoInfo } = useSoli();
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
        resolver: zodResolver(asignarTecnicoSchema),
    });

    const [datosCargados, setDatosCargados] = useState(false);
    const [observaciones, setObservaciones] = useState('');
    const subiendoImagenesRef = useRef(null);
    const [recentSuggestions, setRecentSuggestions] = useState([]);
    const refs = useRef([]);

    useEffect(() => {
        const iniciarDatos = async () => {
            try {
                await traerTecnicos();
            } catch (error) {
                console.error("Error al cargar los datos", error);
            }
        }
        if (!datosCargados) {
            iniciarDatos();
            llenarDatos();
        }
    }, [traerTecnicos, datosCargados]);

    const llenarDatos = () => {
        if (tecnicos.length > 0) {
            console.log(tecnicos);
            setDatosCargados(true);
        }
    };
    const declinar = async () => {
        try {
            const res = await editarEstadoInfo(id)

            if (res) {
                Swal.fire({
                    title: "Completado!",
                    text: res.mensaje,
                    icon: "success",
                    confirmButtonText: "Cool",
                });
            } else {
                Swal.fire("Error", "Error, el informe ya ha sido asignado a un técnico", "error");
            }
        } catch (error) {
            console.error("Error al intentar declinar el informe", error)
        }
    };

    const onSubmit = async (data, e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            const files = subiendoImagenesRef.current.getFiles();

            // Solo añade imágenes si hay alguna
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    formData.append(`imagen-${i}`, files[i]);
                    console.log(`imagen - ${i}`, files[i]);
                }
            }

            formData.append('id', id);
            formData.append('observaciones', observaciones);
            formData.append('idTecnico', data.tecnico);

            await evaluarInfor(id, formData);

            Swal.fire({
                title: "Completado!",
                text: "Registro Exitoso",
                icon: "success",
                confirmButtonText: "Cool",
            });

            reset(); // Reset the form after successful submission
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    }

    if (!datosCargados) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center mt-50 text-cool-gray-50 font-bold">
                    <div className="mb-4">Cargando...</div>
                    <ImFileEmpty className="animate-spin text-purple-50-500 text-6xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl p-4 text-black bg-white rounded-md shadow-md mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="slide-down">
                <div className="p-6">
                    <div className="text-center mb-4">
                        <h1 className="text-2xl text-black font-bold">Asignar Técnico</h1>
                        <p>Rellene los detalles a continuación.</p>
                    </div>

                    <div className="relative w-full">
                        <table className="w-full caption-bottom text-sm border">
                            <thead className="[&_tr]:border border-gray-400">
                                <tr className="border transition-colors hover:bg-gray-100 border-b border-gray-400 hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                                    <th className="h-12 text-center px-4 hover:bg-gray-100 border-b border-gray-400 align-middle font-medium text-black border-gray-400">
                                        Descripción
                                    </th>
                                    <th className="h-12 text-center px-4 align-middle font-medium text-black border-gray-400">
                                        Técnico
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0 border-b border-gray-400">
                                <tr className="hover:bg-gray-100 border-b border-gray-400">
                                    <td className="align-middle border border-gray-400 p-3">
                                        <AutocompleteInput
                                            value={observaciones}
                                            onChange={(newValue) => setObservaciones(newValue)}
                                            data={historialOrden}
                                            recentSuggestions={recentSuggestions}
                                            setRecentSuggestions={setRecentSuggestions}
                                            inputRefs={refs}
                                            placeholder="Ingrese sus Observaciones"
                                            fieldsToCheck={['Observacionestecnicas']}
                                            inputProps={{
                                                type: "text",
                                                maxLength: 500,
                                                className: "w-full resize-none text-black p-3 border border-gray-400 bg-gray-50 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                                                onBlur: () => setValue("observaciones", observaciones, { shouldValidate: true })
                                            }}
                                        />
                                        {errors.observaciones && (
                                            <span className="text-red-500">{errors.observaciones.message}</span>
                                        )}
                                    </td>
                                    <td className="align-middle border border-gray-400 p-3">
                                        <select
                                            {...register("tecnico", { required: "Seleccionar un técnico es requerido" })}
                                            className="w-full p-3 border border-gray-400 bg-gray-50 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                                            <option value="">Selecciona un Técnico</option>
                                            {tecnicos.map(tecnico => (
                                                <option key={tecnico._id} value={tecnico._id}>
                                                    {tecnico.nombreCompleto} - {tecnico.correo}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.tecnico && (
                                            <span className="text-red-500">{errors.tecnico.message}</span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-center">
                        <SubiendoImagenes ref={subiendoImagenesRef} />
                    </div>
                    <div className="flex gap-2 justify-end mt-4">
                        <Link
                            to={`/tecnico/orden`}
                            onClick={declinar}
                            className="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100"
                        >Declinar
                        </Link>
                        <button type='submit' className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Continuar Proceso</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
