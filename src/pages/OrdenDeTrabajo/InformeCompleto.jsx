import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/solicitud.css";
import { GridContainer, Label, LlenarOrden, Title } from "../../components/ui";
import { useOrden } from "../../context/ordenDeTrabajoContext";
import { useSoli } from "../../context/SolicitudContext";
import { AutocompleteInput } from "../../components/ui/AutocompleteInput";
import { ImFileEmpty } from "react-icons/im";
import Swal from "sweetalert2";

export const InformeCompleto = () => {
    const { id } = useParams();
    const { traerUnaInfo, unaInfo, traerHistorialOrden, historialOrden, asignarPersonalDEPMSG } = useOrden();
    const [datosCargados, setDatosCargados] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [clickedPDF, setClickedPDF] = useState(false);
    const { getFirmas, nombresFirmas } = useSoli();
    const [personalDEP, setPersonalDEP] = useState("");
    const [firmas, setFirmas] = useState({ solicitud: "", jefeInmediato: "", direccion: "", autorizo: "" });
    const [recentSuggestions, setRecentSuggestions] = useState([]);
    const navigate = useNavigate();
    const inputRef = useRef([]);


    const llenadoFirmas = () => {
        if (nombresFirmas.length > 0) {
            const { solicitud, revision, validacion, autorizacion } = nombresFirmas[0];
            setFirmas({ solicitud, jefeInmediato: revision, direccion: validacion, autorizo: autorizacion });
        }
    };

    const validarCampos = () => {
        if (!unaInfo?.informe?.fecha) {
            alert('El campo "Fecha" está vacío.');
            return false;
        }
        if (!unaInfo?.informe?.Solicita?.nombre) {
            alert('El campo "Solicita" está vacío.');
            return false;
        }
        if (!unaInfo?.informe.folio) {
            alert('El campo "Folio" está vacío.');
            return false;
        }
        if (!unaInfo?.informe?.tipoDeSolicitud) {
            alert('El campo "Tipo de Solicitud" está vacío.');
            return false;
        }
        if (!unaInfo?.informe?.tipoDeMantenimiento) {
            alert('El campo "Tipo de Mantenimiento" está vacío.');
            return false;
        }
        if (!unaInfo?.informe?.tipoDeTrabajo) {
            alert('El campo "Tipo de Trabajo" está vacío.');
            return false;
        }
        if (!unaInfo?.informe?.Solicita?.areaSolicitante) {
            alert('El campo "Área solicitante" está vacío.');
            return false;
        }
        if (!unaInfo?.informe?.Solicita?.edificio) {
            alert('El campo "Edificio" está vacío.');
            return false;
        }
        if (!unaInfo?.informe?.descripcion) {
            alert('El campo "Descripción del servicio" está vacío.');
            return false;
        }
        if (!unaInfo?.informe?.solicitud?.tecnicos?.nombreCompleto) {
            alert('El campo "Técnico Encargado" está vacío.');
            return false;
        }
        if (!unaInfo?.informe?.solicitud?.fechaAtencion) {
            alert('El campo "Fecha de atención" está vacío.');
            return false;
        }
        if (!unaInfo?.informe?.solicitud?.diagnostico) {
            alert('El campo "Observaciones técnicas" está vacío.');
            return false;
        }

        return true;
    };
    const handleDownloadClick = (event) => {
        event.preventDefault();
        if (validarCampos()) {
            RegistrarNombrePersonalDEPMSG()
            setIsOpen(true);
        }
    };


    const handleCloseModal = (event) => {
        event.preventDefault();
        setIsOpen(false);
    };


    useEffect(() => {
        const traerdatos = async () => {
            try {
                await traerUnaInfo(id);
                if (unaInfo?.informe?.solicitud?.personalDEPMSG) {
                    setPersonalDEP(unaInfo.informe.solicitud.personalDEPMSG);
                }

                await getFirmas();
                await traerHistorialOrden();

                llenadoFirmas()
                setDatosCargados(true);
            } catch (error) {
                console.error("Error al ejecutar la funcion traer datos", error);
            }
        };
        if (!datosCargados) {
            traerdatos();
            llenadoFirmas();
        }
    }, [datosCargados, traerUnaInfo, id, traerHistorialOrden, unaInfo,]);

    const hasInforme = unaInfo && unaInfo.informe;
    const hasSolicitud = unaInfo && unaInfo.informe?.solicitud;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
    
          const form = e.target.form;
          const index = Array.prototype.indexOf.call(form, e.target);
          form.elements[index + 1].focus();
        }
      };
    

    const RegistrarNombrePersonalDEPMSG = async () => {
        try {
            await asignarPersonalDEPMSG(id, personalDEP)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="mx-auto max-w-6xl p-4 text-black">
            <form onKeyDown={handleKeyDown}>
                {datosCargados && unaInfo ? (
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <Title showBackButton={true}>Informe Completo de Mantenimiento</Title>
                        <GridContainer>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Fecha:</Label>
                               <p className="w-full rounded-md">{hasInforme ? new Date(unaInfo.informe.fecha).toISOString().split('T')[0] : 'Fecha no disponible'}</p>
                            </div>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Solicita:</Label>
                                <p className="w-full rounded-md">{hasInforme && unaInfo.informe.Solicita ? unaInfo.informe.Solicita.nombre : 'Solicita no disponible'}</p>
                            </div>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Folio:</Label>
                                <p className="w-full rounded-md">{unaInfo.informe.folio || 'Folio no disponible'}</p>
                            </div>
                        </GridContainer>
                        <GridContainer>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Tipo de Solicitud:</Label>
                                <p className="w-full rounded-md">{hasInforme ? unaInfo.informe?.tipoDeSolicitud : 'Tipo de Solicitud no disponible'}</p>
                            </div>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Tipo de Mantenimiento:</Label>
                                <p className="w-full rounded-md">{hasInforme ? unaInfo.informe?.tipoDeMantenimiento : 'Tipo de Mantenimiento no disponible'}</p>
                            </div>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Tipo de Trabajo:</Label>
                                <p className="w-full rounded-md">{hasInforme ? unaInfo.informe?.tipoDeTrabajo : 'Tipo de Trabajo no disponible'}</p>
                            </div>
                        </GridContainer>
                        <GridContainer>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Área solicitante:</Label>
                                <p className="w-full rounded-md">{hasInforme && unaInfo.informe?.Solicita ? unaInfo.informe.Solicita.areaSolicitante : 'Área solicitante no disponible'}</p>
                            </div>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Edificio:</Label>
                                <p className="w-full rounded-md">{hasInforme && unaInfo.informe?.Solicita ? unaInfo.informe.Solicita.edificio : 'Edificio no disponible'}</p>
                            </div>
                        </GridContainer>
                        <div className="bg-slate-200 rounded p-2 mb-5">
                            <Label>Descripción del servicio:</Label>
                            <p className="w-full">{hasInforme ? unaInfo.informe.descripcion : 'Descripción no disponible'}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2 mb-5">
                            <Label>Técnico Encargado:</Label>
                            <p className="w-full">{hasInforme ? unaInfo.informe?.solicitud?.tecnicos?.nombreCompleto : 'Técnico no disponible'}</p>
                        </div>
                        {unaInfo.estado !== "Declinada" && hasSolicitud && (
                            <>
                                <h2 className="text-xl text-center mb-5 font-bold text-black">Solicitud</h2>
                                <GridContainer>
                                    <div className="bg-slate-200 rounded p-2">
                                        <Label>Fecha de atención:</Label>
                                        <p className="w-full rounded-md">{hasSolicitud && unaInfo.informe?.solicitud?.fechaAtencion ? new Date(unaInfo.informe?.solicitud?.fechaAtencion).toLocaleDateString() : 'Fecha de atención no disponible'}</p>
                                    </div>
                                    <div></div>
                                    <div className="bg-slate-200 rounded p-2">
                                        <Label>Estado:</Label>
                                        <p className="w-full rounded-md">{unaInfo.informe?.estado?.nombre || 'Estado no disponible'}</p>
                                    </div>
                                </GridContainer>
                                <div className="bg-slate-200 rounded p-2 mb-4">
                                    <div className="text-center">
                                        <Label>Insumos solicitados:</Label>
                                    </div>
                                    <ul className="list-disc pl-5">
                                        {hasSolicitud && unaInfo.informe?.solicitud?.material?.length > 0 ? (
                                            unaInfo.informe?.solicitud?.material?.map((mymaterial) => (
                                                <li key={mymaterial._id} className="grid grid-cols-3 gap-4">
                                                    <span>Cantidad: {mymaterial.cantidad}</span>
                                                    <span>Unidad: {mymaterial.unidad}</span> {/* Campo de unidad */}
                                                    <span>Material Entregado: {mymaterial.descripcion}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li>El material aun no ha sido entregado</li>
                                        )}
                                    </ul>
                                </div>


                                <div className="bg-slate-200 rounded p-2 mb-4">
                                    <Label>Observaciones técnicas:</Label>
                                    <p className="w-full rounded-md">{hasSolicitud ? unaInfo.informe?.solicitud?.diagnostico : 'Diagnóstico técnico no disponible'}</p>
                                </div>
                                <div className="grid grid-cols-2 text-center">
                                    <div className="grid grid-cols-2 text-center gap-4 mb-4">
                                        <div>
                                            <Label>Nombre del Personal del DEP MSG</Label>
                                            <AutocompleteInput
                                                index={0}
                                                value={personalDEP || ""}
                                                onChange={(newValue) => setPersonalDEP(newValue)}
                                                data={historialOrden}
                                                recentSuggestions={recentSuggestions}
                                                setRecentSuggestions={setRecentSuggestions}
                                                inputRefs={inputRef}
                                                placeholder="Ingrese el nombre del Personal del DEP MSG"
                                                fieldsToCheck={['personalDEPMSG']}
                                                ConvertirAInput={true}
                                                inputProps={{
                                                    type: "text",
                                                    maxLength: 500,
                                                    className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Nombre y Firma de Conformidad del Servicio
                                            (Directivo y/o Jefatura de Dep., y/o Responsable de Área)
                                        </Label>
                                        <p className="w-full rounded-md">{firmas.solicitud}</p>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="flex items-center justify-center">
                            <button
                                type="button"
                                onClick={handleDownloadClick}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
                            >
                                Descargar Archivo
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center  h-screen">
                        <div className="text-center mt-50 bg-slate-2000 font-bold  ">
                            <div className="mb-4 text-white">Cargando...</div>
                            <ImFileEmpty className="animate-spin text-purple-50-500 text-white text-6xl " />
                        </div>
                    </div>
                )}
                {isOpen && (
                    <div>
                        <LlenarOrden
                            fecha={hasInforme ? new Date(unaInfo.informe.fecha).toLocaleDateString() : 'Fecha no disponible'}
                            solicita={hasInforme && unaInfo.informe.Solicita ? unaInfo.informe.Solicita.nombre : 'Solicita no disponible'}
                            folio={unaInfo.informe.folio || 'Folio no disponible'}
                            tipoDeSolicitud={hasInforme ? unaInfo.informe?.tipoDeSolicitud : 'Tipo de Solicitud no disponible'}
                            tipoDeMantenimiento={hasInforme ? unaInfo.informe?.tipoDeMantenimiento : 'Tipo de Mantenimiento no disponible'}
                            tipoDeTrabajo={hasInforme ? unaInfo.informe?.tipoDeTrabajo : 'Tipo de Mantenimiento no disponible'}
                            areasoli={hasInforme && unaInfo.informe?.Solicita ? unaInfo.informe.Solicita.areaSolicitante : 'Área solicitante no disponible'}
                            edificio={hasInforme && unaInfo.informe?.Solicita ? unaInfo.informe.Solicita.edificio : 'Edificio no disponible'}
                            descripcionServicio={hasInforme ? unaInfo.informe.descripcion : 'Descripción no disponible'}
                            tecnicoEncargado={hasInforme ? unaInfo.informe?.solicitud?.tecnicos?.nombreCompleto : 'Técnico no disponible'}
                            fechaAtencion={hasSolicitud && unaInfo.informe?.solicitud?.fechaAtencion ? new Date(unaInfo.informe?.solicitud?.fechaAtencion).toLocaleDateString() : 'Fecha de atención no disponible'}
                            estado={unaInfo.informe?.estado?.nombre || 'Estado no disponible'}
                            items={hasSolicitud && unaInfo.informe?.solicitud?.material ? unaInfo.informe.solicitud.material : []}
                            diagnostico={hasSolicitud ? unaInfo.informe?.solicitud?.diagnostico : 'Diagnóstico técnico no disponible'}
                            personalDEP={personalDEP}
                            firmas={firmas.solicitud}
                        />
                    </div>
                )}
            </form>
        </div>
    );
};
