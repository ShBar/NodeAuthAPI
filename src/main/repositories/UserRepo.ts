import dotenv from "dotenv";
import { Dialect } from "sequelize";
import { sequelizeConnection } from "../db/Connection";
import { SignupRequest } from "../interfaces/SignupRequest";
import { UserAccount } from "../db/models/User";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: `.env${process.env.NODE_ENV !== undefined ? "." + process.env.NODE_ENV: ""}` });
}

const connection = sequelizeConnection({
    database: process.env.DB_NAME || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "",
    dialect: process.env.DB_DIALECT as Dialect || "mysql",
});

export const UserRepo = {
    createUser: (form: SignupRequest) => {
        return UserAccount(connection).create({
            email: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
        });
    },

    getUserByEmail: (email: string) => {
        return UserAccount(connection).findOne({
            where: {
                email
            }
        });
    },

    checkIfEmailExists: (email: string) => {
        return UserAccount(connection).count({
            where: {
               email 
            }
        })
    },

    getUserById: (id: string) => {
        return UserAccount(connection).findByPk(id);
    },

    updateUserLastName: (id: string, lastName: string) => {
        return UserAccount(connection).update({ lastName }, {
            where: {
                id
            }
        })
    }
}