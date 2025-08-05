import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import DataRoles from './roles.js';

const initRoles = async (db) => {
    const t = await db.sequelize.transaction();

    try {
        for (let i = 0; i < DataRoles.length; i++) {
            const roleItem = DataRoles[i];

            const role = await db.Roles.findOne({
                where: {
                    value: roleItem.value
                }
            });

            if (!role) {
                await db.Roles.create(roleItem, { transaction: t });
            }
        }

        await t.commit();
    } catch (e) {
        await t.rollback();
        console.log(e);
    }
};


export default initRoles;