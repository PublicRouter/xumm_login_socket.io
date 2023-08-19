const { XummSdk } = require('xumm-sdk');
require('dotenv').config();

const Sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);

const createSignin = async () => {

    const signInPayload = await Sdk.payload.create({
        'TransactionType': 'SignIn'
    });

    const response = {
        uuid: signInPayload.uuid,
        qrLink: signInPayload.next.always,
        qrImage: signInPayload.refs.qr_png

    };

    return response ; 

};

module.exports = createSignin;