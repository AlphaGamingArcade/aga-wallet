const Joi = require('joi')

module.exports = {
    userSchema: Joi.object({
        first_name: Joi.string().alphanum().min(1).max(30).required(),
        last_name: Joi.string().alphanum().min(1).max(30).required(),
        phone_number: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        passcode: Joi.number().integer().positive().required(),
    }),
    sendTransactionSchema: Joi.object({
        receiver_address: Joi.string().required(),
        sender_address: Joi.string().required(),
        amount: Joi.number().required(),
    }),
    createWalletSchema: Joi.object({
        user_id: Joi.string().required(),
    }),
    registerPushNotificationTokenSchema: Joi.object({
        user_id: Joi.string().allow(null),
        push_notification_token: Joi.string().required(),
        platform: Joi.string().required(),
    }),
    emailSchema: Joi.object({
        email: Joi.string().email().required(),
    }),
    phoneNumberSchema: Joi.object({
        phone_number: Joi.string().required(),
    }),
    userIdSchema: Joi.object({
        user_id: Joi.string().required(),
    }),
}
