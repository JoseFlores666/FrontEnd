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
                <form className="bg-white p-6 rounded-md shadow-md">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-black">Informe de Mantenimiento</h2>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
                        <div>
                            <label htmlFor="folio" className="block text-sm font-medium mb-1">Folio:</label>
                            <input
                                type="text"
                                id="folio"
                                name="folio"
                                value={unaInfo.folio}
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                readOnly
                            />
                        </div>
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium mb-1">Solicita:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={unaInfo.informe.Solicita.nombre}
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                readOnly
                            />
                        </div>
                        <div>
                            <label htmlFor="areaSolicitante" className="block text-sm font-medium mb-1">Área solicitante:</label>
                            <input
                                type="text"
                                id="areaSolicitante"
                                name="areaSolicitante"
                                value={unaInfo.informe.Solicita.areaSolicitante}
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                readOnly
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
                        <div>
                            <label htmlFor="fecha" className="block text-sm font-medium mb-1">Fecha:</label>
                            <input
                                type="text"
                                id="fecha"
                                name="fecha"
                                value={new Date(unaInfo.informe.fecha).toLocaleDateString()}
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                readOnly
                            />
                        </div>
                        <div>
                            <label htmlFor="tipoDeMantenimiento" className="block text-sm font-medium mb-1">Tipo de Mantenimiento:</label>
                            <input
                                type="text"
                                id="tipoDeMantenimiento"
                                name="tipoDeMantenimiento"
                                value={unaInfo.informe.tipoDeMantenimiento}
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                readOnly
                            />
                        </div>
                        <div>
                            <label htmlFor="tipoDeTrabajo" className="block text-sm font-medium mb-1">Tipo de Trabajo:</label>
                            <input
                                type="text"
                                id="tipoDeTrabajo"
                                name="tipoDeTrabajo"
                                value={unaInfo.informe.tipoDeTrabajo}
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
                        <div>
                            <label htmlFor="tipoDeSolicitud" className="block text-sm font-medium mb-1">Tipo de Solicitud:</label>
                            <input
                                type="text"
                                id="tipoDeSolicitud"
                                name="tipoDeSolicitud"
                                value={unaInfo.informe.tipoDeSolicitud}
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                readOnly
                            />
                        </div>
                        <div>
                            <label htmlFor="edificio" className="block text-sm font-medium mb-1">Edificio:</label>
                            <input
                                type="text"
                                id="edificio"
                                name="edificio"
                                value={unaInfo.informe.Solicita.edificio}
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                readOnly
                            />
                        </div>

                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
                        <div className="col-span-2">
                            <label htmlFor="descripcionDelServicio" className="block text-sm font-medium mb-1">Descripción del servicio:</label>
                            <textarea
                                id="descripcionDelServicio"
                                name="descripcionDelServicio"
                                value={unaInfo.informe.descripcionDelServicio}
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                readOnly
                                rows="4"
                            ></textarea>
                        </div>
                    </div>

                    {unaInfo.estado !== "Declinada" && (
                        <>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-black">Imágenes</h3>
                                <div className="grid grid-cols-4 gap-4">
                                    {unaInfo.informe.imagenes.map((imagen) => (
                                        <img key={imagen._id} src={imagen.secure_url} alt={imagen.public_id} className="max-w-60 h-auto" />
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-black">Solicitud</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label htmlFor="insumosSolicitados" className="block text-sm font-medium mb-1">Insumos solicitados:</label>
                                        <ul className="list-disc pl-5">
                                            {unaInfo.solicitud.insumosSolicitados.map((insumo) => (
                                                <li key={insumo._id}>{insumo.descripcion} - {insumo.cantidad}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <label htmlFor="Observacionestecnicas" className="block text-sm font-medium mb-1">Observaciones técnicas:</label>
                                        <textarea
                                            id="Observacionestecnicas"
                                            name="Observacionestecnicas"
                                            value={unaInfo.solicitud.Observacionestecnicas}
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            readOnly
                                            rows="2"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label htmlFor="fechaAtencion" className="block text-sm font-medium mb-1">Fecha de atención:</label>
                                        <input
                                            type="text"
                                            id="fechaAtencion"
                                            name="fechaAtencion"
                                            value={new Date(unaInfo.solicitud.fechaAtencion).toLocaleDateString()}
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-black">Detalles adicionales</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label htmlFor="estado" className="block text-sm font-medium mb-1">Estado:</label>
                                        <input
                                            type="text"
                                            id="estado"
                                            name="estado"
                                            value={unaInfo.estado}
                                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </form>
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
};
