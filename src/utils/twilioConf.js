const twilio = require("twilio");
const accountSid = process.env.MYAPP_TWILIO_ACCOUNT_SID;
const authToken = process.env.MYAPP_TWILIO_AUTH_TOKEN;
const backendUrl = process.env.MYAPP_BACKEND_DOMAIN_URL

const twilioConf = async (toNumber=process.env.MYAPP_TWILIO_CALL_TO_PHONE_NO) => {
    try {
        const client = new twilio(accountSid, authToken);
        
        let call = await client.calls.create({
          url: "http://demo.twilio.com/docs/voice.xml",
          from: process.env.MYAPP_TWILIO_CALL_FROM_PHONE_NO,
          to: toNumber
        });
        return call;
    } catch (error) {
        console.error("Error making call with Twilio:", error);
        throw error;
    }
};

const twilioConfCallMultipleNumbers = async (toNumbers=process.env.MYAPP_TWILIO_CALL_TO_PHONE_NOS?.split(',')) => {
    try {
        const client = new twilio(accountSid, authToken);
        let arr = []

        let callUrl = `${backendUrl}/twilio/twiml?message=Yourdynamicmessagehere`

        for (let number of toNumbers) {
            if (!number.startsWith('+91')) {
                number = `+91${number}`;
            }

            let call = await client.calls.create({
                url: callUrl,
                from: process.env.MYAPP_TWILIO_CALL_FROM_PHONE_NO,
                to: number
            });
            arr.push({ number, callSid: call.sid })
            console.log(`Call initiated to ${number}: ${call.sid}`);
        }
        return { success: true, data: arr }
    } catch (error) {
        console.error("Error making call with Twilio:", error);
        throw error;
    }
};

module.exports = { twilioConf, twilioConfCallMultipleNumbers };
