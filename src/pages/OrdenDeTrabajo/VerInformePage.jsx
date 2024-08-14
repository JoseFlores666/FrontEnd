import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/solicitud.css";
import { GridContainer, Label, Title } from "../../components/ui";
import { useOrden } from "../../context/ordenDeTrabajoContext";
import scrollToTop from "../../util/Scroll";
import imgWord from "../../img/imagenWord.png";
import imgPDF from "../../img/imagenPDF.png";
import { useSoli } from "../../context/SolicitudContext";

export const VerInforme = () => {
    const { id } = useParams();
    const { traerUnaInfo, unaInfo } = useOrden();
    const [datosCargados, setDatosCargados] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [clickedPDF, setClickedPDF] = useState(false);
    const { getFirmas, nombresFirmas } = useSoli();
    const [firmas, setFirmas] = useState({ solicitud: "", jefeInmediato: "", direccion: "", autorizo: "" });

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
            setIsOpen(true);
        }
    };


    const handleCloseModal = (event) => {
        event.preventDefault();
        setIsOpen(false);
    };

    const handleOpenModal = (event) => {
        event.preventDefault();
        setIsOpen(true);
    };

    const subirDatos = (event) => {
        event.preventDefault();
        setIsOpen(false);
        const form = event.target;

        const formData = new FormData(form);
        const url = 'http://localhost/PlantillasWordyPdf/ManejoOrden.php';
        const method = 'POST';

        fetch(url, {
            method: method,
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                console.log('Formulario enviado correctamente:', text);
                if (clickedPDF) {
                    openVentana();
                } else {
                    descargarWORD();
                }
            });
    };

    useEffect(() => {
        const traerdatos = async () => {
            try {
                await traerUnaInfo(id);
                setDatosCargados(true);
                
                await getFirmas();

            } catch (error) {
                console.error("Error al ejecutar la funcion traer datos", error);
            }
        };
        if (!datosCargados) {
            traerdatos();
            llenadoFirmas();
        }
    }, [datosCargados, traerUnaInfo, id]);

    const hasInforme = unaInfo && unaInfo.informe;
    const hasSolicitud = unaInfo && unaInfo.informe?.solicitud;

    const descargarWORD = () => {
        const a = document.createElement('a');
        a.href = 'http://localhost/PlantillasWordyPdf/DescargarWordOrden.php';
        a.download = 'formSolicitud.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const openVentana = () => {
        const url = 'http://localhost/PlantillasWordyPdf/ResultadoOrden.pdf';
        const features = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
        window.open(url, '_blank', features);
    };

    return (
        <div className="mx-auto max-w-6xl p-4 text-black">
            <form onSubmit={subirDatos}>
                {datosCargados && unaInfo ? (
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <Title showBackButton={true}>Informe Completo de Mantenimiento</Title>
                        <GridContainer>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Fecha:</Label>
                                <p className="w-full rounded-md">{hasInforme ? new Date(unaInfo.informe.fecha).toLocaleDateString() : 'Fecha no disponible'}</p>
                                <input
                                    id="fechaOrden"
                                    name="fechaOrden"
                                    value={hasInforme ? new Date(unaInfo.informe.fecha).toLocaleDateString() : ''}
                                    type="hidden"
                                />
                            </div>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Solicita:</Label>
                                <p className="w-full rounded-md">{hasInforme && unaInfo.informe.Solicita ? unaInfo.informe.Solicita.nombre : 'Solicita no disponible'}</p>
                                <input
                                    name="solicita"
                                    value={hasInforme && unaInfo.informe.Solicita ? unaInfo.informe.Solicita.nombre : ''}
                                    type="hidden"
                                />
                            </div>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Folio:</Label>
                                <p className="w-full rounded-md">{unaInfo.informe.folio || 'Folio no disponible'}</p>
                                <input
                                    id="folio"
                                    name="folio"
                                    value={unaInfo.informe.folio || ''}
                                    type="hidden"
                                />
                            </div>
                        </GridContainer>
                        <GridContainer>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Tipo de Solicitud:</Label>
                                <p className="w-full rounded-md">{hasInforme ? unaInfo.informe?.tipoDeSolicitud : 'Tipo de Solicitud no disponible'}</p>
                                <input
                                    name="tipoDeSolicitud"
                                    value={hasInforme ? unaInfo.informe?.tipoDeSolicitud : ''}
                                    type="hidden"
                                />
                            </div>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Tipo de Mantenimiento:</Label>
                                <p className="w-full rounded-md">{hasInforme ? unaInfo.informe?.tipoDeMantenimiento : 'Tipo de Mantenimiento no disponible'}</p>
                                <input
                                    name="tipoDeMantenimiento"
                                    value={hasInforme ? unaInfo.informe?.tipoDeMantenimiento : ''}
                                    type="hidden"
                                />
                            </div>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Tipo de Trabajo:</Label>
                                <p className="w-full rounded-md">{hasInforme ? unaInfo.informe?.tipoDeTrabajo : 'Tipo de Trabajo no disponible'}</p>
                                <input
                                    name="tipoDeTrabajo"
                                    value={hasInforme ? unaInfo.informe?.tipoDeTrabajo : ''}
                                    type="hidden"
                                />
                            </div>
                        </GridContainer>
                        <GridContainer>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Área solicitante:</Label>
                                <p className="w-full rounded-md">{hasInforme && unaInfo.informe?.Solicita ? unaInfo.informe.Solicita.areaSolicitante : 'Área solicitante no disponible'}</p>
                                <input
                                    id="areasoli"
                                    name="areasoli"
                                    value={hasInforme && unaInfo.informe?.Solicita ? unaInfo.informe.Solicita.areaSolicitante : ''}
                                    type="hidden"
                                />
                            </div>
                            <div className="bg-slate-200 rounded p-2">
                                <Label>Edificio:</Label>
                                <p className="w-full rounded-md">{hasInforme && unaInfo.informe?.Solicita ? unaInfo.informe.Solicita.edificio : 'Edificio no disponible'}</p>
                                <input
                                    name="edificio"
                                    value={hasInforme && unaInfo.informe?.Solicita ? unaInfo.informe.Solicita.edificio : ''}
                                    type="hidden"
                                />
                            </div>
                        </GridContainer>
                        <div className="bg-slate-200 rounded p-2 mb-5">
                            <Label>Descripción del servicio:</Label>
                            <p className="w-full">{hasInforme ? unaInfo.informe.descripcion : 'Descripción no disponible'}</p>
                            <input
                                name="descripcion"
                                value={hasInforme ? unaInfo.informe.descripcion : ''}
                                type="hidden"
                            />
                        </div>
                        <div className="bg-slate-200 rounded p-2 mb-5">
                            <Label>Técnico Encargado:</Label>
                            <p className="w-full">{hasInforme ? unaInfo.informe?.solicitud?.tecnicos?.nombreCompleto : 'Técnico no disponible'}</p>
                            <input
                                id="tecnicoEncargado"
                                name="tecnicoEncargado"
                                value={hasInforme ? unaInfo.informe?.solicitud?.tecnicos?.nombreCompleto : ''}
                                type="hidden"
                            />
                        </div>

                        {unaInfo.estado !== "Declinada" && hasSolicitud && (
                            <>
                                <h2 className="text-xl text-center mb-5 font-bold text-black">Solicitud</h2>
                                <GridContainer>
                                    <div className="bg-slate-200 rounded p-2">
                                        <Label>Fecha de atención:</Label>
                                        <p className="w-full rounded-md">{hasSolicitud && unaInfo.informe?.solicitud?.fechaAtencion ? new Date(unaInfo.informe?.solicitud?.fechaAtencion).toLocaleDateString() : 'Fecha de atención no disponible'}</p>
                                        <input
                                            name="fechaAtencion"
                                            value={hasSolicitud && unaInfo.informe?.solicitud?.fechaAtencion ? new Date(unaInfo.informe?.solicitud?.fechaAtencion).toLocaleDateString() : ''}
                                            type="hidden"
                                        />
                                    </div>
                                    <div></div>
                                    <div className="bg-slate-200 rounded p-2">
                                        <Label>Estado:</Label>
                                        <p className="w-full rounded-md">{unaInfo.informe?.estado?.nombre || 'Estado no disponible'}</p>
                                        <input
                                            name="estado"
                                            value={unaInfo.informe?.estado?.nombre || ''}
                                            type="hidden"
                                        />
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
                                    <input
                                        name="items"
                                        value={JSON.stringify(hasSolicitud && unaInfo.informe?.solicitud?.material ? unaInfo.informe.solicitud.material : [])}
                                        type="hidden"
                                    />
                                </div>


                                <div className="bg-slate-200 rounded p-2 mb-4">
                                    <Label>Observaciones técnicas:</Label>
                                    <p className="w-full rounded-md">{hasSolicitud ? unaInfo.informe?.solicitud?.diagnostico : 'Diagnóstico técnico no disponible'}</p>
                                    <input
                                        id="obs"
                                        name="obs"
                                        value={hasSolicitud ? unaInfo.informe?.solicitud?.diagnostico : ''}
                                        type="hidden"
                                    />
                                </div>
                                <div className="grid grid-cols-2 text-center">
                                    <div>
                                        <Label>Nombre del Personal del DEP MSG</Label>


                                        <input type="text" id="personalDEP" name="personalDEP" />
                                    </div>
                                    <div>
                                        <Label>Nombre y Firma de Conformidad del Servicio
                                            (Directivo y/o Jefatura de Dep., y/o Responsable de Área)
                                        </Label>
                                        <input type="text" id="directivo" name="directivo" value={firmas.solicitud} />

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
                    <p>Cargando datos...</p>
                )}

                {isOpen && (
                    <div
                        id="static-modal"
                        tabIndex="-1"
                        aria-hidden={!isOpen}
                        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
                    >
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Haga click en el tipo de archivo que desea generar:</h3>
                                    <button
                                        type="button"
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        onClick={handleCloseModal}
                                    >
                                        <svg
                                            className="w-3 h-3"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 14"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 p-4 md:grid-cols-2 gap-6 ">
                                    <div className="flex items-center justify-center">
                                        <button
                                            type="submit"
                                            onClick={() => setClickedPDF(false)}
                                            style={{ all: 'unset', cursor: 'pointer' }}
                                        >
                                            <img
                                                src={imgWord}
                                                style={{ marginLeft: '25px', width: '150px', height: '150px' }}
                                            />
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            onClick={() => setClickedPDF(true)}
                                            style={{ all: 'unset', cursor: 'pointer' }}
                                        >
                                            <img
                                                src={imgPDF}
                                                style={{ width: '200px', height: '200px' }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};
