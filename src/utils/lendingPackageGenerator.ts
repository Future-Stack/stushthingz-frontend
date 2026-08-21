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
    status: "validated" | "flagged" | "missing" | "pending";
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
  let y = 35;

  // Colors
  const primaryColor = [13, 122, 95];      // #0D7A5F (Stush Brand)
  const darkTextColor = [17, 24, 39];      // Slate 900
  const grayTextColor = [75, 85, 99];      // Gray 600
  const lightBgColor = [248, 250, 252];    // Slate 50
  const passColor = [16, 185, 129];        // Green 500
  const flagColor = [239, 68, 68];         // Red 500
  const pendingColor = [100, 116, 139];    // Slate 500
  const amberColor = [217, 119, 6];        // Amber 600

  // Calculate statistics
  const totalDocs = data.documents.length;
  const validatedDocs = data.documents.filter((d) => d.status === "validated").length;
  const flaggedDocs = data.documents.filter((d) => d.status === "flagged").length;
  const missingDocs = data.documents.filter((d) => d.status === "missing" || d.status === "pending").length;
  const isComplete = totalDocs > 0 && validatedDocs === totalDocs;
  const completionPercentage = totalDocs > 0 ? Math.round((validatedDocs / totalDocs) * 100) : 0;

  // 1. Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, y, contentWidth, 52, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("LENDING PACKAGE COVER SUMMARY", margin + 14, y + 24);

  // Subtitle in Header
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin - 14, y + 24, { align: "right" });

  // Completeness Status Tag in Header
  const statusTagText = isComplete
    ? "STATUS: COMPLETE PACKAGE (100% VALIDATED)"
    : `STATUS: PARTIAL SUBMISSION (${completionPercentage}% COMPLETE — ${validatedDocs}/${totalDocs} VALIDATED)`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(statusTagText, margin + 14, y + 42);

  y += 62;

  // 2. Applicant & Lender Profile Section (2 Columns)
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.roundedRect(margin, y, contentWidth, 80, 5, 5, "F");

  const col1X = margin + 14;
  const col2X = margin + (contentWidth / 2) + 10;

  // Column 1: Applicant Profile
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("APPLICANT DETAILS", col1X, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`Name: ${data.user.name || "N/A"}`, col1X, y + 34);
  doc.text(`Email: ${data.user.email || "N/A"}`, col1X, y + 48);
  doc.text(`Country of Residence: ${data.user.countryOfResidence || "Jamaica / Diaspora"}`, col1X, y + 62);

  // Column 2: Selected Lender
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("SELECTED LENDER", col2X, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`Lender: ${data.lender?.name || "Preferred Partner Bank / Credit Union"}`, col2X, y + 34);
  doc.text(`Status: Target Selected`, col2X, y + 48);
  doc.text(`Package Ref: LP-${Math.floor(100000 + Math.random() * 900000)}`, col2X, y + 62);

  y += 90;

  // 4. Financial Readiness Snapshot Card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 68, 5, 5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("FINANCIAL READINESS SNAPSHOT", col1X, y + 18);

  // Readiness Score Badge
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(pageWidth - margin - 140, y + 10, 126, 22, 11, 11, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text(`Financial Readiness: ${data.readinessScore}%`, pageWidth - margin - 77, y + 24, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`Budget Target: ${data.user.investmentBudget || "Standard Investment"}`, col1X, y + 36);
  doc.text(`Investment Goal: ${data.user.investmentGoal || "Real Estate Investment"}`, col1X, y + 50);

  doc.text(`Timeline: ${data.user.investmentTimeline || "3-6 Months"}`, col2X, y + 36);
  doc.text(`Validation Criteria: Lender Policy Matrix`, col2X, y + 50);

  y += 78;

  // 5. Document Status Counts Row (Pills)
  const pillWidth = (contentWidth - 16) / 3;

  // Validated Pill
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(margin, y, pillWidth, 24, 4, 4, "FD");
  doc.setTextColor(passColor[0], passColor[1], passColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`VALIDATED: ${validatedDocs}`, margin + 10, y + 15);

  // Flagged Pill
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(239, 68, 68);
  doc.roundedRect(margin + pillWidth + 8, y, pillWidth, 24, 4, 4, "FD");
  doc.setTextColor(flagColor[0], flagColor[1], flagColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`FLAGGED: ${flaggedDocs}`, margin + pillWidth + 18, y + 15);

  // Missing / Pending Pill
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin + (pillWidth * 2) + 16, y, pillWidth, 24, 4, 4, "FD");
  doc.setTextColor(pendingColor[0], pendingColor[1], pendingColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`MISSING / PENDING: ${missingDocs}`, margin + (pillWidth * 2) + 26, y + 15);

  y += 34;

  // 6. Document Validation Matrix Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text("DOCUMENT VALIDATION MATRIX", margin, y);

  y += 12;

  // Table Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, y, contentWidth, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("DOCUMENT TYPE / TITLE", margin + 10, y + 15);
  doc.text("IDENTIFIER", margin + 220, y + 15);
  doc.text("VALIDATION STATUS", pageWidth - margin - 55, y + 15, { align: "center" });

  y += 22;

  // Table Rows
  data.documents.forEach((docItem, index) => {
    const rowBg = index % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.rect(margin, y, contentWidth, 24, "F");

    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 24, pageWidth - margin, y + 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);

    // Truncate long document names
    const docTitle = docItem.title.length > 36 ? docItem.title.substring(0, 34) + "..." : docItem.title;
    doc.text(docTitle, margin + 10, y + 15);

    const docTypeLabel = docItem.docType.replace(/_/g, " ").toUpperCase();
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.setFontSize(7.5);
    doc.text(docTypeLabel, margin + 220, y + 15);

    // Status Pill
    let statusText = "MISSING";
    let statusBg = pendingColor;

    if (docItem.status === "validated") {
      statusText = "VALIDATED";
      statusBg = passColor;
    } else if (docItem.status === "flagged") {
      statusText = "FLAGGED";
      statusBg = flagColor;
    } else if (docItem.status === "pending") {
      statusText = "PENDING";
      statusBg = amberColor;
    } else {
      statusText = "MISSING";
      statusBg = pendingColor;
    }

    doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
    doc.roundedRect(pageWidth - margin - 90, y + 5, 70, 14, 7, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(statusText, pageWidth - margin - 55, y + 15, { align: "center" });

    y += 24;
  });

  // Trigger Download
  const filename = `Lending_Package_${(data.user.name || "User").replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
};
