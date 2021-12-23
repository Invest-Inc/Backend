const Database = require("../database");

class UserSocialProfileModel {
    /**@type{String} */ user_id;
    /**@type{String} */ provider;
    /**@type{String} */ username;
    /**@type{String} */ url;

    constructor(data){
        this.user_id = data?.user_id;
        this.provider = data?.provider;
        this.username = data?.username;
        this.url = data?.url;
    }
}

UserSocialProfileModel.find = async user_id => {
    console.log("AA")
    const res = await Database.query(`
        SELECT * FROM "UserSocialProfile" WHERE "user_id" = '${user_id}'
    `);
    return res.rows.map(r => new UserSocialProfileModel(r));
}

UserSocialProfileModel.upload = async model => {
    const res = await Database.query(`
        INSERT INTO "UserSocialProfile"
        SELECT * FROM json_populate_record (NULL::"UserSocialProfile", '${JSON.stringify(model)}')
    `)
    return true;
}

UserSocialProfileModel.delete = async model => {
    const res = await Database.query(`
        DELETE FROM "UserSocialProfile"
        WHERE "user_id" = $0 AND "provider" = $1 AND "username" = $2 AND "url" = $3
    `, [model.user_id, model.provider, model.username, model.url])
}

module.exports = UserSocialProfileModel;