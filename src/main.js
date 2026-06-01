console.log("UnaHur - Anti-Social net");

const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const app = express();

// Middlewares Globales (SIEMPRE ARRIBA)
app.use(express.json());

const db = require('../models'); 
require('dotenv').config();

const swaggerDocument = YAML.load(path.join(__dirname, '../doc/swagger.yaml'));

const userRoutes = require('./routes/userRoutes');
const tagRoutes = require('./routes/tagRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const followerRoutes = require('./routes/followerRoutes'); 

// --- Swagger UI ---
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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