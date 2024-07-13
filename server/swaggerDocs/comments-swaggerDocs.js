const post_Comments = async (req, res, next) => {
    // #swagger.tags = ['Comments']
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: { Content: 'This is a comment.',ParentId: null, UserId: 'user123' }
   } 
*/
    next();
}


export default {
    post_Comments
}