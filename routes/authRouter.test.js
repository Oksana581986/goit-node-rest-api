import mongoose from "mongoose";
import app from "../app.js";
import request from "supertest";
import { findUser, deleteUsers } from "../services/authServices.js";

const { TEST_DB_HOST, PORT = 3000 } = process.env;


describe("test/ signup route", () => {
    let server = null;
    beforeAll(async() => {
        await mongoose.connect(TEST_DB_HOST);
        server = app.listen(PORT);
    })

    afterAll(async() => {
        await mongoose.connection.close();
        server.close();
    })

    afterEach(async() => {
        await deleteUsers({});
    })

    test("test / signup with correct date", async() => { 
        const signupData = {
            username: "Oksana",
            email: "oksana@gmail.com",
            password: "123456"
        };
        const { statusCode, body } = await request(app).post("/api/auth/signup").send(signupData);
        expect(statusCode).toBe(201);

        expect(body.username).toBe(singnupData.username);
        expect(body.email).toBe(singnupData.email);

        const user = await findUser({email: signupData.email});
        expect(user.username).toBe(singnupData.username);
     });
});