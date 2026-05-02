import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { ReportData } from "./reportData";

Font.register({
  family: "Playfair",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKd3vXDXbtXyPNw.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKefvXDXbtM.ttf",
      fontWeight: "bold",
    },
  ],
});

const TEAL = "#0F5C5E";
const GOLD = "#BFA14A";
const IVORY = "#F4EFE6";
const DARK = "#1A1A1A";
const MID = "#444444";
const LIGHT = "#888888";
const PAGE_BG = "#FDFAF6";

const s = StyleSheet.create({
  page: {
    backgroundColor: PAGE_BG,
    fontFamily: "Helvetica",
    color: DARK,
  },

  header: {
    backgroundColor: TEAL,
    paddingHorizontal: 40,
    paddingVertical: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerLeft: { flexDirection: "column" },
  headerBrand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: IVORY,
    letterSpacing: 0.5,
  },
  headerSub: {
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: "#a8d4d6",
    letterSpacing: 2,
    marginTop: 4,
  },
  headerRight: {
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: GOLD,
    letterSpacing: 1.5,
  },

  goldLine: {
    height: 2,
    backgroundColor: GOLD,
  },

  clientBlock: {
    paddingHorizontal: 40,
    paddingVertical: 22,
    backgroundColor: "#EFF7F7",
    borderBottomWidth: 1,
    borderBottomColor: "#cce0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clientLabel: {
    fontFamily: "Helvetica",
    fontSize: 7,
    color: TEAL,
    letterSpacing: 2,
    marginBottom: 4,
  },
  clientName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: DARK,
    letterSpacing: 0.2,
  },
  clientRight: { alignItems: "flex-end" },
  clientScanType: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: GOLD,
    marginBottom: 4,
  },
  clientDate: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: LIGHT,
  },

  body: {
    paddingHorizontal: 40,
    paddingTop: 28,
    paddingBottom: 20,
    flex: 1,
  },

  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 8,
  },
  sectionBar: {
    width: 3,
    backgroundColor: GOLD,
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: TEAL,
    letterSpacing: 2,
    paddingTop: 1,
  },
  sectionBody: {
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: MID,
    lineHeight: 1.75,
    paddingLeft: 13,
  },

  supportItem: {
    flexDirection: "row",
    paddingLeft: 13,
    marginBottom: 7,
  },
  supportNum: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: GOLD,
    width: 18,
    marginTop: 1,
  },
  supportContent: { flex: 1 },
  supportTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: DARK,
    marginBottom: 2,
  },
  supportDesc: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: LIGHT,
    lineHeight: 1.55,
  },

  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 18,
  },

  closingBox: {
    backgroundColor: "#EFF7F7",
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderRadius: 2,
  },
  closingText: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 10.5,
    color: MID,
    lineHeight: 1.8,
  },
  signatureName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: GOLD,
    marginTop: 12,
  },
  signatureRole: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: TEAL,
    marginTop: 3,
  },

  footer: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: PAGE_BG,
  },
  footerText: {
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: LIGHT,
    flex: 1,
    lineHeight: 1.5,
  },
  footerPage: {
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: LIGHT,
    marginLeft: 16,
  },
});

interface Props {
  data: ReportData;
}

export function BioHarmonyReportPDF({ data }: Props) {
  const { clientName, scanType, date, reportType, sections } = data;

  return (
    <Document
      title={`BioHarmony Report — ${clientName}`}
      author="BioHarmony Solutions"
      subject="Wellness Interpretation Report"
    >
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.headerBrand}>BioHarmony Solutions</Text>
            <Text style={s.headerSub}>BIO-FREQUENCY ANALYTICS</Text>
          </View>
          <Text style={s.headerRight}>WELLNESS INTERPRETATION REPORT</Text>
        </View>

        <View style={s.goldLine} />

        {/* Client block */}
        <View style={s.clientBlock}>
          <View>
            <Text style={s.clientLabel}>CLIENT</Text>
            <Text style={s.clientName}>{clientName}</Text>
          </View>
          <View style={s.clientRight}>
            <Text style={s.clientScanType}>{reportType} · {scanType}</Text>
            <Text style={s.clientDate}>{date}</Text>
          </View>
        </View>

        {/* Body */}
        <View style={s.body}>

          {/* Overview */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={s.sectionBar} />
              <Text style={s.sectionTitle}>OVERVIEW</Text>
            </View>
            <Text style={s.sectionBody}>{sections.overview}</Text>
          </View>

          {/* Emotional Patterns */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={s.sectionBar} />
              <Text style={s.sectionTitle}>EMOTIONAL PATTERNS</Text>
            </View>
            <Text style={s.sectionBody}>{sections.emotionalPatterns}</Text>
          </View>

          {/* Body Insights */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={s.sectionBar} />
              <Text style={s.sectionTitle}>BODY INSIGHTS</Text>
            </View>
            <Text style={s.sectionBody}>{sections.bodyInsights}</Text>
          </View>

          {/* Support Focus */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={s.sectionBar} />
              <Text style={s.sectionTitle}>SUPPORT FOCUS</Text>
            </View>
            {sections.supportFocus.map((item, i) => (
              <View key={i} style={s.supportItem}>
                <Text style={s.supportNum}>{i + 1}.</Text>
                <View style={s.supportContent}>
                  <Text style={s.supportTitle}>{item.title}</Text>
                  <Text style={s.supportDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={s.divider} />

          {/* Closing */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={s.sectionBar} />
              <Text style={s.sectionTitle}>CLOSING</Text>
            </View>
            <View style={s.closingBox}>
              <Text style={s.closingText}>"{sections.closing}"</Text>
            </View>
            <Text style={s.signatureName}>— Kathy Owens</Text>
            <Text style={s.signatureRole}>Founder, BioHarmony Solutions</Text>
          </View>

        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            This report is for wellness education and informational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition. Please consult a qualified healthcare professional for any medical concerns.
          </Text>
          <Text style={s.footerPage} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>

      </Page>
    </Document>
  );
}
