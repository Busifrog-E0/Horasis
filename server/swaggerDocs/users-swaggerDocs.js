const post_Users_Register = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { $ref: '#/definitions/UserRegisterData' }
        } 
    */
    /* #swagger.responses[200] = {
                 description: '',
                 schema: { 'OTPId' : "string" }
         } 
     */

    next();
}

const post_Users_Login = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { $ref: '#/definitions/UserLoginData' }
        } 
    */
    /* #swagger.responses[200] = {
                 description: 'User Data',
                 schema: { $ref: '#/definitions/LoginData' }
         } 
     */
    next();
}

const get_Users_UserId = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'User Data',
                 schema: { $ref: '#/definitions/UserData' }
         } 
     */
    next();
}

const get_Users = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'User Data',
                 schema: { $ref: '#/definitions/UserDataArray' }
         } 
     */
    next();
}

const get_Users_Suggested = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'User Data',
                 schema: { $ref: '#/definitions/UserDataArray' }
         } 
     */
    next();
}

const post_Users_Verify = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { $ref: '#/definitions/OTPVerifyData' }
        } 
    */
    /* #swagger.responses[200] = {
             description: 'User Data',
             schema: { $ref: '#/definitions/LoginData' }
     } 
 */
    next();
}

const post_Users_CheckUsername = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { 'Username' : "JohnDoe" }
        } 
    */

    next();
}

const patch_Users_UserId = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { $ref: '#/definitions/PatchUserData' }
        } 
    */

    next();
}

const patch_Users_UserId_Picture = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: {'CoverPicture' : 'string','ProfilePicture' : 'string'}
        } 
    */

    next();
}

const get_Users_UserId_Media = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'User Data',
                 schema: { $ref: '#/definitions/GetMediaArray' }
         } 
     */
    next();
}

const post_Users_ForgotPassword = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { Email : "wXU8I@example.com" }
        } 
    */
    next();
}

const post_Users_ForgotPassword_Verify = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { $ref: '#/definitions/OTPVerifyData' }
        } 
    */
    next();
}

const post_Users_ForgotPassword_Reset = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { OTPId : "string" , Password : "string" }
        } 
    */
    next();
}

const get_Users_UserId_Notifications = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'User Data',
                 schema: { $ref: '#/definitions/GetNotificationArray' }
         } 
     */
    next();
}

const get_Users_UserId_Notifications_NotificationId = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'User Data',
                 schema: { $ref: '#/definitions/GetNotificationArray' }
         } 
     */
    next();
}

export default {
    post_Users_Register,post_Users_CheckUsername,
    post_Users_Login,patch_Users_UserId,
    get_Users_UserId, patch_Users_UserId_Picture,
    post_Users_Verify, get_Users, get_Users_Suggested,
    get_Users_UserId_Media, post_Users_ForgotPassword,
    post_Users_ForgotPassword_Verify,
    post_Users_ForgotPassword_Reset,
    get_Users_UserId_Notifications,
    get'
}