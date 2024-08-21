const post_Events = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/PostEventsData' }
   } 
*/
    next();
}

const patch_Events_EventId_CoverPicture = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/PatchEventsCoverData' }
   } 
*/
    next();
}

const get_Events = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Event Data',
                 schema: { $ref: '#/definitions/EventDataArray' }
         } 
     */
    next();
}

const get_Events_EventsId = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Event Data',
                 schema: { $ref: '#/definitions/EventsData' }
         } 
     */
    next();
}

const post_Events_EntityId_Join = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const post_Events_EntityId_Invite_InviteeId = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
          in: 'body',
          schema: {  IsSpeaker : false }
} 
*/
    next();
}

const patch_Events_EntityId_Invite_Accept = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const patch_Events_EntityId_Member_Permissions = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/UpdatePermissionData' }
   } 
*/
    next();
}

const post_Events_EventId_Activities = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/ActivityGetDataArray' }
   } 
*/
    next();
}

const get_Events_EventId_Activities = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                   description: 'Event Data',
                   schema: { $ref: '#/definitions/ActivityGetDataArray' }
           } 
       */
    next();
}

const get_Events_EventId_Members = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                   description: 'Event Data',
                   schema: { $ref: '#/definitions/MemberData' }
           } 
       */
    next();
}

const delete_Events_EventId_Invite_Reject = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const delete_Events_EventId_Invite_Cancel = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const delete_Events_EventId_Leave = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_User_UserId_Events = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Event Data',
                 schema: { $ref: '#/definitions/EventDataArray' }
         } 
     */
    next();
}

const delete_Event_EventId_Join_Cancel = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_Events_Invited = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Event Data',
                 schema: { $ref: '#/definitions/EventDataArray' }
         } 
     */
    next();
}

const get_Events_EventId_Members_Requested = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Event Data',
                 schema: { $ref: '#/definitions/MemberData' }
         } 
     */
    next();
}

const post_Events_EventId_Save = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_Events_EventId_Save = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                description: 'Event Data',
                schema: { $ref: '#/definitions/EventDataArray' }
        } 
    */
    next();
}

const delete_Events_EventId_Save = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const delete_Events_EventId_Join_Reject = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const patch_Events_EventId_Join_Accept = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_Events_EventId_Members_Invited = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const patch_Events_EntityId_Member_Permissions_Remove = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  PermissionField : "CanPostActivity" }
   } 
*/
    next();
}
const patch_Events_EntityId_Member_Permissions_Everyone = async (req, res, next) => {
    // #swagger.tags = ['Events']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  'MemberPermissions.CanPostActivity' : true }
   } 
*/
    next();
}


export default {
    post_Events, get_User_UserId_Events, get_Events_EventId_Members_Requested,
    patch_Events_EventId_CoverPicture, post_Events_EventId_Save,
    get_Events, delete_Event_EventId_Join_Cancel, get_Events_EventId_Save,
    delete_Events_EventId_Save, delete_Events_EventId_Join_Reject,
    post_Events_EntityId_Join, get_Events_Invited, patch_Events_EventId_Join_Accept,
    post_Events_EntityId_Invite_InviteeId, get_Events_EventId_Members_Invited,
    patch_Events_EntityId_Invite_Accept, patch_Events_EntityId_Member_Permissions_Remove,
    patch_Events_EntityId_Member_Permissions,
    get_Events_EventId_Activities,
    post_Events_EventId_Activities,
    get_Events_EventId_Members,
    delete_Events_EventId_Invite_Cancel,
    delete_Events_EventId_Invite_Reject,
    delete_Events_EventId_Leave,
    patch_Events_EntityId_Member_Permissions_Everyone,
    get_Events_EventsId
}