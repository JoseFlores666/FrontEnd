import React, { useState } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { apiPDF } from '../../api/apiPDF'; 
import imgWord from '../../img/imagenWord.png'; 
import imgPDF from '../../img/imagenPDF.png';

export const LlenarOrden = ({
    fecha,
    solicita,
    folio,
    tipodeSolicitud,
    tipoDeMantenimiento,
    tipoDeTrabajo,
    areasoli,
    edificio,
    descripcionServicio,
    tecnicoEncargado,
    fechaAtencion,
    items = [],
    diagnostico,
    personalDEP,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [error, setError] = useState(null);

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const fetchAndGenerateDoc = async () => {
        try {
            const response = await fetch("/PlantillaOrden.docx");
            const content = await response.arrayBuffer();

            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            const parsedItems = Array.isArray(items) ? items : [];
            const maxItems = 4;

            while (parsedItems.length < maxItems) {
                parsedItems.push({
                    cantidad: '',
                    descripcion: '',
                    unidad: ''
                });
            }

            const fields = {
                solicita: solicita || "",
                areasoli: areasoli || "",
                edificio: edificio || "",
                folio: folio || "",
                descservicio: descripcionServicio || "",
                obs: diagnostico || "",
                fechadeAtencion: fechaAtencion || "",
                fechahoy: fecha || "",
                m: tipoDeMantenimiento === 'Mobiliario' ? 'X' : ' ',
                i: tipoDeMantenimiento === 'Mobiliario' ? ' ' : 'X',
                p: tipoDeTrabajo === 'Preventivo' ? 'X' : ' ',
                c: tipoDeTrabajo === 'Preventivo' ? ' ' : 'X',
                n: tipodeSolicitud === 'Normal' ? 'X' : ' ',
                u: tipodeSolicitud === 'Normal' ? ' ' : 'X',
                personal: personalDEP || "",
                solicitud: solicita || "",
                tecnico: tecnicoEncargado || "",
            };

            parsedItems.forEach((item, index) => {
                fields[`cant${index + 1}`] = item.cantidad || '';
                fields[`desc${index + 1}`] = item.descripcion || '';
                fields[`util${index + 1}`] = item.unidad || '';
            });

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
        } catch (error) {
            console.error(error);
        }
    };

    const generatePDFDocument = async () => {
        setError(null);
        try {
            const docxBlob = await fetchAndGenerateDoc();
            const pdfBlob = await apiPDF(docxBlob);
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
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
