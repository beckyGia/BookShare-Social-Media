////// =============== FAVORITE =================== ////////
const favBtns = document.querySelectorAll(".single-book .book .favBtn");

favBtns.forEach((favBtn) => {
  favBtn.addEventListener("click", () => {
    favBtn.classList.toggle("favorited");
  });
});

//// ============== RATTINGGG =============== ////////
const ratingStarBtns = document.querySelectorAll(
  ".single-book .book-btns .ratingStar"
);
const ratingStarBtnsSpan = document.querySelectorAll(
  ".single-book .book-btns .starSpan"
);

const ratingStarsATags = document.querySelectorAll(
  ".single-book .book-btns .rating-main-btn"
);
const ratingStarCloseBtns = document.querySelectorAll(
  ".rating-modal .rating-card .close-rating"
);
const ratingStarModals = document.querySelectorAll(
  ".single-book .rating-modal"
);

const starsContainers = document.querySelectorAll(
  ".single-book .book-btns .rating-main-btn .starsDiv"
); // main star container
const rateBtns = document.querySelectorAll(
  ".rating-modal .inputDiv .rateButton"
);
const ratingInps = document.querySelectorAll(
  ".rating-modal .inputDiv .ratingInput"
);

ratingStarBtns.forEach((starBtn, index) => {
  starBtn.addEventListener("click", () => openRatingModal(index));
});

ratingStarCloseBtns.forEach((closeBtn, index) => {
  closeBtn.addEventListener("click", () => closeRatingModal(index));
});

ratingStarsATags.forEach((aTag, index) => {
  aTag.addEventListener("click", () => openRatingModal(index));
});

function openRatingModal(index) {
  ratingStarModals[index].style.display = "block";
}

function closeRatingModal(index) {
  ratingStarModals[index].style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const ratingInps = document.querySelectorAll(
    ".rating-modal .inputDiv .ratingInput"
  );
  const starsContainers = document.querySelectorAll(
    ".single-book .book-btns .rating-main-btn .starsDiv"
  );

  ratingInps.forEach((ratingInput, index) => {
    if (ratingInput.value) {
      const ratingValue = parseFloat(ratingInput.value);
      createStars(starsContainers[index], index);
      fillStars(ratingValue, starsContainers[index], index);
      ratingStarBtnsSpan[index].style.display = "none";
      ratingStarsATags[index].style.display = "block";
    }
  });
});

rateBtns.forEach((rateBtn, index) => {
  rateBtn.addEventListener("click", () => {
    const ratingValue = parseFloat(ratingInps[index].value);
    if (isNaN(ratingValue) || ratingValue > 5 || ratingValue < 0.1) {
      alert("Please enter a number between 0.1 and 5");
      return;
    }
    starsContainers[index].innerHTML = "";
    createStars(starsContainers[index], index);
    fillStars(ratingValue, starsContainers[index], index);
    ratingStarModals[index].style.display = "none";
    ratingStarBtnsSpan[index].style.display = "none";
    ratingStarsATags[index].style.display = "block";
  });
});

function createStars(container, ID) {
  let starDiv = document.createElement("div");

  for (let i = 0; i < 5; i++) {
    const gradientId = `gradient${ID}${i + 1}`;
    const starClass = `star${ID}`;

    const starSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    starSvg.setAttribute("viewBox", "0 0 24 24");
    starSvg.setAttribute("fill", `url(#${gradientId})`);

    const gradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    gradient.setAttribute("id", gradientId);
    gradient.innerHTML = `<stop offset="0%" stop-color="currentColor" /> <stop offset="0%" stop-color="gray"/>`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M12 2L15.09 8.34L22 9.27L17 14.24L18.18 21L12 17.77L5.82 21L7 14.24L2 9.27L8.91 8.34L12 2Z"
    );

    starSvg.appendChild(gradient);
    starSvg.appendChild(path);
    starSvg.classList.add(starClass);
    starDiv.classList.add("starDiv");
    starDiv.appendChild(starSvg);
  }
  container.appendChild(starDiv);
}

function fillStars(rating, container, ID) {
  const stars = container.querySelectorAll(`.star${ID}`);
  stars.forEach((star, index) => {
    if (index + 1 <= rating) {
      star.style.fill = "currentColor";
    } else if (index < rating) {
      const percentage = (rating - Math.floor(rating)) * 100;
      star
        .querySelector(`linearGradient stop:nth-child(1)`)
        .setAttribute("offset", `${percentage}%`);
    } else {
      star.style.fill = "gray";
    }
  });
}

/// OPEN + CLOSE CREATE BOOK MODAL
const createBookBtn = document.querySelector(".create-book-btn");
const createBookModal = document.querySelector(".create-book-modal");
const createCompletedBookModal = document.querySelector(
  ".create-completed-book-modal"
);
const createReadingBookModal = document.querySelector(
  ".create-reading-book-modal"
);
const createBookCancelBtns = document.querySelectorAll(
  ".choose-book-cancel-btn"
);
const createCompletedBookCancelBtns = document.querySelectorAll(
  ".newBook .closeCompletedModal"
);
const createReadingBookCancelBtns = document.querySelectorAll(
  ".newBook .closeReadingModal"
);
const toCompletedPageBtn = document.getElementById("toCompletedPageBtn");
const toReadingPageBtn = document.getElementById("toReadingPageBtn");
const backToAddBookBtns = document.querySelectorAll(".back-to-main");

// Open Profile Picture change modal
createBookBtn.addEventListener("click", () =>
  toggleCreateBookModals(true, createBookModal)
);

// Go to the completed page modal
toCompletedPageBtn.addEventListener("click", () =>
  toggleCreateBookModals(true, createCompletedBookModal)
);

// Go to the reading page modal
toReadingPageBtn.addEventListener("click", () =>
  toggleCreateBookModals(true, createReadingBookModal)
);

// Go back to main page modal
backToAddBookBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleCreateBookModals(true, createBookModal);
  });
});

// Close Profile Picture change modal
createBookCancelBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (index == 0) {
      toggleCreateBookModals(false, createCompletedBookModal);
    } else if (index == 1) {
      toggleCreateBookModals(false, createBookModal);
    } else if (index == 2) {
      toggleCreateBookModals(false, createReadingBookModal);
    }
  });
});

createReadingBookCancelBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (index == 0) {
      toggleCreateBookModals(false, createCompletedBookModal);
    } else if (index == 1) {
      toggleCreateBookModals(false, createBookModal);
    } else if (index == 2) {
      toggleCreateBookModals(false, createReadingBookModal);
    }
  });
});

createCompletedBookCancelBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (index == 0) {
      toggleCreateBookModals(false, createCompletedBookModal);
    } else if (index == 1) {
      toggleCreateBookModals(false, createBookModal);
    } else if (index == 2) {
      toggleCreateBookModals(false, createReadingBookModal);
    }
  });
});

function toggleCreateBookModals(isOpen, modal) {
  closeAllCreateBookModals();
  modal.style.display = isOpen ? "block" : "none";
  const bodyStyle = isOpen ? ["hidden", "100%"] : ["auto", "auto"];
  Object.assign(document.body.style, {
    overflow: bodyStyle[0],
    height: bodyStyle[1],
  });

  scrollToTop(modal);
}

function closeAllCreateBookModals() {
  createBookModal.style.display = "none";
  createCompletedBookModal.style.display = "none";
  createReadingBookModal.style.display = "none";
  // scrollToTop(createCompletedBookModal);
  // scrollToTop(createReadingBookModal);
}

function scrollToTop(modal) {
  if (modal !== createBookModal) {
    modal.scrollTop = 0;
  }
}

// CREATE BOOK DRAG & DROP IMAGE:
// Declare an array to store image URLs
let imageUrls = [];

const dropZones = document.querySelectorAll(".drop-zone");
const fileInputs = document.querySelectorAll(".imageUpload");
const fileListContainers = document.querySelectorAll(".file-list-container");
const imageUrlInputs = document.querySelectorAll(".row .imageUrl");

dropZones.forEach((dropZone, index) => {
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.items) {
      const files = Array.from(e.dataTransfer.items)
        .filter(
          (item) => item.kind === "file" && item.type.startsWith("image/")
        )
        .map((item) => item.getAsFile());

      if (files.length > 0) {
        // Create a FileList from the dropped files
        const filelist = new DataTransfer();
        files.forEach((file) => {
          filelist.items.add(file);
        });

        // Set the files property of the file input with the FileList
        fileInputs[index].files = filelist.files;

        // Trigger the change event on the file input
        const changeEvent = new Event("change", { bubbles: true });
        fileInputs[index].dispatchEvent(changeEvent);
      }
    }

    // Check if the dropped items are URLs
    let imageUrl = e.dataTransfer.items[0].getAsString(function (url) {
      // Remove previous images
      resetImages(index);

      // Display the new dropped image
      displayDroppedImage(url, index);

      // Store the URL in the array
      imageUrls[0] = url;

      // Update the hidden input with the image URLs
      imageUrlInputs[index].value = url;
      console.log(imageUrlInputs[index].value);

      // // Store the URL in the array
      // imageUrls.push(url);

      // Update the hidden input with the image URLs
      updateHiddenInput(index);

      // Remove the 'required' attribute from the file input
      fileInputs[index].removeAttribute("required");
    });
  });
});

function resetImages(index) {
  // Remove previous images
  fileListContainers[index].innerHTML = "";

  // Reset file input
  fileInputs[index].value = "";

  // Add back the drop zone text
  const dropZone = dropZones[index];
  dropZone.textContent = "Drop files here or click to choose";
}

function updateHiddenInput(index) {
  // Filter out null, undefined, or empty string values
  const filteredImageUrls = imageUrls.filter(
    (url) => url !== null && url !== undefined && url !== ""
  );

  imageUrlInputs[index].value = filteredImageUrls.join(",");
  console.log(imageUrlInputs[index].value);
  console.log(`filteredImageUrls: ${filteredImageUrls}`);
  console.log(`imageUrls: ${imageUrls}`);
}

function displayDroppedImage(url, index) {
  const fileItem = document.createElement("div");
  fileItem.classList.add("file-item");

  const img = new Image();
  img.src = url;
  img.alt = "Dropped Image";
  img.classList.add("thumbnail");

  const fileName = document.createElement("span");
  fileName.textContent = "Dropped Image"; // You can customize the name

  const removeIcon = document.createElement("i");
  removeIcon.classList.add("fas", "fa-trash", "remove-icon");
  removeIcon.addEventListener("click", () => {
    fileItem.remove();
  });

  fileItem.appendChild(img);
  fileItem.appendChild(fileName);
  fileItem.appendChild(removeIcon);

  fileListContainers[index].appendChild(fileItem);
  // reader.readAsDataURL(file);
}

function displayImage(file, index) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const fileItem = document.createElement("div");
    fileItem.classList.add("file-item");

    const img = new Image();
    img.src = e.target.result;
    img.alt = file.name;
    img.classList.add("thumbnail");

    const fileName = document.createElement("span");
    fileName.textContent = file.name;

    const removeIcon = document.createElement("i");
    removeIcon.classList.add("fas", "fa-trash", "remove-icon");
    removeIcon.addEventListener("click", () => {
      fileItem.remove();
    });

    fileItem.appendChild(img);
    fileItem.appendChild(fileName);
    fileItem.appendChild(removeIcon);

    fileListContainers[index].appendChild(fileItem);
    // imageUrls.push(e.target.result);
    // updateHiddenInput();
  };

  reader.readAsDataURL(file);
}

dropZones.forEach((dropZone, index) => {
  dropZone.addEventListener("click", () => {
    fileInputs[index].click();
  });
});

fileInputs.forEach((fileInput, index) => {
  fileInput.addEventListener("change", (e) => {
    const files = e.target.files;
    handleFiles(files, index);
  });
});

function handleFiles(files, index) {
  for (const file of files) {
    if (file.type.startsWith("image/")) {
      // Process the image file
      displayImage(file, index);
    }
  }
}

// CREATE BOOK Character limit:
let inputBoxs = document.querySelectorAll(
  ".create-completed-book-modal .input-box-synopsis, .create-reading-book-modal .input-box-synopsis"
);

inputBoxs.forEach((inputBox) => {
  let textarea = inputBox.querySelector("textarea");
  let signalNum = inputBox.querySelector(".signal_num");

  textarea.addEventListener("keyup", () => {
    let valLength = textarea.value.length;

    signalNum.innerText = valLength;

    valLength > 0
      ? inputBox.classList.add("active")
      : inputBox.classList.remove("active");

    valLength > 900
      ? inputBox.classList.add("error")
      : inputBox.classList.remove("error");

    // console.log(valLength);
  });
});

// ADD GENRES TO CREATE BOOK:
let lists = document.querySelectorAll(".genre-list");

lists.forEach((list) => {
  let listItems = list.querySelectorAll("li");
  let inputs = list.querySelectorAll("input");

  for (let i = 0; i < listItems.length; i++) {
    setEventListener(listItems[i], inputs[i]);
  }

  function editItem(event) {
    let listItem = this;
    listItem.classList.add("edit");
    let inputField = listItem.querySelector("input");
    inputField.focus();
    inputField.setSelectionRange(0, inputField.value.length);
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
    if (event.which === 13 || event.which === 9) {
      event.preventDefault();
      this.blur();

      if (!this.parentNode.getAttribute("data-new")) {
        let nextItem = this.parentNode.nextElementSibling;
        if (nextItem) editItem.call(nextItem);
      }
    }
  }

  function setEventListener(listItem, input) {
    listItem.addEventListener("click", editItem);
    input.addEventListener("blur", blurInput);
    input.addEventListener("keydown", keyInput);
  }

  function addChild() {
    let entry = document.createElement("li");
    entry.innerHTML =
      "<span>add another</span><input type='text' name='genres[]'>";
    entry.setAttribute("data-new", true);
    list.appendChild(entry);
    setEventListener(entry, entry.querySelector("input"));
  }
});

///////// ========== OPEN // EDIT BOOK ============== ///////
let allBookEllipsis = document.querySelectorAll(
  ".book .edit-popup .uil-ellipsis-h"
);

let allBookDropdowns = document.querySelectorAll(
  ".book .edit-popup .book-dropdown-content"
);
let allBookExitButtons = document.querySelectorAll(
  ".book .edit-popup .book-dropdown-content .dropdown-link .exit-button"
);

allBookEllipsis.forEach((ellipsis, index) => {
  ellipsis.addEventListener("click", () => {
    console.log("poopy head");
    openBookEllipsisDropDown(index);
  });
});

allBookExitButtons.forEach((exitButton, index) => {
  exitButton.addEventListener("click", () => closeBookEllipsisDropDown(index));
});

function openBookEllipsisDropDown(index) {
  console.log("Hello UNIVERSE");
  allBookDropdowns.forEach((dropdown, i) => {
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

function closeBookEllipsisDropDown(index) {
  // Access the corresponding dropdown using the index
  let dropdown = allBookDropdowns[index];
  dropdown.style.display = "none";
}

///// ======== OPEN EDIT MODAL =========== ////////
const allEditBtns = document.querySelectorAll(
  ".book .edit-popup .book-dropdown-content .dropdown-link .editBookBtn"
);
const allCloseEditBtns = document.querySelectorAll(
  ".book .edit-reading-book-modal .edit-book-btns .edit-book-cancel-btn"
);

const allEditBookModals = document.querySelectorAll(
  ".book .edit-reading-book-modal"
);

const allEditCancelButtons = document.querySelectorAll(
  ".editBook .closeEditModal"
);

allEditBtns.forEach((editBtn, index) => {
  editBtn.addEventListener("click", () => openEditBookModal(index));
});

allCloseEditBtns.forEach((closeBtn, index) => {
  closeBtn.addEventListener("click", () => closeEditBookModal(index));
});

allEditCancelButtons.forEach((cancelButton, index) => {
  cancelButton.addEventListener("click", () => closeEditBookModal(index));
});

function openEditBookModal(index) {
  console.log("hello world", index);
  closeBookEllipsisDropDown(index);
  allEditBookModals[index].style.display = "block";
  document.body.style.overflow = "hidden";
  document.body.style.height = "100%";
}

function closeEditBookModal(index) {
  allEditBookModals[index].style.display = "none";
  document.body.style.overflow = "auto";
  document.body.style.height = "auto";
}
