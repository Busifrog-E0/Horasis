const post_Podcast = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/PostPodcastsData' }
   } 
*/
    next();
}

const patch_Podcast_PodcastId_CoverPicture = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/PatchPodcastsCoverData' }
   } 
*/
    next();
}

const get_Podcasts = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Podcast Data',
                 schema: { $ref: '#/definitions/PodcastDataArray' }
         } 
     */
    next();
}

const get_Guest_Podcasts = async (req, res, next) => {
    // #swagger.tags = ['Guests']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Podcast Data',
                 schema: { $ref: '#/definitions/PodcastDataArray' }
         } 
     */
    next();
}

const post_Podcasts_EntityId_Join = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const post_Podcasts_EntityId_Invite_InviteeId = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
              in: 'body',
              schema: {  IsSpeaker : false }
  } 
*/
    next();
}

const patch_Podcasts_EntityId_Invite_Accept = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const patch_Podcasts_EntityId_Member_Permissions = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/UpdatePermissionData' }
   } 
*/
    next();
}

const post_Podcasts_PodcastId_Activities = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  $ref: '#/definitions/ActivityGetDataArray' }
   } 
*/
    next();
}

const get_Podcasts_PodcastId_Activities = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                   description: 'Podcast Data',
                   schema: { $ref: '#/definitions/ActivityGetDataArray' }
           } 
       */
    next();
}

const get_Podcasts_PodcastId_Members = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                   description: 'Podcast Data',
                   schema: { $ref: '#/definitions/MemberData' }
           } 
       */
    next();
}

const delete_Podcasts_PodcastId_Invite_Reject = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const delete_Podcasts_PodcastId_Invite_Cancel = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const delete_Podcasts_PodcastId_Leave = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_User_UserId_Podcasts = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Podcast Data',
                 schema: { $ref: '#/definitions/PodcastDataArray' }
         } 
     */
    next();
}

const delete_Podcast_PodcastId_Join_Cancel = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_Podcasts_Invited = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Podcast Data',
                 schema: { $ref: '#/definitions/PodcastDataArray' }
         } 
     */
    next();
}

const get_Podcasts_PodcastId_Members_Requested = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                 description: 'Podcast Data',
                 schema: { $ref: '#/definitions/MemberData' }
         } 
     */
    next();
}

const post_Podcasts_PodcastId_Save = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_Podcasts_PodcastId_Save = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.responses[200] = {
                description: 'Podcast Data',
                schema: { $ref: '#/definitions/PodcastDataArray' }
        } 
    */
    next();
}

const delete_Podcasts_PodcastId_Save = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const delete_Podcasts_PodcastId_Join_Reject = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const patch_Podcasts_PodcastId_Join_Accept = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const get_Podcasts_PodcastId_Members_Invited = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    next();
}

const patch_Podcasts_EntityId_Member_Permissions_Remove = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  PermissionField : "CanPostActivity" }
   } 
*/
    next();
}
const patch_Podcasts_EntityId_Member_Permissions_Everyone = async (req, res, next) => {
    // #swagger.tags = ['Podcasts']
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.parameters['body'] = {
               in: 'body',
               schema: {  'MemberPermissions.CanPostActivity' : true }
   } 
*/
    next();
}


export default {
    post_Podcast, get_User_UserId_Podcasts, get_Podcasts_PodcastId_Members_Requested,
    patch_Podcast_PodcastId_CoverPicture, post_Podcasts_PodcastId_Save,
    get_Podcasts, delete_Podcast_PodcastId_Join_Cancel, get_Podcasts_PodcastId_Save,
    delete_Podcasts_PodcastId_Save, delete_Podcasts_PodcastId_Join_Reject,
    post_Podcasts_EntityId_Join, get_Podcasts_Invited, patch_Podcasts_PodcastId_Join_Accept,
    post_Podcasts_EntityId_Invite_InviteeId, get_Podcasts_PodcastId_Members_Invited,
    patch_Podcasts_EntityId_Invite_Accept, patch_Podcasts_EntityId_Member_Permissions_Remove,
    patch_Podcasts_EntityId_Member_Permissions,
    get_Podcasts_PodcastId_Activities,
    post_Podcasts_PodcastId_Activities,
    get_Podcasts_PodcastId_Members,
    delete_Podcasts_PodcastId_Invite_Cancel,
    delete_Podcasts_PodcastId_Invite_Reject,
    delete_Podcasts_PodcastId_Leave,
    patch_Podcasts_EntityId_Member_Permissions_Everyone,
    get_Guest_Podcasts,
}