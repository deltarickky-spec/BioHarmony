import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { ReportData } from "./reportData";

// ─── Brand colours ───
const TEAL = "#0F5C5E";
const GOLD = "#BFA14A";
const CREAM = "#F4EFE6";
const DARK = "#1A1A1A";
const GREY = "#555555";
const WHITE = "#FFFFFF";

// ─── Styles ───
const styles = StyleSheet.create({
  page: {
    padding: 48,
    paddingTop: 32,
    fontFamily: "Helvetica",
    backgroundColor: WHITE,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `2 solid ${GOLD}`,
  },
  headerLeft: {
    flexDirection: "column",
  },
  brand: {
    fontSize: 18,
    fontWeight: "bold",
    color: TEAL,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 8,
    color: GREY,
    marginTop: 2,
    letterSpacing: 1,
  },
  headerRight: {
    fontSize: 8,
    color: GREY,
    textAlign: "right",
  },
  // Section heading
  sectionHeading: {
    fontSize: 13,
    fontWeight: "bold",
    color: TEAL,
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: `1 solid ${GOLD}`,
    letterSpacing: 1.5,
  },
  // Body text
  bodyText: {
    fontSize: 10,
    color: DARK,
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: "justified",
  },
  // Support items
  supportItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 10,
    color: GOLD,
    marginRight: 6,
    marginTop: 2,
  },
  supportContent: {
    flex: 1,
  },
  supportCategory: {
    fontSize: 9,
    fontWeight: "bold",
    color: TEAL,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  supportText: {
    fontSize: 9,
    color: GREY,
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `0.5 solid ${GOLD}`,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: GREY,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: GOLD,
    opacity: 0.3,
    marginVertical: 16,
  },
});

// ─── Component ───
export function BioHarmonyReportPDF({ data }: { data: ReportData }) {
  const dateStr = new Date(data.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.brand}>BIOHARMONY SOLUTIONS</Text>
            <Text style={styles.tagline}>Wellness Frequency Assessment</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>{dateStr}</Text>
            <Text style={{ marginTop: 2 }}>{data.clientName}</Text>
            {data.scanNumber && (
              <Text style={{ marginTop: 4, fontWeight: "bold" }}>Assessment #{data.scanNumber}</Text>
            )}
          </View>
        </View>

        {/* Overview */}
        <Text style={styles.sectionHeading}>Wellness Overview</Text>
        <Text style={styles.bodyText}>{data.sections.overview}</Text>

        {/* Emotional Patterns */}
        {data.sections.emotionalPatterns && (
          <>
            <Text style={styles.sectionHeading}>Emotional & Energetic Patterns</Text>
            <Text style={styles.bodyText}>{data.sections.emotionalPatterns}</Text>
          </>
        )}

        {/* Body Insights */}
        <Text style={styles.sectionHeading}>Body Systems Insights</Text>
        <Text style={styles.bodyText}>{data.sections.bodyInsights}</Text>

        {/* Support & Focus */}
        <Text style={styles.sectionHeading}>Suggested Support Focus</Text>
        {data.sections.supportFocus.map((item, i) => (
          <View key={i} style={styles.supportItem}>
            <Text style={styles.bullet}>✦</Text>
            <View style={styles.supportContent}>
              <Text style={styles.supportCategory}>{item.category}</Text>
              <Text style={styles.supportText}>{item.description}</Text>
            </View>
          </View>
        ))}

        <View style={styles.divider} />

        {/* Closing */}
        {data.sections.closing && (
          <Text style={styles.bodyText}>{data.sections.closing}</Text>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            BioHarmony Solutions — bioharmonysolutions.ca
          </Text>
          <Text style={styles.footerText}>
            AO Scan is an educational wellness tool — not a medical device.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
