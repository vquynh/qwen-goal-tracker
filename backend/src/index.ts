// src/index.ts
import app from './app';
import { AppDataSource } from './data-source';

// Start server
AppDataSource.initialize()
    .then(() => {
        app.listen(process.env.PORT, () => console.log('Server running on port ' + process.env.PORT));
    })
    .catch((error) => console.log('Data Source initialization error:', error));