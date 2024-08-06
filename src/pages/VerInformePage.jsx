import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/solicitud.css";
import { GridContainer, Label, Title } from "../components/ui";
import { useOrden } from "../context/ordenDeTrabajoContext";

export const VerInforme = () => {
    const { id } = useParams();
    const { traerUnaInfo, unaInfo } = useOrden();
    const [datosCargados, setDatosCargados] = useState(false);

    useEffect(() => {
        const traerdatos = async () => {
            try {
                await traerUnaInfo(id);
                setDatosCargados(true);
            } catch (error) {
                console.error("Error al ejecutar la funcion traer datos", error);
            }
        };
        if (!datosCargados) {
            traerdatos();
        }
    }, [datosCargados, traerUnaInfo, unaInfo]);

    const hasInforme = unaInfo && unaInfo.informe;
    const hasSolicitud = unaInfo && unaInfo.informe?.solicitud;

    return (
        <div className="mx-auto max-w-6xl p-4 text-black">
            {datosCargados && unaInfo ? (
                <div className="bg-white p-6 rounded-md shadow-md">
                    <Title>Informe Completo de Mantenimiento</Title>
                    <GridContainer>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Fecha:</Label>
                            <p className="w-full rounded-md">{hasInforme ? new Date(unaInfo.informe.fecha).toLocaleDateString() : 'Fecha no disponible'}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Solicita:</Label>
                            <p className="w-full rounded-md">{hasInforme && unaInfo.informe.Solicita ? unaInfo.informe.Solicita.nombre : 'Solicita no disponible'}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Folio:</Label>
                            <p className="w-full rounded-md">{unaInfo.folio || 'Folio no disponible'}</p>
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
                            <p className="w-full rounded-md">{hasInforme && unaInfo.informe.Solicita ? unaInfo.informe.Solicita.edificio : 'Edificio no disponible'}</p>
                        </div>
                    </GridContainer>
                    <div className="bg-slate-200 rounded p-2 mb-5">
                        <Label>Descripción del servicio:</Label>
                        <p className="w-full">{hasInforme ? unaInfo.informe.descripcion : 'Descripción no disponible'}</p>
                    </div>
                    <div className="bg-slate-200 rounded p-2 mb-5">
                        <Label>Tecnico Encargado:</Label>
                        <p className="w-full">{hasInforme ? unaInfo.informe?.solicitud?.tecnicos?.nombreCompleto : 'Tenico no disponible'}</p>
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
                                    <Label>Insumos solicitados:</Label>
                                    <ul className="list-disc pl-5">
                                        {hasSolicitud && unaInfo.informe?.solicitud?.material?.length > 0 ? (
                                            unaInfo.informe?.solicitud?.material?.map((mymaterial) => (
                                                <li key={mymaterial._id}>{mymaterial.descripcion} - {mymaterial.cantidad}</li>
                                            ))
                                        ) : (
                                            <li>Insumos no disponibles</li>
                                        )}
                                    </ul>
                                </div>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Observaciones técnicas:</Label>
                                <p className="w-full rounded-md">{hasSolicitud ? unaInfo.informe?.solicitud?.diagnostico : 'Diagnostoco técnico no disponibles'}</p>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
};
