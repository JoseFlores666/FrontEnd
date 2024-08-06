import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams,useNavigate  } from "react-router-dom";
import { asignarTecnicoSchema } from '../schemas/AsignarTecnico.js'
import { useOrden } from "../context/ordenDeTrabajoContext";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import "../css/solicitud.css";
import "../css/Animaciones.css";
import { Link } from "react-router-dom";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import SubiendoImagenes from "../components/ui/SubiendoImagenes"
import { Title, Label, GridContainer } from "../components/ui";
import { EncabezadoFormulario } from "../components/ui/Encabezado.jsx";

export const InformacionOrden = () => {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const { traerHistorialOrden, traerEncabezado, encabezado, historialOrden,
        traerUnaInfo, unaInfo, diagnosticoDelTecnico, editarEstadoInfo, } = useOrden();


    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm(
        //     {
        //     resolver: zodResolver(asignarTecnicoSchema),
        // }
    );
    const [datosCargados, setDatosCargados] = useState(false);
    const [diagnostico, setDiagnostico] = useState('');
    const subiendoImagenesRef = useRef(null);
    const [recentSuggestions, setRecentSuggestions] = useState([]);
    const refs = useRef([]);
    useEffect(() => {
        const iniciarDatos = async () => {
            try {
                await await traerUnaInfo(id);

                await await traerHistorialOrden(id);
            } catch (error) {
                console.error("Error al cargar los datos", error);
            }
        }
        if (!datosCargados) {
            iniciarDatos();

            setDatosCargados(true);
        }
    }, [traerUnaInfo, traerHistorialOrden, datosCargados]);


    const onSubmit = async (flag, e) => {
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
            formData.append('diagnostico', diagnostico);
            formData.append('accion', flag ? 'continuar' : 'declinar');

            const res = await diagnosticoDelTecnico(id, formData);
            if (res && res.data?.mensaje) {
                Swal.fire("Completado", res.data?.mensaje, "success");
                clearForm();
                navigate('/tecnico/orden'); 
            } else {
                Swal.fire("Error", res?.data?.error || "Error desconocido", "error");
            }
        } catch (error) {
            console.error("Error al crear solicitud:", error);
            console.log(error)
            Swal.fire("Error", error?.response?.data?.mensaje || "Error desconocido", "error");
        }
    }
    const clearForm = () => {
        reset();

        // Limpia los archivos en SubiendoImagenes
        if (subiendoImagenesRef.current) {
            subiendoImagenesRef.current.clearFiles();
        }

    }

    return (
        <div className="flex items-center justify-center mx-auto max-w-7xl p-4 text-black">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-6xl">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <Title>Informacion del encargo</Title>
                    {/* <GridContainer>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Fecha:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.fecha}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Solicita:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.nombre}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Folio: </Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.folio}</p>
                        </div>
                    </GridContainer>
                    <GridContainer>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Tipo de Solicitud:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeSolicitud}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Tipo de Mantenimiento:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeMantenimiento}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Tipo de Trabajo:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.tipoDeTrabajo}</p>
                        </div>
                    </GridContainer>
                    <GridContainer>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Área solicitante:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.areaSolicitante}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Edificio:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.edificio}</p>
                        </div>
                    </GridContainer>
                    <div className="bg-slate-200 rounded p-2 mb-4">
                        <Label>Descripción:</Label>
                        <p>{unaInfo.informe?.descripcion}</p>
                    </div>
                    <div className="bg-slate-200 rounded p-2 mb-4 text-center">
                        <Label>Técnico Encargado:</Label>
                        {unaInfo.informe?.solicitud?.tecnicos ? (
                            <p>{unaInfo.informe?.solicitud?.tecnicos?.nombreCompleto}</p>
                        ) : (
                            <p>No asignado</p>
                        )}
                        {errors.tecnicos && (
                            <span className="text-red-500">{errors.tecnicos.message}</span>
                        )}
                    </div> */}
                      <EncabezadoFormulario unaInfo={unaInfo} />
                    <div className="bg-slate-200 rounded p-2 mb-4">
                        <Label>Observaciones del servicio requerido</Label>
                        <AutocompleteInput
                            index={3}
                            value={diagnostico}
                            onChange={(newValue) => setDiagnostico(newValue)}
                            data={historialOrden}
                            recentSuggestions={recentSuggestions}
                            setRecentSuggestions={setRecentSuggestions}
                            inputRefs={refs}
                            placeholder="Ingrese sus observaciones"
                            fieldsToCheck={['diagnostico']}
                            inputProps={{
                                type: "text",
                                maxLength: 500,
                                className: "w-full resize-none text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                            }}
                        />

                    </div>

                    <SubiendoImagenes ref={subiendoImagenesRef} />

                    <div className="flex gap-2 justify-center mt-4">
                        <Link
                            to={`/tecnico/orden`}
                            onClick={(e) => onSubmit(false, e)}
                            className="px-4 py-2 text-white border bg-red-500 border-black rounded-md hover:bg-red-700"
                        >
                            Declinar
                        </Link>
                        <button onClick={(e) => onSubmit(true, e)} className="px-4 py-2 border border-black bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Continuar Proceso</button>
                    </div>
                </div>
            </form>
        </div>
    );
};
