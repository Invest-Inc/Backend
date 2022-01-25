const Database = require("../database");



const checkUsernameAvailability = async username => {
    const count = await UserService.count({
        where: {username}
    });
    return count == 0;
}

const getFollowedUsers = async user_id => {
    const followed = await Database.user_User_Followings.findMany({
        where: {user_id}
    });
    return followed;
}

const getFollowedStartups = async user_id => {
    const followed = await Database.user_Startup_Followings.findMany({
        where: {user_id}
    });
    return followed;
}

const followUser = async (user_id, following_user_id) => {
    await Database.user_User_Followings.create({
        data: {
            user_id, 
            following_user_id
        }
    })
}

const followStartup = async (user_id, following_startup_id) => {
    await Database.user_Startup_Followings.create({
        user_id, 
        following_startup_id
    })
}

const unfollowUser = async (user_id, following_user_id) => {
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

const unfollowStartup = async (user_id, following_startup_id) => {
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

const addSocialNetwork = async ({user_id, provider, username, url}) => {
    // Create
    await Database.user_Social_Newtorks.create({
        data: {user_id, provider, username, url}
    })
}

const removeSocialNetwork = async ({user_id, provider}) => {
    // Find
    const row = await Database.user_Social_Newtorks.findFirst({
        where: {user_id, provider}
    });
    // Delete
    await Database.user_Social_Newtorks.delete({
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
    // Social networks
    addSocialNetwork, 
    removeSocialNetwork, 
    // Curricular activity
    addCurricularActivity, 
    modifyCurricularActivity, 
    removeCurricularActivity
}

module.exports = UserService;