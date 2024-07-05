
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
    Shuffle
}