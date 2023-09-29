const { XummSdk } = require('xumm-sdk');
require('dotenv').config();

const Sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);

const subscribeToPayloadUuid = async (uuid) => {
    console.log("Subscription helper is now listening to desired payload for 'signed' true event...")
    const subscription = await Sdk.payload.subscribe(uuid, (event) => {
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data;
        };
    });

    const resolveData = await subscription.resolved;

    if (resolveData) {
        console.log("Subscribed payload has resolved. Will now lookup tx UUID to return resolved tx data.")
        const payload = await Sdk.payload.get(uuid);
        console.log(`
        Resolved TX Data:
            Signed: ${payload.meta.signed}
            Signed By: ${payload.response.account},
            Signed User Token: ${payload.response.user}
        `);

        return payload
    };
    
};
//after payload resolved, lookup completed tx and return data
module.exports = subscribeToPayloadUuid;