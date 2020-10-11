const app = require("../../index");
const request = require('supertest');
const { expect, describe, it } = require('@jest/globals');

describe('Adrenalina a bordo: integration user', () => {
    var token = null;

    it('should add one user', async () => {
        const response = await request(app)
            .post('/user')
            .set('Accept', 'application/json')
            .send({
                "cpf": "05466793310",
                "name": "Mauricio",
                "lastname": "Boaventura",
                "email": "mba097@gmail.com",
                "age": "1997-03-30",
                "password": "Boaventura123"
            })

            expect(response.statusCode).toEqual(200);
            expect(response.body).not.toBeNull();
    });

    it('should return a list of users', async () => {
        const response = await request(app)
            .get('/user')
            .accept('application/json')

        expect(response.statusCode).toEqual(200);
        expect(response.body).not.toBeNull();
    });

    it('should return one users', async () => {
        const response = await request(app)
            .get('/user/05466793310')
            .accept('application/json');

        expect(response.body).not.toBeNull();
        expect(response.statusCode).toEqual(200);
    });

    it('should make login with one user', async () => {
        const response = await request(app)
            .post('/login')
            .accept('application/json')
            .send({
                "email": "mba097@gmail.com",
                "password": "Boaventura123"
            })
        token = response.body.token; // Or something

        expect(response.body).not.toBeNull();
        expect(response.statusCode).toEqual(200);
    });

    it('should delete one user', async () => {
        const response = await request(app)
            .delete('/user/05466793310')
            .accept('application/json')
            .set('Authorization', 'Bearer ' + token);

        expect(response.body).toEqual({});
        expect(response.statusCode).toEqual(204);
    });
});