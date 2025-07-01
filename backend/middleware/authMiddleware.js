const jwt=require('jsonwebtoken');

const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:'Authorization token missing or invalid'});
    }
    const token=authHeader.split(" ")[1];
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();

    }catch(error){
        return res.status(401).json({message:"Invalid or expired token"});
    }
};

const isAdmin=(req,res,next)=>{
    if(req.user.role!=='admin'){
        return res.status(403).json({message:'Access denied: Admins only'});
    }
    next();
};

module.exports={authMiddleware,isAdmin};