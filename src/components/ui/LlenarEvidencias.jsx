import React, { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ImageRun, AlignmentType, VerticalAlign } from "docx";
import { saveAs } from "file-saver";
import imgWord from '../../img/imagenWord.png';
import imgPDF from '../../img/imagenPDF.png';
import { apiPDF } from '../../api/apiPDF';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSoli } from '../../context/SolicitudContext';

export const LlenarEvidencias = ({ solicitud, descripcion, imagenesPares }) => {
    const navigate = useNavigate();
    const { traeApis_keys, api_Key } = useSoli();
    const [datosCargados, setDatosCargados] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const llamaApi = async () => {
            try {
                await traeApis_keys();
                setDatosCargados(true);
            } catch (error) {
                console.error("Error al obtener las API keys:", error);
            }
        };

        if (!datosCargados) {
            llamaApi();
        }
    }, [traeApis_keys, datosCargados]);

    const fetchImageBlob = async (url) => {
        const response = await fetch(url);
        return response.blob();
    };

    const getImageDimensions = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = reject;
            img.src = url;
        });
    };

    const createDocument = async () => {
        const tituloEvidencias = new Paragraph({
            children: [
                new TextRun({
                    text: `EVIDENCIAS`,
                    bold: true,
                    size: 24,
                }),
            ],
            alignment: AlignmentType.CENTER,
        });
    
        const solicitudParagraph = new Paragraph({
            children: [
                new TextRun({
                    text: `Solicitud: ${solicitud}`,
                    bold: true,
                    size: 24,
                }),
            ],
            alignment: AlignmentType.CENTER,
        });
    
        const descripcionParagraph = new Paragraph({
            children: [
                new TextRun({
                    text: `Descripción: ${descripcion}`,
                    size: 24,
                }),
            ],
            alignment: AlignmentType.CENTER,
        });
    
        const cellWidth = 300;  
        const cellHeight = 300; 
    
        const tableRows = await Promise.all(imagenesPares.map(async (par) => {
            return new TableRow({
                children: await Promise.all(par.map(async (imagen) => {
                    const imageBlob = await fetchImageBlob(imagen.secure_url);
                    const dimensions = await getImageDimensions(imagen.secure_url);
    
                    let width = dimensions.width;
                    let height = dimensions.height;
    
                    const widthScale = cellWidth / width;
                    const heightScale = cellHeight / height;
                    const scale = Math.min(widthScale, heightScale);
    
                    width = width * scale;
                    height = height * scale;
    
                    width = Math.min(width, cellWidth);
                    height = Math.min(height, cellHeight);
    
                    const image = new ImageRun({
                        data: imageBlob,
                        transformation: {
                            width: width,
                            height: height,
                        },
                    });
    
                    return new TableCell({
                        children: [
                            new Paragraph({
                                children: [image],
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                            size: cellWidth,
                            type: WidthType.DXA,
                        },
                    });
                })),
            });
        }));
    
        const table = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
        });
    
        return new Document({
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: 600,
                                right: 600,
                                bottom: 600,
                                left: 600,
                                header: 300,
                                footer: 300,
                            },
                        },
                    },
                    children: [tituloEvidencias, solicitudParagraph, descripcionParagraph, table],
                },
            ],
        });
    };
    
    

    const generateWordDocument = async () => {
        setError(null);
        try {
            const doc = await createDocument();
            const docxBlob = await Packer.toBlob(doc);
            Swal.fire({
                title: "Descarga Exitosa",
                text: "Archivo Word generado con éxito",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate('/tecnico/orden');
            saveAs(docxBlob, 'Solicitud.docx');
        } catch (error) {
            console.error("Error al generar el documento Word:", error);
            setError('Error al generar el documento Word');
        }
    };

    const generatePDFDocument = async () => {
        setError(null);
        try {
            const doc = await createDocument();
            const docxBlob = await Packer.toBlob(doc);

            if (api_Key.length > 0) {
                const apiKey = api_Key[0].api_key;
                const pdfBlob = await apiPDF(docxBlob, apiKey);
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank');
                
                Swal.fire({
                    title: "Descarga Exitosa",
                    text: "Archivo PDF generado con éxito",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                navigate('/tecnico/orden');
            } else {
                throw new Error("Falta la API key");
            }
        } catch (error) {
            console.error("Error al convertir DOCX a PDF:", error);
            setError('Error al convertir DOCX a PDF');
        }
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    return (
        <div>
            {isOpen && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Seleccione el tipo de archivo:
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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

                            <div className="grid grid-cols-2 p-4 md:grid-cols-2 gap-6">
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
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};
