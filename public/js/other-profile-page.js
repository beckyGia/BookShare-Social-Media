// =============  DISPLAY SECTIONS ON PROFILE PAGE  ============= ///:
const tabs = document.querySelectorAll(".profile-menu .tab-info");
const sections = document.querySelectorAll(".profile-main .content-info");
const friendsLink = document.getElementById("friends-link");

window.addEventListener("load", (event) => {
  showSection(0);
  tabs[0].classList.add("active");
});

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    showSection(index);
    tabs.forEach((t, i) => t.classList.toggle("active", i === index));
  });
});

friendsLink.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the default link behavior
  tabs[1].click(); // Simulate a click on the second tab
});

function showSection(index) {
  sections.forEach((section, i) => {
    section.style.display = i === index ? "block" : "none";
  });
}

/// FRIENDS SECTION
let allEllipsis = document.querySelectorAll(
  ".friends-content .single-friend .ellipsis-popup-profile .fa-ellipsis "
);
let allDropdowns = document.querySelectorAll(
  ".friends-content .single-friend .ellipsis-popup-profile .dropdown-content"
);
let allExitButtons = document.querySelectorAll(
  ".friends-content .single-friend .ellipsis-popup-profile .dropdown-content .exit-button"
);

allEllipsis.forEach((ellipsis, index) => {
  ellipsis.addEventListener("click", () => openEllipsisDropDown(index));
});

allExitButtons.forEach((exitButton, index) => {
  exitButton.addEventListener("click", () => closeEllipsisDropDown(index));
});

function openEllipsisDropDown(index) {
  allDropdowns.forEach((dropdown, i) => {
    if (i === index) {
      // Toggle the display for the clicked dropdown
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    } else {
      // Close all other dropdowns
      dropdown.style.display = "none";
    }
  });
}

function closeEllipsisDropDown(index) {
  // Access the corresponding dropdown using the index
  let dropdown = allDropdowns[index];
  dropdown.style.display = "none";
}
