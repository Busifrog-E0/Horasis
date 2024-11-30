const get_Reports = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Reports'] */
    /* #swagger.responses[200] = {
             description: 'Report Data',
             schema: { ref: '#/definitions/ReportDataArray' }
     } */
    next();
};

const get_Reports_ReportId = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Reports'] */
    /* #swagger.responses[200] = {
             description: 'Report Data',
             schema: { ref: '#/definitions/ReportData' }
     } */
    next();
};

const post_Reports = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Reports'] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: { ref: '#/definitions/ReportData' }
   } */
    next();
}

const patch_Reports_ReportId = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Reports'] */
    /* #swagger.responses[200] = {
             description: 'Report Data',
             schema: { ref: '#/definitions/ReportData' }
     } */
    next();
}

const delete_Reports_ReportId = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Reports'] */
    next();
}

export default {
    get_Reports, get_Reports_ReportId, post_Reports,
patch_Reports_ReportId,delete_Reports_ReportId
}