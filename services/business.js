const { Prisma } = require("@prisma/client");
const Database = require("./database");

const BusinessService = {
    ...Database.business
}

/**
 * Creates a new business
 * @param {Prisma.BusinessCreateInput} data 
 */
BusinessService.create = async data => {
    await Database.business.create({
        data: {
            LegalEntity: {
                create: {
                    id: data.id,
                    addressCountry: data.addressCountry, 
                    addressLocality: data.addressLocality, 
                    addressPostalCode: data.addressPostalCode, 
                    addressRegion: data.addressRegion,
                    addressText: data.addressText, 
                    birthdate: data.birthdate, 
                    businessName: data.businessName, 
                    businessType: data.businessType, 
                    nationality: data.nationality, 
                    registrationDate: new Date(), 
                    type: "Business"
                }
            }, 
            BusinessAdmin: {
                create: {
                    user_id: data.userID, 
                    permissions: "Owner"
                }
            }, 
            tagline: data.tagline, 
            summary: data.summary, 
            profileName: data.profileName, 
            longSummary: data.longSummary, 
            profilePictureURL: data.profilePictureURL, 
            headerPictureURL: data.headerPictureURL,
            headerVideoURL: data.headerVideoURL, 
            categories: data.categories
        }
    })
}

BusinessService.getBusinessAdmins = async business_id => {
    return await Database.businessAdmin.findMany({
        where: {business_id}
    })
}

BusinessService.createBusinessAdmin = async ({business_id, user_id, permissions}) => {
    return await Database.businessAdmin.create({
        data: {user_id, business_id, permissions}
    })
}

BusinessService.deleteBusinessAdmin = async (id) => {
    return await Database.businessAdmin.delete({
        where: { id }
    })
}