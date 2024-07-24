const post_Discussion = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/PostDiscussionsData' }
   } 
*/
     next();
}

const patch_Discussion_DiscussionId_CoverPicture = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/PatchDiscussionsCoverData' }
   } 
*/
    next();
}

const get_Discussions = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Discussion Data',
                 schema: { $ref: '#/definitions/DiscussionDataArray' }
         } 
     */
    next();
}

const post_Discussions_EntityId_Join = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const post_Discussions_EntityId_Invite_InviteeId = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const patch_Discussions_EntityId_Invite_Accept = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const patch_Discussions_EntityId_Member_Permissions = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/UpdatePermissionData' }
   } 
*/
    next();
}

const post_Discussions_DiscussionId_Activities = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/ActivityGetDataArray' }
   } 
*/
    next();
}

const get_Discussions_DiscussionId_Activities = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                   description: 'Discussion Data',
                   schema: { $ref: '#/definitions/ActivityGetDataArray' }
           } 
       */
    next();
}

const get_Discussions_DiscussionId_Members = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                   description: 'Discussion Data',
                   schema: { $ref: '#/definitions/MemberData' }
           } 
       */
    next();
}

export default {
    post_Discussion,
    patch_Discussion_DiscussionId_CoverPicture,
    get_Discussions,
    post_Discussions_EntityId_Join,
    post_Discussions_EntityId_Invite_InviteeId,
    patch_Discussions_EntityId_Invite_Accept,
    patch_Discussions_EntityId_Member_Permissions,
    get_Discussions_DiscussionId_Activities,
    post_Discussions_DiscussionId_Activities,
    get_Discussions_DiscussionId_Members
}