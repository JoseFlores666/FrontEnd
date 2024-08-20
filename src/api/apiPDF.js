// apiPDF.js
import axios from 'axios';

// Reemplaza con tu clave API de PDF.co
const API_KEY = 'fejj5587@gmail.com_yPgoFrNGM1YM8rxAMhqPyJpLH8LXSnl7nwVXQtvEXWeygTj2fsPDfdVIWKeuaaA2';

export const apiPDF = async (docxBlob) => {
    try {
        // Subir el archivo DOCX a PDF.co
        const formData = new FormData();
        formData.append('file', docxBlob, 'document.docx');

        const uploadResponse = await axios.post(
            'https://api.pdf.co/v1/file/upload',
            formData,
            {
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const uploadedFileUrl = uploadResponse.data.url;

        // Convertir el archivo DOCX a PDF
        const conversionResponse = await axios.post(
            'https://api.pdf.co/v1/pdf/convert/from/doc',
            JSON.stringify({
                name: 'document.pdf',
                url: uploadedFileUrl,
            }),
            {
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        const pdfUrl = conversionResponse.data.url;

        // Descargar el PDF generado
        const pdfResponse = await axios.get(pdfUrl, {
            responseType: 'blob',
        });

        return pdfResponse.data;
    } catch (error) {
        console.error('Error converting DOCX to PDF:', error);
        throw new Error('Failed to convert DOCX to PDF');
    }
};
