import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const signup = async(req, res) =>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message: `All fields are required`});
    }

    try{
        const existingUser = User.findOne({email});
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