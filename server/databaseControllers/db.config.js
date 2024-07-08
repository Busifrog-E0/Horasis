import { MongoClient } from 'mongodb';
import ENV from "./../Env.js";

const client = new MongoClient(ENV.MongoDB_Host);

const init = async () => {
    try {
        await client.connect();
        console.log("Connected");
    } catch (error) {
        console.log(error);
    }
};

const getClient = () => {
    return client;
};

export default {
    init,
    getClient
}