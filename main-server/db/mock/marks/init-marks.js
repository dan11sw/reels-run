import DataMarks from "./marks.js";

const initMarks = async (db) => {
    const t = await db.sequelize.transaction();
    try{
        for(let i = 0; i < DataMarks.length; i++){
            const currMark = DataMarks[i];
    
            const mark = await db.Marks.findOne({
                where: {
                    lat: currMark.lat,
                    lng: currMark.lng,
                    location: currMark.location
                }
            });
    
            if(!mark){
                await db.Marks.create({
                    ...currMark
                });
            }
        }

        await t.commit();
    }catch(e){
        await t.rollback();
        console.log(e);
    }
};


export default initMarks;