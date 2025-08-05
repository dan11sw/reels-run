import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import DataUsers from "./users.js";
import authService from "../../../services/auth/auth-service.js";
import jwt from "jsonwebtoken";

const initUsers = async (db) => {
    const t = await db.sequelize.transaction();
    try {
        for (let i = 0; i < DataUsers.length; i++) {
            const currUser = DataUsers[i];
            const user = await db.Users.findOne({
                where: {
                    email: currUser.email
                }
            });

            if (!user) {
                const exUser = await authService.signUp(currUser);
                const dataFromToken = jwt.verify(exUser.access_token, process.env.JWT_ACCESS_SECRET);

                if (currUser.email === "swdaniel@yandex.ru") {
                    const role = await db.Roles.findOne({
                        where: {
                            value: "admin"
                        }
                    });
                    
                    if (role) {
                        await db.UsersRoles.create({
                            users_id: dataFromToken.users_id,
                            roles_id: role.id
                        }, { transaction: t });
                    }
                }
            }
        }

        await t.commit();
    } catch (e) {
        await t.rollback();
        console.log(e);
    }
};


export default initUsers;