import axios from 'axios';
import { useSoli } from "../../src/context/SolicitudContext";

export const apiPDF = async (docxBlob) => {
    const api_Key='fejj5587@gmail.com_yPgoFrNGM1YM8rxAMhqPyJpLH8LXSnl7nwVXQtvEXWeygTj2fsPDfdVIWKeuaaA2'

    try {
        const formData = new FormData();
        formData.append('file', docxBlob, 'document.docx');

        const uploadResponse = await axios.post(
            'https://api.pdf.co/v1/file/upload',
            formData,
            {
                headers: {
                    'x-api-key': api_Key,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const uploadedFileUrl = uploadResponse.data.url;

        const conversionResponse = await axios.post(
            'https://api.pdf.co/v1/pdf/convert/from/doc',
            JSON.stringify({
                name: 'document.pdf',
                url: uploadedFileUrl,
            }),
            {
                headers: {
                    'x-api-key': api_Key,
                    'Content-Type': 'application/json',
                },
            }
        );

        const pdfUrl = conversionResponse.data.url;

        const pdfResponse = await axios.get(pdfUrl, {
            responseType: 'blob',
        });

        return pdfResponse.data;
    } catch (error) {
        console.error('Error converting DOCX to PDF:', error);
        throw new Error('Failed to convert DOCX to PDF');
    }
};
