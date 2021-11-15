const express = require('express');
const User = require("../models/User");
const router = express.Router();

const accountSid = 'ACcbe998d5513f43aa31fc4c33bf15e052';
const authToken = '799171eff66828bd6ce4fac18ac7ba72';
const client = require('twilio')(accountSid, authToken);
var newSid;

function getSid (sid) {
    newSid = sid;
    return newSid
}

router.get('', async (req, res) => {


    const { sid } = await client.verify.services.create({
        friendlyName: "Our Poker Night",
    })
    getSid(sid);
    console.log('-----------',sid);
    client.verify.services(sid)
        .verifications
        .create({to: '', channel: 'sms'})
        .then(verification => {
            console.log(verification.status);
            res.status(200).send('ok')
        }).catch( (e) => {
        console.log(e);
        return res.status(500).send(e);
        });
})

router.post('/',async (req, res) => {
    console.log('++++++++++', req.body, newSid);



    client.verify.services(newSid)
        .verificationChecks
        .create({to: '', code: req.body.code})
        .then(verification_check => {
            console.log(verification_check.status);
            res.status(200).send('ok')
        })
        .catch(e => {
            console.log(e)
            return res.status(500).send(e);
        });

});

module.exports = router;



