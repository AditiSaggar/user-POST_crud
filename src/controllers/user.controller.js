const UserModel = require('../models/user.schema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rootRouter = require('../routes');
const {createUserSchema, loginUserSchema} = require("../validations/user.validate");

// create
const createUser = async (req, res) => {
    const { error } = createUserSchema.validate(req.body);
    console.log("error", error)
    if (error) {
        console.log("error", error.message)
        return res.status(400).json({
            error: error.details.map((err) => {
            
                return err.message.replace(/"/g, '');
                
            })
        });
    }

    const { email, userName, password } = req.body
    try {
        let checkUser = await UserModel.findOne({ "$or": [{ email: email }, { userName: userName }] })
        console.log("checkUser",checkUser)
        if (!checkUser) {
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)

            const user = await UserModel.create({
                ...req.body,
                password: passwordHash
            })
            res.send({
                data: user,
                message: "User created succesfully",
                status: 200
            })
        }
        else {
            res.status(403).json({ status: false, error: "user already exist" })
        }
    } catch (error) {
    }
}

// login
const loginUser = async (req, res) => {

    const { error } = loginUserSchema.validate(req.body);

    if (error) {
        return res.status(400).json({

            error: error.details.map((err) => err.message.replace(/"/g, ''))
         });
        // console.log(error.details.map)

    }
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email: email })
        if (user) {
            let isPasswordValid = await bcrypt.compare(password, user.password)
            if (!!isPasswordValid) {
                const token = jwt.sign({ user_id: user?._id, email }, process.env.TOKEN_KEY);
                res.send({
                    data: { user, token },
                    status: true
                })
            } else {

                let responseObj = { 
                    status: 403, 
                    json: { 
                        status: false, 
                        error: "password/email not correct" } }
                res.responseObj = responseObj
                next(res)
            }
        } else {
            res.status(403).json({ 
                status: false, 
                error: "password/email not correct" })
        }
    } catch (error) {
        next(error);
    }
}

//getUserById
const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await UserModel.findById(userId);
        if (user) {
            res.status(200).json({
                data: user,
                message: "User found successfully",
                status: 200
            });
        } else {
            res.status(404).json({
                status: false,
                error: "User not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });
    }
};

//getAll users
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({
            data: users,
            message: "Users retrieved successfully",
            status: 200
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });
    }
};

//update
const updateUser = async (req, res) => {
    const userId = req.params.id;
    console.log(req.params.id)
    const updatedData = req.body;
    console.log(req.body)

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        Object.assign(user, updatedData);

        await user.save();

        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//deleteuser
const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await UserModel.deleteOne({ _id: userId });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createUser,
    loginUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
}