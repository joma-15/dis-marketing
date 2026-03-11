document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("submit");
//his
  button.addEventListener("click", async function (event) {
    event.preventDefault();
    console.log("the button was triggered");

    const loading = document.getElementById("loadingPopup");
    loading.style.display = "block"; // ✅ show instantly on click

    const fullname = document.getElementById("regName").value.trim();
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const confirmPass = document.getElementById("regConfirmPassword").value.trim();
    const referral = document.getElementById("regReferral").value.trim();
    const form = document.getElementById("registerForm");

    if (password !== confirmPass) {
      loading.style.display = "none";
      alert("Passwords must be the same");
      form.reset();
      return;
    }

    if (!fullname || !username || !password || !referral) {
      loading.style.display = "none";
      alert("⚠️ Please fill in all fields.");
      return;
    }

    const callbackName = "jsonpCallback_" + Date.now();

    window[callbackName] = function (data) {
      delete window[callbackName];
      document.body.removeChild(script);

      if (data.exists) {
        loading.style.display = "none";
        alert("❌ Password or referral code already exists. Please try again.");
        return;
      }

      const formUrl =
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSf4ILyBKJDLi1yHBwwQ8ZLbXYNgSmx9prgi-tqdRrvxSyn_mQ/formResponse";

      const params = new URLSearchParams();
      params.append("entry.1669826201", fullname);
      params.append("entry.305930707", username);
      params.append("entry.1025155675", password);
      params.append("entry.2067985687", referral);

      fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: params,
      })
        .then(() => {
          alert("✅ Registration successful!");
          form.reset();
          window.location.href = "agentlogin.html";
        })
        .catch((error) => {
          console.error("Submission error:", error);
          alert("⚠️ An error occurred while sending the data.");
        })
        .finally(() => {
          loading.style.display = "none";
        });
    };

    const script = document.createElement("script");
    script.src = `https://script.google.com/macros/s/AKfycbzB9F4g68ZKkWnEN1wXA4BBTFXztXssO-VwK3YH87vPlUK7piQkcQwJd58-TtpwRhCn/exec?action=checkDuplicates&password=${encodeURIComponent(
      password
    )}&referral=${encodeURIComponent(referral)}&callback=${callbackName}`;
    document.body.appendChild(script);
  });
});

async function loginUser(username, password) {
  const loading = document.getElementById("loadingPopup");
  loading.style.display = "block"; // ✅ show instantly

  try {
    const url = `https://script.google.com/macros/s/AKfycbzB9F4g68ZKkWnEN1wXA4BBTFXztXssO-VwK3YH87vPlUK7piQkcQwJd58-TtpwRhCn/exec?action=isAccountValid&username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`;

    console.log("🔗 Fetching URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      alert("Invalid username or password, please try again.");
      return null;
    }

    const data = await response.json();

    if (!data || !data.extraData) {
      alert("Incorrect username and password.");
      return null;
    }

    localStorage.setItem("referral", data.extraData);
    localStorage.setItem("username", username);

    window.location.href = "agentDashboard.html";

    return data.extraData;
  } catch (error) {
    console.error("🔥 Login error:", error);
    alert("Something went wrong. Please try again later.");
    return null;
  } finally {
    loading.style.display = "none"; // ✅ always hide at end
  }
}

const loginbutton = document.getElementById("submit-log");

if (loginbutton) {
  loginbutton.addEventListener("click", async (e) => {
    e.preventDefault();

    const loading = document.getElementById("loadingPopup");
    loading.style.display = "block"; // ✅ show instantly on click

    const username = document.getElementById("logUsername").value.trim();
    const password = document.getElementById("logPassword").value.trim();

    if (!username || !password) {
      loading.style.display = "none"; // hide immediately if invalid
      alert("Please enter both username and password.");
      return;
    }

    await loginUser(username, password);
  });
}

async function DisplayUserData() {
  const loading = document.getElementById("loadingPopup");
  loading.style.display = "block"; // ✅ show instantly

  const referral = localStorage.getItem("referral");
  const url = `https://script.google.com/macros/s/AKfycbwXtZDcI2_V0aXn9o2dKhPvpk6S2jvRgZkL9m55gDYr-RZzIedgbT_3dbnFySCzFljgSQ/exec?logReferral=${encodeURIComponent(
    referral
  )}`;
  const agentName = localStorage.getItem("username") ?? "Agent";

  try {
    const response = await fetch(url);
    const clients = await response.json();

    document.getElementById("welcomeMessage").textContent = `Welcome, ${agentName}`;

    const tbody = document.querySelector("#clientsTable tbody");
    const totalClients = document.getElementById("totalClients");

    clients.forEach((client) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${client.username}</td><td>${client.selected_plan}</td><td>${client.type}</td>`;
      tbody.appendChild(row);
    });

    totalClients.textContent = clients.length;
  } catch (error) {
    console.error("❌ Error fetching user data", error);
  } finally {
    loading.style.display = "none"; // ✅ always hide
  }
}

console.log("before calling user data");
document.addEventListener("DOMContentLoaded", DisplayUserData);
