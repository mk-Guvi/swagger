require('./config/db');
const express = require('express');
const cors = require('cors');
const UserRoute = require('./routers/userRouter');
const bodyparser = require('body-parser');
const swaggerJSDOC = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
//port
const PORT = process.env.PORT || 8079;

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'RESTAPI',
            version: '1.0.0',
            description: 'ysquare users rest api',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./src/routers/*.ts'],
};
const specs = swaggerJSDOC(options);
const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.get('/', (req, res) => {
    res.send('<h1>Rest API Server!</h1>');
});
app.use(cors());
app.use(bodyparser.json());
app.use('/user', UserRoute);

app.listen(PORT, () => {
    console.log(`Server running @ ${PORT}`);
});
