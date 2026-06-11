import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Bitte füllen Sie alle Felder aus.' }, { status: 400 });
    }

    // Configure Nodemailer transporter with Environment Variables
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465, // or 587 depending on provider
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: `"${name} (VSGraph Kontakt)" <${process.env.MAIL_SENDER}>`,
      to: process.env.MAIL_RECEPIENT,
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${name}`,
      text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
      html: `
        <h3>Neue Kontaktanfrage (VSGraph)</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <hr />
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Nachricht erfolgreich gesendet.' }, { status: 200 });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Senden der E-Mail. Bitte überprüfen Sie die Serverkonfiguration.' },
      { status: 500 }
    );
  }
}
