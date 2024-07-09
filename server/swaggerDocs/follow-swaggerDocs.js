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

export default {
    post_Follow,delete_Follow
}