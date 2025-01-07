//ROOT VARIABLE
let root = document.querySelector(":root");

//HUE
// Set the primary hue function
const setPrimaryHue = (hueValue) => {
  // Apply the primary hue to your UI elements
  // For example, you can set CSS variables to apply the hue to your styles
  root.style.setProperty("--primary-color-hue", hueValue);
};

// Retrieve the saved primary hue from local storage
const savedPrimaryHue = localStorage.getItem("primaryHue");
console.log(savedPrimaryHue);

if (savedPrimaryHue) {
  // Apply the saved primary hue to your UI elements
  setPrimaryHue(savedPrimaryHue);
}

//DARK MODE:
const setMode = (mode) => {
  const wrapper = document.querySelector(":root");

  if (mode === "light") {
    wrapper.setAttribute("data-theme", "light");
  } else if (mode === "dim") {
    wrapper.setAttribute("data-theme", "dim");
  } else if (mode === "dark") {
    wrapper.setAttribute("data-theme", "dark");
  }

  // Save the selected mode in local storage
  localStorage.setItem("theme", mode);
};

// Retrieve the saved theme mode from local storage
const savedMode = localStorage.getItem("theme");
console.log(savedMode);

// Apply the saved theme mode to the page
if (savedMode === "light" || savedMode === "dim" || savedMode === "dark") {
  setMode(savedMode);
} else {
  // Default to a specific mode if no saved mode is found
  setMode("light"); // You can set your preferred default mode here
}

//SHOW HIDE PASSWORD
const pwShowHide = document.querySelectorAll(".eye-icon");

pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    let pwFields = eyeIcon.parentElement.querySelectorAll(".password");

    pwFields.forEach((password) => {
      const type =
        password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);

      if (type === "password") {
        eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });
});

//LOGIN CHECKMARK
const btnSet = document.getElementById("login-check");

btnSet.addEventListener("click", () => {
  setWithExpiry("myKey", 9909, 5000);
});

function setWithExpiry(key, value, ttl) {
  const now = new Date();

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}
