// ── groupEnrollment.js ──────────────────────────────────────────────

const FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeiNAHp9jUA299kf-hRvvNh2_UO7p2jhV-lfipSqb9G2i5bQQ/formResponse";

const ENTRIES = {
  empId:                "entry.566583630",
  lastName:             "entry.2104810968",
  firstName:            "entry.61662416",
  middleName:           "entry.1344256124",
  suffix:               "entry.1594710087",
  nickname:             "entry.545619272",
  birthYear:            "entry.148491576",
  birthMonth:           "entry.2009841461",
  birthDay:             "entry.1974754067",
  gender:               "entry.1287314341",
  civilStatus:          "entry.1672467287",
  nationality:          "entry.780917338",
  philHealth:           "entry.394490036",
  philHealthId:         "entry.1451559032",
  phone:                "entry.1477993387",
  department:           "entry.268001845",
  designation:          "entry.8030478",
  employmentDate_year:  "entry.909570184_year",
  employmentDate_month: "entry.909570184_month",
  employmentDate_day:   "entry.909570184_day",
  plan:                 "entry.1673750224",
  memberType:           "entry.174718140",
  idName:               "entry.1636130502",
  activationDate_year:  "entry.1926969263_year",
  activationDate_month: "entry.1926969263_month",
  activationDate_day:   "entry.1926969263_day",
  email:                "entry.928296627",
  expirationDate_year:  "entry.634119965_year",
  expirationDate_month: "entry.634119965_month",
  expirationDate_day:   "entry.634119965_day",
  remarks:              "entry.334521893",
  amaPhilId:            "entry.1182240530",
};

// ── Helpers ─────────────────────────────────────────────────────────

// Split "YYYY-MM-DD" into { year, month, day }
function splitDate(dateStr) {
  if (!dateStr) return { year: "", month: "", day: "" };
  const [year, month, day] = dateStr.split("-");
  return { year: year || "", month: month || "", day: day || "" };
}

// Build a URLSearchParams for one enrollee object
function buildFormParams(enrollee) {
  const empDate = splitDate(enrollee.employmentDate);
  const actDate = splitDate(enrollee.activationDate);
  const expDate = splitDate(enrollee.expirationDate);

  const params = new URLSearchParams();

  params.append(ENTRIES.empId,                enrollee.empId        || "");
  params.append(ENTRIES.lastName,             enrollee.lastName     || "");
  params.append(ENTRIES.firstName,            enrollee.firstName    || "");
  params.append(ENTRIES.middleName,           enrollee.middleName   || "");
  params.append(ENTRIES.suffix,               enrollee.suffix       || "");
  params.append(ENTRIES.nickname,             enrollee.nickname     || "");
  params.append(ENTRIES.birthYear,            enrollee.birthYear    || "");
  params.append(ENTRIES.birthMonth,           enrollee.birthMonth   || "");
  params.append(ENTRIES.birthDay,             enrollee.birthDay     || "");
  params.append(ENTRIES.gender,               enrollee.gender       || "");
  params.append(ENTRIES.civilStatus,          enrollee.civilStatus  || "");
  params.append(ENTRIES.nationality,          enrollee.nationality  || "");
  params.append(ENTRIES.philHealth,           enrollee.philHealth   || "");
  params.append(ENTRIES.philHealthId,         enrollee.philHealthId || "");
  params.append(ENTRIES.phone,                enrollee.phone        || "");
  params.append(ENTRIES.department,           enrollee.department   || "");
  params.append(ENTRIES.designation,          enrollee.designation  || "");
  params.append(ENTRIES.employmentDate_year,  empDate.year);
  params.append(ENTRIES.employmentDate_month, empDate.month);
  params.append(ENTRIES.employmentDate_day,   empDate.day);
  params.append(ENTRIES.plan,                 enrollee.plan         || "");
  params.append(ENTRIES.memberType,           enrollee.memberType   || "");
  params.append(ENTRIES.idName,               enrollee.idName       || "");
  params.append(ENTRIES.activationDate_year,  actDate.year);
  params.append(ENTRIES.activationDate_month, actDate.month);
  params.append(ENTRIES.activationDate_day,   actDate.day);
  params.append(ENTRIES.email,                enrollee.email        || "");
  params.append(ENTRIES.expirationDate_year,  expDate.year);
  params.append(ENTRIES.expirationDate_month, expDate.month);
  params.append(ENTRIES.expirationDate_day,   expDate.day);
  params.append(ENTRIES.remarks,              enrollee.remarks      || "");
  params.append(ENTRIES.amaPhilId,            enrollee.amaPhilId    || "");

  return params;
}

// ── Extract DOM → array ──────────────────────────────────────────────
function extractGroupEnrollmentData() {
  const rows = document.querySelectorAll('#enrollee-tbody tr[data-erow]');
  const enrollees = [];

  rows.forEach((tr, index) => {
    const inputs = tr.querySelectorAll('.cell-inp');
    enrollees.push({
      no:             index + 1,
      empId:          inputs[0].value.trim(),
      lastName:       inputs[1].value.trim(),
      firstName:      inputs[2].value.trim(),
      middleName:     inputs[3].value.trim(),
      suffix:         inputs[4].value,
      nickname:       inputs[5].value.trim(),
      birthYear:      inputs[6].value.trim(),
      birthMonth:     inputs[7].value,
      birthDay:       inputs[8].value,
      gender:         inputs[9].value,
      civilStatus:    inputs[10].value,
      nationality:    inputs[11].value.trim(),
      philHealth:     inputs[12].value,
      philHealthId:   inputs[13].value.trim(),
      phone:          inputs[14].value.trim(),
      department:     inputs[15].value.trim(),
      designation:    inputs[16].value,
      employmentDate: inputs[17].value,
      plan:           inputs[18].value.trim(),
      memberType:     inputs[19].value,
      idName:         inputs[20].value.trim(),
      activationDate: inputs[21].value,
      email:          inputs[22].value.trim(),
      expirationDate: inputs[23].value,
      remarks:        inputs[24].value.trim(),
      amaPhilId:      inputs[25].value.trim(),
    });
  });

  // ⚠️  localStorage is NOT available in Claude artifacts but works in your
  //     own hosted environment — keep this for local use only
  localStorage.setItem("enrollees", JSON.stringify(enrollees));
  return enrollees;   // always return so callers can use the data directly
}

// ── Send ONE enrollee to Google Forms ───────────────────────────────
async function sendSingleEnrollee(enrollee) {
  const params = buildFormParams(enrollee);

  // Google Forms blocks fetch() with CORS — no-cors lets the request
  // through but you won't get a readable response (that's expected)
  await fetch(FORM_URL, {
    method: "POST",
    mode:   "no-cors",               // required for Google Forms
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:   params.toString(),
  });
}

// ── Send ALL enrollees, one at a time ───────────────────────────────
async function sendAllEnrollees(enrollees) {
  const btn     = document.getElementById("gmail");
  const results = { success: 0, failed: [] };

  // Disable button + show progress while submitting
  btn.disabled     = true;
  btn.innerHTML    = `<i class="fa fa-spinner fa-spin me-1"></i> Submitting…`;

  for (const enrollee of enrollees) {
    try {
      await sendSingleEnrollee(enrollee);
      results.success++;
    } catch (err) {
      console.error(`Failed for row ${enrollee.no}:`, err);
      results.failed.push(enrollee.no);
    }
  }

  // Restore button
  btn.disabled  = false;
  btn.innerHTML = `<i class="fa fa-paper-plane me-1"></i> Submit to Google Forms`;

  return results;
}

// ── Main submit handler ──────────────────────────────────────────────
async function submitToGoogleForms() {
  // 1. Pull data straight from the DOM (source of truth)
  const enrollees = extractGroupEnrollmentData();

  if (enrollees.length === 0) {
    alert("No enrollees found. Please add at least one row.");
    return;
  }

  const confirmed = confirm(
    `You are about to submit ${enrollees.length} enrollee(s) to Google Forms.\n\nContinue?`
  );
  if (!confirmed) return;

  // 2. Send each row as a separate form response
  const results = await sendAllEnrollees(enrollees);

  // 3. Report outcome
  if (results.failed.length === 0) {
    alert(`✅ All ${results.success} enrollee(s) submitted successfully!`);
  } else {
    alert(
      `⚠️ Submitted: ${results.success}\n` +
      `Failed rows: ${results.failed.join(", ")}\n\n` +
      "Please retry the failed rows."
    );
  }
}

// ── Wire up the button ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("gmail");
  if (btn) {
    btn.addEventListener("click", submitToGoogleForms);
  } else {
    console.warn('groupEnrollment.js: No element with id="gmail" found.');
  }
});