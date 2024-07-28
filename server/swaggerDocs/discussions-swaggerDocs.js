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

const delete_Discussions_DiscussionId_Invite_Reject = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const delete_Discussions_DiscussionId_Invite_Cancel = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const delete_Discussions_DiscussionId_Leave = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_User_UserId_Discussions = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Discussion Data',
                 schema: { $ref: '#/definitions/DiscussionDataArray' }
         } 
     */
    next();
}

const delete_Discussion_DiscussionId_Join_Cancel = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_Discussions_Invited = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Discussion Data',
                 schema: { $ref: '#/definitions/DiscussionDataArray' }
         } 
     */
    next();
}

const get_Discussions_DiscussionId_Members_Requested = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Discussion Data',
                 schema: { $ref: '#/definitions/MemberData' }
         } 
     */
    next();
}

const post_Discussions_DiscussionId_Save = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_Discussions_DiscussionId_Save = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                description: 'Discussion Data',
                schema: { $ref: '#/definitions/DiscussionDataArray' }
        } 
    */
    next();
}

const delete_Discussions_DiscussionId_Save = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const delete_Discussions_DiscussionId_Join_Reject= async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const patch_Discussions_DiscussionId_Join_Accept = async (req, res, next) => {
    // #swagger.tags = ['Discussions']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}


export default {
    post_Discussion,get_User_UserId_Discussions,get_Discussions_DiscussionId_Members_Requested,
    patch_Discussion_DiscussionId_CoverPicture,post_Discussions_DiscussionId_Save,
    get_Discussions, delete_Discussion_DiscussionId_Join_Cancel, get_Discussions_DiscussionId_Save,
    delete_Discussions_DiscussionId_Save,delete_Discussions_DiscussionId_Join_Reject,
    post_Discussions_EntityId_Join,get_Discussions_Invited,patch_Discussions_DiscussionId_Join_Accept,
    post_Discussions_EntityId_Invite_InviteeId,
    patch_Discussions_EntityId_Invite_Accept,
    patch_Discussions_EntityId_Member_Permissions,
    get_Discussions_DiscussionId_Activities,
    post_Discussions_DiscussionId_Activities,
    get_Discussions_DiscussionId_Members,
    delete_Discussions_DiscussionId_Invite_Cancel,
    delete_Discussions_DiscussionId_Invite_Reject,
    delete_Discussions_DiscussionId_Leave
}