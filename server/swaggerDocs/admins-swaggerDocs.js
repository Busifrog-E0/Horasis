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


export default {
    post_Admin_Login,
    patch_Admin,
    patch_Admin_AddAdmin,
    patch_Admin_RemoveAdmin
}