

const post_files_users = (req, res, next) => {
    // #swagger.tags = ['Files']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
                in: 'body',
                schema: { "FileName": "input.pdf","FileData":[123,456],"FileFieldName":"ProfilePicture" }
       }
    */
    /* #swagger.responses[200] = {
                     description: 'Files Response',
                     schema: { "FileUrl":"https://oxydebug.sgp1.cdn.digitaloceanspaces.com/Users/idName/input.pdf" }
             } 
     */

    return next();
}

const post_files_admin = (req, res, next) => {
    // #swagger.tags = ['Files']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
                in: 'body',
                schema: { "FileName": "input.pdf","FileData":[123,456] }
       }
    */
    /* #swagger.responses[200] = {
                     description: 'Files Response',
                     schema: { "FileUrl":"https://oxydebug.sgp1.cdn.digitaloceanspaces.com/Users/idName/input.pdf" }
             } 
     */

    return next();
}

export default {
    post_files_users,
    post_files_admin,
}