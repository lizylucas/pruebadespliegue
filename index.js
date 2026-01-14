const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Archivo JSON que actúa como base de datos
const DB_FILE = './users.json';

// Middleware para manejar JSON
app.use(express.json());

// Leer base de datos
const readDatabase = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Escribir base de datos
const writeDatabase = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// Endpoint raíz
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Servidor en ejecucion en el puerto 3000',
        status: 200
    });
});

// Obtener todos los usuarios
app.get('/users', (req, res) => {
    const users = readDatabase();
    res.json(users);
});

// Crear usuario
app.post('/users', (req, res) => {
    const users = readDatabase();
    const newUser = req.body;

    if (!newUser.id || !newUser.name || !newUser.email) {
        return res.status(400).json({ error: 'ID, name, and email are required' });
    }

    if (users.some(user => user.id === newUser.id)) {
        return res.status(400).json({ error: 'User with the same ID already exists' });
    }

    users.push(newUser);
    writeDatabase(users);

    res.status(201).json({
        message: 'User created successfully',
        user: newUser
    });
});

// Actualizar usuario
app.put('/users/:id', (req, res) => {
    const users = readDatabase();
    const userId = Number(req.params.id);

    const index = users.findIndex(user => user.id === userId);

    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users[index] = { ...users[index], ...req.body };
    writeDatabase(users);

    res.json({
        message: 'User updated successfully',
        user: users[index]
    });
});

// Eliminar usuario
app.delete('/users/:id', (req, res) => {
    const users = readDatabase();
    const userId = Number(req.params.id);

    const filtered = users.filter(user => user.id !== userId);

    if (filtered.length === users.length) {
        return res.status(404).json({ error: 'User not found' });
    }

    writeDatabase(filtered);
    res.json({ message: 'User deleted successfully' });
});

// Buscar usuario por ID
app.get('/users/:id', (req, res) => {
    const users = readDatabase();
    const userId = Number(req.params.id);

    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
});

// Export para tests
module.exports = app;

// Iniciar servidor solo si no está en test
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
    });
}
