function getAllDependents() {
  const dependents = [];

  for (let i = 1; i <= dependentCount; i++) {
    const block = document.getElementById(`dependent-${i}`);
    if (!block) continue;

    const lastEl  = document.getElementById(`dep${i}_last`);
    const firstEl = document.getElementById(`dep${i}_first`);
    const miEl    = document.getElementById(`dep${i}_mi`);
    const bdayEl  = document.getElementById(`dep${i}_bday`);
    const relEl   = document.getElementById(`dep${i}_rel`);

    if (!lastEl || !firstEl || !bdayEl || !relEl) continue;

    const bday    = bdayEl.value;
    const dateObj = new Date(bday);

    if (isNaN(dateObj.getTime())) {
      alert(`Invalid birthdate for Dependent ${i}`);
      return null;
    }

    const genderEl = document.querySelector(`input[name="dep${i}_gender"]:checked`);

    dependents.push({
      fullName: `${lastEl.value} ${firstEl.value} ${miEl?.value ?? ''}`.trim(),
      birthDate: {
        year:  dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        day:   dateObj.getDate(),
      },
      rel:    relEl.value,
      gender: genderEl ? genderEl.value : ''
    });
  }

  return dependents;
}

function PlanChoose() {
  const btn = document.getElementById("planChoose-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const selectedPlan = document.querySelector('input[name="planType"]:checked')?.value;

    if (!selectedPlan) {
      alert("Please select a plan");
      return;
    }

    localStorage.setItem("PlanType", selectedPlan);

    if (localStorage.getItem("PlanType")) {
      window.location.href = "Plans.html";
    }
  });
}
document.addEventListener("DOMContentLoaded", PlanChoose);

function checkedConditions() {
  const checkboxes = document.querySelectorAll("#conditionChecklist input[type='checkbox']");
  for (const checkbox of checkboxes) {
    if (checkbox.checked) return "Have Condition";
  }
  return "No Condition";
}

// ─────────────────────────────────────────────────────────────────────────────
//  FIX 1: Read plan name + plan type from the confirmation modal fields,
//          not from `.card-title` (which never existed in this page).
// ─────────────────────────────────────────────────────────────────────────────
function extractData() {
  const btn = document.getElementById("user-info");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const lastName   = document.getElementById("LastName")?.value.trim();
    const firstName  = document.getElementById("FirstName")?.value.trim();
    const middleName = document.getElementById("MiddleName")?.value.trim();
    const birthDate  = document.getElementById("bday")?.value;
    const address    = document.getElementById("address")?.value.trim();
    const email      = document.getElementById("email")?.value.trim();
    const gender     = document.querySelector('input[name="gender"]:checked')?.value;
    const civilStatus = document.getElementById("civil-status")?.value;
    const paymentSel = document.getElementById("payment-option");
    const payment    = paymentSel?.options[paymentSel.selectedIndex]?.text ?? '';

    // ── FIX: read plan from the confirmation modal, not from .card-title ──
    const planName   = document.getElementById("conf-plan-name")?.textContent.trim()  ?? '';
    const planType   = document.getElementById("conf-plan-type")?.textContent.trim()  ?? '';
    const plan       = planType ? `${planType} – ${planName}` : planName;

    const condition = checkedConditions();
    const referral  = document.getElementById("referredBy")?.value.trim() || "DIS";

    if (!lastName || !firstName || !middleName || !birthDate || !address || !email || !gender || !civilStatus) {
      alert("Please complete all fields");
      return;
    }

    const dateObj = new Date(birthDate);
    if (isNaN(dateObj.getTime())) {
      alert("Invalid date format");
      return;
    }

    // ── Also save planType key so the form config lookup works ──
    if (planType) {
      localStorage.setItem("PlanType", planType);
    }

    const data = {
      fullName: `${lastName} ${firstName} ${middleName}`,
      birthDate: {
        year:  dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        day:   dateObj.getDate(),
      },
      address,
      email,
      gender,
      condition,
      plan,
      civilStatus,
      payment,
      referral,
    };

    localStorage.setItem("data", JSON.stringify(data));

    let dependents = {};
    const form = localStorage.getItem("selectedForm");
    if (form === "amaphilshop") {
      dependents = getAllDependents();
      if (!dependents) return;
    }

    localStorage.setItem("dependentsData", JSON.stringify(dependents));
    window.location.href = "payment.html";
  });
}
document.addEventListener("DOMContentLoaded", extractData);

// ─────────────────────────────────────────────────────────────────────────────
//  Google Forms config (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
const formsConfig = {
  "shop.html": {
    url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSd6k9TCCfsDvQI84QmtORnyEraWW4PwUFRihlvgfxfHLJ0xgw/formResponse",
    fields: {
      planType:   "entry.307150928",
      fullName:   "entry.598676198",
      address:    "entry.233583999",
      email:      "entry.692955566",
      gender:     "entry.2097655811",
      civilStatus:"entry.814261707",
      condition:  "entry.1339191093",
      plan:       "entry.89154130",
      birthYear:  "entry.1292583609_year",
      birthMonth: "entry.1292583609_month",
      birthDay:   "entry.1292583609_day",
      status:     "entry.1819469267",
      payment:    "entry.322952436",
      referral:   "entry.684880416",
    }
  },
  "amaphilshop.html": {
    url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLScM7WdNo77mVF0Ov40fKqMRi-xerTSFp8WRB6DEl8oYAwPACA/formResponse",
    fields: {
      planType:           "entry.1182148951",
      fullName:           "entry.1766981923",
      address:            "entry.1791205225",
      email:              "entry.1496075633",
      gender:             "entry.1392159046",
      civilStatus:        "entry.998531261",
      condition:          "entry.1673739680",
      plan:               "entry.960401984",
      birthYear:          "entry.1357420546_year",
      birthMonth:         "entry.1357420546_month",
      birthDay:           "entry.1357420546_day",
      status:             "entry.1843997625",
      payment:            "entry.231346316",
      PrincipalDependent: "entry.1647194468",
      relationship:       "entry.60456725",
      referral:           "entry.1754101156",
    }
  }
};

const selectedForm = localStorage.getItem("selectedForm");
const pageKey      = selectedForm + ".html";
const link         = formsConfig[pageKey]?.url;
const fields       = formsConfig[pageKey]?.fields;

async function sendIntoExcel(data) {
  if (!data || !link || !fields) {
    console.error("No form config found for this page or data missing");
    return;
  }

  const params = new URLSearchParams();
  const formFields = {
    [fields.planType]:           localStorage.getItem("PlanType") || "no selected plan",
    [fields.fullName]:           data.fullName,
    [fields.address]:            data.address,
    [fields.email]:              data.email,
    [fields.gender]:             data.gender,
    [fields.civilStatus]:        data.civilStatus,
    [fields.condition]:          data.condition,
    [fields.plan]:               data.plan,
    [fields.birthYear]:          data.birthDate.year,
    [fields.birthMonth]:         data.birthDate.month,
    [fields.birthDay]:           data.birthDate.day,
    [fields.status]:             "Pending",
    [fields.payment]:            data.payment,
    [fields.referral]:           data.referral,
    [fields.PrincipalDependent]: "Principal",
    [fields.relationship]:       "Principal Applicant",
  };

  for (const [key, value] of Object.entries(formFields)) {
    if (key) params.append(key, value);
  }

  try {
    await fetch(link, { method: "POST", mode: "no-cors", body: params });
  } catch (error) {
    alert("An error occurred sending the data");
    console.error(error);
  }
}

async function sendDependentsData(data) {
  const dependentsData = JSON.parse(localStorage.getItem("dependentsData"));
  if (!dependentsData || !link || !fields) return;

  for (const dependent of Object.values(dependentsData)) {
    if (!dependent) continue;

    const params = new URLSearchParams();
    const formFields = {
      [fields.planType]:           localStorage.getItem("PlanType") || "no selected plan",
      [fields.fullName]:           dependent.fullName,
      [fields.address]:            data.address,
      [fields.email]:              data.email,
      [fields.gender]:             dependent.gender,
      [fields.civilStatus]:        'n/a',
      [fields.condition]:          'n/a',
      [fields.plan]:               data.plan,
      [fields.birthYear]:          dependent.birthDate?.year,
      [fields.birthMonth]:         dependent.birthDate?.month,
      [fields.birthDay]:           dependent.birthDate?.day,
      [fields.status]:             "Pending",
      [fields.payment]:            data.payment,
      [fields.PrincipalDependent]: "Dependent",
      [fields.referral]:           data.referral,
      [fields.relationship]:       dependent.rel,
    };

    for (const [key, value] of Object.entries(formFields)) {
      if (key && value != null) params.append(key, value);
    }

    try {
      await fetch(link, { method: "POST", mode: "no-cors", body: params });
    } catch (error) {
      console.error("Error sending dependent:", error);
    }
  }
}

async function sendData() {
  const btn = document.getElementById("gmail");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (!data) {
      console.log("Data was missing");
      return;
    }

    await sendIntoExcel(data);

    const isFamily = localStorage.getItem("PlanType") === "Family";
    if (selectedForm === "amaphilshop" && isFamily) {
      await sendDependentsData(data);
    }

    sendProofPaymentGmail();
  });
}
document.addEventListener("DOMContentLoaded", sendData);


// ─────────────────────────────────────────────────────────────────────────────
//  FIX 2: Group / Masterlist enrollment — collect table rows, save to
//          localStorage, and submit each row to the Group Google Form.
//
//  NOTE: Add your actual Group Google Form URL + entry IDs below.
//        The field names below match the column headers in the enrollment table.
// ─────────────────────────────────────────────────────────────────────────────

const GROUP_FORM_URL = formsConfig["amaphilshop.html"]?.url;  // reuse or replace with your group form URL
// If you have a separate Group form, replace the line above with:
// const GROUP_FORM_URL = "https://docs.google.com/forms/u/0/d/e/YOUR_GROUP_FORM_ID/formResponse";

// Map table column order (0-indexed) → Google Form entry IDs.
// Update these entry IDs to match your actual Group Google Form.
const GROUP_FIELDS = [
  null,                   // 0  – row number (skip)
  "entry.empId",          // 1  – Employee ID
  "entry.lastName",       // 2  – Last Name       ← REQUIRED
  "entry.firstName",      // 3  – Given Name       ← REQUIRED
  "entry.middleName",     // 4  – Middle Name
  "entry.suffix",         // 5  – Suffix
  "entry.nickname",       // 6  – Nickname
  "entry.birthYear",      // 7  – Birth Year       ← REQUIRED
  "entry.birthMonth",     // 8  – Birth Month      ← REQUIRED
  "entry.birthDay",       // 9  – Birth Day        ← REQUIRED
  "entry.gender",         // 10 – Gender           ← REQUIRED
  "entry.civilStatus",    // 11 – Civil Status     ← REQUIRED
  "entry.nationality",    // 12 – Nationality      ← REQUIRED
  "entry.philHealth",     // 13 – PhilHealth       ← REQUIRED
  "entry.philHealthId",   // 14 – PhilHealth ID    ← REQUIRED
  "entry.phone",          // 15 – Phone            ← REQUIRED
  "entry.department",     // 16 – Department
  "entry.resignation",    // 17 – Resignation      ← REQUIRED
  "entry.empDate",        // 18 – Employment Date  ← REQUIRED
  "entry.plan",           // 19 – Plan             ← REQUIRED
  "entry.memberType",     // 20 – Member Type      ← REQUIRED
  "entry.idName",         // 21 – ID Name (dep.)
  "entry.activationDate", // 22 – Activation Date
  "entry.email",          // 23 – Email            ← REQUIRED
  "entry.expirationDate", // 24 – Expiration Date
  "entry.remarks",        // 25 – Remarks
  "entry.amaPhilId",      // 26 – AMAPHIL ID
  null,                   // 27 – action button (skip)
];

/**
 * Reads all enrollee rows from the group table, validates required fields,
 * stores them in localStorage, and submits each row to the Google Form.
 * Called by the "Submit Enrollment" button in groupEnrollModal.
 */
async function extractGroupEnrollmentData() {
  const rows = document.querySelectorAll('#enrollee-tbody tr[data-erow]');

  if (rows.length === 0) {
    alert('Please add at least one enrollee before submitting.');
    return;
  }

  // ── Validate required cells ──────────────────────────────────────
  let firstInvalid = null;
  rows.forEach(tr => {
    tr.querySelectorAll('[data-req="1"]').forEach(el => {
      el.style.borderColor = '';
      if (!el.value.trim()) {
        el.style.borderColor = 'var(--danger)';
        if (!firstInvalid) firstInvalid = el;
      }
    });
  });

  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid.focus();
    alert('Please fill in all required fields (highlighted in red) before submitting.');
    return;
  }

  // ── Collect row data ─────────────────────────────────────────────
  const enrollees = [];

  rows.forEach(tr => {
    const cells = tr.querySelectorAll('td');
    const row   = {};

    // Map each cell's input/select value to a named key
    const colNames = [
      null, 'empId', 'lastName', 'firstName', 'middleName', 'suffix',
      'nickname', 'birthYear', 'birthMonth', 'birthDay', 'gender',
      'civilStatus', 'nationality', 'philHealth', 'philHealthId', 'phone',
      'department', 'resignation', 'empDate', 'plan', 'memberType',
      'idName', 'activationDate', 'email', 'expirationDate', 'remarks',
      'amaPhilId', null
    ];

    cells.forEach((td, i) => {
      if (!colNames[i]) return;
      const inp = td.querySelector('input, select');
      row[colNames[i]] = inp ? inp.value.trim() : '';
    });

    // Add the shared group plan details
    row.groupPlanName   = selectedGroupPlan.name;
    row.groupPlanPeriod = selectedGroupPlan.period;
    row.groupPlanPrice  = selectedGroupPlan.price;

    enrollees.push(row);
  });

  // ── Persist to localStorage ──────────────────────────────────────
  localStorage.setItem('groupEnrollmentData', JSON.stringify(enrollees));
  localStorage.setItem('PlanType', 'Group');

  // ── Submit each row to Google Form ──────────────────────────────
  const submitBtn = document.getElementById('group-submit-btn');
  if (submitBtn) {
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Submitting…';
  }

  let successCount = 0;

  for (const enrollee of enrollees) {
    const params = new URLSearchParams();

    // Build the field map using GROUP_FIELDS entry IDs
    const colValues = [
      null,                           // 0  row #
      enrollee.empId,                 // 1
      enrollee.lastName,              // 2
      enrollee.firstName,             // 3
      enrollee.middleName,            // 4
      enrollee.suffix,                // 5
      enrollee.nickname,              // 6
      enrollee.birthYear,             // 7
      enrollee.birthMonth,            // 8
      enrollee.birthDay,              // 9
      enrollee.gender,                // 10
      enrollee.civilStatus,           // 11
      enrollee.nationality,           // 12
      enrollee.philHealth,            // 13
      enrollee.philHealthId,          // 14
      enrollee.phone,                 // 15
      enrollee.department,            // 16
      enrollee.resignation,           // 17
      enrollee.empDate,               // 18
      enrollee.plan || enrollee.groupPlanName, // 19 – prefer cell value, fall back to banner
      enrollee.memberType,            // 20
      enrollee.idName,                // 21
      enrollee.activationDate,        // 22
      enrollee.email,                 // 23
      enrollee.expirationDate,        // 24
      enrollee.remarks,               // 25
      enrollee.amaPhilId,             // 26
      null,                           // 27
    ];

    GROUP_FIELDS.forEach((entryId, i) => {
      if (!entryId || colValues[i] == null || colValues[i] === '') return;
      params.append(entryId, colValues[i]);
    });

    // Always append the shared plan period + price
    if (fields?.payment)  params.append(fields.payment,  enrollee.groupPlanPeriod);
    if (fields?.planType) params.append(fields.planType, 'Group');
    if (fields?.status)   params.append(fields.status,   'Pending');

    try {
      await fetch(GROUP_FORM_URL, { method: 'POST', mode: 'no-cors', body: params });
      successCount++;
    } catch (err) {
      console.error(`Failed to submit enrollee ${enrollee.firstName} ${enrollee.lastName}:`, err);
    }
  }

  if (submitBtn) {
    submitBtn.disabled    = false;
    submitBtn.innerHTML   = '<i class="fa fa-paper-plane me-1"></i>Submit Enrollment';
  }

  alert(
    `Group enrollment submitted!\n\n` +
    `✅ ${successCount} of ${enrollees.length} enrollee(s) sent successfully.\n` +
    `Plan: ${selectedGroupPlan.name}\n` +
    `Payment: ${selectedGroupPlan.period}`
  );
}

// Expose globally so the inline onclick="extractGroupEnrollmentData()" works
window.extractGroupEnrollmentData = extractGroupEnrollmentData;