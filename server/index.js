import ENV from "./Env.js";

import cors from "cors";
import express, { json, urlencoded } from 'express';


import db from './databaseControllers/db.config.js';
const PORT = ENV.PORT;
// const PORT = 443;


const app = express();

import router from "./routes/index.js";

app.use(cors({ origin: true }));
app.use(express.json({ "limit": "20mb" }));

app.use(json());
app.use(urlencoded({
    extended: true
}));
import errorHandler from './middleware/errorHandling-middleware.js';


import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swaggerOutput.json' assert { type: 'json' };
// import { FirstSetupAdminInfo } from "./databaseControllers/admins-databaseController.js";
import { GenerateToken } from "./controllers/auth-controller.js";
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((req, res, next) => {
    console.log(req.method, req.originalUrl);
    return next();
})

app.use(router);

app.use(errorHandler);




(async () => {
    await db.init();
    // await FirstSetupAdminInfo();


    app.listen(PORT, (err) => {
        console.log(`Server is up at localhost ${PORT}`);
        const CurrentUser = {
            // Role: 'Admin',
            // UserId: "Admin",
            Role: 'User',
            UserId: "668d391c8faf7d50f734eb69",
            RegistrationStatus: "",
            Subscription: null
        }
        GenerateToken(CurrentUser);
    });


})();





