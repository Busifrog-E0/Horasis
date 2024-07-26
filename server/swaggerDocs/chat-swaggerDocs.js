const get_Chat = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Chat']
    /* #swagger.responses[200] = {
                 description: 'Chat Data',
                 schema: { $ref: '#/definitions/ConversationDataArray' }
         } 
     */
    return next();
}

const get_Chat_ConversationId = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Chat']
    /* #swagger.responses[200] = {
                 description: 'Chat Data',
                 schema: { $ref: '#/definitions/ConversationData' }
         } 
     */
    return next();
}

const get_Chat_ConversationId_Messages = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Chat']
    /* #swagger.responses[200] = {
                 description: 'Chat Data',
                 schema: { $ref: '#/definitions/MessageDataArray' }
         } 
     */
    return next();
}

const post_ReterieveConversationId = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Chat']
    /* #swagger.responses[200] = {
                 description: 'Chat Data',
                 schema: "60c72b345f1b2c0015a4e7d3"
         } 
     */
    return next();
}

export default {
    get_Chat,
    get_Chat_ConversationId,
    get_Chat_ConversationId_Messages,
    post_ReterieveConversationId,
}

