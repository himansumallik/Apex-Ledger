import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const signup = async(req, res) =>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message: `All fields are required`});
    }

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: `Email already in use`});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name, 
            email, 
            password: hashPassword
        });

        return res.status(201).json({
            message: `User registered successfully`,
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            } 
        });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const signin = async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '7d'}
        )

        return res.status(200).json({
            message: `Login Successful`,
            token, 
            user: {
                id: user._id,
                name: user.name, 
                email:user.email,
            },
        });

    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

