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
      resignation:    inputs[16].value,
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
  
}

async function sendData(){
  try {
    
  } catch (error) {
    console.log(error)
  }
}

if(enrollees != null){
  button = button.addEventListener('click', {
    
  });
}

