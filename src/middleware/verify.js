const jwt = require('jsonwebtoken');
function auth(req, res, next) {
    const bearerHeader = req?.headers?.['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader?.split(' ');
        const token = bearer?.[1];
        req.token = token;
        const verified = jwt.verify(token, process.env.TOKEN_KEY)
        if (verified) {
            next()
        } else {
            // Access Denied 
            return res.status(401).json({ message: 'invaild token' });

        }
    } else {
        // Access Denied 
        return res.status(401).json({ message: 'invaild token' });

    }
}
module.exports = auth;
