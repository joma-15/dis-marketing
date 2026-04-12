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
 *  9  Birth Day          (required)
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
  url: "PASTE_YOUR_FORM_RESPONSE_URL_HERE",

  fields: {
    // ── Identity ──────────────────────────────────────────────
    employeeId:       "entry.XXXXXXXXXX",   // Employee ID (optional)
    lastName:         "entry.XXXXXXXXXX",   // Last Name
    givenName:        "entry.XXXXXXXXXX",   // Given Name
    middleName:       "entry.XXXXXXXXXX",   // Middle Name (optional)
    suffix:           "entry.XXXXXXXXXX",   // Suffix (optional)
    nickname:         "entry.XXXXXXXXXX",   // Nickname (optional)

    // ── Birthdate (three separate fields) ─────────────────────
    birthYear:        "entry.XXXXXXXXXX",   // Birth Year
    birthMonth:       "entry.XXXXXXXXXX",   // Birth Month
    birthDay:         "entry.XXXXXXXXXX",   // Birth Day

    // ── Personal info ─────────────────────────────────────────
    gender:           "entry.XXXXXXXXXX",   // Gender
    civilStatus:      "entry.XXXXXXXXXX",   // Civil Status
    nationality:      "entry.XXXXXXXXXX",   // Nationality
    philhealth:       "entry.XXXXXXXXXX",   // PhilHealth (Yes/No)
    philhealthId:     "entry.XXXXXXXXXX",   // PhilHealth ID
    phoneNumber:      "entry.XXXXXXXXXX",   // Phone Number

    // ── Employment ────────────────────────────────────────────
    department:       "entry.XXXXXXXXXX",   // Department (optional)
    resignation:      "entry.XXXXXXXXXX",   // Resignation status
    employmentDate:   "entry.XXXXXXXXXX",   // Employment Date

    // ── Plan & membership ─────────────────────────────────────
    plan:             "entry.XXXXXXXXXX",   // Plan name
    memberType:       "entry.XXXXXXXXXX",   // Principal / Dependent
    idName:           "entry.XXXXXXXXXX",   // ID Name (dependent only)
    activationDate:   "entry.XXXXXXXXXX",   // Activation Date (optional)
    email:            "entry.XXXXXXXXXX",   // Email
    expirationDate:   "entry.XXXXXXXXXX",   // Expiration Date (optional)
    remarks:          "entry.XXXXXXXXXX",   // Remarks (optional)
    amaphilId:        "entry.XXXXXXXXXX",   // AMAPHIL ID (optional)

    // ── Auto-filled by the system ─────────────────────────────
    // planType:         "entry.XXXXXXXXXX",   // "Group" — set automatically
    // status:           "entry.XXXXXXXXXX",   // "Pending" — set automatically
    // paymentPeriod:    "entry.XXXXXXXXXX",   // e.g. "Quarterly" — from plan selection
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
function extractRowValues(tr) {
  const cells = tr.querySelectorAll('td');
  return Array.from(cells).map(td => {
    const inp = td.querySelector('input, select, textarea');
    return inp ? inp.value.trim() : '';
  });
}

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
    resignation:    v[17] || '',
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
    // [f.planType]:       'Group',
    // [f.status]:         'Pending',
    // [f.paymentPeriod]:  planInfo.period || '',

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
    [f.resignation]:    enrolleeData.resignation,
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
  if (GROUP_FORM_CONFIG.url === 'PASTE_YOUR_FORM_RESPONSE_URL_HERE') {
    alert('Google Form URL is not configured yet.\nOpen group-enroll.js and set GROUP_FORM_CONFIG.url.');
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