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

// COVER PHOTO PROFILE CHANGE
const changeCoverPhotoBtn = document.querySelector("#changeCoverPhoto");
const coverPhotoModal = document.querySelector("#changeCoverPhotoModal");
const coverPhotoCancelBtn = document.querySelector(".cover-photo-cancel");

changeCoverPhotoBtn.addEventListener("click", () =>
  toggleCoverPhotoModal(true)
);
coverPhotoCancelBtn.addEventListener("click", () =>
  toggleCoverPhotoModal(false)
);

function toggleCoverPhotoModal(isOpen) {
  coverPhotoModal.style.display = isOpen ? "block" : "none";
  const bodyStyle = isOpen ? ["hidden", "100%"] : ["auto", "auto"];
  Object.assign(document.body.style, {
    overflow: bodyStyle[0],
    height: bodyStyle[1],
  });
}

// PROFILE PICTURE CHANGE
const changeProfilePicBtn = document.querySelector("#changeProfilePhoto");
const profilePicModal = document.querySelector("#changeProfilePicModal");
const profilePicCancelBtn = document.querySelector(
  ".profile-pic-btns .profile-pic-cancel"
);

changeProfilePicBtn.addEventListener("click", () =>
  toggleProfilePicModal(true)
);
profilePicCancelBtn.addEventListener("click", () =>
  toggleProfilePicModal(false)
);

function toggleProfilePicModal(isOpen) {
  profilePicModal.style.display = isOpen ? "block" : "none";
  const bodyStyle = isOpen ? ["hidden", "100%"] : ["auto", "auto"];
  Object.assign(document.body.style, {
    overflow: bodyStyle[0],
    height: bodyStyle[1],
  });
}

// EDIT PROFILE INFORMATION MODAL:
const editProfileInfoBtn = document.querySelector("#editProfile");
const editProfileInfoModal = document.querySelector("#editProfilePageModal");
const editProfileInfoCancelBtn = document.querySelector(".edit-profile-cancel");

editProfileInfoBtn.addEventListener("click", () =>
  toggleProfileInfoModal(true)
);

editProfileInfoCancelBtn.addEventListener("click", () =>
  toggleProfileInfoModal(false)
);

function toggleProfileInfoModal(isOpen) {
  editProfileInfoModal.style.display = isOpen ? "block" : "none";
  const bodyStyle = isOpen ? ["hidden", "100%"] : ["auto", "auto"];
  Object.assign(document.body.style, {
    overflow: bodyStyle[0],
    height: bodyStyle[1],
  });
}

// Character limit:
const inputBox = document.querySelector(".input-box-bio");
const textarea = inputBox.querySelector(".input-box-bio textarea");
const signalNum = inputBox.querySelector(".input-box-bio .signal_num");

textarea.addEventListener("input", updateCharacterCount);

function updateCharacterCount() {
  const valLength = textarea.value.length;

  signalNum.innerText = valLength;

  inputBox.classList.toggle("active", valLength > 0);
  inputBox.classList.toggle("error", valLength > 100);
}

// EDIT LIST OF HOBBIES:
const list = document.getElementById("list");

list.addEventListener("click", handleListClick);

function handleListClick(event) {
  const listItem = event.target.closest("li");

  if (listItem) {
    const input = listItem.querySelector("input");
    editItem(listItem, input);
  }
}

function editItem(listItem, input) {
  listItem.classList.add("edit");
  input.focus();
  input.setSelectionRange(0, input.value.length);
}

function deleteItem(listItem) {
  if (!listItem.getAttribute("data-new")) {
    list.removeChild(listItem);
  }
}

function blurInput(event) {
  const listItem = event.target.closest("li");
  listItem.classList.remove("edit");

  if (event.target.value === "") {
    deleteItem(listItem);
  } else {
    listItem.querySelector("span").innerHTML = event.target.value;

    if (listItem.getAttribute("data-new")) {
      listItem.removeAttribute("data-new");
      addChild();
    }
  }
}

function keyInput(event) {
  if (event.key === "Enter" || event.key === "Tab") {
    event.preventDefault();
    this.blur();

    if (!this.parentNode.getAttribute("data-new")) {
      const nextItem = this.parentNode.nextElementSibling;
      if (nextItem) {
        const nextInput = nextItem.querySelector("input");
        editItem(nextItem, nextInput);
      } else {
        addChild();
      }
    }
  }
}

function setEventListener(listItem, input) {
  input.addEventListener("blur", blurInput);
  input.addEventListener("keydown", keyInput);
}

function addChild() {
  const entry = document.createElement("li");
  entry.innerHTML =
    "<span>add another</span><input type='text' name='hobbies[]'>";
  entry.setAttribute("data-new", true);
  list.appendChild(entry);
  setEventListener(entry, entry.querySelector("input"));
}

document.querySelectorAll("#list li").forEach((listItem, index) => {
  const input = listItem.querySelector("input");
  setEventListener(listItem, input);
});

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
