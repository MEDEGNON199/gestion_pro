import * as nodemailer from 'nodemailer';

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'hugues',
      pass: 'swet kthp vtrj yoro', // ⬅️ Remplace par ton vrai mot de passe
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: 'TaskFlow <huguesmedegnon842@gmail.com>',
    to: 'valentinmedegnon@gmail.com',
    subject: 'Test email TaskFlow',
    text: 'Ceci est un test !',
    html: '<b>Ceci est un test !</b>',
  });

  console.log('Email envoyé:', info.messageId);
}

testEmail().catch(console.error);