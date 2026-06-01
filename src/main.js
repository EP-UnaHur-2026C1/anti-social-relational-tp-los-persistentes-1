console.log("UnaHur - Anti-Social net");

const express = require('express');
const app = express();

// Middlewares Globales (SIEMPRE ARRIBA)
app.use(express.json());

const db = require('../models'); 
require('dotenv').config();

//const swaggerUi = require('swagger-ui-express');
//const YAML = require('yamljs'); 
//const swaggerDocument = YAML.load('./doc/swagger.yaml');

// --- Importación de Rutas ---
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const userRoutes = require('./routes/userRoutes');
const tagRoutes = require('./routes/tagRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const followerRoutes = require('./routes/followerRoutes'); 

// --- Registro de Rutas ---
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/tag', tagRoutes);
app.use('/comment', commentRoutes);
app.use('/followers', followerRoutes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
// .sync() analiza tus modelos y crea de forma automática las tablas que falten físicamente en SQLite sin borrar tus usuarios actuales
        await db.sequelize.sync();
        console.log("Conexión a la DB y sincronización de tablas OK");
    } catch (error) {
        console.error("Error al sincronizar la DB:", error);
    }
    console.log(`Servidor corriendo en puerto ${PORT}`);
});