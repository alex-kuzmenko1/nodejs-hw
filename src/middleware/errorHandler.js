const createError = require('http-errors');

export const errorHandler = (err, req, res, next) => {
 
  if (err instanceof createError.HttpError) {
   
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
  } else {
    
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
  }
};
