import express from 'express';
import dotenv from 'dotenv';
import './src/config/db.js';
import logger from './src/config/logger.js';
import menuCategoryRoutes from './src/routes/menu-category.routes.js';
import menuItemRoutes from './src/routes/menu-item.routes.js';
import { errorHandler } from './src/middlewares/error.middleware.js';
import modifierGroupRoutes from './src/routes/modifier-group.routes.js'; 
import modifierOptionRoutes from './src/routes/modifier-option.routes.js';  
import itemModifierGroupRoutes from './src/routes/item-modifier-group.routes.js'; 
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/menu', menuCategoryRoutes);
app.use('/api/v1', menuItemRoutes);
app.use('/api/v1', modifierGroupRoutes);
app.use('/api/v1', modifierOptionRoutes);
app.use('/api/v1', itemModifierGroupRoutes);
app.use(errorHandler);

app.listen(3000, () => {
  logger.info('Server running on port 3000');
  logger.info('Swagger running at http://localhost:3000/api/v1/docs')
});