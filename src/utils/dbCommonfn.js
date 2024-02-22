const { raw } = require("mysql2");
const { sequelize } = require("../dbConfig/dbConfig");
const CustomError = require("../error/CustomErrorObj");
const { setUserDetails, setUserDelete } = require("./functionalHelper");
const { ModuleHistory } = require("../Models/TrackModuleHistory");

const fnGet = async (modelname, query = {}, include = []) => {
    try {
        let options = {
            raw: true,
            where: { ...query },
            include: include.length > 0 ? include : '',
        }
        console.log(options, 'options');
        const data = await modelname.findAll(options);
        return data;
    } catch (error) {
        console.log(error, 'error check');
        throw new CustomError(error?.message, 500)
    }
}

const fnPost = async (modelname, obj, include = [], req) => {
    try {
        let d = setUserDetails(req, obj)
        const data = await modelname.create(d, include);
        console.log('post data');
        return data;
    } catch (error) {
        console.log(error, 'error');
        throw new CustomError(error?.message, 400)
    }
}

const fnUpdate = async (model, obj, condition, req) => {
    try {
        let d = setUserDetails(req, obj,)
        console.log(d, condition, 'before update ');
        const data = await model.update(d, { where: condition });
        if (data[0] == 1) {
            return true
        }
        else {
            throw new CustomError('No Record Found To Update', 404)
        }
    } catch (error) {
        throw new CustomError(error?.message, error?.code ? error?.code : 500)
    }
}

const fnDelete = async (model, condition, req, modulename) => {
    try {
        let obj = setUserDelete(req, {});
        console.log(obj, 'obj delete');
        await fnPost(ModuleHistory, { modulename, ...obj });
        console.log(condition, 'condition for delete');
        const data = await model.destroy({ where: condition });
        if (data == 1) {
            return true
        }
        else {
            throw new CustomError('No Record Found To Delete', 404)
        }
    } catch (error) {
        throw new CustomError(error?.message, error?.code ? error?.code : 500)
    }
}

module.exports = {
    fnGet,
    fnPost,
    fnUpdate,
    fnDelete
}