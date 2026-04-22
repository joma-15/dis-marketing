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
  console.log('the button was being clicked');
  console.log(enrollees);
  localStorage.setItem("enrollees", JSON.stringify(enrollees));
}

const button = document.getElementById("gmail"); 
const enrollees = JSON.parse(localStorage.getItem(enrollees)); 

const entries = {
      empId:          "entry.566583630"||"null",
      lastName:       "entry.2104810968",
      firstName:      "entry.61662416",
      middleName:     "entry.1344256124"||"null",
      suffix:         "entry.1594710087"||"null",
      nickname:       "entry.545619272",
      birthYear:      "entry.148491576",
      birthMonth:     "entry.2009841461",
      birthDay:       "entry.1974754067",
      gender:         "entry.1287314341",
      civilStatus:    "entry.1672467287",
      nationality:    "entry.780917338",
      philHealth:     "entry.394490036"||"null",
      philHealthId:   "entry.1451559032"||"null",
      phone:          "entry.1477993387",
      department:     "entry.268001845"||"null",
      designation:    "entry.8030478"||"null",
      employmentDate_year: "entry.909570184_year",
      employmentDate_month: "entry.909570184_month",
      employmentDate_day: "entry.909570184_day",
      plan:           "entry.1673750224",
      memberType:     "entry.174718140",
      idName:         "entry.1636130502"||"null",
      activationDate_year: "entry.1926969263_year"||"null",
      activationDate_month: "entry.1926969263_month"||"null",
      activationDate_day: "entry.1926969263_day"||"null",
      email:          "entry.928296627",
      expirationDate_year: "entry.634119965_year"||"null",
      expirationDate_month: "entry.634119965_month"||"null",
      expirationDate_day: "entry.634119965_day"||"null",
      remarks:        "entry.334521893"||"null",
      amaPhilId:      "entry.1182240530"||"null",
}

async function sendData(){
  try {
    const reponse = await fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSeiNAHp9jUA299kf-hRvvNh2_UO7p2jhV-lfipSqb9G2i5bQQ/formResponse");
    
  } catch (error) {
    console.log(error)
  }
}

if(enrollees != null){
  button = button.addEventListener('click', {
    
  });
}

