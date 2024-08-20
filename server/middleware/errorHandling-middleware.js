const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
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