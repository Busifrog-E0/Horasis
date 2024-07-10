const post_Follow = async (req, res, next) => {
    // #swagger.tags = ['Follow']
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { 'FolloweeId' : 'string' }
        } 
    */
    next();
}

const delete_Follow = async (req, res, next) => {
    // #swagger.tags = ['Follow']
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { 'FolloweeId' : 'string' }
        } 
    */
    next();
}

const get_Followers = async (req, res, next) => {
    // #swagger.tags = ['Follow']
    /* #swagger.responses[200] = {
             description: 'User Data',
             schema: { $ref: '#/definitions/UserDataArray' }
     } 
 */
    next();
}

const get_Followings = async (req, res, next) => {
    // #swagger.tags = ['Follow']
    /* #swagger.responses[200] = {
             description: 'User Data',
             schema: { $ref: '#/definitions/UserDataArray' }
     } 
 */
    next();
}

const get_Follow_Count = async (req, res, next) => {
    // #swagger.tags = ['Follow']
    /* #swagger.responses[200] = {
             description: 'User Data',
             schema: { NoOfFollowers : 5,NoOfFollowings : 5 }
     } 
 */
    next();
}

export default {
    post_Follow, delete_Follow,
    get_Followers, get_Followings,
    get_Follow_Count
}