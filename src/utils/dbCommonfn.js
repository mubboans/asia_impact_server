const { raw } = require("mysql2");
const { sequelize } = require("../dbConfig/dbConfig");
const CustomError = require("../error/CustomErrorObj");
const { setUserDetails, setUserDelete, setUserDetailsUpdate, getCurrentFormatedDate } = require("./functionalHelper");
const { ModuleHistory } = require("../Models/TrackModuleHistory");

const fnGet = async (modelname, query = {}, include = [], raw = false) => {
    try {
        let options;

        raw ? raw = true : raw = false;
        let pageno;
        if (query.limit && query.offset) {
            pageno = Number(query.offset);
            options = {
                ...options,
                limit: Number(query.limit),
                offset: (pageno - 1) * query.limit,
                logging: console.log
            }
            delete query.limit;
            delete query.offset;
        }
        if (query.attribute) {
            options = {
                ...options,
                attributes: query.attribute
            }
            delete query.attribute;
        }
        options = {
            ...options,
            // raw: true,
            raw,
            where: { ...query },
            order: [["id", "DESC"]],
            include: include.length > 0 ? include : '',
            // logging: console.log
        }
        console.log(options, 'check option', options.limit && options.offset);
        if (options.limit) {
            let { rows, count } = await modelname.findAndCountAll(options);
            return {
                totalPage: Math.ceil(count / options.limit),
                totalRecords: count,
                currentPage: pageno,
                currentLimit: options.limit,
                data: rows
            }
        }
        else {
            let data = await modelname.findAll(options);
            return data;
        }
    } catch (error) {
        console.log(error, 'error check');
        throw new CustomError(error?.message, 500)
    }
}
const fnPost = async (modelname, obj, include = [], req) => {
    try {
        let d = setUserDetails(req, obj);
        d.createdDate = getCurrentFormatedDate();
        d.createdOn = getCurrentFormatedDate();
        const data = await modelname.create(d, include);
        console.log('post data', include);
        return data;
    } catch (error) {
        console.log(error, 'error');
        throw new CustomError(error?.message, 400)
    }
}
const fnbulkCreate = async (modelname, arr, keys, req) => {
    try {
        let options = {};
        let modifiedarr = arr.map((x) => {
            console.log(x, 'x check in bulk');
            let d = setUserDetails(req, x);
            return d;
        });
        if (keys && keys.length > 0) {
            options = {
                updateOnDuplicate: [...keys]
            }
        }
        console.log(modifiedarr, 'modifiedarr');
        const data = await modelname.bulkCreate(modifiedarr, options);
        // console.log(data, 'bulk update');
        return data;
    } catch (error) {
        console.log(error, 'error');
        throw new CustomError(error?.message, 400)
    }
}
const fnUpdate = async (model, obj, condition, req) => {
    try {
        let d = setUserDetailsUpdate(req, obj)
        console.log(d, condition, 'before update ');
        const data = await model.update(d, { where: condition });
        console.log(data, 'data check');
        if (data[0] !== 0) {
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
        // if (!condition.id) throw new CustomError('No Id Found To Delete', 400)
        let obj = setUserDelete(req, {});
        console.log(obj, 'obj delete');
        console.log(condition, 'condition for delete');
        const data = await model.destroy({ where: condition, logging: console.log });
        console.log(data, 'data check');
        if (data == 1 || data > 1) {
            await fnPost(ModuleHistory, { modulename, ...obj });
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
    fnDelete,
    fnbulkCreate
}