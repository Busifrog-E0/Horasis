import ENV from "./Env.js";

import cors from "cors";
import express, { json, urlencoded } from 'express';
import { Socket, Server } from "socket.io";


import db from './databaseControllers/db.config.js';
const PORT = ENV.PORT;
// const PORT = 443;


const app = express();

import router from "./routes/index.js";

app.use(cors({ origin: true }));
app.use(express.json({ "limit": "60mb" }));

app.use(json());
app.use(urlencoded({
    extended: true
}));
import errorHandler from './middleware/errorHandling-middleware.js';


import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swaggerOutput.json' assert { type: 'json' };
// import { FirstSetupAdminInfo } from "./databaseControllers/admins-databaseController.js";
import { ClearAdminRoleArray, GenerateToken } from "./controllers/auth-controller.js";
import { decodeSocketIdToken } from "./middleware/auth-middleware.js";
import { ConnectSocket } from "./controllers/socket-controller.js";
import { CreateActiveUsers } from "./databaseControllers/activeUsers-databaseController.js";




app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((req, res, next) => {
    console.log(req.method, req.originalUrl);
    return next();
})

app.use(router);

app.use(errorHandler);

setInterval(() => {
    ClearAdminRoleArray();
}, 1000 * 60 * 60 * 12);




const expressServer = app.listen(PORT, async (err) => {
    await db.init();
    // await FirstSetupAdminInfo();

    console.log(`Server is up at localhost ${PORT}`);
    const CurrentUser = {
        // Role: 'Admin',
        // UserId: "Admin",
        Role: ['Admin', 'User'],
        UserId: "669a2369525967c06f6bfc0a",
        RegistrationStatus: "",
        Subscription: null
    }
    GenerateToken(CurrentUser);
});

ConnectSocket(expressServer);









