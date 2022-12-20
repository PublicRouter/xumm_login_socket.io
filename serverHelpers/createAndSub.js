const createSignin = require('./createXummSignin');
const subscribeTo = require('./subscribeToSignin');

const createAndSub = async () => {
    const signInObj = await createSignin();
    console.log(`
    SignIn Payload Links:
    Xumm URL: ${signInObj.qrLink},
    Qr PNG: ${signInObj.qrImage}
    `)

    const subscription = await subscribeTo(signInObj.uuid)

    const subscriptionResponse = await subscription;
    console.log("SUB RESPONSE FROM MAIN", subscriptionResponse)


}

createAndSub()