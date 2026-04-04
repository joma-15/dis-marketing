function getAllDependents() {
  const dependents = [];

  for (let i = 1; i <= dependentCount; i++) {
    const block = document.getElementById(`dependent-${i}`);
    if (!block) continue; // block removed, skip entirely

    const lastEl  = document.getElementById(`dep${i}_last`);
    const firstEl = document.getElementById(`dep${i}_first`);
    const miEl    = document.getElementById(`dep${i}_mi`);
    const bdayEl  = document.getElementById(`dep${i}_bday`);
    const relEl   = document.getElementById(`dep${i}_rel`);

    // Guard: skip if any required field is missing from DOM
    if (!lastEl || !firstEl || !bdayEl || !relEl) continue;

    const bday   = bdayEl.value;
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
  // localStorage.setItem("dependentsData", JSON.stringify(dependents));
  return dependents;
}

// document.getElementById('user-info')?.addEventListener('click', getAllDependents);

// document.addEventListener("DOMContentLoaded", () => {
//     const path = window.location.pathname;

//     if(path == "/payment.html"){
//       console.log("dependents data was being triggered");
//       console.log(JSON.parse(localStorage.getItem("dependentsData")));
//     }
//     console.log(window.location.pathname);
// });

function PlanChoose() {
  const btn = document.getElementById("planChoose-btn"); // get the button

  btn.addEventListener("click", () => {
    console.log("the plan choose function is being triggered");

    // extract the plan
    const selectedPlan = document.querySelector(
      'input[name="planType"]:checked'
    ).value;

    if (!selectedPlan) {
      alert("please select a plan");
    }
    console.log(selectedPlan);
    localStorage.setItem("PlanType", selectedPlan);

    if (localStorage.getItem("PlanType")) {
      window.location.href = "Plans.html";
    }
  });
}
document.addEventListener("DOMContentLoaded", PlanChoose);

//check if the user have condition
function checkedConditions() {
  const checkboxes = document.querySelectorAll(
    "#conditionChecklist input[type='checkbox']"
  );

  for (const checkbox of checkboxes) {
    if (checkbox.checked) {
      return "Have Condition";
    }
  }
  return "No Condition";
}

//extract user information from the modal
  function extractData() {
    const btn = document.getElementById("user-info");
    console.log(btn);

    btn.addEventListener("click", () => {
      console.log("the data submission is currently loading");

      const lastName = document.getElementById("LastName")?.value.trim();
      const firstName = document.getElementById("FirstName")?.value.trim();
      const middleName = document.getElementById("MiddleName")?.value.trim();
      const birthDate = document.getElementById("bday")?.value;
      const address = document.getElementById("address")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const gender = document.querySelector(
        'input[name="gender"]:checked'
      )?.value;
      const civilStatus = document.getElementById("civil-status")?.value;
      const payment = document.getElementById("payment-option")
      .options[document.getElementById("payment-option").selectedIndex].text;
      let plan =
        document.querySelector(".card-title")?.innerText.trim() ?? "50K Plan";
      const condition = checkedConditions();
      const referral =
        document.getElementById("referredBy").value.trim() || "DIS";

      if (
        !lastName ||
        !firstName ||
        !middleName ||
        !birthDate ||
        !address ||
        !email ||
        !gender ||
        !civilStatus 
      ) {
        alert("Please complete all fields");
        return null;
      }

      // Parse the birth date
      const dateObj = new Date(birthDate);
      if (isNaN(dateObj.getTime())) {
        alert("Invalid date format");
        return null;
      }

      const data = {
        fullName: `${lastName} ${firstName} ${middleName}`,
        birthDate: {
          year: dateObj.getFullYear(),
          month: dateObj.getMonth() + 1, // Months are 0-indexed
          day: dateObj.getDate(),
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
      //localstorage for persistent data
      localStorage.setItem("data", JSON.stringify(data));
      let dependents = {};

      const form = localStorage.getItem("selectedForm"); 
      if(form == "amaphilshop"){
        dependents = getAllDependents();
        if (!dependents) return; // stop if invalid
      }

      localStorage.setItem("dependentsData", JSON.stringify(dependents));
      window.location.href = "payment.html";
    });
  }
  document.addEventListener("DOMContentLoaded", extractData);
  
  //destination on where to sent the google form data
  // let formlink;
  // //entries where to put the data
  // let planTypeEntry;
  // let fullNameEntry;
  // let addressEntry;
  // let emailEntry;
  // let genderEntry;
  // let civilStatusEntry;
  // let conditionEntry;
  // let planEntry;
  // let birthyearEntry;
  // let birthmonthEntry;
  // let birthdayEntry;
  // let statusEntry;
  // let paymentEntry;
  // let referralEntry;

  // if(window.location.pathname.i ncludes("shop.html")){
  //   formlink = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSd6k9TCCfsDvQI84QmtORnyEraWW4PwUFRihlvgfxfHLJ0xgw/formResponse";
  // }

  // if(window.location.pathname.includes("amaphiltools.html")){
  //   formlink = "https://docs.google.com/forms/u/0/d/e/1FAIpQLScM7WdNo77mVF0Ov40fKqMRi-xerTSFp8WRB6DEl8oYAwPACA/formResponse";
  // }

  const formsConfig = {
  "shop.html": {
    url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSd6k9TCCfsDvQI84QmtORnyEraWW4PwUFRihlvgfxfHLJ0xgw/formResponse",
    fields: {
      planType: "entry.307150928",
      fullName: "entry.598676198",
      address: "entry.233583999",
      email: "entry.692955566",
      gender: "entry.2097655811",
      civilStatus: "entry.814261707",
      condition: "entry.1339191093",
      plan: "entry.89154130",
      birthYear: "entry.1292583609_year",
      birthMonth: "entry.1292583609_month",
      birthDay: "entry.1292583609_day",
      status: "entry.1819469267",
      payment: "entry.322952436",
      referral: "entry.684880416",
    }
  },

  "amaphilshop.html": {
    url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLScM7WdNo77mVF0Ov40fKqMRi-xerTSFp8WRB6DEl8oYAwPACA/formResponse",
    fields: {
      planType: "entry.1182148951",
      fullName: "entry.1766981923",
      address: "entry.1791205225",
      email: "entry.1496075633",
      gender: "entry.1392159046",
      civilStatus: "entry.998531261",
      condition: "entry.1673739680",
      plan: "entry.960401984",
      birthYear: "entry.1357420546_year",
      birthMonth: "entry.1357420546_month",
      birthDay: "entry.1357420546_day",
      status: "entry.1843997625",
      payment: "entry.231346316",
      PrincipalDependent : "entry.1647194468",
      relationship : "entry.60456725",
      referral: "entry.1754101156",
    }
  }
};

const selectedForm = localStorage.getItem("selectedForm");

// map to your config keys
const pageKey = selectedForm + ".html";

const link = formsConfig[pageKey]?.url;
const fields = formsConfig[pageKey]?.fields;

async function sendIntoExcel(data) {
  if (!data) return;
  if (!link || !fields) {
    console.error("No form config found for this page");
    return;
  }

  const params = new URLSearchParams();

  const formFields = {
    [fields.planType]: localStorage.getItem("PlanType") || "no selected plan",
    [fields.fullName]: data.fullName,
    [fields.address]: data.address,
    [fields.email]: data.email,
    [fields.gender]: data.gender,
    [fields.civilStatus]: data.civilStatus,
    [fields.condition]: data.condition,
    [fields.plan]: data.plan,
    [fields.birthYear]: data.birthDate.year,
    [fields.birthMonth]: data.birthDate.month,
    [fields.birthDay]: data.birthDate.day,
    [fields.status]: "Pending",
    [fields.payment]: data.payment,
    [fields.referral]: data.referral,
    [fields.PrincipalDependent]: "Principal",
    [fields.relationship]: "Principal Applicant",
  };

  for (const [key, value] of Object.entries(formFields)) {
    if (key) params.append(key, value); // avoid undefined keys
  }

  try {
    await fetch(link, {
      method: "POST",
      mode: "no-cors",
      body: params,
    });
  } catch (error) {
    alert("An error occurred sending the data");
    console.error(error);
  }
}


//sending dependents data 
async function sendDependentsData(data) {
  const dependentsData = JSON.parse(localStorage.getItem("dependentsData"));
  if (!dependentsData) return;

  for (const dependent of Object.values(dependentsData)) {
    if (!dependent) continue; // skip null/empty entries

    const params = new URLSearchParams();

    const formFields = {
      [fields.planType]: localStorage.getItem("PlanType") || "no selected plan",
      [fields.fullName]: dependent.fullName,
      [fields.address]: data.address,
      [fields.email]: data.email,
      [fields.gender]: dependent.gender,
      [fields.civilStatus]: 'n/a',
      [fields.condition]: 'n/a',
      [fields.plan]: data.plan,
      [fields.birthYear]: dependent.birthDate?.year,
      [fields.birthMonth]: dependent.birthDate?.month,
      [fields.birthDay]: dependent.birthDate?.day,
      [fields.status]: "Pending",
      [fields.payment]: data.payment,
      [fields.PrincipalDependent]: "Dependent",
      [fields.referral]: data.referral,
      [fields.relationship]: dependent.rel,
    };

    for (const [key, value] of Object.entries(formFields)) {
      if (key && value != null) {
        params.append(key, value);
      }
    }

    try {
      await fetch(link, {
        method: "POST",
        mode: "no-cors",
        body: params,
      });
    } catch (error) {
      console.error("Error sending dependent:", error);
    }
  }
}

//send the data to the database and gmail
async function sendData() {
  const btn = document.getElementById("gmail");

  btn.addEventListener("click", async () => {
    const data = JSON.parse(localStorage.getItem("data"));
    const dependents = JSON.parse(localStorage.getItem("dependentsData"));
    console.log("the function is being triggered");

    if (!data) {
      console.log("the data was missing");
    }
    console.log(JSON.stringify(data));
    await sendIntoExcel(data);

    console.log("the data was being sent to the database");

    //send the dependent data if in family 
    const isFamily = localStorage.getItem("PlanType") == "Family";

    if(selectedForm === "amaphilshop" && isFamily){
      await sendDependentsData(data);
    }

    sendProofPaymentGmail();
  });
}
document.addEventListener("DOMContentLoaded", sendData);
