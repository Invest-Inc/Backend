const Database = require("../database");

const searchUsersByProfile = async (q) => {
    const results = await Database.$queryRaw`
        SELECT *, 'user' AS "type" FROM "User"
        WHERE to_tsvector("User"."name" || ' ' || "User"."legal_full_name" || ' ' || "User"."username" || ' ' || "User"."summary")
        @@ to_tsquery(${q})
    `;
    return results;
}

const searchUsersByExperience = async (q) => {
    const results = await Database.$queryRaw`
        SELECT "User".*, 'user' AS "type" FROM "User_Curricular_Activity"
        JOIN "User" USING ("user_id")
        WHERE to_tsvector("organization" || ' ' || "User_Curricular_Activity"."name" || ' ' || "User_Curricular_Activity"."description")
        @@ to_tsquery(${q})
    `;
    return results;
}

const searchStartups = async (q) => {
    const results = await Database.$queryRaw`
        SELECT *, 'startup' AS "type" FROM "Startup"
        WHERE to_tsvector("name" || ' ' || "summary" || ' ' || "industry")
        @@ to_tsquery(${q})
    `;
    return results;
}

const searchAll = async (q) => {
    const results = [];
    const startups_ids = new Set();
    const users_ids = new Set();

    for(let user of await searchUsersByProfile(q)){
        if(users_ids.has(user.user_id)) continue;
        users_ids.add(user.user_id);
        results.push(user);
    }

    for(let user of await searchUsersByExperience(q)){
        if(users_ids.has(user.user_id)) continue;
        users_ids.add(user.user_id);
        results.push(user);
    }

    for(let startup of await searchStartups(q)){
        if(startups_ids.has(startup.startup_id)) continue;
        startups_ids.add(startup.startup_id);
        results.push(startup);
    }
    return results;
}

/* searchAll('nasa').then(results=>{
    console.dir(results)
}) */

const SearchService = {
    searchUsersByProfile, 
    searchUsersByExperience,
    searchStartups, 
    searchAll
};

module.exports = SearchService;