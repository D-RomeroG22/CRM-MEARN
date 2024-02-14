const Email = require('./models/Email');

require("dotenv").config();
const nodemailer = require("nodemailer");

class CronEmail{

     transporter = nodemailer.createTransport({
        service:process.env.MAILER_SERVICE,
        auth:{
            user:process.env.MAILER_EMAIL,
            pass:process.env.MAILER_SECRET
        }
    });

    constructor()
    {}

    async sendMail(documents){
        const emails = [];
        const subject = documents[0].subject; // Asunto será el mismo para todos los documentos
        const htmlBody = documents[0].htmlBody; // Cuerpo HTML será el mismo para todos los documentos
        for (const document of documents) {
          emails.push(document.name);
        }
        try {

            const sendInformation = await this.transporter.sendMail({
                to:emails,
                subject:subject,
                html:htmlBody,
                attachments:attachments
            });

            console.log(sendInformation);
            return true
        } catch (error) {

            return false
        }
    }

}


export const EmailService = async()=>{
    const fecha = new Date();
    try {
        const query = {
            sendDate: {
              $date: {
                $year: fecha.getFullYear, // Año actual
                $month: fecha.getMonth, // Mes actual (febrero, 0 es enero)
                $day: fecha.getDay, // Día actual
              },
            },
          };
        const documents = await Email.find(query);
        if(!documents) return 'No hay correos para enviar';
        const emailSer = new CronEmail();
        await emailSer.sendMail(documents);
        return  `Correos enviados el dia ${fecha}`;
    } catch (error) {
        return error
    }
}