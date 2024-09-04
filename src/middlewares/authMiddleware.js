import jwt from 'jsonwebtoken';

const secretKey = 'your-secret-key';

export const validateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send('Token no proporcionado');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).send('Token inválido');
        }

        req.user = decoded;
        next();
    });
};