import PDFDocument from "pdfkit";
import { Readable } from "stream";
import { Colaborador } from "../drizzle/schema";

interface RelatorioData {
  colaborador: Colaborador;
  data: string;
  matricula: string;
  localidade: string;
  motivo: string;
  klm: number;
  totalDespesas: number;
}

export async function generateRelatorioPDF(data: RelatorioData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header - Logo and Title
      doc.fontSize(20)
        .fillColor("#E31E24")
        .text("EXPRESS", 50, 50, { continued: true })
        .fillColor("#1E3A8A")
        .text("GLASS");

      doc.fontSize(10)
        .fillColor("#666666")
        .text("part of Cary group", 50, 75);

      doc.fontSize(16)
        .fillColor("#000000")
        .text("DESPESAS DE KM EM VIATURA PRÓPRIA", 200, 60, { align: "center" });

      // Identification Section
      doc.fontSize(14)
        .fillColor("#000000")
        .text("Identificação:", 50, 120);

      const identY = 145;
      doc.fontSize(11);
      
      doc.text("Utilizador:", 50, identY);
      doc.rect(150, identY - 5, 400, 20).stroke();
      doc.text(data.colaborador.nome, 155, identY);

      doc.text("Nº Colaborador:", 50, identY + 30);
      doc.rect(150, identY + 25, 150, 20).stroke();
      doc.text(data.colaborador.codigo, 155, identY + 30);

      doc.text("Empresa:", 50, identY + 60);
      doc.rect(150, identY + 55, 150, 20).stroke();
      doc.text(data.colaborador.empresa, 155, identY + 60);

      doc.text("Centro de Custo:", 50, identY + 90);
      doc.rect(150, identY + 85, 150, 20).stroke();
      doc.text(data.colaborador.loja, 155, identY + 90);

      // Expenses Section
      const expensesY = identY + 140;
      doc.fontSize(14)
        .text("Despesas - Mapa de Km", 50, expensesY);

      const tableY = expensesY + 30;
      doc.fontSize(11);

      doc.text("Data", 50, tableY);
      doc.rect(150, tableY - 5, 150, 20).stroke();
      doc.text(data.data, 155, tableY);

      doc.text("Matrícula:", 50, tableY + 30);
      doc.rect(150, tableY + 25, 150, 20).stroke();
      doc.text(data.matricula, 155, tableY + 30);

      doc.text("Proprietário:", 50, tableY + 60);
      doc.rect(150, tableY + 55, 400, 20).stroke();
      doc.text(data.colaborador.nome, 155, tableY + 60);

      // Table
      const tableHeaderY = tableY + 100;
      const colWidths = [80, 60, 60, 60, 120, 165];
      const headers = ["Dia", "Saída", "Chegada", "Km's", "Local", "Motivo"];
      
      let xPos = 50;
      headers.forEach((header, i) => {
        doc.rect(xPos, tableHeaderY, colWidths[i], 25).stroke();
        doc.fontSize(9).text(header, xPos + 5, tableHeaderY + 8, { width: colWidths[i] - 10 });
        xPos += colWidths[i];
      });

      // Table row
      const rowY = tableHeaderY + 25;
      xPos = 50;
      const rowData = [
        data.data,
        "09H00",
        "18H00",
        data.klm.toString(),
        data.localidade,
        data.motivo.substring(0, 50)
      ];

      rowData.forEach((cell, i) => {
        doc.rect(xPos, rowY, colWidths[i], 30).stroke();
        doc.fontSize(9).text(cell, xPos + 5, rowY + 8, { width: colWidths[i] - 10 });
        xPos += colWidths[i];
      });

      // Totals
      const totalsY = rowY + 50;
      doc.fontSize(11);
      doc.text(`Total Km`, 350, totalsY);
      doc.text(data.klm.toString(), 450, totalsY);
      
      doc.text(`Valor/Km`, 350, totalsY + 20);
      doc.text("0,36 €", 450, totalsY + 20);

      // Total box
      doc.fontSize(12)
        .fillColor("#000000");
      doc.rect(260, totalsY + 50, 290, 30).stroke();
      doc.text("Total de Despesas:", 270, totalsY + 60);
      doc.fontSize(14)
        .text(`${(data.totalDespesas / 100).toFixed(2)} €`, 450, totalsY + 58);

      // Observations
      const obsY = totalsY + 100;
      doc.fontSize(11)
        .fillColor("#000000")
        .text("Observações:", 50, obsY);
      doc.rect(50, obsY + 20, 495, 60).stroke();

      // Signatures
      const sigY = obsY + 100;
      doc.text("O Colaborador:", 50, sigY);
      doc.moveTo(50, sigY + 20).lineTo(200, sigY + 20).stroke();

      doc.text("O Responsável:", 350, sigY);
      doc.moveTo(350, sigY + 20).lineTo(500, sigY + 20).stroke();

      // Note at bottom
      const noteY = sigY + 50;
      doc.fontSize(8)
        .fillColor("#666666")
        .text(
          "Nota: valores recebidos até dia 16 do mês N, serão pagos no mês N, valores recebidos entre dia 17 e 31 do mês N serão pagos no mês N+1",
          50,
          noteY,
          { width: 495, align: "left" }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

