const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const dbPath = path.join(dbDir, 'policylens.db');
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
  // Create policies table
  db.run(`
    CREATE TABLE IF NOT EXISTS policies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      pros TEXT,
      cons TEXT,
      eligibility_rules TEXT,
      how_to_avail TEXT,
      official_links TEXT,
      status TEXT DEFAULT 'active',
      target_group TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create users table (for storing questionnaire responses temporarily)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      age_range TEXT,
      occupation TEXT,
      income_range TEXT,
      student_status TEXT,
      state TEXT,
      family_income TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert sample policy data
  const samplePolicies = [
    {
      name: "National Scholarship Scheme",
      category: "Education",
      description: "Financial assistance for students from economically weaker sections to pursue higher education.",
      pros: JSON.stringify(["Reduces financial burden on families", "Promotes higher education among disadvantaged groups", "Covers tuition fees and maintenance allowance"]),
      cons: JSON.stringify(["Limited slots available", "Complex application process", "Strict eligibility criteria"]),
      eligibility_rules: JSON.stringify({ income_max: 800000, student: true }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Check eligibility on the official portal</li>
          <li>Keep required documents ready (income certificate, academic records)</li>
          <li>Apply online through the National Scholarship Portal</li>
          <li>Track application status regularly</li>
          <li>Renew scholarship annually with updated documents</li>
        </ol>
      `,
      official_links: JSON.stringify([{ name: "National Scholarship Portal", url: "https://scholarships.gov.in" }]),
      status: "active",
      target_group: "Students"
    },
    {
      name: "Pradhan Mantri Ujjwala Yojana",
      category: "Social Welfare",
      description: "Provides free LPG connections to women from below poverty line households.",
      pros: JSON.stringify(["Free LPG connection", "Safer cooking fuel", "Reduces health hazards from traditional fuels"]),
      cons: JSON.stringify(["Requires annual renewal of LPG subsidies", "Limited to BPL households", "Initial documentation requirements"]),
      eligibility_rules: JSON.stringify({ bpl: true, woman_headed_household: true }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Check if your household is listed in SECC database</li>
          <li>Visit nearest CSC center or apply online</li>
          <li>Submit required documents (ration card, identity proof)</li>
          <li>Complete enrollment process</li>
          <li>Receive LPG connection and subsidy benefits</li>
        </ol>
      `,
      official_links: JSON.stringify([{ name: "Ujjwala Yojana Portal", url: "https://ujjwala.gov.in" }]),
      status: "active",
      target_group: "Women from BPL households"
    },
    {
      name: "Atal Pension Yojana",
      category: "Pension",
      description: "Pension scheme aimed at workers in the unorganised sector.",
      pros: JSON.stringify(["Guaranteed pension after 60 years", "Government co-contribution", "Tax benefits"]),
      cons: JSON.stringify(["Fixed contribution amounts", "Only for unorganized sector workers", "Limited to age 18-40 at entry"]),
      eligibility_rules: JSON.stringify({ age_min: 18, age_max: 40, sector: "unorganized" }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Approach a bank or CSC center</li>
          <li>Complete registration form with KYC documents</li>
          <li>Choose desired pension amount</li>
          <li>Make regular monthly contributions</li>
          <li>Receive pension after turning 60</li>
        </ol>
      `,
      official_links: JSON.stringify([{ name: "APY Information", url: "https://www.npscra.nsdl.co.in/APY.php" }]),
      status: "active",
      target_group: "Unorganized sector workers"
    },
    {
      name: "Prime Minister's Scholarship Scheme (PMSS)",
      category: "Education",
      description: "Monthly scholarship for wards and widows of Central Armed Police Forces (CAPFs), State Police, Assam Rifles and Railway Protection Force (RPF/RPSF) pursuing professional courses.",
      pros: JSON.stringify([
        "Monthly scholarship of ₹3,000 for girls and ₹2,500 for boys",
        "Annual support up to ₹36,000 for girls and ₹30,000 for boys",
        "Covers all major technical and professional courses"
      ]),
      cons: JSON.stringify([
        "Limited to families of CAPF/Police personnel",
        "Requires 60% marks in 12th class",
        "Only for first year of professional courses"
      ]),
      eligibility_rules: JSON.stringify({
        "student": true,
        "family_type": "capf_police"
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Ensure you are in first year of professional course</li>
          <li>Have passed 12th class with at least 60% marks</li>
          <li>Belong to CAPF/Police family category</li>
          <li>Apply through National Scholarship Portal (NSP)</li>
          <li>Application window: Usually from June to November</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "National Scholarship Portal", url: "https://scholarships.gov.in" }
      ]),
      status: "active",
      target_group: "Students from CAPF/Police families"
    },
    {
      name: "PM Young Achievers Scholarship Award Scheme for Vibrant India (PM-YASASVI)",
      category: "Education",
      description: "Scholarship for students from OBC, EBC, and DNT communities to pursue higher education in Classes 9 and 11.",
      pros: JSON.stringify([
        "Full tuition fee and non-refundable charges covered",
        "Living expenses of ₹3,000 per month",
        "Books and stationery allowance of ₹5,000 per annum",
        "Computer/laptop assistance up to ₹45,000"
      ]),
      cons: JSON.stringify([
        "Limited to OBC, EBC, and DNT communities",
        "Family income must not exceed ₹2.5 lakh",
        "Only for students in Classes 9 or 11"
      ]),
      eligibility_rules: JSON.stringify({
        "student": true,
        "community": ["obc", "ebc", "dnt"],
        "income_max": 250000,
        "class": [9, 11]
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Check if you belong to OBC, EBC, or DNT community</li>
          <li>Ensure family income is below ₹2.5 lakh</li>
          <li>Be studying in Class 9 or 11</li>
          <li>Apply through National Scholarship Portal</li>
          <li>Applications open June 2 to August 31, 2025</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "National Scholarship Portal", url: "https://scholarships.gov.in" }
      ]),
      status: "active",
      target_group: "Students from OBC, EBC, DNT communities"
    },
    {
      name: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
      category: "Education",
      description: "Scholarship for meritorious students from economically weaker sections to continue their education from Class 9 to Class 12.",
      pros: JSON.stringify([
        "₹12,000 per year for Classes 9 to 12",
        "Promotes academic and performance continuity",
        "Available for government and government-aided schools"
      ]),
      cons: JSON.stringify([
        "Annual parent income must be below ₹3.5 lakh",
        "Not available for students of KVS, NVS, or residential schools",
        "Requires at least 55% in Class 7 (50% for SC/ST)"
      ]),
      eligibility_rules: JSON.stringify({
        "student": true,
        "income_max": 350000,
        "min_class": 8,
        "max_class": 12,
        "school_type": "government_or_aided"
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Be studying in government or government-aided school</li>
          <li>Score at least 55% in Class 7 (50% for SC/ST)</li>
          <li>Family income below ₹3.5 lakh annually</li>
          <li>Apply on the National Scholarship Portal (NSP)</li>
          <li>Last date for applications: September 30, 2025</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "National Scholarship Portal", url: "https://scholarships.gov.in" }
      ]),
      status: "active",
      target_group: "Students from economically weaker sections"
    },
    {
      name: "PM-Vidya Lakshmi Education Loan Scheme + Central Sector Interest Subsidy (CSIS)",
      category: "Education",
      description: "Education loan scheme with interest subsidy for students pursuing professional/technical courses in India.",
      pros: JSON.stringify([
        "Loan up to ₹10 lakh free of collateral",
        "Maximum interest subsidy during moratorium period",
        "75% credit guarantee by Government of India",
        "3% interest subvention on loans up to ₹10 lakh"
      ]),
      cons: JSON.stringify([
        "Family income must be limited to ₹4.5 lakh annually",
        "Only for professional/technical courses in India",
        "Institution must be NAAC/NBA accredited"
      ]),
      eligibility_rules: JSON.stringify({
        "income_max": 450000,
        "course_type": "professional_technical",
        "institution_type": "accredited"
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Ensure family income is below ₹4.5 lakh annually</li>
          <li>Enroll in NAAC/NBA accredited institution</li>
          <li>Apply using Common Education Loan Application Form (CELAF)</li>
          <li>Submit application on Vidya Lakshmi portal</li>
          <li>Track loan application status online</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "Vidya Lakshmi Portal", url: "https://vidyalakshmi.co.in" }
      ]),
      status: "active",
      target_group: "Students pursuing higher education"
    },
    {
      name: "Prime Minister Internship Scheme (PM Internship Scheme)",
      category: "Employment",
      description: "12-month paid internship exposure for young individuals to gain real job experience in various sectors.",
      pros: JSON.stringify([
        "12-month paid internship with ₹5,000 per month allowance",
        "₹6,000 one-off joining allowance",
        "Insurance coverage (PMJJBY and PMSBY)",
        "Available in 24 sectors including automotive, banking, hospitality, logistics, and MSME"
      ]),
      cons: JSON.stringify([
        "Age limit of 21-24 years",
        "Family income must not exceed ₹8 lakh",
        "Not open to graduates from IITs, IIMs, NLUs, IISERs, NIDs, IIITs"
      ]),
      eligibility_rules: JSON.stringify({
        "age_min": 21,
        "age_max": 24,
        "education_min": "12th_pass",
        "income_max": 800000,
        "not_employed": true,
        "not_studying": true
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Check eligibility criteria (age, education, income, employment status)</li>
          <li>Visit PM Internship portal: pminternship.mca.gov.in</li>
          <li>Complete online application form</li>
          <li>Wait for selection and placement</li>
          <li>Begin 12-month paid internship program</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "PM Internship Portal", url: "https://pminternship.mca.gov.in" }
      ]),
      status: "active",
      target_group: "Young adults seeking work experience"
    },
    {
      name: "Employees' Provident Fund (EPF)",
      category: "Pension",
      description: "Mandatory retirement savings scheme for salaried employees where both employee and employer contribute equally.",
      pros: JSON.stringify([
        "Employer contributes an equal share (12% of basic salary)",
        "Interest rate of 8.25% per annum",
        "Tax-free if withdrawn after 5 years of continuous service",
        "Loan facility available for specific purposes"
      ]),
      cons: JSON.stringify([
        "Mandatory only for companies with more than 20 employees",
        "Long lock-in period until retirement",
        "Limited withdrawal options"
      ]),
      eligibility_rules: JSON.stringify({
        "employment_type": "salaried",
        "company_size_min": 20
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Get employed in a company with more than 20 employees</li>
          <li>EPF account will be automatically created</li>
          <li>12% of basic salary will be deducted monthly</li>
          <li>Employer contributes equal amount</li>
          <li>Track account through EPFO portal</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "EPFO Portal", url: "https://www.epfindia.gov.in" }
      ]),
      status: "active",
      target_group: "Salaried employees"
    },
    {
      name: "National Pension Scheme (NPS)",
      category: "Pension",
      description: "Government-backed retirement scheme offering flexibility in investment choices with tax benefits.",
      pros: JSON.stringify([
        "Flexibility to choose between equity, corporate bonds, and government securities",
        "Tax benefits under Section 80CCD(1) and 80CCD(1B)",
        "Additional tax benefits up to ₹50,000 under Section 80CCD(1B)",
        "Market-linked returns of 9-15%"
      ]),
      cons: JSON.stringify([
        "Market-linked returns carry risk",
        "Partial withdrawals only after 3 years",
        "40% of corpus must be used for annuity at retirement"
      ]),
      eligibility_rules: JSON.stringify({
        "age_min": 18,
        "age_max": 70
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Be an Indian citizen between 18-70 years of age</li>
          <li>Choose a Point of Presence (POP) - bank or financial institution</li>
          <li>Complete registration process and get PRAN</li>
          <li>Choose investment options (Tier I and Tier II)</li>
          <li>Make regular contributions to the scheme</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "NPS Trust Portal", url: "https://www.npscra.nsdl.co.in" }
      ]),
      status: "active",
      target_group: "Individuals planning for retirement"
    },
    {
      name: "Public Provident Fund (PPF)",
      category: "Savings",
      description: "Long-term, risk-free savings scheme for retirement planning with guaranteed returns and tax benefits.",
      pros: JSON.stringify([
        "Guaranteed returns of 7.1% per annum",
        "Tax-free interest earnings",
        "Deduction under Section 80C up to ₹1.5 lakh",
        "Extendable in blocks of 5 years after 15 years"
      ]),
      cons: JSON.stringify([
        "Long lock-in period of 15 years",
        "Limited withdrawal options",
        "Lower returns compared to market-linked investments"
      ]),
      eligibility_rules: JSON.stringify({
        "citizenship": "indian"
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Be an Indian citizen (HUF and NRIs not eligible)</li>
          <li>Open PPF account at a bank or post office</li>
          <li>Make minimum annual contribution of ₹500</li>
          <li>Maximum contribution of ₹1.5 lakh per year</li>
          <li>Account matures after 15 years, extendable in 5-year blocks</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "Income Tax Department", url: "https://www.incometax.gov.in" }
      ]),
      status: "active",
      target_group: "Individuals seeking safe investment"
    },
    {
      name: "Atal Pension Yojana (APY)",
      category: "Pension",
      description: "Government-backed pension scheme for workers in the unorganized sector with guaranteed monthly pensions.",
      pros: JSON.stringify([
        "Guaranteed monthly pensions ranging from ₹1,000 to ₹5,000",
        "Government contributes to pension for first 5 years",
        "Tax benefits under Section 80CCD(1)",
        "Interest rate of 8.00%"
      ]),
      cons: JSON.stringify([
        "Limited to individuals aged 18-40 years",
        "Only for workers in unorganized sector",
        "Fixed pension amounts after retirement"
      ]),
      eligibility_rules: JSON.stringify({
        "age_min": 18,
        "age_max": 40,
        "sector": "unorganized"
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Be between 18-40 years of age</li>
          <li>Be a worker in the unorganized sector</li>
          <li>Have a savings bank account</li>
          <li>Have a mobile number linked to the account</li>
          <li>Enroll through a bank or authorized institution</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "Pension Fund Regulatory Authority", url: "https://www.pfrda.org.in" }
      ]),
      status: "active",
      target_group: "Workers in unorganized sector"
    },
    {
      name: "National Savings Certificate (NSC)",
      category: "Savings",
      description: "Safe, government-backed investment with fixed returns for tax-saving purposes.",
      pros: JSON.stringify([
        "Guaranteed returns of 7.7% per annum",
        "Tax deduction under Section 80C up to ₹1.5 lakh",
        "Government backing ensures safety of principal",
        "5-year tenure with fixed returns"
      ]),
      cons: JSON.stringify([
        "Lower returns compared to market-linked investments",
        "Fixed tenure of 5 years",
        "Interest is taxable"
      ]),
      eligibility_rules: JSON.stringify({
        "citizenship": "indian"
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Be an Indian citizen (adults only, minors through guardians)</li>
          <li>Purchase from any post office or authorized bank</li>
          <li>Minimum investment of ₹1,000</li>
          <li>Interest compounded annually</li>
          <li>Investment matures after 5 years</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "Department of Posts", url: "https://www.indiapost.gov.in" }
      ]),
      status: "active",
      target_group: "Conservative investors"
    },
    {
      name: "Udyam Registration",
      category: "MSME",
      description: "Valid registration for MSMEs that provides recognition and access to government benefits and schemes.",
      pros: JSON.stringify([
        "Access to financial assistance, grants, and loans",
        "Eligibility for various government schemes",
        "Enhanced business credibility",
        "Easier access to government tenders"
      ]),
      cons: JSON.stringify([
        "Requires proper documentation and compliance",
        "Annual return filing required",
        "Only for manufacturing/service enterprises"
      ]),
      eligibility_rules: JSON.stringify({
        "business_type": "manufacturing_or_service",
        "investment_limit": true
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Have a valid Aadhaar number</li>
          <li>Prepare required documents (Aadhaar, PAN, bank details)</li>
          <li>Visit Udyam Registration Portal</li>
          <li>Fill out the online application form</li>
          <li>Submit and receive Udyam Registration Number (URN)</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "Udyam Registration Portal", url: "https://udyamregistrations.gov.in" }
      ]),
      status: "active",
      target_group: "Micro, Small and Medium Enterprises"
    },
    {
      name: "Prime Minister Employment Generation Programme (PMEGP)",
      category: "MSME",
      description: "Scheme for setting up small manufacturing units or services with government aid for employment generation.",
      pros: JSON.stringify([
        "Financial assistance for establishing new enterprises",
        "Subsidy of 15% for general category, 25% for special categories",
        "Loan assistance through banks",
        "Focus on employment generation"
      ]),
      cons: JSON.stringify([
        "Requires detailed project report",
        "Collateral requirements for loans",
        "Only for new enterprises"
      ]),
      eligibility_rules: JSON.stringify({
        "enterprise_type": "new",
        "employment_focus": true
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Prepare a detailed project report</li>
          <li>Apply through official MSME portal or bank</li>
          <li>Get loan assistance from designated banks</li>
          <li>Receive government subsidy component</li>
          <li>Start manufacturing/service enterprise</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "MSME Ministry", url: "https://www.msme.gov.in" }
      ]),
      status: "active",
      target_group: "Entrepreneurs wanting to start small units"
    },
    {
      name: "MUDRA Loan (Shishu, Kishor, Tarun)",
      category: "MSME",
      description: "Loan assistance up to ₹10 lakh for starting or expanding non-corporate, non-farm small/micro enterprises.",
      pros: JSON.stringify([
        "Loans up to ₹10 lakh without collateral",
        "Three segments: Shishu (up to ₹50k), Kishor (₹50k-5lakh), Tarun (₹5lakh-10lakh)",
        "No processing fee for loans up to ₹1 lakh",
        "Easy application process through banks and NBFCs"
      ]),
      cons: JSON.stringify([
        "Only for non-corporate, non-farm enterprises",
        "Requires business plan and documentation",
        "Interest rates vary by lender"
      ]),
      eligibility_rules: JSON.stringify({
        "business_type": "non_corporate_non_farm",
        "enterprise_size": "micro"
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Have a non-corporate, non-farm small/micro enterprise</li>
          <li>Prepare business plan and required documents</li>
          <li>Apply through banks, NBFCs, or MFIs</li>
          <li>Choose appropriate loan segment (Shishu, Kishor, or Tarun)</li>
          <li>Receive loan for business establishment or expansion</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "MUDRA Portal", url: "https://www.mudra.org.in" }
      ]),
      status: "active",
      target_group: "Micro-enterprise owners"
    },
    {
      name: "Stand-Up India Scheme",
      category: "MSME",
      description: "Scheme providing loans to women entrepreneurs and SC/ST entrepreneurs for self-employment and small business development.",
      pros: JSON.stringify([
        "Financial assistance for women and SC/ST entrepreneurs",
        "Bank loans between ₹10 lakh and ₹1 crore",
        "At least one SC/ST and one woman entrepreneur per bank branch",
        "Support for greenfield enterprises"
      ]),
      cons: JSON.stringify([
        "Limited to women and SC/ST entrepreneurs",
        "Requires new business (greenfield enterprise)",
        "Collateral requirements may apply"
      ]),
      eligibility_rules: JSON.stringify({
        "gender": "woman",
        "category": ["sc", "st"],
        "enterprise_type": "new"
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Be a woman or SC/ST category entrepreneur</li>
          <li>Plan to start a new business (greenfield enterprise)</li>
          <li>Apply through designated banks</li>
          <li>Submit business plan and required documents</li>
          <li>Receive loan between ₹10 lakh and ₹1 crore</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "Stand-Up India Portal", url: "https://www.standupindia.gov.in" }
      ]),
      status: "active",
      target_group: "Women and SC/ST entrepreneurs"
    },
    {
      name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
      category: "MSME",
      description: "Scheme enabling financing of loans for MSMEs without collateral through credit guarantee.",
      pros: JSON.stringify([
        "Collateral-free loans for MSMEs",
        "Credit guarantee up to ₹2 crore",
        "Simplified loan procedures",
        "Reduced processing costs"
      ]),
      cons: JSON.stringify([
        "Processing fee of 0.25% of loan amount",
        "Only for MSEs with turnover up to ₹100 crore",
        "Limited loan amount under guarantee"
      ]),
      eligibility_rules: JSON.stringify({
        "enterprise_type": "micro_small",
        "turnover_max": 1000000000
      }),
      how_to_avail: `
        <h3>How to Avail:</h3>
        <ol>
          <li>Be a micro or small enterprise</li>
          <li>Have turnover up to ₹100 crore</li>
          <li>Apply for loan through participating banks</li>
          <li>Pay processing fee of 0.25% of loan amount</li>
          <li>Receive collateral-free loan under CGTMSE guarantee</li>
        </ol>
      `,
      official_links: JSON.stringify([
        { name: "CGTMSE Portal", url: "https://www.cgtmse.in" }
      ]),
      status: "active",
      target_group: "Micro and Small Enterprises"
    }
  ];

  // Insert sample data if table is empty
  db.get("SELECT COUNT(*) as count FROM policies", (err, row) => {
    if (err) {
      console.error("Error checking policies table:", err);
    } else if (row.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO policies (name, category, description, pros, cons, eligibility_rules, how_to_avail, official_links, status, target_group)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      samplePolicies.forEach(policy => {
        stmt.run([
          policy.name,
          policy.category,
          policy.description,
          policy.pros,
          policy.cons,
          policy.eligibility_rules,
          policy.how_to_avail,
          policy.official_links,
          policy.status,
          policy.target_group
        ]);
      });
      
      stmt.finalize();
      console.log("Sample policies inserted into database");
    }
  });
});

module.exports = db;