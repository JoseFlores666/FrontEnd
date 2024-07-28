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

            reset();
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    }

    return (
        <div className="flex items-center justify-center mx-auto max-w-7xl p-4 text-black">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-5xl">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold">Información De La Orden</h1>
                        <p>Rellene los Detalles Del Trabajo A Realizar</p>
                    </div>
                    <label className="block text-sm font-bold mb-1">Descripción:</label>
                    <p className='mb-4'>En esta area se solicita esto </p>

                    {errors.observaciones && (
                        <span className="text-red-500">{errors.observaciones.message}</span>
                    )}

                    <label className="block text-sm font-bold mb-1">Técnico Encargado:</label>
                    <p className='mb-4'>Eduardo Hernandez Hernandez</p>

                    {errors.tecnico && (
                        <span className="text-red-500">{errors.tecnico.message}</span>
                    )}

                    <div>
                        <label className="block text-sm font-bold mb-1">Observaciones del servicio requerido</label>
                        <AutocompleteInput
                            index={3}
                            //   value={descripcion}
                            //   onChange={(newValue) => setDescripcion(newValue)}
                            data={historialOrden}
                            recentSuggestions={recentSuggestions}
                            setRecentSuggestions={setRecentSuggestions}
                            inputRefs={refs}
                            placeholder="Ingrese una descripción"
                            fieldsToCheck={['descripcionDelServicio']}
                            inputProps={{
                                type: "text",
                                maxLength: 500,
                                className: "w-full mb-2 resize-none text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                            }}
                        />
                        <input name="descripcion" id="descripcion" type="hidden" />
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
