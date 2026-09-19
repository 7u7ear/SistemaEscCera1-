const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const logger = require('./logger.service');

class EmailService {
    constructor() {
        this.transporter = null;
        this.logFilePath = path.resolve(__dirname, '../../../logs/email.log');

        this.initTransporter();
        this.ensureLogDir();
    }

    initTransporter() {
        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

        if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
            this.transporter = nodemailer.createTransport({
                host: SMTP_HOST,
                port: parseInt(SMTP_PORT, 10),
                secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
                auth: {
                    user: SMTP_USER,
                    pass: SMTP_PASS,
                },
            });
            logger.info('SMTP Transporter inicializado correctamente.');
        } else {
            logger.warn('Faltan variables de entorno SMTP. Los emails se guardarán en el log local (fallback).');
        }
    }

    ensureLogDir() {
        const logDir = path.dirname(this.logFilePath);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }

    async sendMail(to, subject, html) {
        const from = process.env.SMTP_FROM || '"Sistema ECN N°1" <no-reply@ecn1.edu.ar>';
        const mailOptions = {
            from,
            to,
            subject,
            html,
        };

        if (this.transporter) {
            try {
                const info = await this.transporter.sendMail(mailOptions);
                logger.info(`Email enviado a ${to}: ${info.messageId}`);
                return { success: true, messageId: info.messageId };
            } catch (error) {
                logger.error(`Error enviando email via SMTP a ${to}:`, error);
                return this.fallbackLog(mailOptions, error);
            }
        } else {
            return this.fallbackLog(mailOptions, new Error('SMTP no configurado'));
        }
    }

    fallbackLog(mailOptions, originalError) {
        try {
            const timestamp = new Date().toISOString();
            const logEntry = `\n==================================================\n` +
                             `FECHA:   ${timestamp}\n` +
                             `DE:      ${mailOptions.from}\n` +
                             `PARA:    ${mailOptions.to}\n` +
                             `ASUNTO:  ${mailOptions.subject}\n` +
                             `ERROR:   ${originalError.message}\n` +
                             `----------------- CONTENIDO HTML -----------------\n` +
                             `${mailOptions.html}\n` +
                             `==================================================\n`;

            fs.appendFileSync(this.logFilePath, logEntry, 'utf8');
            logger.info(`Email fallback registrado en logs/email.log para ${mailOptions.to}`);
            return { success: false, fallback: true, error: originalError.message };
        } catch (fsError) {
            logger.error('Error crítico al escribir en el fallback log de emails:', fsError);
            return { success: false, fallback: false, error: 'Fallo al escribir en logs de fallback' };
        }
    }
}

module.exports = new EmailService();
