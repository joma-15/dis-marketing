//direct the link depending on the selected value
function PlanChoose() {
  console.log("the planchoose function is being triggered");
  const selectedPlan = document.querySelector(
    'input[name="planType"]:checked'
  ).value;
  console.log(selectedPlan);
  localStorage.setItem("selectedPlan", selectedPlan);

  // if (selectedPlan == "Individual" || selectedPlan == "Family" || selectedPlan == "Senior") {
  //         window.location.href = "Plans.html"
  // }

  // if (selectedPlan == "Group") {
  //     const modal = new bootstrap.Modal(document.getElementById('group-modal'));
  //     modal.show();

  // }
  window.location.href = "Plans.html";
}

function openClientModal() {
  const groupModal = bootstrap.Modal.getInstance(
    document.getElementById("group-modal")
  );
  groupModal.hide();

  const clientDetailsModal = new bootstrap.Modal(
    document.getElementById("clientDetailsModal")
  );
  clientDetailsModal.show();
}

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

function extractData() {
  const lastName = document.getElementById("LastName")?.value.trim();
  const firstName = document.getElementById("FirstName")?.value.trim();
  const middleName = document.getElementById("MiddleName")?.value.trim();
  const birthDate = document.getElementById("bday")?.value;
  const address = document.getElementById("address")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  const civilStatus = document.getElementById("civil-status")?.value;
  let plan =
    document.querySelector(".card-title")?.innerText.trim() ?? "50K Plan";
  const condition = checkedConditions();

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

  return {
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
  };
}

function saveToLocalStorage(formdata) {
  console.log("the data has been saved to local storage");
  console.log(formdata);
  if (formdata) {
    localStorage.setItem("data", JSON.stringify(formdata));
    window.location.href = "payment.html"; //saved the data to this page
  } else {
    console.error(
      "An error has been occured while saving the data to the localstorage"
    );
  }
}

function getData() {
  console.log("get data function is being triggered");
  const formData = localStorage.getItem("data");
  // const selectedPlan = localStorage.getItem('selectedPlan');

  if (formData) {
    const parseData = JSON.parse(formData);
    console.log(parseData);
    // console.log(selectedPlan);
    localStorage.removeItem("data"); //clear the data after extracting
    // localStorage.removeItem(('selectedPlan'))

    return parseData;
  }
}

async function submitData(data) {
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScVcBDaGA9Rj93kd6K0GzDkm9ymkbz-rLjOKpFqE6DAzdKE1w/formResponse";
  const params = new URLSearchParams();

  // if (!data || !data.birthDate || !data.birthDate.year) {
  //   console.log('the birday year is missing try again');
  //   return;
  // }

  // Map your data to Google Form fields (verify these entry IDs)
  const formFields = {
    "entry.118683267": localStorage.getItem("selectedPlan"),
    "entry.328719651": data.fullName,
    "entry.1226942228_year": data.birthDate.year,
    "entry.1226942228_month": data.birthDate.month,
    "entry.1226942228_day": data.birthDate.day,
    "entry.1564645568": data.address,
    "entry.1830843199": data.email,
    "entry.113235889": data.gender,
    "entry.1003466199": data.civilStatus,
    "entry.526372370": data.condition,
    "entry.2137808509": data.plan,
    "entry.579757869": "Pending",
  };

  // //  Map your data to Google Form fields (verify these entry IDs)
  //     params.append('entry.118683267', "hello world");
  //     params.append('entry.328719651', data.fullName);         // Full name
  //     params.append('entry.1226942228_year', data.birthDate.year);  // Year
  //     params.append('entry.1226942228_month', data.birthDate.month); // Month
  //     params.append('entry.1226942228_day', data.birthDate.day);    // Day
  //     params.append('entry.1564645568', data.address);         // Address
  //     params.append('entry.1830843199', data.email);             // Email
  //     params.append('entry.113235889', data.gender);           // Gender
  //     params.append('entry.1003466199', data.civilStatus);     // Civil Status
  //     params.append('entry.579757869', "Pending");

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
    console.log("Data has been sent successfully");
  } catch (error) {
    alert("an error occured sending the data");
    console.error("An error occured " + error);
  }
}

//for form click
function saveOnClick() {
  const data = extractData();
  if (data) {
    saveToLocalStorage(data); //save the data to the local storage
  }
}

// const localStorageData = getData(); //get the data from the local storage
// if (localStorageData) {
//   submitData(localStorageData);//submit the data to the database
// }else{
//   console.warn('No data found in the local storage')
// }
//for payment click
// async function submitOnClick(event) {
//   console.log("the function is trigger");
//   event.preventDefault();

//   const localStorageData = getData(); //get the data from the local storage
//   if (localStorageData) {
//     await submitData(localStorageData);
//     alert("the data was submitted successfully");
//     console.log("the data has been sent to the database");
//     window.location.href = "index.html";
//   }
// }

document.getElementById("paymentForm").addEventListener("submit", submitOnClick); 

async function submitOnClick(event) {
  event.preventDefault();
  console.log("the function is triggered");

  // 1️⃣ Get localStorage data
  const localStorageData = getData();
  if (localStorageData) {
    await submitData(localStorageData);
    console.log("The form data has been sent to Google Form / DB");
  }

  // 2️⃣ Handle file upload
  const fileInput = document.getElementById("screenshot");
  const file = fileInput.files[0];

  if (file) {
    try {
      const formData = new FormData();
      formData.append("proofImage", file);

      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("The data was submitted successfully");
        window.location.href = "index.html";

        console.log("File uploaded:", res);
      }
    } catch (error) {
      console.log(error);
    }
  } 
}

  // async function submitProofOnclick(event){
  //   e.preventDefault(); 
  //   console.log('try to submit proof of payment to email'); 

  //   const fileInput = document.getElementById("screenshot"); 
  //   const file = fileInput.files[0]; 

  //   //check if file exist to the database
  //   if (file) {
  //     try {
  //     const formData = new FormData();
  //     formData.append("proofImage", file);

  //     const res = await fetch("http://localhost:3000/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (res.ok) {
  //       alert("The data was submitted successfully");
  //       window.location.href = "index.html";

  //       console.log("File uploaded:", res);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   }
  // }

  // 3️⃣ Redirect after success

//showpayment details
function showPaymentDetails() {
  const methods = document.querySelectorAll(".payment-info");
  methods.forEach((m) => (m.style.display = "none"));

  const selected = document.getElementById("paymentSelect").value;
  document.getElementById(selected).style.display = "block";
}

function copyText(text) {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard!");
}

window.showPaymentDetails = showPaymentDetails;
window.copyText = copyText;
window.submitOnClick = submitOnClick;

//for sending proof of payment to the gmail
// function sendProofPayment() {
//   const payment = document.getElementById("paymentForm");

//   payment.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const fileInput = document.getElementById("screenshot");
//     const file = fileInput.files[0];

//     const formData = new FormData();
//     formData.append("proofImage", file);

//     //send the file to the backend
//     const res = await fetch("http://localhost:3000/upload", {
//       method: "POST",
//       body: formData,
//     });

//     console.log("the data is being submitted : ", res);
//   });
// }w
