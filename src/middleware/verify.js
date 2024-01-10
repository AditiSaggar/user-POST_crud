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
            return res.status(401).json({ 
                message: 'invaild token' 
            });

        }
    } else {
        return res.status(401).json({               //401:Unauthorized
            message: 'invaild token' 
        });

    }
}

//aaccess Admin
const accessAdmin = (admin) => {
    return (req, res, next) => {
        try {
            if (req.user.role === admin) {
                next();
            } else {
                throw new Error("Don't have permission to perform this action");
            }
        } catch (error) {
            console.error('Error in accessAdmin middleware:', error);
            res.status(403).json({
                success: false,
                message: 'Access denied. Only users with the required role can perform this action.',
                error: error.message
            });
        }
    };
};



module.exports = {
    auth,
    accessAdmin,
};
