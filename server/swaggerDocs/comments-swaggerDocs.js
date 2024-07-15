const post_Comments = async (req, res, next) => {
    // #swagger.tags = ['Comments']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: { Content: 'This is a comment.',ParentId: "asdfadfadfa", UserId: 'user123' }
   } 
*/
    next();
}


const get_Comments = async (req, res, next) => {
    // #swagger.tags = ['Comments']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'User Data',
                 schema: { $ref: '#/definitions/CommentDataArray' }
         } 
     */
    next();
}

const get_Comments_CommentId = async (req, res, next) => {
    // #swagger.tags = ['Comments']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'User Data',
                 schema: { $ref: '#/definitions/CommentData' }
         } 
     */
    next();
}

const delete_Comments_CommentId = async (req, res, next) => {
    // #swagger.tags = ['Comments']
    /* #swagger.security = [{ "BearerAuth": [] }] */

    next();
}
export default {
    post_Comments,
    get_Comments, get_Comments_CommentId,
    delete_Comments_CommentId
}