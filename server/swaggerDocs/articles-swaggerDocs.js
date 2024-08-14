

const get_Articles = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Articles'] */
    /* #swagger.responses[200] = {
                 description: 'Article Data',
                 schema: { $ref: '#/definitions/ArticleDataArray' }
         } */
    next();
};

const get_Articles_ArticleId = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Articles'] */
    /* #swagger.responses[200] = {
                 description: 'Article Data',
                 schema: { $ref: '#/definitions/ArticleData' }
         } */
    next();
};

const post_Articles = async (req, res, next) => {
/* #swagger.security = [{ "BearerAuth": [] }] */
/* #swagger.tags = ['Articles'] */
/* #swagger.parameters['body'] = {
               in: 'body',
               schema: { $ref: '#/definitions/PostArticlesData' }
   } */
    next();
}

const post_Articles_ArticleId_Save = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Articles'] */
    next();
}

const get_Articles_ArticleId_Save = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Articles'] */
    /* #swagger.responses[200] = {
             description: 'Article Data',
             schema: { $ref: '#/definitions/ArticleDataArray' }
     } */
    next();
}

const delete_Articles_ArticleId_Save = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Articles'] */
    next();
}

const patch_Articles_ArticleId = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Articles'] */
    /* #swagger.responses[200] = {
             description: 'Article Data',
             schema: { $ref: '#/definitions/ArticlePatchData' }
     } */
    next();
}

const patch_Articles_ArticleId_CoverPicture = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Articles'] */
    /* #swagger.responses[200] = {
             description: 'Article Data',
             schema: { CoverPhoto : "string" }
     } */
    next();
}

export default {
    get_Articles, get_Articles_ArticleId, post_Articles,
    post_Articles_ArticleId_Save, get_Articles_ArticleId_Save,
    delete_Articles_ArticleId_Save, patch_Articles_ArticleId,
    patch_Articles_ArticleId_CoverPicture
}