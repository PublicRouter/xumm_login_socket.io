const { XummSdk } = require('xumm-sdk')

require('dotenv').config()

const Sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET)

const lookupPayload = async (uuid) => {
    const payload = await Sdk.payload.get(uuid);
    console.log(`
    Fetched Payload Data:
    Signed By: ${payload.response.account},
    Signed User Token: ${payload.response.user}
    `)

}

module.exports = lookupPayload