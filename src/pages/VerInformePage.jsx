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
                console.log(unaInfo);
                setDatosCargados(true);
            } catch (error) {
                console.error("Error al ejecutar la funcion traer datos", error);
            }
        };
        if (!datosCargados) {
            traerdatos();
        }
    }, [datosCargados, traerUnaInfo, unaInfo]);

    return (
        <div className="mx-auto max-w-6xl p-4 text-black">
            {datosCargados && unaInfo ? (
                <div className="bg-white p-6 rounded-md shadow-md">
                    <Title>Informe Completo de Mantenimiento</Title>
                    <GridContainer>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Fecha:</Label>
                            <p className="w-full rounded-md">{new Date(unaInfo.informe.fecha).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Solicita:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe.Solicita.nombre}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Folio:</Label>
                            <p className="w-full rounded-md">{unaInfo.folio}</p>
                        </div>
                    </GridContainer>
                    <GridContainer>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Tipo de Solicitud:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe.tipoDeSolicitud}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Tipo de Mantenimiento:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe.tipoDeMantenimiento}</p>
                        </div>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Tipo de Trabajo:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe.tipoDeTrabajo}</p>
                        </div>
                    </GridContainer>
                    <GridContainer>
                        <div className="bg-slate-200 rounded p-2">
                            <Label>Área solicitante:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe.Solicita.areaSolicitante}</p>
                        </div>

                        <div className="bg-slate-200 rounded p-2">
                            <Label>Edificio:</Label>
                            <p className="w-full rounded-md">{unaInfo.informe.Solicita.edificio}</p>
                        </div>
                    </GridContainer>
                    <div className="bg-slate-200 rounded p-2 mb-5">
                        <Label>Descripción del servicio:</Label>
                        <p className="w-full">{unaInfo.informe.descripcionDelServicio}</p>
                    </div>

                    {unaInfo.estado !== "Declinada" && (
                        <>
                            <h2 className="text-xl text-center mb-5 font-bold text-black">Solicitud</h2>
                            <GridContainer>
                                <div className="bg-slate-200 rounded p-2">
                                    <Label>Fecha de atención:</Label>
                                    <p className="w-full rounded-md">{new Date(unaInfo.solicitud.fechaAtencion).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-slate-200 rounded p-2">
                                    <Label>Insumos solicitados:</Label>
                                    <ul className="list-disc pl-5">
                                        {unaInfo.solicitud.insumosSolicitados.map((insumo) => (
                                            <li key={insumo._id}>{insumo.descripcion} - {insumo.cantidad}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-slate-200 rounded p-2">
                                    <Label>Estado:</Label>
                                    <p className="w-full rounded-md">{unaInfo.estado}</p>
                                </div>
                            </GridContainer>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Observaciones técnicas:</Label>
                                <p className="w-full rounded-md">{unaInfo.solicitud.Observacionestecnicas}</p>
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
