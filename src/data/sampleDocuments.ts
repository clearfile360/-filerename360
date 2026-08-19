// Realistic sample document generators with rich visual SVG/Canvas previews
// Enables users to test FileMind AI immediately without finding test files on disk

export interface SampleDocDef {
  id: string;
  name: string;
  type: string;
  size: number;
  description: string;
  docTypeHint: string;
  expectedName: string;
  svgContent: string;
}

export const SAMPLE_DOCUMENTS: SampleDocDef[] = [
  {
    id: "sample_sale_deed_1998",
    name: "IMG_83921.jpg",
    type: "image/jpeg",
    size: 245000,
    description: "Property sale deed document for Survey No. 123/4 in Gollakuppam (1998)",
    docTypeHint: "Sale Deed",
    expectedName: "Sale_Deed_Survey_123-4_Gollakuppam_1998.jpg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
      <rect width="600" height="800" fill="#fcf9f2"/>
      <rect x="25" y="25" width="550" height="750" fill="none" stroke="#92704f" stroke-width="3"/>
      <rect x="35" y="35" width="530" height="730" fill="none" stroke="#d4b996" stroke-width="1"/>
      
      <!-- Stamp Header -->
      <rect x="180" y="55" width="240" height="60" fill="#eed9bf" rx="6" stroke="#92704f"/>
      <text x="300" y="85" font-family="serif" font-size="14" font-weight="bold" fill="#593b1d" text-anchor="middle">GOVERNMENT OF ANDHRA PRADESH</text>
      <text x="300" y="103" font-family="serif" font-size="12" fill="#593b1d" text-anchor="middle">REGISTRATION &amp; STAMPS DEPARTMENT</text>
      
      <!-- Document Title -->
      <text x="300" y="160" font-family="serif" font-size="22" font-weight="bold" fill="#3b2510" text-anchor="middle">DEED OF ABSOLUTE SALE</text>
      <line x1="150" y1="170" x2="450" y2="170" stroke="#3b2510" stroke-width="1.5"/>

      <!-- Document Body -->
      <text x="60" y="210" font-family="sans-serif" font-size="13" fill="#2d2319" font-weight="bold">THIS DEED OF SALE executed on this 14th day of November, 1998</text>
      <text x="60" y="235" font-family="sans-serif" font-size="12" fill="#4a3f35">BY AND BETWEEN: Sri K. Ramamurthy, S/o K. Venkatappa, residing at Gollakuppam</text>
      <text x="60" y="255" font-family="sans-serif" font-size="12" fill="#4a3f35">(hereinafter called the VENDOR) of the ONE PART</text>
      
      <text x="60" y="290" font-family="sans-serif" font-size="12" fill="#4a3f35">AND IN FAVOUR OF: Sri M. Suresh, S/o M. Narayana, residing at Chittoor</text>
      <text x="60" y="310" font-family="sans-serif" font-size="12" fill="#4a3f35">(hereinafter called the PURCHASER) of the OTHER PART.</text>
      
      <!-- Schedule of Property -->
      <rect x="55" y="345" width="490" height="180" fill="#f5ede0" stroke="#c4ab89" rx="4"/>
      <text x="75" y="375" font-family="serif" font-size="15" font-weight="bold" fill="#3b2510">SCHEDULE OF PROPERTY</text>
      <line x1="75" y1="382" x2="250" y2="382" stroke="#3b2510" stroke-width="1"/>
      
      <text x="75" y="410" font-family="sans-serif" font-size="13" fill="#2d2319"><tspan font-weight="bold">Village/Location:</tspan> Gollakuppam Revenue Village</text>
      <text x="75" y="435" font-family="sans-serif" font-size="13" fill="#2d2319"><tspan font-weight="bold">Survey Number:</tspan> Survey No. 123/4</text>
      <text x="75" y="460" font-family="sans-serif" font-size="13" fill="#2d2319"><tspan font-weight="bold">Extent of Land:</tspan> 2 Acres 14 Cents agricultural dry land</text>
      <text x="75" y="485" font-family="sans-serif" font-size="13" fill="#2d2319"><tspan font-weight="bold">Total Consideration:</tspan> Rs. 85,000/- (Rupees Eighty Five Thousand Only)</text>
      <text x="75" y="508" font-family="sans-serif" font-size="12" fill="#66594d">Sub-Registrar Office: Bangarupalem Sub-District</text>

      <!-- Signatures & Seal -->
      <text x="80" y="600" font-family="cursive" font-size="16" fill="#1b2a4a">K. Ramamurthy</text>
      <line x1="70" y1="610" x2="190" y2="610" stroke="#3b2510" stroke-width="1"/>
      <text x="80" y="625" font-family="sans-serif" font-size="11" fill="#4a3f35">Signature of Vendor</text>

      <text x="380" y="600" font-family="cursive" font-size="16" fill="#1b2a4a">M. Suresh</text>
      <line x1="370" y1="610" x2="490" y2="610" stroke="#3b2510" stroke-width="1"/>
      <text x="380" y="625" font-family="sans-serif" font-size="11" fill="#4a3f35">Signature of Purchaser</text>

      <!-- Official Stamp Seal -->
      <circle cx="300" cy="690" r="45" fill="none" stroke="#8b1e1e" stroke-width="2" stroke-dasharray="3,3"/>
      <circle cx="300" cy="690" r="38" fill="none" stroke="#8b1e1e" stroke-width="1"/>
      <text x="300" y="685" font-family="sans-serif" font-size="9" font-weight="bold" fill="#8b1e1e" text-anchor="middle">SUB REGISTRAR</text>
      <text x="300" y="698" font-family="sans-serif" font-size="8" fill="#8b1e1e" text-anchor="middle">14 NOV 1998</text>
      <text x="300" y="710" font-family="sans-serif" font-size="8" fill="#8b1e1e" text-anchor="middle">GOLLAKUPPAM</text>
    </svg>`,
  },
  {
    id: "sample_acme_invoice_9841",
    name: "SCAN_0049281.pdf",
    type: "application/pdf",
    size: 184000,
    description: "Acme Cloud Services Monthly SaaS Enterprise Invoice #INV-9841",
    docTypeHint: "Invoice",
    expectedName: "Acme_Invoice_INV-9841_2024-10-15.pdf",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
      <rect width="600" height="800" fill="#ffffff"/>
      
      <!-- Top Brand Header -->
      <rect x="0" y="0" width="600" height="110" fill="#0f172a"/>
      <circle cx="60" cy="55" r="22" fill="#38bdf8"/>
      <text x="60" y="62" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">A</text>
      <text x="95" y="62" font-family="sans-serif" font-size="24" font-weight="bold" fill="#ffffff">Acme Cloud Inc.</text>
      <text x="540" y="62" font-family="sans-serif" font-size="26" font-weight="900" fill="#94a3b8" text-anchor="end">INVOICE</text>

      <!-- Invoice Metadata Bar -->
      <rect x="40" y="140" width="520" height="90" fill="#f8fafc" stroke="#e2e8f0" rx="8"/>
      <text x="60" y="170" font-family="sans-serif" font-size="11" fill="#64748b" font-weight="bold">INVOICE NUMBER</text>
      <text x="60" y="195" font-family="sans-serif" font-size="15" fill="#0f172a" font-weight="bold">INV-9841</text>

      <text x="210" y="170" font-family="sans-serif" font-size="11" fill="#64748b" font-weight="bold">INVOICE DATE</text>
      <text x="210" y="195" font-family="sans-serif" font-size="14" fill="#0f172a">October 15, 2024</text>

      <text x="360" y="170" font-family="sans-serif" font-size="11" fill="#64748b" font-weight="bold">DUE DATE</text>
      <text x="360" y="195" font-family="sans-serif" font-size="14" fill="#0f172a">November 15, 2024</text>

      <text x="490" y="170" font-family="sans-serif" font-size="11" fill="#64748b" font-weight="bold">STATUS</text>
      <rect x="475" y="180" width="60" height="22" fill="#dcfce7" rx="4"/>
      <text x="505" y="195" font-family="sans-serif" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">PAID</text>

      <!-- Bill To & From -->
      <text x="40" y="265" font-family="sans-serif" font-size="12" font-weight="bold" fill="#64748b">BILLED TO:</text>
      <text x="40" y="288" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Nexus Global Technologies LLC</text>
      <text x="40" y="308" font-family="sans-serif" font-size="12" fill="#475569">450 Innovation Parkway, Suite 300</text>
      <text x="40" y="326" font-family="sans-serif" font-size="12" fill="#475569">San Francisco, CA 94105</text>

      <!-- Table of items -->
      <rect x="40" y="360" width="520" height="35" fill="#f1f5f9" rx="4"/>
      <text x="55" y="382" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">DESCRIPTION</text>
      <text x="340" y="382" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">QTY</text>
      <text x="420" y="382" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">RATE</text>
      <text x="535" y="382" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155" text-anchor="end">AMOUNT</text>

      <text x="55" y="420" font-family="sans-serif" font-size="13" fill="#0f172a">Enterprise Dedicated Cloud Cluster (Tier 3)</text>
      <text x="345" y="420" font-family="sans-serif" font-size="13" fill="#0f172a">1</text>
      <text x="420" y="420" font-family="sans-serif" font-size="13" fill="#0f172a">$350.00</text>
      <text x="535" y="420" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="end">$350.00</text>
      <line x1="40" y1="440" x2="560" y2="440" stroke="#f1f5f9"/>

      <text x="55" y="470" font-family="sans-serif" font-size="13" fill="#0f172a">AI Vector Search Add-on (5M embeddings)</text>
      <text x="345" y="470" font-family="sans-serif" font-size="13" fill="#0f172a">1</text>
      <text x="420" y="470" font-family="sans-serif" font-size="13" fill="#0f172a">$149.00</text>
      <text x="535" y="470" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="end">$149.00</text>
      <line x1="40" y1="490" x2="560" y2="490" stroke="#f1f5f9"/>

      <!-- Totals -->
      <rect x="340" y="530" width="220" height="110" fill="#f8fafc" stroke="#e2e8f0" rx="6"/>
      <text x="360" y="560" font-family="sans-serif" font-size="13" fill="#64748b">Subtotal:</text>
      <text x="540" y="560" font-family="sans-serif" font-size="13" fill="#0f172a" text-anchor="end">$499.00</text>
      
      <text x="360" y="585" font-family="sans-serif" font-size="13" fill="#64748b">Tax (0%):</text>
      <text x="540" y="585" font-family="sans-serif" font-size="13" fill="#0f172a" text-anchor="end">$0.00</text>
      
      <line x1="360" y1="598" x2="540" y2="598" stroke="#cbd5e1"/>
      <text x="360" y="625" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Total Paid:</text>
      <text x="540" y="625" font-family="sans-serif" font-size="17" font-weight="900" fill="#0284c7" text-anchor="end">$499.00</text>
    </svg>`,
  },
  {
    id: "sample_lab_report_4019",
    name: "photo_2024-11-04_9921.png",
    type: "image/png",
    size: 210000,
    description: "BioHealth Diagnostics Comprehensive Clinical Pathology Lab Report #BLD-4019",
    docTypeHint: "Medical Report",
    expectedName: "BioHealth_Lab_Report_BLD-4019_2024-11-04.png",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
      <rect width="600" height="800" fill="#ffffff"/>
      <rect x="0" y="0" width="600" height="90" fill="#0891b2"/>
      
      <text x="40" y="45" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">BioHealth Diagnostics Laboratory</text>
      <text x="40" y="68" font-family="sans-serif" font-size="12" fill="#cffafe">Clinical Pathology &amp; Molecular Diagnostics Division</text>

      <!-- Patient & Specimen Info Box -->
      <rect x="35" y="115" width="530" height="100" fill="#ecfeff" stroke="#a5f3fc" rx="6"/>
      <text x="55" y="145" font-family="sans-serif" font-size="12" fill="#155e75"><tspan font-weight="bold">Patient Name:</tspan> Robert Sterling</text>
      <text x="320" y="145" font-family="sans-serif" font-size="12" fill="#155e75"><tspan font-weight="bold">Age / Gender:</tspan> 42 Yrs / Male</text>
      
      <text x="55" y="170" font-family="sans-serif" font-size="12" fill="#155e75"><tspan font-weight="bold">Sample ID / Accession:</tspan> BLD-4019</text>
      <text x="320" y="170" font-family="sans-serif" font-size="12" fill="#155e75"><tspan font-weight="bold">Collection Date:</tspan> 2024-11-04</text>
      
      <text x="55" y="195" font-family="sans-serif" font-size="12" fill="#155e75"><tspan font-weight="bold">Referring Physician:</tspan> Dr. Sarah Mitchell, MD</text>
      <text x="320" y="195" font-family="sans-serif" font-size="12" fill="#155e75"><tspan font-weight="bold">Report Status:</tspan> Final Validated</text>

      <!-- Section Title -->
      <text x="35" y="245" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0e7490">COMPREHENSIVE METABOLIC PANEL (CMP)</text>
      <line x1="35" y1="255" x2="565" y2="255" stroke="#0891b2" stroke-width="1.5"/>

      <!-- Table Header -->
      <rect x="35" y="270" width="530" height="30" fill="#f1f5f9"/>
      <text x="50" y="290" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">TEST PARAMETER</text>
      <text x="240" y="290" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">RESULT</text>
      <text x="340" y="290" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">UNITS</text>
      <text x="440" y="290" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">REFERENCE RANGE</text>

      <text x="50" y="325" font-family="sans-serif" font-size="12" fill="#0f172a">Fasting Blood Glucose</text>
      <text x="240" y="325" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">94</text>
      <text x="340" y="325" font-family="sans-serif" font-size="12" fill="#64748b">mg/dL</text>
      <text x="440" y="325" font-family="sans-serif" font-size="12" fill="#64748b">70 - 99</text>
      <line x1="35" y1="340" x2="565" y2="340" stroke="#f1f5f9"/>

      <text x="50" y="365" font-family="sans-serif" font-size="12" fill="#0f172a">Total Serum Cholesterol</text>
      <text x="240" y="365" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">218 (High)</text>
      <text x="340" y="365" font-family="sans-serif" font-size="12" fill="#64748b">mg/dL</text>
      <text x="440" y="365" font-family="sans-serif" font-size="12" fill="#64748b">&lt; 200</text>
      <line x1="35" y1="380" x2="565" y2="380" stroke="#f1f5f9"/>

      <text x="50" y="405" font-family="sans-serif" font-size="12" fill="#0f172a">Serum Creatinine</text>
      <text x="240" y="405" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">0.92</text>
      <text x="340" y="405" font-family="sans-serif" font-size="12" fill="#64748b">mg/dL</text>
      <text x="440" y="405" font-family="sans-serif" font-size="12" fill="#64748b">0.70 - 1.30</text>
      <line x1="35" y1="420" x2="565" y2="420" stroke="#f1f5f9"/>

      <!-- Doctor stamp -->
      <rect x="340" y="600" width="220" height="80" fill="#f8fafc" stroke="#cbd5e1" rx="6"/>
      <text x="355" y="630" font-family="cursive" font-size="16" fill="#0369a1">Dr. S. Mitchell</text>
      <text x="355" y="650" font-family="sans-serif" font-size="10" fill="#64748b">Pathologist, MD (Path)</text>
      <text x="355" y="665" font-family="sans-serif" font-size="9" fill="#0891b2">Reg. #MED-891042</text>
    </svg>`,
  },
  {
    id: "sample_pacific_power_bill",
    name: "unnamed_document_2910.jpg",
    type: "image/jpeg",
    size: 198000,
    description: "Pacific Grid Power Utility Electric Bill Statement Acct #9843-0192 (Nov 2024)",
    docTypeHint: "Utility Bill",
    expectedName: "Pacific_Power_Utility_Bill_Acct_9843-0192_2024-11.jpg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
      <rect width="600" height="800" fill="#fafafa"/>
      <rect x="0" y="0" width="600" height="85" fill="#166534"/>
      
      <text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">Pacific Grid Electric &amp; Power</text>
      <text x="40" y="65" font-family="sans-serif" font-size="12" fill="#bbf7d0">Residential Electric Service Statement</text>
      <text x="560" y="52" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="end">ACCOUNT SUMMARY</text>

      <!-- Account Details Card -->
      <rect x="35" y="110" width="530" height="80" fill="#ffffff" stroke="#e2e8f0" rx="8"/>
      <text x="55" y="138" font-family="sans-serif" font-size="11" fill="#64748b">ACCOUNT NUMBER</text>
      <text x="55" y="162" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">9843-0192</text>

      <text x="210" y="138" font-family="sans-serif" font-size="11" fill="#64748b">BILLING CYCLE</text>
      <text x="210" y="162" font-family="sans-serif" font-size="13" fill="#0f172a">Oct 01 - Oct 31, 2024</text>

      <text x="380" y="138" font-family="sans-serif" font-size="11" fill="#64748b">STATEMENT DATE</text>
      <text x="380" y="162" font-family="sans-serif" font-size="13" fill="#0f172a">November 03, 2024</text>

      <!-- Amount Callout -->
      <rect x="35" y="210" width="530" height="80" fill="#f0fdf4" stroke="#86efac" rx="8"/>
      <text x="55" y="245" font-family="sans-serif" font-size="13" font-weight="bold" fill="#166534">TOTAL AMOUNT DUE BY NOV 24, 2024</text>
      <text x="55" y="275" font-family="sans-serif" font-size="24" font-weight="900" fill="#15803d">$184.20</text>
      <text x="380" y="255" font-family="sans-serif" font-size="12" fill="#475569">Total Energy Used:</text>
      <text x="380" y="275" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">742 kWh</text>

      <!-- Service Address -->
      <text x="40" y="325" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">SERVICE ADDRESS:</text>
      <text x="40" y="345" font-family="sans-serif" font-size="13" fill="#0f172a">David Miller, 892 Oakridge Lane, Seattle, WA 98101</text>
    </svg>`,
  },
  {
    id: "sample_contract_agreement",
    name: "Doc_Draft_Final_v3_SIGNED.pdf",
    type: "application/pdf",
    size: 275000,
    description: "Master Services Agreement Contract between Apex Corp and Nova Dynamics (Jan 2024)",
    docTypeHint: "Contract",
    expectedName: "Apex_Nova_Master_Services_Agreement_2024-01-10.pdf",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
      <rect width="600" height="800" fill="#fcfcfc"/>
      <rect x="30" y="30" width="540" height="740" fill="none" stroke="#cbd5e1" stroke-width="1"/>
      
      <text x="300" y="80" font-family="serif" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">MASTER SERVICES AGREEMENT</text>
      <text x="300" y="105" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">Contract Reference: MSA-APEX-NOVA-2024</text>
      <line x1="180" y1="120" x2="420" y2="120" stroke="#0f172a" stroke-width="1"/>

      <text x="60" y="160" font-family="serif" font-size="13" fill="#1e293b">This Master Services Agreement is entered into on <tspan font-weight="bold">January 10, 2024</tspan></text>
      <text x="60" y="195" font-family="sans-serif" font-size="12" fill="#334155"><tspan font-weight="bold">PARTY A (Client):</tspan> Apex Systems Corporation, Delaware</text>
      <text x="60" y="225" font-family="sans-serif" font-size="12" fill="#334155"><tspan font-weight="bold">PARTY B (Provider):</tspan> Nova Dynamics AI Software Inc., California</text>

      <text x="60" y="275" font-family="serif" font-size="13" font-weight="bold" fill="#0f172a">1. SCOPE OF SERVICES</text>
      <text x="60" y="300" font-family="sans-serif" font-size="12" fill="#475569">Provider agrees to supply custom machine learning pipeline engineering,</text>
      <text x="60" y="320" font-family="sans-serif" font-size="12" fill="#475569">intelligent document categorization APIs, and related enterprise support.</text>

      <!-- Signature block -->
      <rect x="55" y="580" width="220" height="90" fill="#f8fafc" stroke="#e2e8f0" rx="4"/>
      <text x="65" y="605" font-family="cursive" font-size="16" fill="#1e3a8a">Jonathan Hayes</text>
      <text x="65" y="630" font-family="sans-serif" font-size="11" fill="#475569">CEO, Apex Systems Corp.</text>
      <text x="65" y="650" font-family="sans-serif" font-size="10" fill="#64748b">Date: 2024-01-10</text>

      <rect x="325" y="580" width="220" height="90" fill="#f8fafc" stroke="#e2e8f0" rx="4"/>
      <text x="335" y="605" font-family="cursive" font-size="16" fill="#1e3a8a">Elena Rostova</text>
      <text x="335" y="630" font-family="sans-serif" font-size="11" fill="#475569">CTO, Nova Dynamics Inc.</text>
      <text x="335" y="650" font-family="sans-serif" font-size="10" fill="#64748b">Date: 2024-01-10</text>
    </svg>`,
  },
];

// Helper to convert SVG string to base64 data URL for instant multimodal analysis
export function svgToDataUrl(svgString: string): string {
  const base64 = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64}`;
}
