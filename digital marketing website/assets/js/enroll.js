// ── enroll.js ───────────────────────────────────────────────────────

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
//  extractData — reads the client details form and saves to localStorage,
//  then redirects to payment.html.
//
//  Also captures:
//    • seniorPlanKey       — '1499' or '1599' (null for non-Senior plans)
//    • accidentalInsurance — true if the client opted in to Accidental Insurance
//                           (only relevant for the ₱1,499 Senior plan)
// ─────────────────────────────────────────────────────────────────────────────
function extractData() {
  const btn = document.getElementById("user-info");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const lastName    = document.getElementById("LastName")?.value.trim();
    const firstName   = document.getElementById("FirstName")?.value.trim();
    const middleName  = document.getElementById("MiddleName")?.value.trim();
    const birthDate   = document.getElementById("bday")?.value;
    const address     = document.getElementById("address")?.value.trim();
    const email       = document.getElementById("email")?.value.trim();
    const gender      = document.querySelector('input[name="gender"]:checked')?.value;
    const civilStatus = document.getElementById("civil-status")?.value;
    const paymentSel  = document.getElementById("payment-option");
    const payment     = paymentSel?.options[paymentSel.selectedIndex]?.text ?? '';

    // ── Read plan details from confirmation modal ──
    const planName = document.getElementById("conf-plan-name")?.textContent.trim()  ?? '';
    const planType = document.getElementById("conf-plan-type")?.textContent.trim()  ?? '';
    const plan     = planType ? `${planType} – ${planName}` : planName;

    // ── Senior-specific state ──
    // selectedSeniorPlanKey is a global set in Plans.html inline script
    const seniorPlanKey       = (typeof selectedSeniorPlanKey !== 'undefined') ? selectedSeniorPlanKey : null;
    const accidentalInsurance = document.getElementById("accidental-insurance-check")?.checked ?? false;

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

    // ── Save planType key so the form config lookup works ──
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
      seniorPlanKey,
      accidentalInsurance,
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
//  Google Forms config
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
    [fields.planType]:            localStorage.getItem("PlanType") || "no selected plan",
    [fields.fullName]:            data.fullName,
    [fields.address]:             data.address,
    [fields.email]:               data.email,
    [fields.gender]:              data.gender,
    [fields.civilStatus]:         data.civilStatus,
    [fields.condition]:           data.condition,
    [fields.plan]:                data.plan,
    [fields.birthYear]:           data.birthDate.year,
    [fields.birthMonth]:          data.birthDate.month,
    [fields.birthDay]:            data.birthDate.day,
    [fields.status]:              "Pending",
    [fields.payment]:             data.payment,
    [fields.referral]:            data.referral,
  };

  Object.entries(formFields).forEach(([key, value]) => {
    if (key && value !== undefined && value !== null) {
      params.append(key, value);
    }
  });

  await fetch(link, {
    method: "POST",
    mode:   "no-cors",
    body:   params.toString(),
  });
}

async function sendDependentsData(principalData) {
  const dependentsData = JSON.parse(localStorage.getItem("dependentsData") || "[]");
  if (!dependentsData.length) return;

  for (const dep of dependentsData) {
    const params = new URLSearchParams();

    if (fields?.fullName)           params.append(fields.fullName,           dep.fullName);
    if (fields?.birthYear)          params.append(fields.birthYear,          dep.birthDate.year);
    if (fields?.birthMonth)         params.append(fields.birthMonth,         dep.birthDate.month);
    if (fields?.birthDay)           params.append(fields.birthDay,           dep.birthDate.day);
    if (fields?.gender)             params.append(fields.gender,             dep.gender);
    if (fields?.relationship)       params.append(fields.relationship,       dep.rel);
    if (fields?.PrincipalDependent) params.append(fields.PrincipalDependent, "Dependent");
    if (fields?.planType)           params.append(fields.planType,           localStorage.getItem("PlanType") || "");
    if (fields?.plan)               params.append(fields.plan,               principalData.plan);
    if (fields?.status)             params.append(fields.status,             "Pending");

    try {
      await fetch(link, { method: "POST", mode: "no-cors", body: params.toString() });
    } catch (err) {
      console.error("Failed to send dependent:", dep.fullName, err);
    }
  }
}

function sendProofPaymentGmail() {
  // Placeholder — implement Gmail/email proof-of-payment logic here
  console.log("sendProofPaymentGmail called");
}

function sendData() {
  const btn = document.getElementById("confirm-payment-btn");
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
//  Group / Masterlist enrollment
// ─────────────────────────────────────────────────────────────────────────────
const GROUP_FORM_URL = formsConfig["amaphilshop.html"]?.url;

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

    // Attach shared group plan details
    row.groupPlanName   = selectedGroupPlan.name;
    row.groupPlanPeriod = selectedGroupPlan.period;
    row.groupPlanPrice  = selectedGroupPlan.price;

    enrollees.push(row);
  });

  localStorage.setItem('groupEnrollmentData', JSON.stringify(enrollees));
  localStorage.setItem('PlanType', 'Group');

  // ── Submit each row ──────────────────────────────────────────────
  const submitBtn = document.getElementById('group-submit-btn');
  if (submitBtn) {
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Submitting…';
  }

  let successCount = 0;

  for (const enrollee of enrollees) {
    const params = new URLSearchParams();

    const colValues = [
      null,
      enrollee.empId, enrollee.lastName, enrollee.firstName, enrollee.middleName,
      enrollee.suffix, enrollee.nickname, enrollee.birthYear, enrollee.birthMonth,
      enrollee.birthDay, enrollee.gender, enrollee.civilStatus, enrollee.nationality,
      enrollee.philHealth, enrollee.philHealthId, enrollee.phone, enrollee.department,
      enrollee.resignation, enrollee.empDate,
      enrollee.plan || enrollee.groupPlanName,
      enrollee.memberType, enrollee.idName, enrollee.activationDate, enrollee.email,
      enrollee.expirationDate, enrollee.remarks, enrollee.amaPhilId,
      null,
    ];

    GROUP_FIELDS.forEach((entryId, i) => {
      if (!entryId || colValues[i] == null || colValues[i] === '') return;
      params.append(entryId, colValues[i]);
    });

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
    submitBtn.disabled  = false;
    submitBtn.innerHTML = '<i class="fa fa-paper-plane me-1"></i>Submit Enrollment';
  }

  alert(
    `Group enrollment submitted!\n\n` +
    `✅ ${successCount} of ${enrollees.length} enrollee(s) sent successfully.\n` +
    `Plan: ${selectedGroupPlan.name}\n` +
    `Payment: ${selectedGroupPlan.period}`
  );
}

// Expose globally so inline onclick still works as fallback
window.extractGroupEnrollmentData = extractGroupEnrollmentData;