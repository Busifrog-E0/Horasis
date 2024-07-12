const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    if (err.message) {
        res.status(statusCode).json(err.message);
    }
    else {
        res.status(statusCode).json({
            error: JSON.stringify(err),
            status: false,
        });
    }
};


export default errorHandler;