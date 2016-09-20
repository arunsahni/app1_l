

const messages = {
        "errorRetreivingData": "Error occured while retreiving the data from collection",
        "errorVerification": "Error occured while fetching the data",
        "successVerification": "saved successfully",
        "vehicleTypeUpdateSuccess": "Vehicle Type updated successfully",
        "vehicleTypeStatusUpdateSuccess": "Status updated successfully",
        "vehicleTypeStatusUpdateFailure": "Error occured while updating status",
        "vehicleTypeStatusDeleteFailure": "Error occured while deleting the vehicle types",
        "vehicleTypeDeleteSuccess":"Vehicle Type deleted successfully",
        "successSendingForgotPasswordEmail": "Password sent successfully"

        }

const gmailSMTPCredentials = {
        "type": "SMTP",
        "service": "Gmail",
        "host": "ssl://smtp.gmail.com",
        "port": 465,
        "secure": true,
        "username": "learnanything15@gmail.com",
        "password": "learnanything"

        }

const facebookCredentials = {
        "app_id" : "1749478025322375",
        "secret":"d8d8b27dcd1c1fb1e7b1a5f8acf3ce1e",
        "token_secret": process.env.token_secret || 'JWT Token Secret'
        }

const twitterCredentials = {
"consumer_key" : "q2doqAf3TC6Znkc1XwLvfSD4m",
        "consumer_secret" : "Yrfi1hr84UMoamS2vnJZQn6CeP8dHsv6XjDoyRqsfzSNwyFQBZ"
        }

const googleCredentials = {
"client_secret_key" : "TxjtEARvPHGfyYHwrlSOMcxD"
        }

const twilioCredentials = {
 "TwilioNumber" : "+12673547187",
 "ACCOUNTSID"   : "ACe8a9f10460d2461e70eab4797ea452ae",
 "AUTHTOKEN"    : "0eb5be11606f83865809226985fb1289"
}

const imagePaths = {
    "learner": "/../../../public/images/learner/avatar/original/",
    "learnerResize": "/../../../public/images/learner/avatar/thumbnail/",
    "tutor": "/../../../public/images/tutor/avatar/original/",
    "tutorResize": "/../../../public/images/tutor/avatar/thumbnail/",
}

var obj = {messages:messages, gmailSMTPCredentials:gmailSMTPCredentials, facebookCredentials:facebookCredentials, twitterCredentials : twitterCredentials, googleCredentials : googleCredentials, twilioCredentials: twilioCredentials,imagePaths: imagePaths};
        module.exports = obj; 