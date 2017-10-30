export const smtp = {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'apikey', // generated ethereal user
        pass: 'SendGridApiKey'  // generated ethereal password
    }
}


export const url = 'http://localhost:3001';
