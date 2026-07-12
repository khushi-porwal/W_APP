const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "E-Commerce API",
            version: "1.0.0",
            description: "API Documentation for MERN E-Commerce Application"
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Development Server"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: ["./routes/**/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;