let allEllipsis = document.querySelectorAll(
  ".middle .single-friend .ellipsis-popup .fa-ellipsis "
);
let allDropdowns = document.querySelectorAll(
  ".middle .single-friend .ellipsis-popup .dropdown-content"
);
let allExitButtons = document.querySelectorAll(
  ".middle .single-friend .ellipsis-popup .dropdown-content .exit-button"
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
