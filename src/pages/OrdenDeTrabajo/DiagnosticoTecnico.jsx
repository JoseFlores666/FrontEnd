import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { diagnosticoSchema } from '../../schemas/AsignarTecnico.js';
import { useOrden } from "../../context/ordenDeTrabajoContext.jsx";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import "../../css/solicitud.css";
import "../../css/Animaciones.css";
import { AutocompleteInput } from "../../components/ui/AutocompleteInput.jsx";
import SubiendoImagenes from "../../components/ui/SubiendoImagenes.jsx";
import { Title, Label } from "../../components/ui/index.js";
import { EncabezadoFormulario } from "../../components/ui/Encabezado.jsx";
import scrollToTop from '../../util/Scroll.js';

export const DiagnosticoTecnico = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { traerHistorialOrden, historialOrden, traerUnaInfo, unaInfo, diagnosticoDelTecnico, editarEstadoInfo } = useOrden();

    const { register, handleSubmit, formState: { errors }, setValue, reset, setError, clearErrors } = useForm({
        resolver: zodResolver(diagnosticoSchema),
        defaultValues: {
            diagnostico: '',
        },
    });

    const [datosCargados, setDatosCargados] = useState(false);
    const [diagnostico, setDiagnostico] = useState('');
    const subiendoImagenesRef = useRef(null);
    const [recentSuggestions, setRecentSuggestions] = useState([]);
    const refs = useRef([]);

    useEffect(() => {
        const iniciarDatos = async () => {
            try {
                await traerUnaInfo(id);
                await traerHistorialOrden(id);
                if (unaInfo.informe?.solicitud?.diagnostico) {
                    setDiagnostico(unaInfo.informe?.solicitud?.diagnostico);
                }
            } catch (error) {
                console.error("Error al cargar los datos", error);
            }
        }
        if (!datosCargados) {
            iniciarDatos();
            setDatosCargados(true);
            scrollToTop();
        }
    }, [traerUnaInfo, traerHistorialOrden, datosCargados, unaInfo]);

    const onSubmit = async (flag, e) => {
        e.preventDefault();

        const hasFiles = subiendoImagenesRef.current ? subiendoImagenesRef.current.hasFiles() : false;

        if (diagnostico.trim() === "" && !hasFiles) {
            Swal.fire("Información incompleta", "Debe ingresar un diagnóstico y subir al menos una imagen como evidencia.", "warning");
            setError("diagnostico", { type: "manual", message: "Debe ingresar un diagnóstico o subir al menos una imagen como evidencia." });
            setError("images", { type: "manual", message: "Debe ingresar un diagnóstico o subir al menos una imagen como evidencia." });
            return;
        }
        // Verificar si hay archivos antes de continuar
        if (flag === false) {
            if (subiendoImagenesRef.current && !subiendoImagenesRef.current.hasFiles()) {
                Swal.fire("Evidencia requerida", "Incluya al menos una imagen como evidencia", "warning");
                setError("images", { type: "manual", message: "Debe subir al menos una imagen como evidencia." });
                return;
            }
        }

        // Validar diagnóstico
        if (diagnostico.trim() === "") {
            setError("diagnostico", { type: "manual", message: "El diagnóstico es requerido." });
            return;
        }

        try {
            const formData = new FormData();
            const files = subiendoImagenesRef.current.getFiles();

            if (files.length > 0) {
                files.forEach((file, index) => {
                    formData.append(`imagen-${index}`, file);
                });
            }

            formData.append('id', id);
            formData.append('diagnostico', diagnostico);
            formData.append('accion', flag ? 'continuar' : 'declinar');

            const res = await diagnosticoDelTecnico(id, formData);
            if (res && res.data?.mensaje) {
                clearForm();
                Swal.fire("Completado", res.data?.mensaje, "success").then(() => {
                    navigate('/tecnico/orden');
                });
            } else {
                Swal.fire("Error", res?.data?.error || "Error desconocido", "error");
            }
        } catch (error) {
            console.error("Error al crear solicitud:", error);
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
            <form onSubmit={handleSubmit((data, e) => onSubmit(true, e))} className="w-full max-w-6xl">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <Title showBackButton={true}>Diagnóstico y Evaluación de Servicios</Title>
                    <EncabezadoFormulario unaInfo={unaInfo} />
                    <div className="bg-slate-200 rounded p-2 mb-4">
                        <Label>Diagnostico del servicio requerido</Label>
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
                                onBlur: () => {
                                    setValue("diagnostico", diagnostico, { shouldValidate: true });
                                    clearErrors("diagnostico");
                                }
                            }}
                        />
                        {errors.diagnostico && <div className="text-red-500">{errors.diagnostico.message}</div>}
                    </div>

                    <SubiendoImagenes ref={subiendoImagenesRef} />
                    {errors.images && <div className="text-red-500">{errors.images.message}</div>}

                    <div className="flex gap-2 justify-center mt-4">
                        <Link
                            to={`/tecnico/orden`}
                            onClick={(e) => onSubmit(false, e)}
                            className="px-4 py-2 text-white border bg-red-500 border-black rounded-md hover:bg-red-700"
                        >
                            Declinar
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-black bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                        >
                            Continuar Proceso
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
