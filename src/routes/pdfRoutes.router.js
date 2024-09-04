// routes/pdfRoutes.router.js

import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { validateToken } from '../middlewares/authMiddleware.js';
import { handleError } from '../helpers/errorHelper.js'; 

const router = express.Router();

// URL de la API que devuelve el PDF
const apiUrl = 'https://example.com/api/get-pdf';

// Encabezados adicionales que necesitas enviar
const headers = {
    'Authorization': 'Bearer your-access-token',
    'Accept': 'application/pdf',
};

router.get('/descargar-pdf', validateToken, async (req, res) => {
    try {
        const response = await axios.get(apiUrl, {
            headers: headers,
            responseType: 'arraybuffer',
        });

        if (response.status === 200) {
            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'documento.pdf';

            const filePath = path.join(__dirname, '../pdf', fileName);

            if (!fs.existsSync(path.dirname(filePath))) {
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
            }

            fs.writeFileSync(filePath, response.data);

            res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error('Error al enviar el archivo:', err);
                }
                fs.unlinkSync(filePath);
            });
        } else {
            res.status(response.status).send('Error al obtener el PDF');
        }
    } catch (error) {
        handleError(res, error, 'Error al procesar la solicitud');
    }
});

export default router;
