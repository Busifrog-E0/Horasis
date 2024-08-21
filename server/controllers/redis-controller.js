import { Redis } from "ioredis";


const redis = new Redis();

/**
 * 
 * @param {string} key 
 * @param {object} value 
 * @param {number} expiration 
 */
const SetCache = async (key, value, expiration = 3600) => {
    await redis.set(key, JSON.stringify(value), "EX", expiration);
}

/**
 * 
 * @param {string} key 
 * @returns {Promise<object|null>}
 */
const GetCache = async (key) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
}

/**
 * 
 * @param {string} pattern 
 */
const DeleteCache = async (pattern) => {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        await redis.del(...keys);
    }
};

const DeleteCacheByPattern = async (pattern) => {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        await redis.del(...keys);
    }
};

export {
    SetCache, GetCache, DeleteCache, DeleteCacheByPattern
}