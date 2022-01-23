const Database = require("../database");

const UserService = {
    ...Database.user
}

UserService.checkUsernameAvailability = async username => {
    const count = await UserService.count({
        where: {username}
    });
    return count == 0;
}

module.exports = UserService;