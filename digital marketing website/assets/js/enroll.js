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

    if (localStorage.getItem("planType")) {
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
      referral,
    };
    //localstorage for persistent data
    localStorage.setItem("data", JSON.stringify(data));
    window.location.href = "payment.html";
  });
}
document.addEventListener("DOMContentLoaded", extractData);

async function sendIntoExcel(data) {
  const formUrl =
    // "https://docs.google.com/forms/d/e/1FAIpQLScVcBDaGA9Rj93kd6K0GzDkm9ymkbz-rLjOKpFqE6DAzdKE1w/formResponse";
    "https://docs.google.com/forms/d/e/1FAIpQLScQmnDQfzBud88VDwXSRxZb_Kj3Qeh0WVpCnv297P4I0QkJHg/formResponse";
  const params = new URLSearchParams();

  const formFields = {
    "entry.807207221": localStorage.getItem("PlanType") || "no selected plan",
    "entry.1368872495": data.fullName,
    "entry.265391803": data.address,
    "entry.21286280": data.email,
    "entry.914829469": data.gender,
    "entry.1102795712": data.civilStatus,
    "entry.962982325": data.condition,
    "entry.354268935": data.plan,
    "entry.277015241_year": data.birthDate.year,
    "entry.277015241_month": data.birthDate.month,
    "entry.277015241_day": data.birthDate.day,
    "entry.597664781": "Pending",
    "entry.118563215": data.referral,
  };

  for (const [key, value] of Object.entries(formFields)) {
    params.append(key, value);
  }

  if (!data) return false;

  try {
    const response = await fetch(formUrl, {
      method: "POST",
      mode: "no-cors",
      body: params,
    });
    console.log(response);
  } catch (error) {
    alert("an error occured sending the data");
    console.error("An error occured " + error);
  }
}

//send the data to the database and gmail
async function sendData() {
  const btn = document.getElementById("gmail");

  btn.addEventListener("click", async () => {
    const data = JSON.parse(localStorage.getItem("data"));
    console.log("the fuckin function is being triggered");

    if (!data) {
      console.log("the data was missing");
    }
    console.log(JSON.stringify(data));
    await sendIntoExcel(data);
    sendProofPaymentGmail();
  });
}
document.addEventListener("DOMContentLoaded", sendData);
