const { XummSdk } = require('xumm-sdk');
require('dotenv').config();

const Sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);

const subscribeTo = async (uuid) => {

    const subscription = await Sdk.payload.subscribe(uuid, (event) => {
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data;
        };
    });

    const resolveData = await subscription.resolved;

    if (resolveData) {
        console.log("GETTING FINAL PAYLOAD")
        const payload = await Sdk.payload.get(uuid);
        console.log(`
            Fetched Payload Data:
            Signed: ${payload.meta.signed}
            Signed By: ${payload.response.account},
            Signed User Token: ${payload.response.user}
        `);
        return payload
    };
    
};

module.exports = subscribeTo;