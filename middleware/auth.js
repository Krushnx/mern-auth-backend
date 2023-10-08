
const jwt = require("jsonwebtoken");

function auth(req , res , next)
{
    try {
        const token = req.cookies.token;
        
        if(!token)
         return res.status(401).json({errormessage : "Unauthorized "});

        const verified = jwt.verify(token, process.env.JWT_SECRATE);
        
        req.user = verified.user;

        next();
        
    } catch (error) {
        console.error(error);
        res.status(401).json({errormessage : "Unauthorized Fuck you baby"});
    }
}

module.exports = auth;