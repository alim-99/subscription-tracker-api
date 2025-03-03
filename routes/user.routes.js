import { Router } from "express";
import { getUsers, getUser, createNewUser, deleteUser, updateUser } from "../controllers/user.controller.js";
import { authorize } from '../middlewares/auth.middleware.js'; 

const userRouter = Router();

// get all users
userRouter.get('/', getUsers);

// get a user by id
userRouter.get('/:id', authorize ,getUser);

// create a new user
userRouter.post('/', createNewUser);

// update a user
userRouter.put('/:id', updateUser);

// delete a user by its id
userRouter.delete('/:id', deleteUser);

export default userRouter;