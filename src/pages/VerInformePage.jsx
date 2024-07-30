import React, { useState, useEffect } from "react";
import { useSoli } from "../context/SolicitudContext";
import { useParams } from "react-router-dom";
import "../css/solicitud.css";

export const VerInforme = () => {
    const { id } = useParams();
    const { traeUnaInfo, unaInfo } = useSoli();
    const [datosCargados, setDatosCargados] = useState(false);

    useEffect(() => {
        const traerdatos = async () => {
            try {
                await traeUnaInfo(id);
                console.log(unaInfo);
                setDatosCargados(true);
            } catch (error) {
                console.error("Error al ejecutar la funcion traer datos", error);
            }
        };
        if (!datosCargados) {
            traerdatos();
        }
    }, [datosCargados, traeUnaInfo, unaInfo]);

    return (
        <div className="mx-auto max-w-6xl p-4 text-black">
            {datosCargados && unaInfo ? (
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-black">Informe de Mantenimiento</h2>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold mb-1">Folio:</label>
                            <p className="w-full rounded-md">{unaInfo.folio}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Solicita:</label>
                            <p className="w-full rounded-md">{unaInfo.informe.Solicita.nombre}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Área solicitante:</label>
                            <p className="w-full rounded-md">{unaInfo.informe.Solicita.areaSolicitante}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold mb-1">Fecha:</label>
                            <p className="w-full rounded-md">{new Date(unaInfo.informe.fecha).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Tipo de Mantenimiento:</label>
                            <p className="w-full rounded-md">{unaInfo.informe.tipoDeMantenimiento}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Tipo de Trabajo:</label>
                            <p className="w-full rounded-md">{unaInfo.informe.tipoDeTrabajo}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold mb-1">Tipo de Solicitud:</label>
                            <p className="w-full rounded-md">{unaInfo.informe.tipoDeSolicitud}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Edificio:</label>
                            <p className="w-full rounded-md">{unaInfo.informe.Solicita.edificio}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-1">Descripción del servicio:</label>
                        <p className="w-full">{unaInfo.informe.descripcionDelServicio}</p>
                    </div>

                    {unaInfo.estado !== "Declinada" && (
                        <>
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-black">Solicitud</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Insumos solicitados:</label>
                                        <ul className="list-disc pl-5">
                                            {unaInfo.solicitud.insumosSolicitados.map((insumo) => (
                                                <li key={insumo._id}>{insumo.descripcion} - {insumo.cantidad}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Observaciones técnicas:</label>
                                        <p className="w-full rounded-md">{unaInfo.solicitud.Observacionestecnicas}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Fecha de atención:</label>
                                        <p className="w-full rounded-md">{new Date(unaInfo.solicitud.fechaAtencion).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-black">Detalles adicionales</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Estado:</label>
                                        <p className="w-full rounded-md">{unaInfo.estado}</p>
                                    </div>
                                </div>
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
