const post_Saves = (req, res, next) => {
    // #swagger.tags = ['Saves']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { EntityId : "string" , Type : "Activity" }
        } 
    */
    next();
}

export default {
    post_Saves
}