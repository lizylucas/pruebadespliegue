const request = require('supertest');
const fs = require('fs');
const app = require('../index'); // ajusta la ruta si es necesario

const testUser = {
    id: 999,
    name: 'Usuario Test',
    email: 'test@test.com'
};

// Limpieza después de los tests
afterAll(() => {
    const users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
    const filtered = users.filter(u => u.id !== testUser.id);
    fs.writeFileSync('./users.json', JSON.stringify(filtered, null, 2), 'utf8');
});

it('Debe responder el endpoint raíz', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Servidor en ejecucion/i);
});

it('Debe crear un nuevo usuario', async () => {
    const res = await request(app)
        .post('/users')
        .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toMatchObject(testUser);
});

it('Debe buscar el usuario creado', async () => {
    const res = await request(app).get(`/users/${testUser.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toMatchObject(testUser);
});
