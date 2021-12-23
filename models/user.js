const Database = require("../database");
const LegalEntityModel = require("./legalentity");


class UserModel extends LegalEntityModel {
    /**@type {String} */ legalEntityId;
    /**@type {String} */ profileName;
    /**@type {String} */ profilePictureURL;
    /**@type {String} */ headerPictureURL;
    /**@type {String} */ biography;
    /**@type {String} */ email;
    /**@type {String} */ phoneNumber;
    /**@type {String} */ password;
    /**@type {Boolean} */ verifiedEmail;
    /**@type {String} */ username;

    constructor(data){
        super(data);
        this.legalEntityId = this.id;
        this.legalEntity_id = this.id;
        // Public attributes
        this.profileName = data?.profileName;
        this.profilePictureURL = data?.profilePictureURL;
        this.headerPictureURL = data?.headerPictureURL;
        this.biography = data?.biography;
        this.username = data?.username;
        // Private attributes
        this.email = data?.email;
        this.phoneNumber = data?.phoneNumber;
        this.password = data?.password;
        this.verifiedEmail = data?.verifiedEmail;
    }
}

UserModel.find = async params => {
    const condition = Object.keys(params).map(key => `"${key}" = '${params[key]}'`).join(' AND ');
    const res = await Database.query(`
        SELECT * FROM "User" JOIN "LegalEntity" ON "User"."legalEntity_id" = "LegalEntity"."id" WHERE ${condition}
    `);
    return res.rows.map(r => new UserModel(r));
}

UserModel.upload = async model => {
    // First upload legalEntity
    await LegalEntityModel.upload(model)
    await Database.query(`
        INSERT INTO "User"
        SELECT * FROM json_populate_record (NULL::"User", '${JSON.stringify(model)}')
    `)
}

UserModel.isUsernameAvailable = async username => {
    const res = await Database.query(`
        SELECT COUNT(*) FROM "User" WHERE "username" = '${username}'
    `)
    return res.rows.length == 0;
}

UserModel.getIdFromUsername = async username => {
    const res = await Database.query(`
        SELECT "legalEntity_id" FROM "User" WHERE "username" = '${username}'
    `);
    if(!res) return undefined;
    return res.rows[0].id;
}

module.exports = UserModel;