const { registerPushNotificationTokenSchema } = require('../helpers/schema')
const sqlFunction = require('../helpers/sqlFunction')
const { Expo } = require('expo-server-sdk')

const expo = new Expo()
module.exports = class pushNotificationController {
    static registerPushNotificationToken = async (req, res) => {
        const { error } = registerPushNotificationTokenSchema.validate(req.body)
        if (error) {
            return res.status(401).json({
                message:
                    error?.details.map((detail) => detail.message).join(',') ??
                    'Invalid payload',
            })
        }

        try {
            const {
                user_id: userId,
                push_notification_token: token,
                platform,
            } = req.body
            const pushNotificationData =
                await sqlFunction.registerPushNotifToken({
                    userId,
                    token,
                    platform,
                })
            res.status(200).json({
                ...pushNotificationData,
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error',
            })
        }
    }
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
