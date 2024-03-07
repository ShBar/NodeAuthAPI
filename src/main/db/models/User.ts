import { sequelizeConnection } from "../Connection";
import { DataTypes } from "sequelize";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";

export const UserAccount = sequelizeConnection.define("UserAccount", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        set(val) {
            this.setDataValue("password", getPasswordHash(val as string));
        },
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { tableName: 'UserAccount' });


export const getPasswordHash = (val: string): string => {
    const salt = genSaltSync(10);
    return hashSync(val, salt);
}

export const syncModels = async() => {
    await UserAccount.sync();
}


