/**
 * group-enroll.js
 * ───────────────────────────────────────────────────────────────
 * Handles Group enrollment table → Google Form submission.
 *
 * HOW TO SET UP YOUR GOOGLE FORM
 * ────────────────────────────────
 * 1. Create a Google Form with one question per field below.
 * 2. Publish the form, open the pre-filled link, fill one value
 *    in each field, copy the URL — each param is "entry.XXXXXXX".
 * 3. Paste every entry ID into GROUP_FORM_CONFIG.fields below.
 * 4. Set GROUP_FORM_CONFIG.url to your form's /formResponse URL.
 *
 * COLUMN ORDER in the enrollment table (left → right):
 *  0  #  (row number — skipped)
 *  1  Employee ID        (optional)
 *  2  Last Name          (required)
 *  3  Given Name         (required)
 *  4  Middle Name        (optional)
 *  5  Suffix             (optional)
 *  6  Nickname           (optional)
 *  7  Birth Year         (required)
 *  8  Birth Month        (required)
 *  9  Birth Day          (required)a
 * 10  Gender             (required)
 * 11  Civil Status       (required)
 * 12  Nationality        (required)
 * 13  PhilHealth         (required)  — Yes / No
 * 14  PhilHealth ID      (required)
 * 15  Phone Number       (required)
 * 16  Department         (optional)
 * 17  Resignation        (required)
 * 18  Employment Date    (required)
 * 19  Plan               (required)
 * 20  Member Type        (required)  — Principal / Dependent
 * 21  ID Name            (dependent-only, optional for Principal)
 * 22  Activation Date    (optional)
 * 23  Email              (required)
 * 24  Expiration Date    (optional)
 * 25  Remarks            (optional)
 * 26  AMAPHIL ID         (optional)
 * 27  Delete btn         (skipped)
 * ───────────────────────────────────────────────────────────────
 */
// ══════════════════════════════════════════════════════════════
//  CONFIGURATION  ← fill in your real entry IDs & form URL
// ══════════════════════════════════════════════════════════════
const GROUP_FORM_CONFIG = {
  /**
   * Your Google Form's formResponse endpoint.
   * Example:
   *   "https://docs.google.com/forms/u/0/d/e/1FAIpQLSXXXXXX/formResponse"
   */
  url: "https://docs.google.com/forms/u/5/d/e/1FAIpQLSeiNAHp9jUA299kf-hRvvNh2_UO7p2jhV-lfipSqb9G2i5bQQ/formResponse?",

  fields: {
    // ── Identity ──────────────────────────────────────────────
    employeeId:       "entry.566583630",   // Employee ID (optional)
    lastName:         "entry.2104810968",   // Last Name
    givenName:        "entry.61662416",   // Given Name
    middleName:       "entry.1344256124",   // Middle Name (optional)
    suffix:           "entry.1594710087",   // Suffix (optional)
    nickname:         "entry.545619272",   // Nickname (optional)

    // ── Birthdate (three separate fields) ─────────────────────
    birthYear:        "entry.148491576",   // Birth Year
    birthMonth:       "entry.2009841461",   // Birth Month
    birthDay:         "entry.1974754067",   // Birth Day

    // ── Personal info ─────────────────────────────────────────
    gender:           "entry.1287314341",   // Gender
    civilStatus:      "entry.1672467287",   // Civil Status
    nationality:      "entry.780917338",   // Nationality
    philhealth:       "entry.394490036",   // PhilHealth (Yes/No)
    philhealthId:     "entry.1451559032",   // PhilHealth ID
    phoneNumber:      "entry.1477993387",   // Phone Number

    // ── Employment ────────────────────────────────────────────
    department:       "entry.268001845",   // Department (optional)
    designation:      "entry.8030478",   // Resignation status
    employmentDate:   "entry.909570184",   // Employment Date

    // ── Plan & membership ─────────────────────────────────────
    plan:             "entry.1673750224",   // Plan name
    memberType:       "entry.174718140",   // Principal / Dependent
    idName:           "entry.1636130502",   // ID Name (dependent only)
    // activationDate:   "entry.1926969263",   // Activation Date (optional)
    email:            "entry.928296627",   // Email
    // expirationDate:   "entry.634119965",   // Expiration Date (optional)
    remarks:          "entry.334521893",   // Remarks (optional)
    amaphilId:        "entry.1182240530",   // AMAPHIL ID (optional)

    //activation date 
    activationDate_year:   "entry.1926969263_year",//year
    activationDate_month:   "entry.1926969263_month",//month 
    activationDate_day:   "entry.1926969263_day",//day 

    //expiration date
    expirationDate_year:   "entry.634119965_year",//year
    expirationDate_month:   "entry.634119965_month",//month 
    expirationDate_day:   "entry.634119965_day",//day\

    //employmentDate
    employmentDate_year:   "entry.909570184_year",//year
    employmentDate_month:   "entry.909570184_month",//month
    employmentDate_day:   "entry.909570184_day",//day
  }
};


// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Read all cell inputs from a table row in column order.
 * Returns an array of trimmed string values (index 0 = row number cell,
 * index 1 = Employee ID, …, index 27 = delete button — skip those).
 */


/**
 * Map a row's cell values to a named data object.
 * Index positions match the column order documented at the top of this file.
 */
function rowToData(tr) {
  const v = extractRowValues(tr);
  //                          col index ↓
  return {
    employeeId:     v[1]  || '',   // optional
    lastName:       v[2]  || '',
    givenName:      v[3]  || '',
    middleName:     v[4]  || '',   // optional
    suffix:         v[5]  || '',   // optional
    nickname:       v[6]  || '',   // optional
    birthYear:      v[7]  || '',
    birthMonth:     v[8]  || '',
    birthDay:       v[9]  || '',
    gender:         v[10] || '',
    civilStatus:    v[11] || '',
    nationality:    v[12] || '',
    philhealth:     v[13] || '',
    philhealthId:   v[14] || '',
    phoneNumber:    v[15] || '',
    department:     v[16] || '',   // optional
    designation:    v[17] || '',
    employmentDate: v[18] || '',
    plan:           v[19] || '',
    memberType:     v[20] || '',
    idName:         v[21] || '',   // dependent-only; blank for Principal
    activationDate: v[22] || '',   // optional
    email:          v[23] || '',
    expirationDate: v[24] || '',   // optional
    remarks:        v[25] || '',   // optional
    amaphilId:      v[26] || '',   // optional
  };
}

/**
 * Build URLSearchParams from one enrollee's data object
 * and the shared plan/payment info.
 */
function buildParams(enrolleeData, planInfo) {
  const f = GROUP_FORM_CONFIG.fields;
  const params = new URLSearchParams();

  const mapping = {

    [f.employeeId]:     enrolleeData.employeeId,
    [f.lastName]:       enrolleeData.lastName,
    [f.givenName]:      enrolleeData.givenName,
    [f.middleName]:     enrolleeData.middleName,
    [f.suffix]:         enrolleeData.suffix,
    [f.nickname]:       enrolleeData.nickname,

    [f.birthYear]:      enrolleeData.birthYear,
    [f.birthMonth]:     enrolleeData.birthMonth,
    [f.birthDay]:       enrolleeData.birthDay,

    [f.gender]:         enrolleeData.gender,
    [f.civilStatus]:    enrolleeData.civilStatus,
    [f.nationality]:    enrolleeData.nationality,
    [f.philhealth]:     enrolleeData.philhealth,
    [f.philhealthId]:   enrolleeData.philhealthId,
    [f.phoneNumber]:    enrolleeData.phoneNumber,

    [f.department]:     enrolleeData.department,
    [f.designation]:    enrolleeData.designation,
    [f.employmentDate]: enrolleeData.employmentDate,

    [f.plan]:           enrolleeData.plan || planInfo.name || '',
    [f.memberType]:     enrolleeData.memberType,
    [f.idName]:         enrolleeData.idName,
    [f.activationDate]: enrolleeData.activationDate,
    [f.email]:          enrolleeData.email,
    [f.expirationDate]: enrolleeData.expirationDate,
    [f.remarks]:        enrolleeData.remarks,
    [f.amaphilId]:      enrolleeData.amaphilId,
  };

  for (const [key, value] of Object.entries(mapping)) {
    // Skip undefined keys (entry IDs not yet filled in) and null/undefined values
    if (key && key !== 'entry.XXXXXXXXXX' && value != null) {
      params.append(key, value);
    }
  }

  return params;
}

/**
 * POST one enrollee row to Google Forms (no-cors, fire-and-forget).
 */
async function submitSingleEnrollee(enrolleeData, planInfo) {
  const params = buildParams(enrolleeData, planInfo);

  await fetch(GROUP_FORM_CONFIG.url, {
    method: 'POST',
    mode:   'no-cors',
    body:   params,
  });
}


// ══════════════════════════════════════════════════════════════
//  VALIDATION
// ══════════════════════════════════════════════════════════════

/**
 * Highlights blank required cells in red.
 * Returns the first invalid element, or null if all valid.
 */
function validateEnrolleeTable() {
  const rows = document.querySelectorAll('#enrollee-tbody tr[data-erow]');
  let firstInvalid = null;

  rows.forEach(tr => {
    tr.querySelectorAll('[data-req="1"]').forEach(el => {
      el.style.borderColor = '';   // reset
      if (!el.value.trim()) {
        el.style.borderColor = 'var(--danger)';
        if (!firstInvalid) firstInvalid = el;
      }
    });
  });

  return firstInvalid;
}


// ══════════════════════════════════════════════════════════════
//  MAIN SUBMIT FUNCTION  (called by the Submit button)
// ══════════════════════════════════════════════════════════════

/**
 * submitGroupEnrollment()
 *
 * Called by the "Submit Enrollment" button's onclick in health-plans.html.
 * Validates, then sequentially POSTs every row to Google Forms.
 *
 * @param {Object} planInfo  — { name, period, price }  (from selectedGroupPlan)
 */
async function submitGroupEnrollment(planInfo) {
  const rows = document.querySelectorAll('#enrollee-tbody tr[data-erow]');

  // ── Guard: at least one row ────────────────────────────────
  if (rows.length === 0) {
    alert('Please add at least one enrollee before submitting.');
    return;
  }

  // ── Guard: validate required fields ───────────────────────
  const firstInvalid = validateEnrolleeTable();
  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid.focus();
    showToast('Please fill in all required fields (highlighted in red).', 'error');
    return;
  }

  // ── Guard: form URL configured ────────────────────────────
  if (!GROUP_FORM_CONFIG.url || !GROUP_FORM_CONFIG.url.includes("formResponse")) {
  alert('Invalid Google Form URL.');
  return;
}

  // ── Lock the submit button ─────────────────────────────────
  const submitBtn = document.getElementById('group-submit-btn');
  const originalBtnHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-1"></i>Submitting…';

  // ── Submit all rows sequentially ──────────────────────────
  let successCount = 0;
  let failCount    = 0;

  for (const tr of rows) {
    try {
      const enrolleeData = rowToData(tr);
      await submitSingleEnrollee(enrolleeData, planInfo || {});
      successCount++;
    } catch (err) {
      failCount++;
      console.error('Failed to submit row:', err);
    }
  }

  // ── Restore button ─────────────────────────────────────────
  submitBtn.disabled  = false;
  submitBtn.innerHTML = originalBtnHtml;

  // ── Feedback ───────────────────────────────────────────────
  if (failCount === 0) {
    showToast(
      `✓ Enrollment submitted! ${successCount} enrollee${successCount > 1 ? 's' : ''} recorded successfully.`,
      'success'
    );
    // Optional: close modal after success
    // bootstrap.Modal.getInstance(document.getElementById('groupEnrollModal'))?.hide();
  } else {
    showToast(
      `⚠ ${successCount} submitted, ${failCount} failed. Check console for details.`,
      'warning'
    );
  }
}


// ══════════════════════════════════════════════════════════════
//  TOAST NOTIFICATION  (styled to match AMAPHIL theme)
// ══════════════════════════════════════════════════════════════

function showToast(message, type = 'success') {
  // Remove any existing toast
  document.getElementById('group-enroll-toast')?.remove();

  const colors = {
    success: { bg: '#1a3260', border: '#f47920', icon: 'fa-circle-check',    iconColor: '#f47920' },
    error:   { bg: '#7a1a1a', border: '#e05252', icon: 'fa-circle-exclamation', iconColor: '#e05252' },
    warning: { bg: '#3d2a0f', border: '#f47920', icon: 'fa-triangle-exclamation', iconColor: '#f9a845' },
  };
  const c = colors[type] || colors.success;

  const toast = document.createElement('div');
  toast.id = 'group-enroll-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 99999;
    background: ${c.bg};
    border: 1.5px solid ${c.border};
    border-radius: 14px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    max-width: 380px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  `;
  toast.innerHTML = `
    <i class="fa ${c.icon}" style="color:${c.iconColor};font-size:1.1rem;flex-shrink:0;"></i>
    <span style="color:white;font-size:0.88rem;line-height:1.4;">${message}</span>
    <button onclick="this.closest('#group-enroll-toast').remove()"
      style="background:none;border:none;color:rgba(255,255,255,0.5);font-size:1rem;cursor:pointer;margin-left:auto;padding:0 0 0 8px;line-height:1;">✕</button>
  `;

  // Inject keyframe if not already present
  if (!document.getElementById('toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = `
      @keyframes toastIn {
        from { opacity:0; transform:translateY(16px) scale(0.95); }
        to   { opacity:1; transform:translateY(0)    scale(1); }
      }
    `;
    document.head.appendChild(s);
  }

  document.body.appendChild(toast);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s, transform 0.4s';
    toast.style.opacity    = '0';
    toast.style.transform  = 'translateY(8px)';
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}


// ══════════════════════════════════════════════════════════════
//  EXPORTS  (used by health-plans.html inline script)
// ══════════════════════════════════════════════════════════════
// These are exposed as globals because health-plans.html loads
// this file with a plain <script src="...">, not as ES module.
window.submitGroupEnrollment = submitGroupEnrollment;
window.showToast             = showToast;



