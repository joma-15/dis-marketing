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
      window.location.href = "payment.html";
    });
  }
  document.addEventListener("DOMContentLoaded", extractData);
  
  //destination on where to sent the google form data
  let formlink;
  if(window.location.pathname == "/shop.html"){ 
    formlink = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSd6k9TCCfsDvQI84QmtORnyEraWW4PwUFRihlvgfxfHLJ0xgw/formResponse";
  }

  if(window.location.pathname == "/amaphilshop.html"){
    formlink
  }

  async function sendIntoExcel(data) {
    const formUrl = formlink;
      // "https://docs.google.com/forms/d/e/1FAIpQLScQmnDQfzBud88VDwXSRxZb_Kj3Qeh0WVpCnv297P4I0QkJHg/formResponse";
      // "https://docs.google.com/forms/u/0/d/e/1FAIpQLSd6k9TCCfsDvQI84QmtORnyEraWW4PwUFRihlvgfxfHLJ0xgw/formResponse";
    const params = new URLSearchParams();

    const formFields = {
      "entry.307150928": localStorage.getItem("PlanType") || "no selected plan",
      "entry.598676198": data.fullName, //ok na 
      "entry.233583999": data.address, //ok na
      "entry.692955566": data.email, //ok na
      "entry.2097655811": data.gender, //ok na
      "entry.814261707": data.civilStatus, //ok na
      "entry.1339191093": data.condition, //ok na
      "entry.89154130": data.plan, //ok na
      "entry.1292583609_year": data.birthDate.year,//ok na
      "entry.1292583609_month": data.birthDate.month,//ok na
      "entry.1292583609_day": data.birthDate.day,//ok na
      "entry.1819469267": "Pending",//ok na
      "entry.322952436": data.payment, //ok na
      "entry.684880416": data.referral, //ok na
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
