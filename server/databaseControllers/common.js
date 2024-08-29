import { ObjectId } from "mongodb";
import { ReadFollows, ReadOneFromFollows, UpdateFollows } from "./follow-databaseController.js";
import { ReadOneFromUsers } from "./users-databaseController.js";
import { ReadActivities, UpdateActivities } from "./activities-databaseController.js";
import { ReadDiscussions, UpdateDiscussions } from "./discussions-databaseController.js";

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



//await OriginalLanguageInActivities();

//UserDetailsinFollow()
//TypeFeedInActivities()

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
    VersionUpdate,
    Shuffle,
    
}