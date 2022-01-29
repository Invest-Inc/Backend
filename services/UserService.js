const Database = require("../database");

/**
 * Is this username available?
 * @param {{username: String}} param0 
 * @returns {Promise<Boolean>}
 */
const checkUsernameAvailability = async ({username}) => {
    const count = await UserService.count({
        where: {username}
    });
    return count == 0;
}

/**
 * Returns a list of the users followed by this user
 * @param {{user_id: Number}} param0 
 * @returns {Promise<Array>}
 */
const getFollowedUsers = async ({user_id}) => {
    const followed = await Database.user_User_Followings.findMany({
        where: {user_id}
    });
    return followed;
}

/**
 * Returns a list of the startups followed by this user
 * @param {{user_id: Number}} param0 
 * @returns {Promise<Array>}
 */
const getFollowedStartups = async ({user_id}) => {
    const followed = await Database.user_Startup_Followings.findMany({
        where: {user_id}
    });
    return followed;
}

/**
 * Follows a user
 * @param {{user_id: Number, following_user_id: Number}} param0 
 */
const followUser = async ({user_id, following_user_id}) => {
    await Database.user_User_Followings.create({
        data: {
            user_id, 
            following_user_id
        }
    })
}

/**
 * Follows a startup
 * @param {{user_id: String, following_startup_id: String}} param0 
 */
const followStartup = async ({user_id, following_startup_id}) => {
    await Database.user_Startup_Followings.create({
        data: {
            user_id, 
            following_startup_id
        }
    })
}

/**
 * Unfollows a user
 * @param {{user_id: String, following_user_id: String}} param0 
 */
const unfollowUser = async ({user_id, following_user_id}) => {
    // Find
    let row = await Database.user_User_Followings.findFirst({
        where: {user_id, following_user_id}
    })
    if(row == undefined) return;
    // Delete
    await Database.user_User_Followings.delete({
        where: {user_user_following_id: row.user_user_following_id}
    })
}

/**
 * Unfollows a startup
 * @param {{user_id: String, following_startup_id: String}} param0 
 */
const unfollowStartup = async ({user_id, following_startup_id}) => {
    // Find
    let row = await Database.user_Startup_Followings.findFirst({
        where: {user_id, following_startup_id}
    });
    if(row == undefined) return;
    // Delete
    await Database.user_Startup_Followings.delete({
        where: {user_startup_followings_id: row.user_startup_followings_id}
    })
}

const followsUser = async ({user_id, following_user_id}) => {
    // Find
    const count = await Database.user_User_Followings.count({
        where: {user_id, following_user_id}
    });
    return count != 0;
}

const followsStartup = async ({user_id, following_startup_id}) => {
    // Find
    const count = await Database.user_Startup_Followings.count({
        where: {user_id, following_startup_id}
    });
    return count != 0;
}

const addSocialNetwork = async ({user_id, provider, username, url}) => {
    // Create
    await Database.user_Social_Network.create({
        data: {user_id, provider, username, url}
    })
}

const removeSocialNetwork = async ({user_id, provider}) => {
    // Find
    const row = await Database.user_Social_Network.findFirst({
        where: {user_id, provider}
    });
    // Delete
    await Database.user_Social_Network.delete({
        where: {user_social_networks_id: row.user_social_networks_id}
    });
}

const addCurricularActivity = async ({user_id, start_date, end_date, type, organization, name, description}) => {
    await Database.user_Curricular_Activity.create({
        data: {user_id, start_date, end_date, type, organization, name, description}
    });
}

const modifyCurricularActivity = async ({user_curricular_activity_id, user_id, start_date, end_date, type, organization, name, description}) => {
    let row = await Database.user_Curricular_Activity.findFirst({
        where: {user_curricular_activity_id, user_id}
    })
    if(row == undefined) return;
    await Database.user_Curricular_Activity.update({
        where: {
            user_curricular_activity_id,
        },
        data: {start_date, end_date, type, organization, name, description}
    });
}

const removeCurricularActivity = async ({user_curricular_activity_id, user_id}) => {
    let row = await Database.user_Curricular_Activity.findFirst({
        where: {user_curricular_activity_id, user_id}
    })
    if(row == undefined) return;
    await Database.user_Curricular_Activity.delete({
        where: {user_curricular_activity_id}
    })
}

const UserService = {
    ...Database.user, 
    checkUsernameAvailability, 
    // Followers
    getFollowedUsers, 
    getFollowedStartups, 
    followUser, 
    followStartup, 
    unfollowUser, 
    unfollowStartup, 
    followsUser, 
    followsStartup,
    // Social networks
    addSocialNetwork, 
    removeSocialNetwork, 
    // Curricular activity
    addCurricularActivity, 
    modifyCurricularActivity, 
    removeCurricularActivity
}

module.exports = UserService;