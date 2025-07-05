const post_Admin_Login = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Admin'] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: { $ref: '#/definitions/Admindata' }
   } 
   */
    next();
}


const patch_Admin = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Admin'] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: { $ref: '#/definitions/Admindata' }
   } 
   */
    next();
}

const patch_Admin_AddAdmin = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Admin'] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: { UserId : "string" }
   } 
   */
    next();
}

const patch_Admin_RemoveAdmin = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Admin'] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: { UserId : "string" }
   } 
   */
    next();
}

const get_Admin_Users = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Admin'] */
    /* #swagger.responses[200] = {
                 description: 'User Data',
                 schema: { $ref: '#/definitions/UserDataArray' }
         } 
     */
    next();
}

export default {
    post_Admin_Login,
    patch_Admin,
    patch_Admin_AddAdmin,
    patch_Admin_RemoveAdmin,
    get_Admin_Users
}