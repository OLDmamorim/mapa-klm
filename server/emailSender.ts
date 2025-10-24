import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"MAPA KLM - ExpressGlass" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    });

    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function sendRelatorioEmail(
  adminEmail: string,
  colaboradorNome: string,
  data: string,
  pdfBuffer: Buffer
): Promise<boolean> {
  const subject = `Relatório de Despesas KM - ${colaboradorNome} - ${data}`;
  
  const text = `
Novo relatório de despesas de KM submetido.

Colaborador: ${colaboradorNome}
Data: ${data}

O relatório em PDF está anexado a este email.

---
Sistema MAPA KLM - ExpressGlass
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">MAPA KLM</h1>
        <p style="color: white; margin: 5px 0 0 0;">ExpressGlass</p>
      </div>
      
      <div style="padding: 30px; background-color: #f9fafb;">
        <h2 style="color: #1f2937; margin-top: 0;">Novo Relatório de Despesas</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Colaborador:</strong> ${colaboradorNome}</p>
          <p style="margin: 10px 0;"><strong>Data:</strong> ${data}</p>
        </div>
        
        <p style="color: #6b7280;">O relatório completo em PDF está anexado a este email.</p>
      </div>
      
      <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
        <p>Sistema MAPA KLM - ExpressGlass</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
    attachments: [
      {
        filename: `Relatorio_${colaboradorNome.replace(/\s+/g, "")}_${data}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}

