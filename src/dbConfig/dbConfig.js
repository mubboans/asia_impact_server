const { Sequelize, DataTypes } = require('sequelize');
const { createUser, User } = require('../Models/Users');
const { createDocument, Document } = require('../Models/Document');
const { createNewsModel } = require('../Models/News');
const { createModuleHistoryModel } = require('../Models/TrackModuleHistory');
const { createOtpModel } = require('../Models/Otp');
const { createUserRelationModel, UserRelation } = require('../Models/UserRelation');
const { createLanguageModel } = require('../Models/Language');
const { createSustainGoalModel, SustainGoal } = require('../Models/SustainGoal');
const { CompanyNSustain, createCompanyNSustain } = require('../Models/CompanyNSustain');
const { Company, createCompanyModel } = require('../Models/Company');
const { createReportModel, Report } = require('../Models/Report');
const { createOpportunityModel, Opportunity } = require('../Models/Opportunities');
const { createNotificationModel } = require('../Models/Notification');
const { Highlight, createHighLightsModel } = require('../Models/Highlight');
const { HighlightDetail, createHighlightsOtherDetailModel } = require('../Models/HighlightDetail');
const { createInsightModel } = require('../Models/Insight');
const { createUserDetail, UserDetail } = require('../Models/UserDetail');
const { createLrDetail, LrDetail } = require('../Models/LRDetail');
const { createFileStore } = require('../Models/FIleStore');
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
        createReportModel(sequelize, DataTypes);
        createOpportunityModel(sequelize, DataTypes);
        createNotificationModel(sequelize, DataTypes);
        createHighLightsModel(sequelize, DataTypes);
        createHighlightsOtherDetailModel(sequelize, DataTypes);
        createInsightModel(sequelize, DataTypes);
        createUserDetail(sequelize, DataTypes);
        createLrDetail(sequelize, DataTypes);
        createFileStore(sequelize, DataTypes);


        User.hasMany(Document, { foreignKey: 'userid', as: 'document' });
        Document.belongsTo(User, { foreignKey: 'userid' });

        User.hasMany(UserDetail, { foreignKey: 'userid', as: 'userdetail' });
        UserDetail.belongsTo(User, { foreignKey: 'userid' });


        User.hasMany(LrDetail, { foreignKey: 'userid', as: 'lrdetail' });
        LrDetail.belongsTo(User, { foreignKey: 'userid' });

        UserDetail.hasMany(LrDetail, { foreignKey: 'userdetailid', as: 'userlrdetail' });
        LrDetail.belongsTo(UserDetail, { foreignKey: 'userdetailid' });


        UserDetail.hasMany(Document, { foreignKey: 'userdetailid', as: 'document' });
        Document.belongsTo(UserDetail, { foreignKey: 'userdetailid' });

        LrDetail.hasMany(Document, { foreignKey: 'lrdetailid', as: 'document' });
        Document.belongsTo(LrDetail, { foreignKey: 'lrdetailid' });



        User.hasMany(UserRelation, { foreignKey: 'advisorId', as: 'advisor' });
        User.hasMany(UserRelation, { foreignKey: 'investorId', as: 'investor' });
        UserRelation.belongsTo(User, { foreignKey: 'advisorId', as: 'advisor' });
        UserRelation.belongsTo(User, { foreignKey: 'investorId', as: 'investor' });


        SustainGoal.hasMany(CompanyNSustain, { foreignKey: 'sustaingoalid' });
        CompanyNSustain.belongsTo(SustainGoal, { foreignKey: 'sustaingoalid' });
        Company.hasMany(Report, { foreignKey: 'companyid' });
        Report.belongsTo(Company, { foreignKey: 'companyid' });

        Company.hasMany(Opportunity, { foreignKey: 'companyid' });
        Opportunity.belongsTo(Company, { foreignKey: 'companyid' });


        Highlight.hasMany(HighlightDetail, { foreignKey: 'highlightid', as: 'highligthdetail' });
        HighlightDetail.belongsTo(Highlight, { foreignKey: 'highlightid' });


        await sequelize.sync({ alter: false });

    } catch (error) {
        console.log(error, 'error ');
    }

}

// module.exports = { dbConnect, sequelize, modelSync }
module.exports = { sequelize, db, dbConnect }