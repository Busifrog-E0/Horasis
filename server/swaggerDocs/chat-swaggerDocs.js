const get_Chat = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Chat']
    /* #swagger.responses[200] = {
                 description: 'Chat Data',
                 schema: { $ref: '#/definitions/ConversationDataArray' }
         } 
     */
    next();
}

const get_Chat_ConversationId = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Chat']
    /* #swagger.responses[200] = {
                 description: 'Chat Data',
                 schema: { $ref: '#/definitions/ConversationData' }
         } 
     */
    next();
}

const get_Chat_ConversationId_Messages = async (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    // #swagger.tags = ['Chat']
    /* #swagger.responses[200] = {
                 description: 'Chat Data',
                 schema: { $ref: '#/definitions/MessageDataArray' }
         } 
     */
    next();
}

export default {
    get_Chat,
    get_Chat_ConversationId,
    get_Chat_ConversationId_Messages
}

