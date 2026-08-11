// netlify/functions/procesa-contacte.js
// -----------------------------------------------------------------
// Netlify Function que rep les dades del formulari de contacte.html
// i envia un correu amb remitent fix: roma.mendoza@institutjoanmiro.cat (fase de desenvolupament)
//
// REQUISITS ABANS DE FER-LO SERVIR:
//
// 1) El projecte ha d'estar desplegat a Netlify (aquesta funció NO
//    funciona obrint l'HTML directament des de l'ordinador).
//
// 2) Cal instal·lar la dependència "nodemailer". Al terminal, a
//    l'arrel del projecte:
//        npm init -y
//        npm install nodemailer
//
// 3) Cal tenir un compte de correu real roma.mendoza@institutjoanmiro.cat
//    i les seves dades SMTP (host, usuari, contrasenya). NO les
//    escriviu directament en aquest fitxer: configureu-les com a
//    "variables d'entorn" al tauler de Netlify:
//        Site settings > Environment variables > Add a variable
//    Variables a crear:
//        SMTP_HOST      (p. ex. smtp.institutjoanmiro.cat)
//        SMTP_PORT      (587 o 465)
//        SMTP_USER      (roma.mendoza@institutjoanmiro.cat)
//        SMTP_PASS      (la contrasenya d'aquest compte)
//        DESTINATARI    (info@institutjoanmiro.cat, o la bústia que rebi els missatges)
//
// 4) Un cop desplegat, la funció queda disponible automàticament a:
//        https://institutjoanmiro.netlify.app/.netlify/functions/procesa-contacte
//    (aquesta és l'adreça real del site a Netlify). L'HTML de
//    contacte.html fa servir una ruta relativa (/.netlify/functions/...),
//    així que ja funciona correctament amb aquest domini sense
//    haver de tocar res més.
//    L'HTML de contacte.html ja hi apunta.
// -----------------------------------------------------------------

const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Mètode no permès.' }) };
  }

  let dades;
  try {
    dades = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Dades no vàlides.' }) };
  }

  const nom = (dades.nom || '').trim();
  const correu = (dades.correu || '').trim();
  const motiu = (dades.motiu || '').trim();
  const missatge = (dades.missatge || '').trim();

  const correuValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correu);
  if (!nom || !correu || !missatge || !correuValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, error: 'Dades incompletes o correu no vàlid.' }),
    };
  }

  // Comprovació prèvia: si falta alguna variable d'entorn, ho diem
  // clarament al log en lloc de deixar que nodemailer falli d'una
  // manera més críptica més avall.
  const falten = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'].filter(
    (clau) => !process.env[clau]
  );
  if (falten.length > 0) {
    console.error('Falten variables d\'entorn a Netlify:', falten.join(', '));
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "No s'ha pogut enviar el correu." }),
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465, // true per al port 465, false per al 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Institut Joan Miró - Web" <${process.env.SMTP_USER}>`, // remitent fix
      to: process.env.DESTINATARI || process.env.SMTP_USER,
      replyTo: `"${nom}" <${correu}>`, // si es respon el correu, va a qui ha escrit
      subject: `Formulari de contacte web: ${motiu}`,
      text:
        `Nou missatge des del formulari de contacte de institutjoanmiro.cat\n\n` +
        `Nom: ${nom}\n` +
        `Correu: ${correu}\n` +
        `Motiu: ${motiu}\n\n` +
        `Missatge:\n${missatge}\n`,
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    // Aquest detall NO s'envia mai al navegador (per seguretat),
    // però sí que queda apuntat al log de la funció a Netlify
    // (Functions > procesa-contacte), que és on l'hem d'anar a mirar
    // per saber exactament què ha fallat.
    console.error('Error enviant el correu del formulari de contacte:', {
      message: err.message,
      code: err.code,       // p. ex. EAUTH, ECONNECTION, ETIMEDOUT...
      command: err.command, // p. ex. l'ordre SMTP on ha fallat
      response: err.response,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "No s'ha pogut enviar el correu." }),
    };
  }
};
