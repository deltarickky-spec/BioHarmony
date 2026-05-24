import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  ShadingType,
  TableRow,
  TableCell,
  Table,
  WidthType,
  PageNumber,
  Footer,
} from "docx";
import type { ReportData } from "./reportData";

const TEAL = "0F5C5E";
const GOLD = "BFA14A";
const DARK = "1A1A1A";
const GREY = "555555";

function sectionHeading(text: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        color: TEAL,
        bold: true,
        size: 22,
        font: "Calibri",
      }),
    ],
    spacing: { before: 360, after: 100 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 4 },
    },
  });
}

function bodyParagraph(text: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        color: DARK,
        size: 21,
        font: "Calibri",
      }),
    ],
    spacing: { before: 60, after: 160 },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function bulletItem(title: string, desc: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${title}  `, bold: true, color: GOLD, size: 21, font: "Calibri" }),
      new TextRun({ text: desc, color: DARK, size: 21, font: "Calibri" }),
    ],
    bullet: { level: 0 },
    spacing: { before: 40, after: 100 },
  });
}

export async function generateDOCX(data: ReportData): Promise<Blob> {
  const { clientName, scanType, date, reportType, sections } = data;

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 21 },
        },
      },
    },
    sections: [
      {
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "This report is for wellness education and informational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition. ",
                    color: "999999",
                    size: 16,
                    font: "Calibri",
                    italics: true,
                  }),
                  new TextRun({
                    children: ["Page ", PageNumber.CURRENT],
                    color: "999999",
                    size: 16,
                    font: "Calibri",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: [
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "0F5C5E", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "BioHarmony Analytics",
                            color: "F4EFE6",
                            bold: true,
                            size: 36,
                            font: "Georgia",
                          }),
                        ],
                        spacing: { before: 200, after: 80 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "BIO-FREQUENCY ANALYTICS   ·   WELLNESS INTERPRETATION REPORT",
                            color: "BFA14A",
                            size: 16,
                            font: "Calibri",
                          }),
                        ],
                        spacing: { before: 0, after: 200 },
                      }),
                    ],
                    margins: { top: 200, bottom: 200, left: 400, right: 400 },
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 200 } }),

          new Paragraph({
            children: [new TextRun({ text: "CLIENT", color: TEAL, size: 16, bold: true, font: "Calibri" })],
            spacing: { before: 0, after: 60 },
          }),
          new Paragraph({
            children: [new TextRun({ text: clientName, color: DARK, size: 40, bold: true, font: "Georgia" })],
            spacing: { before: 0, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${reportType}  ·  ${scanType}`, color: GOLD, size: 22, font: "Calibri", bold: true }),
            ],
            spacing: { before: 0, after: 40 },
          }),
          new Paragraph({
            children: [new TextRun({ text: date, color: GREY, size: 18, font: "Calibri" })],
            spacing: { before: 0, after: 320 },
          }),

          sectionHeading("Overview"),
          bodyParagraph(sections.overview),

          sectionHeading("Emotional Patterns"),
          bodyParagraph(sections.emotionalPatterns),

          sectionHeading("Body Insights"),
          bodyParagraph(sections.bodyInsights),

          sectionHeading("Support Focus"),
          ...sections.supportFocus.map((item) => bulletItem(item.title, item.desc)),

          new Paragraph({ text: "", spacing: { after: 200 } }),

          sectionHeading("Closing"),
          new Paragraph({
            children: [
              new TextRun({
                text: `"${sections.closing}"`,
                italics: true,
                color: DARK,
                size: 21,
                font: "Georgia",
              }),
            ],
            spacing: { before: 100, after: 240 },
            alignment: AlignmentType.JUSTIFIED,
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "— Kathy Owens", color: GOLD, bold: true, size: 22, font: "Calibri" }),
            ],
            spacing: { before: 0, after: 40 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Founder, BioHarmony Analytics", color: TEAL, size: 18, font: "Calibri" }),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
}
