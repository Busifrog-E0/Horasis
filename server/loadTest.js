import { faker } from '@faker-js/faker'
import dataHandling from './databaseControllers/functions.js'
import { ReadOneFromUsers, ReadUsers } from './databaseControllers/users-databaseController.js'
const GenerateUsers = (numUsers) => {
    const users = [];

    for (let i = 0; i < numUsers; i++) {
        const createdIndex = Date.now() + i; // Unique creation time for indexing
        users.push({
            FullName: faker.person.fullName(),
            Email: faker.internet.email(),
            Username: faker.internet.userName(),
            Password: faker.internet.password(),
            Country: faker.location.country(),
            City: faker.location.city(),
            JobTitle: faker.person.jobTitle(),
            Industry: faker.commerce.department(),
            CompanyName: faker.company.name(),
            About: faker.lorem.sentence({ min: 20, max: 50 }),
            ProfilePicture: '', // Can add default or random picture URLs
            CoverPicture: '',   // Can add default or random cover picture URLs
            CreatedIndex: createdIndex,
            Index: String(createdIndex),
        });
    }
    return users;
}

const GenerateFollows = async () => {
    const follows = [];
    const FollowerId = "66a28143759fc91dd06c6a9f";
    const follower = await ReadOneFromUsers(FollowerId);
    const users = await ReadUsers({}, undefined, -1, undefined);
    await Promise.all(users.map(async user => {
        if (user._id.toString() !== FollowerId) {
            const follow = {
                FollowerId: FollowerId,
                FolloweeId: user._id.toString(),
                UserDetails: [follower, user],
                CreatedIndex: Date.now(),
                Index: String(Date.now())
            }
            follows.push(follow)
        }
    }));

    return follows
}

const GenerateConnections = async () => {
    const connections = [];
    const SenderId = "66a28143759fc91dd06c6a9f";
    const follower = await ReadOneFromUsers(SenderId);
    const users = await ReadUsers({}, undefined, -1, undefined);
    await Promise.all(users.map(async user => {
        if (user._id.toString() !== SenderId) {
            const follow = {
                SenderId: SenderId,
                RecieverId: user._id.toString(),
                UserIds: [SenderId, user._id.toString()],
                UserDetails: [follower, user],
                AcceptedIndex: Date.now(),
                Status: "Connected",
                CreatedIndex: Date.now(),
                Index: String(Date.now())
            }
            connections.push(follow)
        }
    }));

    return connections
}

const GeneratePosts = async () => {
    const users = await ReadUsers({}, undefined, -1, undefined);
    const posts = [];
    users.map(user => {

        const numPosts = faker.number.int({ min: 5, max: 15 });
        for (let i = 0; i < numPosts; i++) {
            const createdIndex = Date.now() + faker.number.int({ min: -10000, max: 10000 });
            const post = {
                NoOfLikes: 0,
                NoOfComments: 0,
                OriginalLanguage: "English",
                Type: "Feed",
                EntityId: "Feed",
                UserId: user._id.toString(),
                MediaFiles: [],
                Documents: [],
                Mentions: [],
                Content: faker.lorem.sentence({ min: 20, max: 50 }),
                CreatedIndex: createdIndex,
                Index: String(createdIndex)
            }
            posts.push(post)
        }
    });
    return posts;
}

try {
    // await dataHandling.db.collection("Users").insertMany(GenerateUsers(10000))
    // await dataHandling.db.collection("Follows").insertMany(await GenerateFollows())
    // await dataHandling.db.collection("Connections").insertMany(await GenerateConnections())
    await dataHandling.db.collection("Activities").insertMany(await GeneratePosts())
    console.log("finished")
} catch (error) {
    console.log(error)
}
