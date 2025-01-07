// ========= USER + DARK MODE SETTINGGG =================== //
const userProfile = document.getElementById("userProfile");
const settingsMenu = document.querySelector(".settings-menu");
const darkBtn = document.querySelector('.theme-switch input[type="checkbox"]');
const indexLogoImg = document.getElementById("nav-logo");

function settingsMenuToggle() {
  settingsMenu.classList.toggle("settings-menu-height");
}

userProfile.addEventListener("click", settingsMenuToggle);

// Close when user click outside
document.body.addEventListener("mousedown", function (e) {
  let isUserProfileClicked = userProfile.contains(e.target);
  let isSettingsMenuClicked = settingsMenu.contains(e.target);
  if (!isUserProfileClicked && !isSettingsMenuClicked) {
    settingsMenu.classList.remove("settings-menu-height");
  }
});

// SHOW PRIVACY AND SETTINGS:
const privacyModalContainerBtn = document.querySelector(".openStatusModal");
const privacyModal = document.querySelector(".privacyModal");
const privacyModalCloseBtn = document.querySelector(".profile-status-cancel");

privacyModalContainerBtn.addEventListener("click", () =>
  toggleProfileStatusModal(true)
);
privacyModalCloseBtn.addEventListener("click", () =>
  toggleProfileStatusModal(false)
);

function toggleProfileStatusModal(isOpen) {
  console.log("Toggling modal", isOpen);
  privacyModal.style.display = isOpen ? "block" : "none";
  const bodyStyle = isOpen ? ["hidden", "100%"] : ["auto", "auto"];
  Object.assign(document.body.style, {
    overflow: bodyStyle[0],
    height: bodyStyle[1],
  });
}

// OPEN DEACTIVATE / DELETE MODAL:
document.addEventListener("DOMContentLoaded", function () {
  const deleteAccountModal = document.querySelector(".deleteAccountModal");
  const deleteAccountModalBtn = document.querySelector(
    ".settings-menu .settings-links .deleteAccount"
  );
  const deleteAccountCloseBtn = document.querySelector(
    ".delete-profile-cancel"
  );

  deleteAccountModalBtn.addEventListener("click", () =>
    toggleDeleteModal(true)
  );
  deleteAccountCloseBtn.addEventListener("click", () =>
    toggleDeleteModal(false)
  );

  function toggleDeleteModal(isOpen) {
    console.log("Toggling modal", isOpen);
    deleteAccountModal.style.display = isOpen ? "block" : "none";
    const bodyStyle = isOpen ? ["hidden", "100%"] : ["auto", "auto"];
    Object.assign(document.body.style, {
      overflow: bodyStyle[0],
      height: bodyStyle[1],
    });
  }
});

// SET DARK MODE
const setMode = (mode) => {
  const wrapper = document.querySelector(":root");
  const slider = document.querySelector(".slider");

  let transformValue = "0%";

  if (mode === "light") {
    wrapper.setAttribute("data-theme", "light");
    indexLogoImg.src = "/img/black-logo.png";
    transformValue = "0%";
  } else if (mode === "dim") {
    wrapper.setAttribute("data-theme", "dim");
    indexLogoImg.src = "/img/white-logo.png";
    transformValue = "100%";
  } else if (mode === "dark") {
    wrapper.setAttribute("data-theme", "dark");
    indexLogoImg.src = "/img/white-logo.png";
    transformValue = "200%";
  }

  slider.style.transform = `translateX(${transformValue})`;
  localStorage.setItem("sliderPosition", transformValue);

  localStorage.setItem("theme", mode);
};

const initMode = () => {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const themePreference = localStorage.getItem("theme");
  let mode = query.matches ? "dark" : "light";

  if (themePreference === "light") {
    mode = "light";
  } else if (themePreference === "dim") {
    mode = "dim";
  } else if (themePreference === "dark") {
    mode = "dark";
  }

  setMode(mode);

  query.addListener((e) => {
    const newMode = e.matches ? "dark" : "light";
    setMode(newMode);
  });

  const themeRadios = document.querySelectorAll(
    '.theme-switcher input[type="radio"]'
  );
  themeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        const mode = radio.id.split("-")[0];
        setMode(mode); // Extract mode from radio id
      }
    });
  });
};

initMode();

// SAVE SLIDER POSITION:
const themeRadios = document.querySelectorAll(
  '.theme-switcher input[type="radio"]'
);
const slider = document.querySelector(".slider");

// Retrieve the saved slider position from local storage, or set it to 0% if not found
const savedPosition = localStorage.getItem("sliderPosition") || "0%";
slider.style.transform = `translateX(${savedPosition})`;

themeRadios.forEach((radio, index) => {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      const transformValue = `${index * 100}%`;
      slider.style.transform = `translateX(${transformValue})`;
      localStorage.setItem("sliderPosition", transformValue); // Save position to local storage
    }
  });
});
