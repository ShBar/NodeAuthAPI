import supertest from "supertest";
import { app } from "../main/app";
import { LoginRequest, SignupRequest } from "../main/interfaces/SignupRequest";
import { syncModels } from "../main/db/models/User";
import { sequelizeConnection } from "../main/db/Connection";
import { Dialect } from "sequelize";
import dotenv from "dotenv";
import { UserRepo } from "../main/repositories/UserRepo";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: `.env${process.env.NODE_ENV !== undefined ? "." + process.env.NODE_ENV : ""}` });
}

const connection = sequelizeConnection({
    database: process.env.DB_NAME || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "",
    dialect: process.env.DB_DIALECT as Dialect,
});

describe("Signup Test", () => {

    beforeAll(async () => {
        await connection.authenticate();
        await connection.createSchema(process.env.DB_NAME!!, {});
        await syncModels(connection);
    })

    afterAll(async () => {
        await connection.dropAllSchemas({});
    })

    const payload: SignupRequest = {
        email: "john.doe@test.com",
        password: "$eCret123",
        firstName: "John",
        lastName: "Doe"
    }

    it("Should Signup Successfully", async () => {
        const response = await supertest(app)
            .post("/api/v1/auth/signup")
            .send(payload);

        expect(response.statusCode).toBe(201);
    });

    it("Should return error: Account already exists, login instead", async () => {
        const response = await supertest(app)
            .post("/api/v1/auth/signup")
            .send(payload);

        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            error: "Account already exists, login instead"
        })
    });

    it("Should return error: Invalid email", async () => {
        const body = Object.assign({}, payload);
        body.email = "testemail.com";

        const response = await supertest(app)
            .post("/api/v1/auth/signup")
            .send(body);

        expect(response.statusCode).toBe(422);
        expect(response.body).toMatchObject({
            "errors": [
                {
                    "type": "field",
                    "value": body.email,
                    "msg": "Invalid email",
                    "path": "email",
                    "location": "body"
                }
            ]
        });
    });

    it("Should return error: Weak password", async () => {
        const body = Object.assign({}, payload);
        body.password = "Test123";

        const response = await supertest(app)
            .post("/api/v1/auth/signup")
            .send(body);

        expect(response.statusCode).toBe(422);
        expect(response.body).toMatchObject({
            "errors": [
                {
                    "type": "field",
                    "value": body.password,
                    "msg": "Password is weak: At least 1 Uppercase, 1 Lowercase and 1 Special character required",
                    "path": "password",
                    "location": "body"
                }
            ]
        });
    });

});

describe("Login Test", () => {

    const payload: LoginRequest = {
        email: "john.doe@test.com",
        password: "$eCret123",
    }

    beforeAll(async () => {
        await connection.authenticate();
        await connection.createSchema(process.env.DB_NAME!!, {});
        await syncModels(connection);
        await UserRepo.createUser({
            email: "john.doe@test.com",
            password: "$eCret123",
            firstName: "John",
            lastName: "Doe"
        });
    })

    afterAll(async () => {
        await connection.dropAllSchemas({});
    })

    it("Should Login Successfully", async () => {
        const response = await supertest(app)
            .post("/api/v1/auth/login")
            .send(payload);

        expect(response.statusCode).toBe(200);
    });

    it("Should return Login Error on email mismatch", async () => {
        const body = Object.assign({}, payload);
        body.email = "john.doe@invalid.com";

        const response = await supertest(app)
            .post("/api/v1/auth/login")
            .send(body);

        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchObject({
            error: "Authentication Failed: Invalid Email or Password"
        });
    });

    it("Should return Login Error on password mismatch", async () => {
        const body = Object.assign({}, payload);
        body.password = "$eCret1234";

        const response = await supertest(app)
            .post("/api/v1/auth/login")
            .send(body);

        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchObject({
            error: "Authentication Failed: Invalid Email or Password"
        });
    });
});

describe("Profile Test", () => {

    let token: any;

    beforeAll(async () => {
        await connection.authenticate();
        await connection.createSchema(process.env.DB_NAME!!, {});
        await syncModels(connection);
        await UserRepo.createUser({
            email: "john.doe@test.com",
            password: "$eCret123",
            firstName: "John",
            lastName: "Doe"
        });
        const response = await supertest(app)
            .post("/api/v1/auth/login")
            .send({
                email: "john.doe@test.com",
                password: "$eCret123",
            });
        token = response.body!!.token!!;
    })

    afterAll(async () => {
        await connection.dropAllSchemas({});
    })


    it("Should Get Profile Successfully", async () => {
        const response = await supertest(app)
            .get("/api/v1/user/profile")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            firstName: "John",
            lastName: "Doe"
        });
    });

    it("Should return Invalid Token Error on Get Call", async () => {
        const response = await supertest(app)
            .get("/api/v1/user/profile")
            .set("Authorization", "Bearer InvalidToken");

        expect(response.statusCode).toBe(403);
        expect(response.body).toMatchObject({
            error: "Invalid token"
        });
    });

    it("Should Update Profile Successfully", async () => {
        const response = await supertest(app)
            .put("/api/v1/user/profile")
            .send({
                lastName: "Wick"
            })
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
    });

    it("Should return Invalid Token Error on Update Call", async () => {
        const response = await supertest(app)
            .put("/api/v1/user/profile")
            .send({
                lastName: "Wick"
            })
            .set("Authorization", "Bearer InvalidToken");

        expect(response.statusCode).toBe(403);
        expect(response.body).toMatchObject({
            error: "Invalid token"
        });
    });

    it("Should return Error when update field is missing", async () => {
        const response = await supertest(app)
            .put("/api/v1/user/profile")
            .send({})
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(422);
        expect(response.body).toMatchObject({
            "errors": [
                {
                    "type": "field",
                    "msg": "Cannot be empty",
                    "path": "lastName",
                    "location": "body"
                }
            ]
        });
    });
});





