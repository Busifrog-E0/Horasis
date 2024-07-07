const post_Users_Register = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { $ref: '#/definitions/UserRegisterData' }
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
    next();
}

export default {
    post_Users_Register,
    post_Users_Login,
    get_Users_UserId,
    post_Users_Verify
}