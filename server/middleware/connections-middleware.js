

const GetConnections = (req, res, next) => {
    // @ts-ignore
    req.query.Filter = { UserIds: req.params.UserId, Status: "Connected", ...req.query.Filter };
    return next();
}
const GetConnectionsReceived = (req, res, next) => {
    // @ts-ignore
    req.query.Filter = { ReceiverId: req.user.UserId, Status: "Pending", ...req.query.Filter };
    return next();
}
const GetConnectionsSent = (req, res, next) => {
    // @ts-ignore
    req.query.Filter = { SenderId: req.user.UserId, Status: "Pending", ...req.query.Filter };
    return next();
}

export {
    GetConnections,
    GetConnectionsReceived,
    GetConnectionsSent,
}