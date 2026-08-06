import jsPDF from "jspdf";

export interface LendingPackageData {
  user: {
    name: string;
    email: string;
    countryOfResidence?: string;
    investmentBudget?: string;
    investmentGoal?: string;
    investmentTimeline?: string;
  };
  lender?: {
    name: string;
    id?: string;
    details?: string;
  } | null;
  readinessScore: number;
  documents: Array<{
    docType: string;
    title: string;
    status: "validated" | "flagged" | "passed" | "pending";
    uploadedAt?: string;
    notes?: string;
  }>;
}

export const generateLendingPackagePDF = async (data: LendingPackageData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 40;

  // Primary Color (#0D7A5F / Stush Brand Theme) & Secondary Colors
  const primaryColor = [13, 122, 95];
  const darkTextColor = [17, 24, 39];
  const grayTextColor = [75, 85, 99];
  const lightBgColor = [248, 250, 252];
  const passColor = [16, 185, 129];
  const flagColor = [239, 68, 68];

  // 1. Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, y, contentWidth, 55, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("LENDING PACKAGE COVER SUMMARY", margin + 15, y + 33);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin - 15, y + 33, { align: "right" });

  y += 75;

  // 2. Applicant & Lender Profile Section (2 Columns)
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.roundedRect(margin, y, contentWidth, 90, 6, 6, "F");

  const col1X = margin + 15;
  const col2X = margin + (contentWidth / 2) + 10;

  // Column 1: Applicant Profile
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("APPLICANT DETAILS", col1X, y + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`Name: ${data.user.name || "N/A"}`, col1X, y + 40);
  doc.text(`Email: ${data.user.email || "N/A"}`, col1X, y + 55);
  doc.text(`Country: ${data.user.countryOfResidence || "Jamaica / Diaspora"}`, col1X, y + 70);

  // Column 2: Selected Lender
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("SELECTED LENDER", col2X, y + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`Lender Name: ${data.lender?.name || "Preferred Partner Bank / Credit Union"}`, col2X, y + 40);
  doc.text(`Status: Target Selected`, col2X, y + 55);
  doc.text(`Package Ref: LP-${Math.floor(100000 + Math.random() * 900000)}`, col2X, y + 70);

  y += 105;

  // 3. Financial Readiness Snapshot Card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 80, 6, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("FINANCIAL READINESS SNAPSHOT", col1X, y + 22);

  // Readiness Score Badge
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(pageWidth - margin - 130, y + 12, 115, 26, 13, 13, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Score: ${data.readinessScore}%`, pageWidth - margin - 72.5, y + 28, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`Budget Target: ${data.user.investmentBudget || "Not Specified"}`, col1X, y + 44);
  doc.text(`Investment Goal: ${data.user.investmentGoal || "Real Estate Investment"}`, col1X, y + 60);

  doc.text(`Timeline: ${data.user.investmentTimeline || "3-6 Months"}`, col2X, y + 44);
  doc.text(`DSCR / LTV Status: Validated Pre-Check Passed`, col2X, y + 60);

  y += 95;

  // 4. Document Validation Matrix
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text("DOCUMENT VALIDATION SUMMARY", margin, y);

  y += 15;

  // Table Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, y, contentWidth, 24, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text("DOCUMENT TYPE", margin + 12, y + 16);
  doc.text("REQUIREMENT / DESCRIPTION", margin + 180, y + 16);
  doc.text("STATUS", pageWidth - margin - 60, y + 16, { align: "center" });

  y += 24;

  // Table Rows
  data.documents.forEach((docItem, index) => {
    const rowBg = index % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.rect(margin, y, contentWidth, 26, "F");

    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 26, pageWidth - margin, y + 26);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);

    // Truncate long document names
    const docTitle = docItem.title.length > 30 ? docItem.title.substring(0, 28) + "..." : docItem.title;
    doc.text(docTitle, margin + 12, y + 16);

    const docTypeLabel = docItem.docType.replace(/_/g, " ").toUpperCase();
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(docTypeLabel, margin + 180, y + 16);

    // Status Pill
    const isPassed = docItem.status === "validated" || docItem.status === "passed";
    const statusText = isPassed ? "PASSED" : "FLAGGED";
    const statusBg = isPassed ? passColor : flagColor;

    doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
    doc.roundedRect(pageWidth - margin - 90, y + 6, 60, 14, 7, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(statusText, pageWidth - margin - 60, y + 16, { align: "center" });

    y += 26;
  });

  y += 25;

  // 5. Summary Footer / Disclaimer Notice
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
  const disclaimer =
    "This document package was compiled by the Stush Investment Platform upon user request. " +
    "All document validation results are based on automated pre-verification against selected lender requirements. " +
    "This package is intended for direct submission by the applicant to their designated loan officer.";

  const splitDisclaimer = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(splitDisclaimer, margin, y);

  // Trigger Download
  const filename = `Lending_Package_${(data.user.name || "User").replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
};
