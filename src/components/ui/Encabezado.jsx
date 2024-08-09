import React from "react";
import { GridContainer, Label } from ".";

export const EncabezadoFormulario = ({ unaInfo }) => {
    const formatFecha = (fecha) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fecha).toLocaleDateString(undefined, options);
    };

    return (
        <div className=" rounded-md ">
            <GridContainer>
                <div className="bg-slate-200 rounded p-2">
                    <Label>Fecha:</Label>
                    <p className="w-full rounded-md">{formatFecha(unaInfo.informe?.fecha)}</p>
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
                <div className="bg-slate-200 rounded p-2 ">
                    <Label>Edificio:</Label>
                    <p className="w-full rounded-md">{unaInfo.informe?.Solicita?.edificio}</p>
                </div>
            </GridContainer>
            <div className="bg-slate-200 rounded p-2 mb-4">
                <Label>Descripción:</Label>
                <p>{unaInfo.informe?.descripcion}</p>
            </div>
            {unaInfo.informe?.solicitud?.tecnicos && (

                <div className="bg-slate-200 rounded p-2 mb-4 text-center">
                    <Label>Técnico Encargado:</Label>
                    {unaInfo.informe?.solicitud?.tecnicos ? (
                        <p>{unaInfo.informe?.solicitud?.tecnicos?.nombreCompleto}</p>
                    ) : (
                        <p>No asignado</p>
                    )}
                </div>
            )}
            {unaInfo.informe?.solicitud?.diagnostico && (
                <div className="bg-slate-200 rounded p-2 mb-4">
                    <Label>Diagnostico</Label>
                    <p>{unaInfo.informe?.solicitud?.diagnostico}</p>
                </div>
            )}
        </div>
    );
}; 