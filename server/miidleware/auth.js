const jwt = require('jsonwebtoken');
exports.auth = async (req,res, next) => {

    try {
        
        const token = req.body.token || req.cookies.token || req.get("Authorization")?.replace("Bearer ", "");
        
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }
        try {
            const payload = jwt.verify(token,process.env.JWT_SECRET);
            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Invaild token."
            })
        } 
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"Error in validating token"
        })
    }
}

exports.isDoctor = async (req, res, next) => {
    try {
        if(req.user.accountType !== 'Doctor') {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for doctors only.',
            });
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified."
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if(req.user.accountType !== 'Admin') {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for admin only.',
            });
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified."
        })
    }
}

exports.isHospital = async (req, res, next) => {
    try {
        if(req.user.accountType !== 'Hospital') {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for hospital only.',
            });
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified."
        })
    }
}


