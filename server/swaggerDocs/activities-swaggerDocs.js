const post_Activities = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Activities']
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: { $ref: '#/definitions/ActivityPostData' }
   } 
*/
    next();
}

const patch_Activities = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Activities']
    /* #swagger.parameters['body'] = {
                   in: 'body',
                   schema: { Content : "string" }
       } 
   */
    next();
}

const get_Activities = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Activities']
    /* #swagger.responses[200] = {
                 description: 'Activity Data',
                 schema: { $ref: '#/definitions/ActivityGetDataArray' }
         } 
     */
    next();
}

const get_Activities_ActivityId = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Activities']
    /* #swagger.responses[200] = {
                 description: 'Activity Data',
                 schema: { $ref: '#/definitions/ActivityGetData' }
         } 
     */
    next();
}

const delete_Activities_ActivityId = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Activities']
    next();
}

const post_Activities_ActivityId_Like = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Activities']
    next();
}

const delete_Activities_ActivityId_Dislike = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Activities']
    next();
}
const get_Activities_ActivityId_LikedUsers = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Activities']
    /* #swagger.responses[200] = {
                 description: 'Activity Data',
                 schema: { $ref: '#/definitions/LikedUsersData' }
         } 
     */
    next();
}

const post_Activities_ActivityId_Save = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Activities']
    next();
}

const delete_Activities_ActivityId_Save = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Activities']
    next();
}

const get_User_UserId_Activities_Save = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Activities']
    next();
}

export default {
    post_Activities,post_Activities_ActivityId_Like,
    patch_Activities,delete_Activities_ActivityId_Dislike,
    get_Activities,get_Activities_ActivityId_LikedUsers,
    get_Activities_ActivityId,post_Activities_ActivityId_Save,
    delete_Activities_ActivityId, delete_Activities_ActivityId_Save,
    get_User_UserId_Activities_Save
}