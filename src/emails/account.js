const sgMail=require('@sendgrid/mail')
const sendGridapiKey=process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendGridapiKey)
const sendemail=(email,name)=>
{
sgMail.send({
        
        to:email,
        from:'no-reply_instagramclone@byom.de',
        subject:' This is a sample send',
        text:'i hope this one actually get to you'

})
}
const cancelemail=(email,name)=>
{

    sgMail.send({
        
        to:email,
        from:'no-reply_instagramclone@byom.de',
        subject:' Cancel your account',
        text:'Cancel your account'

})
}
module.exports={
    sendemail
}