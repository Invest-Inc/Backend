const Database = require("../database");
const LegalEntityModel = require("./legalentity");

class BusinessModel extends LegalEntityModel {
    /**@type {String} */ legalEntityId;
    /**@type {String} */ profileName;
    /**@type {String} */ tagline;
    /**@type {String} */ summary;
    /**@type {String} */ longSummary;
    /**@type {String} */ profilePictureURL;
    /**@type {String} */ headerPictureURL;
    /**@type {String} */ headerVideoURL;
    /**@type {String} */ email;
    /**@type {String} */ phoneNumber;
    /**@type {Array<String>} */ categories;

    constructor(data){
        super(data);
        this.legalEntityId = this.id;
        this.legalEntity_id = this.id;
        this.profileName = data?.profileName;
        this.tagline = data?.tagline;
        this.summary = data?.summary;
        this.longSummary = data?.longSummary;
        this.profilePictureURL = data?.profilePictureURL;
        this.headerPictureURL = data?.headerPictureURL;
        this.headerVideoURL = data?.headerVideoURL;
        this.email = data?.email;
        this.phoneNumber = data?.phoneNumber;

        if(typeof data?.categories == "string"){
            this.categories = data?.categories.split(',');
        } else {
            this.categories = data?.categories;
        }

    }
}

BusinessModel.find = async params => {
    const condition = Object.keys(params).map(key => `"${key}" = '${params[key]}'`).join(' AND ');
    const res = await Database.query(`
        SELECT * FROM "Business" JOIN "LegalEntity" ON "Business"."legalEntity_id" = "LegalEntity"."id" WHERE ${condition}
    `)
    return res.rows.map(r => new BusinessModel(r));

}


module.exports = BusinessModel;