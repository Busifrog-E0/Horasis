

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


export default {
    get_Articles,get_Articles_ArticleId,post_Articles
}