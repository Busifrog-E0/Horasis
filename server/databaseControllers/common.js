import moment from "moment";
import { ReadFollows, ReadOneFromFollows, UpdateFollows } from "./follow-databaseController.js";
import { ReadOneFromUsers, ReadUsers } from "./users-databaseController.js";
import { ReadActivities, UpdateActivities, UpdateManyActivities } from "./activities-databaseController.js";
import { ReadDiscussions, UpdateDiscussions } from "./discussions-databaseController.js";
import { CreateActiveUsers, ReadActiveUsers } from "./activeUsers-databaseController.js";
import { AddConnectionstoUser } from "../controllers/users-controller.js";
import { AddtoUserActivities } from "../controllers/activities-controller.js";
import { ReadLikes, UpdateLikes } from "./likes-databaseController.js";
import { GetLikes } from "../controllers/likes-controller.js";
import { GetParentTypeFromEntity } from "../controllers/common.js";
import { ReadComments, UpdateComments } from "./comments-databaseController.js";
import databaseHandling from "./functions.js";
import { CreateAdminForFirstTime } from "./admins-databaseController.js";


const FirstTimeSetup = async () => {
    await CreateAdminForFirstTime()

    await databaseHandling.db.collection('Likes').createIndex(
        { UserId: 1, EntityId: 1 },
        { unique: true }
    );

    await databaseHandling.db.collection('Follows').createIndex(
        { FolloweeId: 1, FollowerId: 1 },
        { unique: true }
    );

    await databaseHandling.db.collection('Members').createIndex(
        { MemberId: 1, EntityId: 1, MembershipStatus: 1 },
        { unique: true }
    );

}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 
 * @param {Function} ReadFn 
 * @param {Function} UpdateFn 
 * @param {object} where 
 * @returns 
 */
const VersionUpdate = async (ReadFn, UpdateFn, where = {}) => {
    let count = 0;
    let promises = [];
    let Index = undefined;
    while (true) {
        const documents = await ReadFn(where, Index, 600, undefined);
        if (documents.length === 0) {
            break;
        }
        for (const doc of documents) {
            promises.push(UpdateFn(doc));
            // await UpdateFn(doc);
            Index = doc.NextId;
            count++;
        }
        await Promise.all(promises);
        // await delay(60000)
        promises = [];
        console.log(count);

    }
    await Promise.all(promises);
    console.log(count);
    return count;
}

const OriginalLanguageInActivities = async () => {
    const update = async (activity) => {
        await UpdateDiscussions({ NoOfActivities: 0 }, activity.DocId);
    }
    await VersionUpdate(ReadDiscussions, update, { NoOfActivities: { '$exists': false } });
}

const CreateActiveUsersDocument = async () => {
    const Users = await ReadUsers({}, undefined, -1, undefined);
    await Promise.all(Users.map(async (user) => {
        //@ts-ignore
        const [ActiveUser] = await ReadActiveUsers({ UserId: user.DocId, Date: moment(user.CreatedIndex).startOf('day').valueOf() }, undefined, 1, undefined);
        if (!ActiveUser) {
            //@ts-ignore
            await CreateActiveUsers({ UserId: user.DocId, Date: moment(user.CreatedIndex).startOf('day').valueOf() });
        }
    }))
}

const CreateUserExtendedProperties = async () => {
    const Users = await ReadUsers({}, undefined, -1, undefined);
    for (let j = 0; j < Users.length; j++) {
        const User = Users[j];
        await AddConnectionstoUser(User.DocId, User.DocId);
    }
    const Follows = await ReadFollows({}, undefined, -1, undefined);
    for (let i = 0; i < Follows.length; i++) {
        const Follow = Follows[i]
        await AddConnectionstoUser(Follow.FolloweeId, Follow.FollowerId);
        console.log(Follow.FolloweeId, Follow.FollowerId)
    }

}

const CreateActivityExtendedProps = async () => {
    const Activities = await ReadActivities({ Type: "Feed" }, undefined, -1, undefined);
    await Promise.all(Activities.map(async Act => {
        await AddtoUserActivities(Act);
    }))
    console.log(1)
}

const AddUserDetailstoLikes = async () => {
    const Likes = await ReadLikes({ UserDetails: { $exists: false } }, undefined, -1, undefined);
    await Promise.all(Likes.map(async Like => {
        const UserDetails = await ReadOneFromUsers(Like.UserId);
        await UpdateLikes({ UserDetails }, Like.DocId);
    }))
    return;
}
//await OriginalLanguageInActivities();

//UserDetailsinFollow()
//TypeFeedInActivities()

const TypeFeedInProfileChangeActivities = async () => {
    await UpdateManyActivities({ Type: "Feed", EntityId: "Feed" }, { Type: { $exists: false } })
}

const ParentTypeInLikesAndComments = async () => {
    const Comments = await ReadComments({ RootParentId: { $exists: false } }, undefined, -1, undefined);
    await Promise.all(Comments.map(async Comment => {
        const { ParentId: RootParentId, ParentType: RootParentType } = await GetParentTypeFromEntity(Comment.DocId, "Comment");
        await UpdateComments({ RootParentId, RootParentType }, Comment.DocId);
    }))
}

const UserInComments = async () => {
    const Comments = await ReadComments({ UserDetails: { $exists: false } }, undefined, -1, undefined);
    await Promise.all(Comments.map(async Comment => {
        const UserDetails = await ReadOneFromUsers(Comment.UserId);
        await UpdateComments({ UserDetails }, Comment.DocId);
    }))
    console.log('finish')
}

function Shuffle(array) {
    let m = array.length, t, i;

    while (m) {

        i = Math.floor(Math.random() * m--);

        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}


export {
    FirstTimeSetup,
    VersionUpdate,
    Shuffle,
    CreateUserExtendedProperties,
    CreateActivityExtendedProps,
    AddUserDetailstoLikes,
    TypeFeedInProfileChangeActivities,
    ParentTypeInLikesAndComments,
    UserInComments,
}