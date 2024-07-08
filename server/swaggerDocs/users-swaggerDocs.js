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
    /* #swagger.responses[200] = {
                 description: 'User Data',
                 schema: { $ref: '#/definitions/UserData' }
         } 
     */
    next();
}

const post_Users_Verify = async (req, res, next) => {
    // #swagger.tags = ['Users']
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

const get_Users_CheckUsername = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { 'Username' : "JohnDoe" }
        } 
    */

    next();
}

const patch_Users_UserId = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { $ref: '#/definitions/PatchUserData' }
        } 
    */

    next();
}

export default {
    post_Users_Register,get_Users_CheckUsername,
    post_Users_Login,patch_Users_UserId,
    get_Users_UserId,
    post_Users_Verify
}