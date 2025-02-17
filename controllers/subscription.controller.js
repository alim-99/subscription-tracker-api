import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.modal.js';
import { SERVER_URL } from '../config/env.js';

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();

    res.status(200).json({ success: true, data: subscriptions });
  } catch(error) {
    next(error);
  }
};

export const getSubscriptionDetails = async (req, res, next) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json({success: false, message: "Subscription id is required"});
    }

    const subscriptionDetails = await Subscription.findById(id);

    if (!subscriptionDetails) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    res.status(200).json({ success: true, data: subscriptionDetails });
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id, 
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    });

    res.status(201).json({ success: true, data: {subscription, workflowRunId} });
  } catch(error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // check if the user is the same as the one in the token
    if(req.user.id != req.params.id) {
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch(error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const {id} = req.params;
    const existedSubscription = await Subscription.findById(id);
    if (!existedSubscription) {
      res.status(404).json({success: false, message: "Subscription not found"});
    }

    const deletedSubscription = await existedSubscription.deleteOne();

    res.status(200).json({success: true, message: 'Subscription deleted successfully'});
  } catch(error) {
    next(error);
  }
};