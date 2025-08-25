
const post_Members_EntityId_Join = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
              in: 'body',
              schema: {  Type : "Event" }
  } 
*/
    next();
}

const post_Members_EntityId_Invite_InviteeId = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
              in: 'body',
              schema: {  IsSpeaker : false ,  Type : "Event" }
  } 
*/
    next();
}

const patch_Members_EntityId_Invite_Accept = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
              in: 'body',
              schema: {  Type : "Event" }
  } 
*/
    next();
}

const patch_Members_EntityId_Member_Permissions = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/UpdatePermissionData' }
   } 
*/
    next();
}


const get_Members_EntityId_Members = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                   description: 'Member Data',
                   schema: { $ref: '#/definitions/MemberData' }
           } 
       */
    next();
}

const delete_Members_EntityId_Invite_Reject = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const delete_Members_EntityId_Invite_Cancel = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const delete_Members_EntityId_Leave = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}


const delete_Member_EntityId_Join_Cancel = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_Members_Invited = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Member Data',
                 schema: { $ref: '#/definitions/MemberDataArray' }
         } 
     */
    next();
}

const get_Members_EntityId_Members_Requested = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Member Data',
                 schema: { $ref: '#/definitions/MemberData' }
         } 
     */
    next();
}


const delete_Members_EntityId_Join_Reject = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const patch_Members_EntityId_Join_Accept = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_Members_EntityId_Members_Invited = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const patch_Members_EntityId_Member_Permissions_Remove = async (req, res, next) => {
    // #swagger.tags = ['Members']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  PermissionField : "CanPostActivity" }
   } 
*/
    next();
}

export default {
    post_Members_EntityId_Join,
    post_Members_EntityId_Invite_InviteeId,
    patch_Members_EntityId_Invite_Accept,
    patch_Members_EntityId_Member_Permissions,
    get_Members_EntityId_Members,
    delete_Members_EntityId_Invite_Reject,
    delete_Members_EntityId_Invite_Cancel,
    delete_Members_EntityId_Leave,
    delete_Member_EntityId_Join_Cancel,
    get_Members_Invited,
    get_Members_EntityId_Members_Requested,
    delete_Members_EntityId_Join_Reject,
    patch_Members_EntityId_Join_Accept,
    get_Members_EntityId_Members_Invited,
    patch_Members_EntityId_Member_Permissions_Remove
}