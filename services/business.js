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
                    addressRegion: data.addressRegion, 
                    addressLocality: data.addressLocality, 
                    addressText: data.addressText, 
                    addressPostalCode: data.addressPostalCode, 
                    birthdate: new Date(data.birthdate), 
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
            profileName: data.profileName, 
            tagline: data.tagline, 
            summary: data.summary, 
            longSummary: data.longSummary,
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

BusinessService.getUserPermissions = async ({user_id, business_id}) => {
    const row = await Database.businessAdmin.findFirst({
        where: {
            business_id, 
            AND: {
                user_id
            }
        }
    })
    if(row == undefined) return {permissions: "none"}
    return {permissions: row.permissions}
} 

module.exports = BusinessService;