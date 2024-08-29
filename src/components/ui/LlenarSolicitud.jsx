import React, { useState, useEffect } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { apiPDF } from '../../api/apiPDF';
import imgWord from '../../img/imagenWord.png';
import imgPDF from '../../img/imagenPDF.png';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSoli } from '../../context/SolicitudContext';

export const LlenarSolicitud = ({
    fecha,
    tipoSuministro,
    procesoClave,
    proyecto,
    actividad,

closeModal,
    items,  // Aquí recibes los items

    justificacion,
    solicitante,
    jefeInmediato,
    dirrecion,
    rectoría,

}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { traeApis_keys, api_Key } = useSoli();
    const [datosCargados, setDatosCargados] = useState(false);

    useEffect(() => {
        const llamaApi = async () => {
            try {
                await traeApis_keys();
                setDatosCargados(true);
            } catch (error) {
                console.log(error)
            }
        };
        if (!datosCargados) {
            llamaApi();
        }
    }, [traeApis_keys, datosCargados, api_Key]);

    const handleCloseModal = () => {
        setIsOpen(false);
        navigate('/soli');
        closeModal(); 

    };

    const [day, month, year] = (fecha || "").split("-").reverse();

    const fetchAndGenerateDoc = async () => {
        try {
            const response = await fetch("/PlantillaSolicitud.docx");
            const content = await response.arrayBuffer();

            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            const maxItems = 10; // Define el número máximo de items
            const fields = {
                dia: day || "",
                mes: month || "",
                año: year || "",
                y: tipoSuministro === 'Normal' ? '⬛' : '☐',
                x: tipoSuministro === 'Normal' ? '☐' : '⬛',
                pce: procesoClave === 'Educativo' ? '⬛' : '☐',
                pco: procesoClave === 'Educativo' ? '☐' : '⬛',
                proyecto: proyecto || "",
                actividad: actividad || "",
                justificacion: justificacion || "",
                sol: solicitante || "",
                rev: jefeInmediato || "",
                val: dirrecion || "",
                aut: rectoría || "",
            };

            // Agrega los campos para los ítems
            for (let i = 0; i < maxItems; i++) {
                const item = items[i] || { cantidad: '', unidad: '', descripcion: '' };
                fields[`col${i + 1}`] = item.cantidad || '';
                fields[`uni${i + 1}`] = item.unidad || '';
                fields[`desc${i + 1}`] = item.descripcion || '';
            }

            doc.render(fields);
            return doc.getZip().generate({
                type: 'blob',
                compression: 'DEFLATE',
            });
        } catch (error) {
            console.error('Error generating document:', error);
            setError('Hubo un error al generar el documento. Por favor, inténtalo de nuevo.');
            throw error;
        }
    };
    const generateWordDocument = async () => {
        setError(null);
        try {
            const docxBlob = await fetchAndGenerateDoc();
            saveAs(docxBlob, 'OrdenDeMantenimiento.docx');
            Swal.fire({
                title: "Descarga Exitosa",
                text: "Archivo Word generado con éxito",
                icon: "success",
                confirmButtonText: "OK",
            })
            navigate('/soli');
        } catch (error) {
            console.error(error);
        }
    };

    const generatePDFDocument = async () => {
        setError(null);
        try {
            if (api_Key.length > 0) {
                const apiKey = api_Key[0].api_key;
                const docxBlob = await fetchAndGenerateDoc();
                const pdfBlob = await apiPDF(docxBlob,apiKey);
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank');
                Swal.fire({
                    title: "Descarga Exitosa",
                    text: "Archivo PDF generado con éxito",
                    icon: "success",
                    confirmButtonText: "OK",
                })
                navigate('/soli');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {isOpen && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Seleccione el tipo de archivo:</h3>
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
                                        type="button"
                                        onClick={generateWordDocument}
                                        style={{ all: 'unset', cursor: 'pointer' }}
                                    >
                                        <img
                                            src={imgWord}
                                            alt="Generar Word"
                                            style={{ marginLeft: '25px', width: '150px', height: '150px' }}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={generatePDFDocument}
                                        style={{ all: 'unset', cursor: 'pointer' }}
                                    >
                                        <img
                                            src={imgPDF}
                                            alt="Generar PDF"
                                            style={{ width: '200px', height: '200px' }}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
