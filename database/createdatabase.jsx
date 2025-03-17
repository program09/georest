import { Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';


// Abrir o crear la base de datos
const db = SQLite.openDatabase(
    { 
        name: 'georest.db', 
        location: 'default',
        createFromLocation: 1  // This ensures the database persists between app launches
    },
    () => {
        console.log('Database opened successfully');
        checkAndCreateTables(); // Verificar y crear tablas si no existen

            // Eliminar restaurantes con send_api igual a 0
           /* db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM Restaurants WHERE send_api = 0',
                    [],
                    () => console.log('Restaurants table cleaned successfully'),
                    error => console.error('Error cleaning Restaurants table:', error)
                );
            });
            */
    },
    error => {
        Alert.alert(
            'Error al crear la base de datos',
            'No se pudo crear la base de datos',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
        console.error('Failed to open database', error);
    }
);

// Función para verificar y crear tablas si no existen
const checkAndCreateTables = () => {
    db.transaction(tx => {
        // Verificar si la tabla Types existe
        tx.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Types'",
            [],
            (_, result) => {
                if (result.rows.length === 0) {
                    // Crear tabla Types si no existe
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS Types (
                            uuid TEXT PRIMARY KEY,
                            name TEXT NOT NULL,
                            description TEXT
                        )`,
                        [],
                        () => console.log('Types table created or already exists'),
                        error => console.error('Failed to create Types table', error)
                    );
                } else {
                    console.log('Types table already exists');
                }
            },
            error => console.error('Failed to check Types table', error)
        );

        // Verificar si la tabla Restaurants existe
        tx.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Restaurants'",
            [],
            (_, result) => {
                if (result.rows.length === 0) {
                    // Crear tabla Restaurants si no existe
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS Restaurants (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              uuid TEXT,
              ruc TEXT NOT NULL,
              name TEXT NOT NULL,
              latitude TEXT NOT NULL,
              longitude TEXT NOT NULL,
              comment TEXT,
              send_api BOOLEAN NOT NULL DEFAULT false
            )`,
                        [],
                        () => console.log('Restaurants table created or already exists'),
                        error => console.error('Failed to create Restaurants table', error)
                    );
                } else {
                    console.log('Restaurants table already exists');
                }
            },
            error => console.error('Failed to check Restaurants table', error)
        );

        // Verificar si la tabla Photos existe
        tx.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Photos'",
            [],
            (_, result) => {
                if (result.rows.length === 0) {
                    // Crear tabla Photos si no existe
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS Photos (
                        uuid_restaurant TEXT,
                        uuid_type TEXT,
                        path_photo TEXT NOT NULL,
                        FOREIGN KEY (uuid_restaurant) REFERENCES Restaurants(uuid),
                        FOREIGN KEY (uuid_type) REFERENCES Types(uuid),
                        PRIMARY KEY (uuid_restaurant, uuid_type)
                        )`,
                        [],
                        () => console.log('Photos table created or already exists'),
                        error => console.error('Failed to create Photos table', error)
                    );
                } else {
                    console.log('Photos table already exists');
                }
            },
            error => console.error('Failed to check Photos table', error)
        );
    });
};

// Exportar la base de datos para usarla en otros archivos
export { db };