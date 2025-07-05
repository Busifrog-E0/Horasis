const ReportMarkAsReadMiddleware = (req, res, next) => { 
    req.body.IsViewed = true;
    return next();
}

export {
    ReportMarkAsReadMiddleware
}