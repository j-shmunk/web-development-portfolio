const jwt = required('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!authHeader) || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = decoded;
            next();
        }
    );
};

module.exports = verifyJWT;