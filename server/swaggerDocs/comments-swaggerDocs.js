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

const post_Comments_CommentId_Like = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Comments']
    next();
}

const delete_Comments_CommentId_Dislike = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Comments']
    next();
}
const get_Comments_CommentId_LikedUsers = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Comments']
    /* #swagger.responses[200] = {
                 description: '',
                 schema: { $ref: '#/definitions/LikedUsersData' }
         } 
     */
    next();
}
export default {
    post_Comments,
    get_Comments, get_Comments_CommentId,
    delete_Comments_CommentId,
    post_Comments_CommentId_Like,delete_Comments_CommentId_Dislike,get_Comments_CommentId_LikedUsers
}