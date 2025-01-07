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

//IMAGE PREVIEW
let picturePreview = document.querySelector(".imagePreview");
let actionButton = document.querySelector(".action-button");
let fileInput = document.querySelector("input[name='file']");
let fileReader = new FileReader();

const DEFAULT_IMAGE_SRC = "https://www.drupal.org/files/profile_default.png";

actionButton.addEventListener("click", () => {
  if (picturePreview.src !== DEFAULT_IMAGE_SRC) {
    resetImage();
  } else {
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => {
  refreshImagePreview();
});

function resetImage() {
  setActionButtonMode("upload");
  picturePreview.src = DEFAULT_IMAGE_SRC;
  fileInput.value = "";
}

function setActionButtonMode(mode) {
  let modes = {
    upload: function () {
      actionButton.innerHTML =
        '<i class="fa-solid fa-camera"></i> + Browse Photo';
      actionButton.classList.remove("mode-remove");
      actionButton.classList.add("mode-upload");
    },
    remove: function () {
      actionButton.innerHTML =
        '<i class="fa-solid fa-camera"></i> Remove Photo';
      actionButton.classList.remove("mode-upload");
      actionButton.classList.add("mode-remove");
    },
  };
  return modes[mode] ? modes[mode]() : console.error("unknown mode");
}

function refreshImagePreview() {
  if (picturePreview.src !== DEFAULT_IMAGE_SRC) {
    picturePreview.src = DEFAULT_IMAGE_SRC;
  } else {
    if (fileInput.files && fileInput.files.length > 0) {
      fileReader.readAsDataURL(fileInput.files[0]);
      fileReader.onload = (e) => {
        picturePreview.src = e.target.result;
        setActionButtonMode("remove");
      };
    }
  }
}

refreshImagePreview();

// INPUT ONLY NUMBERS
let prevVal = "";
document.addEventListener("DOMContentLoaded", function () {
  //window.addEventListener('load',function(){
  document.querySelector("input").addEventListener("input", function (e) {
    if (this.checkValidity()) {
      prevVal = this.value;
    } else {
      this.value = prevVal;
    }
  });
});

// Character limit:
let inputBox = document.querySelector(".input-box-bio"),
  textarea = inputBox.querySelector(".input-box-bio textarea"),
  signalNum = inputBox.querySelector(".input-box-bio .signal_num");

textarea.addEventListener("keyup", () => {
  let valLength = textarea.value.length; //stored textarea value length into valLength

  signalNum.innerText = valLength; //converted signalNum innerText by valLength

  valLength > 0
    ? inputBox.classList.add("active")
    : inputBox.classList.remove("active"); // if valLength is greater than 0 than add active class if not remove the active class
  valLength > 100
    ? inputBox.classList.add("error")
    : inputBox.classList.remove("error"); // if valLength is greater than 100 than add error class if not remove the error class

  // console.log(valLength);
});

// ADD HOBBIES:
document.querySelector(".hobbyBtn").addEventListener("click", addItem);

function addItem() {
  let item = document.querySelector(".hobbyInput").value;

  if (item.trim() === "") {
    return;
  }

  let list = document.querySelector(".hobbiesList");

  let newChild = document.createElement("li");
  let deleteBtn = document.createElement("button");

  deleteBtn.classList.add("deleteHobbiesBtn");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  deleteBtn.addEventListener("click", function () {
    list.removeChild(newChild);
    updateHiddenInput();
  });

  newChild.classList.add("hobby");
  newChild.innerText = item;
  newChild.setAttribute("value", `${item}`);
  newChild.setAttribute("name", "hobbies[]"); // Set name attribute on newChild
  newChild.appendChild(deleteBtn);

  list.appendChild(newChild);
  updateHiddenInput();

  document.querySelector(".hobbyInput").value = "";
}

function updateHiddenInput() {
  let hobbyList = document.querySelector(".hobbiesList").children;
  let hobbyValues = Array.from(hobbyList).map((li) => li.getAttribute("value"));

  // Update the hidden input field value with the array of hobbies
  document.querySelector("#hiddenHobbiesInput").value =
    JSON.stringify(hobbyValues);
}

//show cover photo
document.querySelector("html").classList.add("js");

let fileCoverInput = document.querySelector(".input-file"),
  button = document.querySelector(".input-file-trigger"),
  the_return = document.querySelector(".file-return"),
  removeImgBtn = document.querySelector(".remove-image");

button.addEventListener("keydown", function (event) {
  if (event.keyCode == 13 || event.keyCode == 32) {
    fileCoverInput.focus();
  }
});
button.addEventListener("click", function (event) {
  fileCoverInput.focus();
  return false;
});
fileCoverInput.addEventListener("change", function (event) {
  // the_return.innerHTML = `${this.value} <a id="remove-image" class="remove-image" onClick="removePic" href="#" style="display: inline;">&#215;</a>`;
  the_return.innerHTML = `${this.value}`;
});

// function removePic() {
//   the_return.removeChild;
//   console.log("the world");
// }

//PAGE SLIDER
// PAGE SLIDER
const pages = document.querySelectorAll(".page");
const translateAmount = 100;
let translate = 0;

function checkFormValidity(page) {
  const formElements = page.querySelectorAll("input, select, textarea");

  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i];

    // Remove any previous indication
    element.classList.remove("required-indicator");

    // Skip validation for empty fields
    if (element.value.trim() === "" && element.hasAttribute("required")) {
      console.log(`Field "${element.name}" is empty.`);
      element.classList.add("required-indicator");
      return false;
    }

    if (element.tagName.toLowerCase() === "img" && !element.checkValidity) {
      const imgContainer = element.parentElement;
      imgContainer.classList.add("required-indicator");
    }

    if (!element.checkValidity() && element.hasAttribute("required")) {
      element.classList.add("required-indicator");
      console.log(`Field "${element.name}" is not valid.`);
      console.log(element);
      return false; // Stop checking if any field is invalid
    }
  }

  return true; // All fields are valid
}

function updateNextButtonState() {
  const currentPage = document.querySelector(".page.active");
  const nextButton = currentPage.querySelector(".next");

  if (nextButton) {
    nextButton.disabled = !checkFormValidity(currentPage);
  }
}

document.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("next") || target.classList.contains("prev")) {
    const currentPage = document.querySelector(".page.active");

    if (target.classList.contains("next") && !checkFormValidity(currentPage)) {
      // Don't proceed if the form is not valid
      return;
    }

    translate += target.classList.contains("next")
      ? -translateAmount
      : translateAmount;

    pages.forEach(
      (page) => (page.style.transform = `translateX(${translate}%)`)
    );
    currentPage.classList.remove("active");

    const nextPage = target.classList.contains("next")
      ? currentPage.nextElementSibling
      : currentPage.previousElementSibling;

    if (nextPage) {
      nextPage.classList.add("active");
      updateNextButtonState();
    }
  }
});

// Initial setup
updateNextButtonState();

document
  .getElementById("detailsSubmitBtn")
  .addEventListener("click", function () {
    let formData = new FormData(document.getElementById("detailsProfileForm"));
    console.log("Sending request body:", formData);
    // Rest of your code
  });
