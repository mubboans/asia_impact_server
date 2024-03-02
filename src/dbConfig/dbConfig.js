const { Sequelize, DataTypes } = require('sequelize');
const { createUser, User } = require('../Models/Users');
const { createDocument, Document } = require('../Models/Document');
const { createNewsModel } = require('../Models/News');
const { createModuleHistoryModel } = require('../Models/TrackModuleHistory');
const { createOtpModel } = require('../Models/Opt');
const { createUserRelationModel, UserRelation } = require('../Models/UserRelation');
const { createLanguageModel } = require('../Models/Language');
const { createSustainGoalModel, SustainGoal } = require('../Models/SustainGoal');
const { CompanyNSustain, createCompanyNSustain } = require('../Models/CompanyNSustain');
const { Company, createCompanyModel } = require('../Models/Company');
// const User = require('../Models/Users');
// const Documents = require('../Models/Document');
// const { syncModel } = require('../Models');
// const Models = require('../Models');

const sequelize = new Sequelize(
    {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DBNAME,
        logging: false,
        pool: {
            max: 5, // Adjust as needed number of connection
            min: 0,
            acquire: 30000,
            idle: 10000,
        },

    });
const db = {}
db.sequelize = sequelize;

const dbConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Authenticated to db Successfull');
        // db.sequelize = sequelize;
        createUser(sequelize, DataTypes);
        createDocument(sequelize, DataTypes);
        createNewsModel(sequelize, DataTypes);
        createModuleHistoryModel(sequelize, DataTypes);
        createOtpModel(sequelize, DataTypes);
        createUserRelationModel(sequelize, DataTypes);
        createLanguageModel(sequelize, DataTypes);
        createSustainGoalModel(sequelize, DataTypes);
        createCompanyNSustain(sequelize, DataTypes);
        createCompanyModel(sequelize, DataTypes);

        User.hasMany(Document, { foreignKey: 'userid', as: 'document' });
        Document.belongsTo(User, { foreignKey: 'userid' });

        User.hasMany(UserRelation, { foreignKey: 'advisorId', foreignKey: 'investorId' });
        // User.hasMany(UserRelation, { foreignKey: 'investorId' });

        UserRelation.belongsTo(User, { foreignKey: 'advisorId', foreignKey: 'investorId' });

        // SustainGoal.hasMany()
        // CompanyNSustain.belongsTo(SustainGoal,{foreignKey:'sustaingoalid'})
        Company.belongsToMany(SustainGoal, {
            through: 'CompanyNSustain', foreignKey: 'companyid',
            otherKey: 'sustaingoalid', sourceKey: 'id',
        });

        SustainGoal.belongsToMany(Company, {
            through: 'CompanyNSustain',
            foreignKey: 'sustaingoalid', // Use the same column name as in CompanyNSustain
            otherKey: 'companyid', // Use the same column name as in CompanyNSustain
            sourceKey: 'id', // Use the primary key column name in SustainGoal
        });

        // CompanyNSustain.belongsToMany(Company, {
        //     through: CompanyNSustain, foreignKey: 'companyid',
        //     otherKey: 'sustaingoalid', sourceKey: 'id',
        // });

        // UserRelation.belongsTo(User, { foreignKey: 'investorId' });

        await sequelize.sync({ alter: false });

    } catch (error) {
        console.log(error, 'error ');
    }

}

// module.exports = { dbConnect, sequelize, modelSync }
module.exports = { sequelize, db, dbConnect }