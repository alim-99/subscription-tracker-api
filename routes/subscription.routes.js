import { Router } from "express";
import { authorize } from '../middlewares/auth.middleware.js';
import { 
  createSubscription, 
  deleteSubscription, 
  getAllSubscriptions, 
  getSubscriptionDetails, 
  getUserSubscriptions
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// get all the created subscriptions
subscriptionRouter.get('/', getAllSubscriptions);

// get the subscription details by the subscription id
subscriptionRouter.get('/:id', getSubscriptionDetails);

// create new subscription
subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => {
  res.send({ title: "UPDATE subscription" });
});

// delete a subscription by user id
subscriptionRouter.delete('/:id', deleteSubscription);

// get subscription by the user id
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// cancel subscription by subscription id
subscriptionRouter.put('/:id/cancel', (req, res) => {
  res.send({ title: "CANCEL subscription" });
});

export default subscriptionRouter;