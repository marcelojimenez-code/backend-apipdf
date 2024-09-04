import express from 'express'
import dotenv from 'dotenv'
import viewsPdf from './routes/pdfRoutes.router.js'

import cors from 'cors'

dotenv.config()


/* Nombramos la variable app con la función de express */
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* Cors */
app.use(cors())

/**
 * Definimos el puerto 
 */
const port = process.env.PORT || 5000;
app.listen(port, async () => {
    console.log(`Servidor backend corriendo en ${port}`);
  })


// Usar las rutas en la aplicación
app.use('/api', viewsPdf);


// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error del servidor' });
});