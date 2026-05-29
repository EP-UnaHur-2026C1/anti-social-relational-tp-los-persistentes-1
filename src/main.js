console.log("UnaHur - Anti-Social net");

const express = require('express');
const app = express();

// Middlewares Globales (SIEMPRE ARRIBA)
app.use(express.json());

const db = require('../models'); 
require('dotenv').config();

//const swaggerUi = require('swagger-ui-express');
//const YAML = require('yamljs');                                               | ??????????????????????????
//const swaggerDocument = YAML.load('./doc/swagger.yaml');                      | Preguntar si se puede usar

// --- Importación de Rutas ---
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const userRouter = require('./routes/userRoutes');
const tagRouter = require('./routes/tagRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
// const followerRoutes = require('./routes/followerRoutes');

// --- Registro de Rutas ---
app.use('/user', userRouter);
app.use('/post', postRoutes);
app.use('/tag', tagRouter);
app.use('/comment', commentRoutes);
// app.use('/followers', followerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => { // al iniciar el servidor, se intenta conectar a la base de datos 
// para verificar que la conexión es exitosa, y se muestra un mensaje en la consola 
// indicando si la conexión fue exitosa o si hubo un error, y finalmente se muestra 
// un mensaje indicando que el servidor está corriendo en el puerto especificado
    try {
        await db.sequelize.authenticate();
        console.log("Conexión a la DB OK");
    } catch (error) {
        console.error("Error conectando a la DB:", error);
    }
    console.log(`Servidor corriendo en puerto ${PORT}`);
});