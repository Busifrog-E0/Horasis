import ENV from "./Env.js";

import cors from "cors";
import express, { json, urlencoded } from 'express';
import { Socket, Server } from "socket.io";
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit'
import db from './databaseControllers/db.config.js';
import { readFile } from 'fs/promises';

const PORT = ENV.PORT;
// const PORT = 443;


const app = express();

import router from "./routes/index.js";

const allowedOrigins = ['https://hsocial.web.app', 'http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

app.use(express.json({ "limit": "60mb" }));

app.use(json());
app.use(urlencoded({
    extended: true
}));

app.use(helmet({ contentSecurityPolicy: false }));
const limiter = rateLimit({
    windowMs: 60 * 1000, // 15 mins
    max: 300,
    message: {
        status: 429,
        error: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(limiter);
import errorHandler from './middleware/errorHandling-middleware.js';


import swaggerUi from 'swagger-ui-express';
const raw = await readFile('./swaggerOutput.json', 'utf-8');
const swaggerFile = JSON.parse(raw);
// import swaggerFile from './swaggerOutput.json' with { type: 'json' };
// import { FirstSetupAdminInfo } from "./databaseControllers/admins-databaseController.js";
import { ClearAdminRoleArray, ClearLogoutUsers, GenerateToken } from "./controllers/auth-controller.js";
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
    ClearLogoutUsers();
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









