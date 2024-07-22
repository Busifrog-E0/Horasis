const post_Discussion = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/PostDiscussionsData' }
   } 
*/
     next();
}

const patch_Discussion_DiscussionId_CoverPicture = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/PatchDiscussionsCoverData' }
   } 
*/
    next();
}

export default {
    post_Discussion,
    patch_Discussion_DiscussionId_CoverPicture
}