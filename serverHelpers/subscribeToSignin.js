const { XummSdk } = require('xumm-sdk');
require('dotenv').config()

const Sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET)

const subscribeTo = async (uuid) => {

    const subscription = await Sdk.payload.subscribe(uuid, (event) => {
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data;
        }; 
    });

    const resolveData = await subscription.resolved;

    if (resolveData.signed === true) {
        return {
            signed: true,
            txData: resolveData
        }
    }else if (resolveData.signed === false) {
        return {
            signed: false,
            txData: resolveData
        }
    };

}

module.exports = subscribeTo