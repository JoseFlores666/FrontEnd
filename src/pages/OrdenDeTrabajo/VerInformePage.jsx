import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/solicitud.css";
import { GridContainer, Label, Title } from "../../components/ui";
import { useOrden } from "../../context/ordenDeTrabajoContext";
import scrollToTop from "../../util/Scroll";

export const VerInforme = () => {
    const { id } = useParams();
    const { traerUnaInfo, unaInfo } = useOrden();
    const [datosCargados, setDatosCargados] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [clickedPDF, setClickedPDF] = useState(false);

    const handleCloseModal = (event) => {
        event.preventDefault();
        setIsOpen(false);
      };

      const handleFormSubmit = async (data, event) => {
        event.preventDefault();
        await saveData(data);
    
        const form = event.target;
        const formData = new FormData(form);
        const url = 'http://localhost/PlantillasWordyPdf/ManejoOrden.php';
    
        fetch(url, {
          method: 'POST',
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
            } catch (error) {
                console.error("Error al ejecutar la funcion traer datos", error);
            }
        };
        if (!datosCargados) {
            traerdatos();
        }
        scrollToTop();

    }, [datosCargados, traerUnaInfo, unaInfo]);

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
            <form>
                {datosCargados && unaInfo ? (
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <Title showBackButton={true}>Informe Completo de Mantenimiento</Title>
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
                                <div className="bg-slate-200 rounded p-2 mb-4">
                                    <Label>Observaciones técnicas:</Label>
                                    <p className="w-full rounded-md">{hasSolicitud ? unaInfo.informe?.solicitud?.diagnostico : 'Diagnostoco técnico no disponibles'}</p>
                                </div>
                            </>
                        )}
                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
                            >
                                Guardar cambios
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
