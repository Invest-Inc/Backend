const Database = require("../database");

class LegalEntityModel {
    /**@type {String} */    id;
    /**@type {("Person"|"Business")} */ type;
    /**@type {String} */    nationality;
    /**@type {Date} */      registrationDate;
    /**@type {Date} */      birthdate;
    /**@type {String} */    addressCountry;
    /**@type {String} */    addressRegion;
    /**@type {String} */    addressLocality;
    /**@type {String} */    addressPostalCode;
    /**@type {String} */    addressText;
    /**@type {String} */    personFirstName;
    /**@type {String} */    personFamilyName;
    /**@type {String} */    businessName;
    /**@type {String} */    businessType;

    constructor(data){
        this.id = data?.id;
        // Review for allowed types
        if(data?.type == "Person" || data?.type == "Business")
            this.type = data.type;
        else this.type = "Person";
        // TODO: Review for ISO 3166/2
        this.nationality = data?.nationality;
        // Dates
        this.registrationDate = new Date(data?.registrationDate || new Date());
        this.birthdate = new Date(data?.birthdate);
        // Address
        this.addressCountry = data?.addressCountry;
        this.addressRegion = data?.addressRegion;
        this.addressLocality = data?.addressLocality;
        this.addressPostalCode = data?.addressPostalCode;
        this.addressText = data?.addressText;
        // Different fields for Person vs. Business
        if(this.type == "Person"){
            this.personFirstName = data?.personFirstName;
            this.personFamilyName = data?.personFamilyName;
        } else {
            this.businessName = data?.businessName;
            this.businessType = data?.businessType;
        }

    }


}

LegalEntityModel.upload = async model => {
    const res = await Database.query(`
        INSERT INTO "LegalEntity"
        SELECT * FROM json_populate_record (NULL::"LegalEntity", '${JSON.stringify(model)}')
    `)
}

module.exports = LegalEntityModel;