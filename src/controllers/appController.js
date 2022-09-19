const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');
const {exportLoadsToExcel} = require('../tools/exportXlsx')

const _static = `http://localhost:${process.env.PORT}`;
const _apiBase = `${_static}/api`;

const getUser = async (req) => {
    const authorization = req.cookies.token;
    if (!authorization) {
        return null;
    }
    return jwt.verify(authorization.split(' ')[1],
        process.env.SECRET_KEY);
}

const renderHomePage = async (req, res, next) => {
    try {
        const user = await getUser(req, res);
        if (user) {
            if (user.role === 'DRIVER') {
                user.trucks = await getTrucks(req, res);
                user.activeLoad = await getActiveLoad(req, res);
                user.loads = await getDriverLoads(req, res);
            } else {
                user.loads = await getLoads(req, res);
            }
            const avatar = await getAvatar(req, res);
            user.avatar = avatar ? `${_static}/images/${avatar}` : `${_static}/images/avatar.png`;
        }
        res.render('index', {
            user
        });
    } catch (err) {
        return renderErrorPage(400, err.message)(req, res);
    }
}

const renderErrorPage = (statusCode, statusTitle) => {
    return async (req, res) => res.status(statusCode).render('error', {
        title: statusTitle,
        user: req.user,
    });
};

const login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const {data: {jwt_token}} = await axios({
            method: 'post',
            url: `${_apiBase}/auth/login`,
            data: {
                email,
                password
            }
        });
        res.cookie('token', `Bearer ${jwt_token}`);
        res.redirect('back');
    } catch (err) {
        return renderErrorPage(400, err.message)(req, res);
    }
}

const signUp = async (req, res, next) => {
    try {
        const {email, password, role} = req.body;
        await axios({
            method: 'post',
            url: `${_apiBase}/auth/register`,
            data: {
                email,
                password,
                role
            }
        })
        return login(req, res, next);
    } catch (err) {
        return renderErrorPage(400, err.message)(req, res);
    }
}

const logout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.redirect('back');
    } catch (err) {
        return renderErrorPage(400, err.message)(req, res);
    }
}

const createTruck = async (req, res, next) => {
    try {
        const {type} = req.body;
        await axios({
            method: 'post',
            data: {
                type
            },
            url: `${_apiBase}/trucks`,
            headers: {
                authorization: req.cookies.token
            }
        })
        res.redirect('back');
    } catch (err) {
        return renderErrorPage(400, err.message)(req, res);
    }
}

const getTrucks = async (req, res, next) => {
    try {
        const {data: {trucks}} = await axios({
            method: 'get',
            url: `${_apiBase}/trucks`,
            headers: {
                authorization: req.cookies.token
            }
        });
        return trucks;
    } catch (err) {
        return renderErrorPage(400, err.message)(req, res);
    }
}

const assignTruck = async (req, res, next) => {
    try {
        const {id} = req.params;
        await axios({
            method: 'post',
            url: `${_apiBase}/trucks/${id}/assign`,
            headers: {
                authorization: req.cookies.token
            }
        });
        res.redirect('back');
    } catch (err) {
        return renderErrorPage(400, err.message)(req, res);
    }
}

const deleteTruck = async (req, res, next) => {
    try {
        const {id} = req.params;
        await axios({
            method: 'delete',
            url: `${_apiBase}/trucks/${id}`,
            headers: {
                authorization: req.cookies.token
            }
        });
        res.redirect('back');
    } catch (err) {
        return renderErrorPage(400, err.message)(req, res);
    }
}

const createLoad = async (req, res, next) => {
    try {
        const {name, payload, pickup_address, delivery_address, width, length, height} = req.body;
        await axios({
            method: 'post',
            url: `${_apiBase}/loads`,
            data: {
                name,
                payload,
                pickup_address,
                delivery_address,
                dimensions: {
                    width,
                    length,
                    height
                }
            },
            headers: {
                authorization: req.cookies.token
            }
        });
        res.redirect('back');
    } catch (err) {
        return renderErrorPage(400, `${err.message}. Check if your data is correct.`)(req, res);
    }
}

const getLoads = async (req, res, next) => {
    try {
        const {data: {loads}} = await axios({
            method: 'get',
            url: `${_apiBase}/loads`,
            headers: {
                authorization: req.cookies.token
            }
        });
        return loads;
    } catch (err) {
        return renderErrorPage(400, err.message)(req, res);
    }
}

const deleteLoad = async (req, res, next) => {
    try {
        const {id} = req.params;
        await axios({
            method: 'delete',
            url: `${_apiBase}/loads/${id}`,
            headers: {
                authorization: req.cookies.token
            }
        });
        res.redirect('back');
    } catch (err) {
        return renderErrorPage(400, err.message)(req, res);
    }
}

const postLoad = async (req, res, next) => {
    try {
        const {id} = req.params;
        await axios({
            method: 'post',
            url: `${_apiBase}/loads/${id}/post`,
            headers: {
                authorization: req.cookies.token
            }
        });
        res.redirect('back');
    } catch (err) {
        return renderErrorPage(400, `${err.message}. Looks like no one can take your load at the moment.`)(req, res);
    }
}

const getActiveLoad = async (req, res, next) => {
    try {
        const {data: {load}} = await axios({
            method: 'get',
            url: `${_apiBase}/loads/active`,
            headers: {
                authorization: req.cookies.token
            }
        });
        return load;
    } catch (err) {
        return null;
    }
}

const iterateLoad = async (req, res, next) => {
    try {
        await axios({
            method: 'patch',
            url: `${_apiBase}/loads/active/state`,
            headers: {
                authorization: req.cookies.token
            }
        });
        res.redirect('back');
    } catch (err) {
        return renderErrorPage(400, `${err.message}`)(req, res);
    }
}

const getDriverLoads = async (req, res) => {
    try {
        const {data: {loads}} = await axios({
            method: 'get',
            url: `${_apiBase}/loads`,
            headers: {
                authorization: req.cookies.token
            }
        });
        return loads;
    } catch (err) {
        return null;
    }
}

const exportLoads = async (req, res, next) => {
    try {
        const loads = await getDriverLoads(req, res);
        exportLoadsToExcel(loads);
        res.download(path.resolve('./files/loads.xlsx'), (err) => {
            if (err) {
                console.log(err);
            }
        })
    } catch (err) {
        return renderErrorPage(400, `${err.message}`)(req, res);
    }
}

const getAvatar = async (req, res, next) => {
    try {
        const {data: {avatar}} = await axios({
            method: 'get',
            url: `${_apiBase}/users/avatar`,
            headers: {
                authorization: req.cookies.token
            }
        });
        return avatar;
    } catch (err) {
        return renderErrorPage(400, `${err.message}`)(req, res);
    }
}

const uploadAvatar = async (req, res, next) => {
    try {
        await axios({
            method: 'patch',
            url: `${_apiBase}/users/avatar`,
            data: {
                avatarName: req.file.filename
            },
            headers: {
                authorization: req.cookies.token
            }
        });
        res.redirect('back');
    } catch (err) {
        return renderErrorPage(400, `${err.message}`)(req, res);
    }
}

module.exports = {
    renderHomePage,
    login,
    signUp,
    logout,
    createTruck,
    assignTruck,
    deleteTruck,
    createLoad,
    deleteLoad,
    postLoad,
    iterateLoad,
    exportLoads,
    uploadAvatar
}