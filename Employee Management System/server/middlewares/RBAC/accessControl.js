const jwt = require("jsonwebtoken");
const crypto = require('crypto');
require("dotenv").config();





const createTokens = (user, printHash) => {
  const accessToken =  jwt.sign(
    {
      id: user._id,
      role: user.role,
      printHash: printHash
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1min",
    }
  )

  const refreshToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,

    { expiresIn: "7d",
    }
  )
  return {accessToken, refreshToken}
};

exports.createTokens = createTokens


exports.checkToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const fingerprint = req.cookies.fingerprint;

  if (!accessToken)
    return res.status(401).json({ 
      success: false, 
      msg: "Unauthorized - token missing", 
      data: [] 
    });

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const hashMatch = crypto.createHash('sha256').update(fingerprint).digest('hex') === decoded.printHash

    if(!hashMatch)
      return res.status(401).json({ 
        success: false, 
        msg: 'Unauthorized', 
        data: [] 
      })

    req.user = decoded; // attaches cookie to req.user
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false, 
      msg: "Invalid or expired token", 
      data: [] 
    });
  }
};


exports.checkManager = (req, res, next) => {
  // `checkToken` should have already attached req.user
  if (req.user && req.user.role === 'manager') {
    next(); // User is an admin, proceed to the next middleware/route handler
  } else {
    // User is not an admin or token is invalid
    res.status(403).json({ 
      success: false, 
      msg: 'Forbidden: Admin access required', 
      data: [] 
    });
  }
};

exports.checkEmployee = (req, res, next) => {
    // checkToken should have already attached req.user
    if (req.user && req.user.role === 'employee') {
        next(); // User is a regular user, proceed
    } else {
        // Not a regular user, deny access
        res.status(403).json({ 
          success: false, 
          msg: 'Forbidden: User access required', 
          data: [] 
        });
    }
};