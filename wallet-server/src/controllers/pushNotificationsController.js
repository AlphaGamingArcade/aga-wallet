const { registerPushNotificationTokenSchema } = require('../helpers/schema')
const sqlFunction = require('../helpers/sqlFunction')
const { Expo } = require('expo-server-sdk')

const expo = new Expo()
module.exports = class pushNotificationController {
    static registerPushNotificationToken = async (req, res) => {
        try {
            const { error } = registerPushNotificationTokenSchema.validate(req.body);
    
            if (error) {
                return res.status(400).json({
                    message: error.details.map((detail) => detail.message).join(',') || 'Invalid payload',
                });
            }
    
            const { user_id: userId, push_notification_token: token, platform } = req.body;
    
            const isPushTokenExist = await sqlFunction.isPushTokenExists(token);
    
            if (isPushTokenExist) {
                const pushTokenData = await sqlFunction.updatePushTokenUser(userId, platform, token);
                return res.status(200).json({
                    ...pushTokenData,
                });
            }
    
            const pushTokenData = await sqlFunction.createPushToken(userId, platform, token);
            res.status(200).json({
                ...pushTokenData,
            });
        } catch (error) {
            console.error(error); // Log the error for debugging purposes
            res.status(500).json({
                message: 'Internal server error',
            });
        }
    };
    static testPushNotification = async (req, res) => {
        try {
            expo.sendPushNotificationsAsync([
                {
                    to: req.body.expo_id,
                    title: 'Aga Wallet',
                    body: 'You received $20.00',
                },
            ])
            res.status(200).json({
                message: 'Notification sent successfully',
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error',
            })
        }
    }
}
