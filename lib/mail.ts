import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

/**
 * Send a verification email with a 6-digit OTP code
 */
export async function sendVerificationEmail(
    to: string,
    code: string
): Promise<void> {
    const mailOptions = {
        from: `"Cloudframe Studio" <${process.env.GMAIL_USER}>`,
        to,
        subject: `${code} — Your Cloudframe Studio verification code`,
        html: generateEmailHTML(code),
    };

    await transporter.sendMail(mailOptions);
}

function generateEmailHTML(code: string): string {
    const digits = code.split('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #FFFBF5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFBF5; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #1C1917 0%, #433022 100%); padding: 32px 40px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                                    ☁️ Cloudframe Studio
                                </h1>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px 40px 20px;">
                                <h2 style="margin: 0 0 8px; color: #1C1917; font-size: 24px; font-weight: 700;">
                                    Verify your email
                                </h2>
                                <p style="margin: 0 0 32px; color: #78716C; font-size: 15px; line-height: 1.6;">
                                    Enter this code to complete your signup. It expires in <strong style="color: #1C1917;">10 minutes</strong>.
                                </p>

                                <!-- OTP Code -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="padding: 24px 0;">
                                            <table cellpadding="0" cellspacing="0">
                                                <tr>
                                                    ${digits.map(d => `
                                                    <td style="padding: 0 4px;">
                                                        <div style="width: 48px; height: 56px; background: linear-gradient(135deg, #FFF7ED, #FFEDD5); border: 2px solid #FED7AA; border-radius: 12px; text-align: center; line-height: 56px; font-size: 28px; font-weight: 800; color: #1C1917; letter-spacing: 2px;">
                                                            ${d}
                                                        </div>
                                                    </td>
                                                    `).join('')}
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 24px 0 0; color: #A8A29E; font-size: 13px; line-height: 1.5; text-align: center;">
                                    If you didn't create an account on Cloudframe Studio, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 20px 40px 32px; text-align: center; border-top: 1px solid #F5F5F4;">
                                <p style="margin: 0; color: #D6D3D1; font-size: 11px;">
                                    © 2026 Cloudframe Studio Inc.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}
