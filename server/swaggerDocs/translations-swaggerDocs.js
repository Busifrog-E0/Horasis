
const post_Translations = (req, res, next) => {
    // #swagger.tags = ['Translations']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
                    in: 'body',
                    schema: { EntityId : "string" , Type : "Activity" , TargetLanguage : "German" }
        } 
    */
    next();
}

export default {
    post_Translations
}