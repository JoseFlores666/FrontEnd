// En el componente InformacionOrden.jsx

import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { asignarTecnicoSchema } from '../schemas/AsignarTecnico.js'
import { useSoli } from "../context/SolicitudContext";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import "../css/solicitud.css";
import "../css/Animaciones.css";
import { Link } from "react-router-dom";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import SubiendoImagenes from "../components/ui/SubiendoImagenes"

//Segundo formulario Orden

export const InformacionOrden = () => {
    const { id } = useParams();
    const { historialOrden, traeHistorialOrden, ObservacionesDelTenico, traerEncabezado, encabezado, editarEstadoInfo, traeUnaInfo, unaInfo } = useSoli();
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm(
        //     {
        //     resolver: zodResolver(asignarTecnicoSchema),
        // }
    );

    const [datosCargados, setDatosCargados] = useState(false);
    const [observaciones, setObservaciones] = useState('');
    const subiendoImagenesRef = useRef(null);
    const [recentSuggestions, setRecentSuggestions] = useState([]);
    const refs = useRef([]);

    useEffect(() => {
        const iniciarDatos = async () => {
            try {
                await await traeUnaInfo(id);
                await await traerEncabezado(id);
                console.log(unaInfo)
                console.log(encabezado)
            } catch (error) {
                console.error("Error al cargar los datos", error);
            }
        }
        if (!datosCargados) {
            iniciarDatos();

            setDatosCargados(true);
        }
    }, [traerEncabezado, traeUnaInfo, datosCargados]);



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

            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    formData.append(`imagen-${i}`, files[i]);
                    console.log(`imagen - ${i}`, files[i]);
                }
            }

            formData.append('id', id);
            formData.append('observaciones', observaciones);


            const res = await ObservacionesDelTenico(id, formData);
            if (res) {
                Swal.fire({
                    title: "Completado!",
                    text: "Registro Exitoso",
                    icon: "success",
                    confirmButtonText: "Cool",
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Error en el servidor",
                    icon: "error",
                    confirmButtonText: "Cool",
                });
            }

            reset();
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    }

    return (
        <div className="flex items-center justify-center mx-auto max-w-7xl p-4 text-black">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-6xl">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold">Asignar Técnico</h1>
                        <p>Rellene los detalles a continuación.</p>
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


                    <div>
                        <label className="block text-sm font-bold mb-1">Observaciones del servicio requerido</label>
                        <AutocompleteInput
                            index={3}
                            value={observaciones}
                            onChange={(newValue) => setObservaciones(newValue)}
                            data={historialOrden}
                            recentSuggestions={recentSuggestions}
                            setRecentSuggestions={setRecentSuggestions}
                            inputRefs={refs}
                            placeholder="Ingrese sus observaciones"
                            fieldsToCheck={['descripcionDelServicio']}
                            inputProps={{
                                type: "text",
                                maxLength: 500,
                                className: "w-full mb-2 resize-none text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                            }}
                        />
                    </div>

                    <div>
                        <SubiendoImagenes ref={subiendoImagenesRef} />
                    </div>

                    <div className="flex gap-2 justify-center mt-4">
                        <Link
                            to={`/tecnico/orden`}
                            onClick={declinar}
                            className="px-4 py-2 text-white border bg-red-500 border-black rounded-md hover:bg-red-700"
                        >
                            Declinar
                        </Link>
                        <button type='submit' className="px-4 py-2 border border-black bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Continuar Proceso</button>
                    </div>
                </div>
            </form>
        </div>
    );
};
