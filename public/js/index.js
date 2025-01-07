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
