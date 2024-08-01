import React, { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useParams } from 'react-router-dom';
import { useSoli } from '../context/SolicitudContext';
import { asignarTecnicoSchema } from '../schemas/AsignarTecnico.js'
import { zodResolver } from '@hookform/resolvers/zod';
import { ImFileEmpty } from "react-icons/im";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Title, Label, GridContainer } from '../components/ui';
//Primer Formulario Orden

export default function AsignarTecnico() {

    const { id } = useParams();
    const { historialOrden, traeHistorialOrden, evaluarInfor, traerTecnicos, tecnicos, editarEstadoInfo, traeUnaInfo, unaInfo } = useSoli();
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm(
        // {
        // resolver: zodResolver(asignarTecnicoSchema),
        // }
    );

    const [datosCargados, setDatosCargados] = useState(false);
    const [observaciones, setObservaciones] = useState('');

    useEffect(() => {
        const iniciarDatos = async () => {
            try {
                await traerTecnicos();
                await traeUnaInfo(id);
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

    const onSubmit = async (data, e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append('id', id);
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
        <div className="flex items-center justify-center mx-auto max-w-7xl p-4 text-black" style={{ height: '90vh' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-6xl">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <Title>Asignar tecnico</Title>
                    <GridContainer>
                        <div>
                            <Label>Folio: </Label>
                            <p className="w-full rounded-md">{unaInfo.folio}</p>

                        </div>
                        <div>
                            <Label>Solicita:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.nombre}</p>
                        </div>
                        <div>
                            <Label>Área solicitante:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.areaSolicitante}</p>
                        </div>
                    </GridContainer>

                    <GridContainer>
                        <div>
                            <Label>Fecha:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.fecha}</p>
                        </div>
                        <div>
                            <Label>Tipo de Mantenimiento:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeMantenimiento}</p>
                        </div>
                        <div>
                            <Label>Tipo de Trabajo:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeTrabajo}</p>
                        </div>
                    </GridContainer>

                    <GridContainer>
                        <div>
                            <Label>Tipo de Solicitud:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeSolicitud}</p>
                        </div>
                        <div>
                            <Label>Edificio:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.edificio}</p>
                        </div>
                    </GridContainer>
                    
                    <Label>Descripción:</Label>
                    <div className="mb-8 flex items-center">
                        <p>{unaInfo.informe?.descripcionDelServicio}</p>
                    </div>

                    <Label>Encargado de la actividad:</Label>
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


                    <div className="flex gap-2 justify-center mt-4">
                        <Link
                            to={`/tecnico/orden`}
                            // onClick={declinar}
                            className="px-4 py-2 text-white border bg-red-500 border-black rounded-md hover:bg-red-700"
                        >
                            Cancelar
                        </Link>
                        <button type='submit' className="px-4 py-2 border border-black bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Guardar Cambios</button>
                    </div>
                </div>
            </form>
        </div>

    );
}
