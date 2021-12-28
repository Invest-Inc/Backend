const { Prisma } = require("@prisma/client");
const Database = require("./database");

const UserService = {
    ...Database.user
};

/**
 * Creates a new user in database
 * @param {Prisma.UserCreateInput} data Data of new user object
 */
UserService.create = async data => {
    await Database.user.create({
        data: {
            LegalEntity: {
                create: {
                    id: data.id, 
                    type: "Person", 
                    registrationDate: new Date(), 
                    birthdate: new Date(data.birthdate || 0),
                    addressCountry: data.addressCountry,
                    addressRegion: data.addressRegion,
                    addressLocality: data.addressLocality,
                    addressPostalCode: data.addressPostalCode,
                    addressText: data.addressText,
                    nationality: data.nationality, 
                    personFirstName: data.personFirstName, 
                    personFamilyName: data.personFamilyName
                }
            },
            biography: data.biography || "Hey there! I am using Invest Inc.",
            email: data.email, 
            phoneNumber: data.phoneNumber, 
            username: data.username, 
            profileName: data.profileName, 
            profilePictureURL: data.profilePictureURL || "", 
            headerPictureURL: data.headerPictureURL || "",
            password: data.password, 
            verified_email: false
        }
    })
}

/**
 * Checks if a username is already in use
 * @param {String} username Username to check
 * @returns {Boolean}
 */
UserService.checkUsernameAvailability = async username => {
    const count = await Database.user.count({
        where: {username}
    });
    return count == 0;
}

/**
 * Hides private fields from user object (eg, passwords, phoneNumbers, etc)
 * @param {Prisma.UserCreateInput} data User data
 */
UserService.hidePrivateFields = data => {
    delete data.LegalEntity;
    delete data.email;
    delete data.phoneNumber;
    delete data.password;
    return data;
}

UserService.getProfiles = async user_id => {
    return Database.userSocialProfile.findMany({
        where: {user_id}, 
        select: {
            id: true,
            provider: true, 
            username: true, 
            url: true
        }
    })
}

UserService.createProfile = async ({user_id, provider, username, url}) => {
    return Database.userSocialProfile.create({
        data: { user_id, provider, username, url }
    })
}

UserService.deleteProfile = async ({user_id, id}) => {
    const row = await Database.userSocialProfile.findFirst({
        where: {
            user_id, 
            AND: {
                id
            }
        }
    })
    if(row == undefined) return;
    return Database.userSocialProfile.delete({
        where: {id: row.id}
    })
}

module.exports = UserService;