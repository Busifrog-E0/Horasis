import { IncrementDiscussions, ReadOneFromDiscussions } from "../databaseControllers/discussions-databaseController.js";
import { IncrementEvents, ReadOneFromEvents } from "../databaseControllers/events-databaseController.js";
import { IncrementPodcasts, ReadOneFromPodcasts } from "../databaseControllers/podcasts-databaseController.js";

/**@typedef {'Discussion'|'Event'|'Podcast'} Type */


/**
 * 
 * @param {string} EntityId 
 * @param {Type} Type 
 * @returns 
 */
const ReadAType = async (EntityId, Type,) => {
    let EntityData;
    switch (Type) {
        case "Discussion": {
            EntityData = await ReadOneFromDiscussions(EntityId); break;
        }
        case "Event": {
            EntityData = await ReadOneFromEvents(EntityId); break;
        }
        case "Podcast": {
            EntityData = await ReadOneFromPodcasts(EntityId); break;
        }
    }
    return EntityData;
}

/**
 * 
 * @param {string} EntityId 
 * @param {Type} Type 
 * @param {object} incData
 * @returns 
 */
const IncrementAType = async (EntityId, Type, incData) => {
    switch (Type) {
        case "Discussion": {
            await IncrementDiscussions(incData, EntityId); break;
        }
        case "Event": {
            await IncrementEvents(incData, EntityId); break;
        }
        case "Podcast": {
            await IncrementPodcasts(incData, EntityId); break;
        }
    }
}


export {
    ReadAType, IncrementAType,
}