// ============ CREATE POST ================== ///
import { createPopup } from "https://unpkg.com/@picmo/popup-picker@latest/dist/index.js?module";

// // Debounce function to avoid frequent API requests while typing
function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

///////// ========== OPEN // EDIT POST ============== ///////
let allPostEllipsis = document.querySelectorAll(
  ".feeds .feed .edit-popup .uil-ellipsis-h"
);
let allPostDropdowns = document.querySelectorAll(
  ".feeds .feed .edit-popup .post-dropdown-content"
);
let allPostExitButtons = document.querySelectorAll(
  ".feeds .feed .edit-popup .post-dropdown-content .dropdown-link .exit-button"
);

// Add click event listener to the document to handle click outside
document.addEventListener("click", (event) => {
  // Check if the clicked element is one of the ellipsis icons
  if (event.target.matches(".feeds .feed .edit-popup .uil-ellipsis-h")) {
    // Find the corresponding dropdown
    const dropdown = event.target.nextElementSibling;

    console.log("hello world");
    // Toggle the dropdown's display
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  } else {
    // Close all dropdowns
    closeAllPostEllipsisDropdowns();
  }
});

// Add click event listeners for exit buttons
allPostExitButtons.forEach((exitButton, index) => {
  exitButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent clicks on exit button from propagating
    closePostEllipsisDropDown(index);
  });
});

function closePostEllipsisDropDown(index) {
  allPostDropdowns[index].style.display = "none";
}

function closeAllPostEllipsisDropdowns() {
  allPostDropdowns.forEach((dropdown) => {
    dropdown.style.display = "none";
  });
}

//// ========== OPEN/CLOSE EDIT POST MODAL ========== ///////
function initializeEditModalButtons() {
  let openBtns = document.querySelectorAll(
    ".post-dropdown-content .dropdown-link .edit-profile-post-btn"
  );
  let closeBtns = document.querySelectorAll(
    ".row-title .post-cancel .edit-post-cancel-btn"
  );
  let modals = document.querySelectorAll(".feed .profileEditPostModal");
  let postModals = document.querySelectorAll(".feed .editProfilePostModal");
  const imageSections = document.querySelectorAll(
    ".profileEditPostModal .edit-post-image"
  );
  const addImageBtns = document.querySelectorAll(
    ".profileEditPostModal .add-edit-image"
  );

  openBtns.forEach((openBtn, currentIndex) => {
    const closeBtn = closeBtns[currentIndex];
    const modal = modals[currentIndex];
    const postModal = postModals[currentIndex];
    const imageSection = imageSections[currentIndex];
    const addImageBtn = addImageBtns[currentIndex];
    initializeEditPostModal(
      openBtn,
      closeBtn,
      modal,
      postModal,
      imageSection,
      addImageBtn,
      currentIndex
    );
  });
}

function initializeEditPostModal(
  openBtn,
  closeBtn,
  modal,
  postModal,
  imageSection,
  addImageBtn,
  index
) {
  const editImageInputs = document.querySelectorAll(".editImageUrl");
  const editGifInputs = document.querySelectorAll(".editPostGIF");
  const editBookTitles = document.querySelectorAll(".editBookTitle");
  const editBookAuthors = document.querySelectorAll(".editBookAuthor");
  const editBookSynopsis = document.querySelectorAll(".editBookSynopsis");
  const editBookCoverPhotos = document.querySelectorAll(".editBookCoverPhoto");
  const editBookGenres = document.querySelectorAll(".editBookGenres");
  // const editInputElements = document.querySelectorAll(
  //   ".edit-dropzone-wrapper input"
  // );
  const addEditPostImgs = document.querySelectorAll(
    ".edit-post-image img[name='postImage']"
  );
  const addEditPhotoInfos = document.querySelectorAll(
    ".edit-dropzone-wrapper .dropzone-desc"
  );
  const editPhotoTrashCans = document.querySelectorAll(
    ".edit-post-image .edit-cancel-btn-div .delete-edit-photo i"
  );
  // Store the original index in a variable
  const originalIndex = index;

  openBtn.addEventListener("click", () => {
    // Set the currently open modal's index
    let image = editImageInputs[index].value;
    let gif = editGifInputs[index].value;
    let bookTitle = editBookTitles[index].value;
    let bookAuthor = editBookAuthors[index].value;
    let bookSynopsis = editBookSynopsis[index].value;
    let bookCoverPhoto = editBookCoverPhotos[index].value;
    let bookGenres = editBookGenres[index].value.split(", ");

    console.log("original:", originalIndex);
    console.log("modal that is opened:", index);

    initializeEditImageButtons(index);
    // Call initializeImageContents with the current index
    initializeImageContents(index, index);

    if (image !== "") {
      editImageUrl[index] = image;
      console.log("editImageUrl", editImageUrl);
      console.log("index", index);
      openAddEditImageToPost(imageSection, addImageBtn, index);
      displayEditDroppedImage(
        image,
        index,
        addEditPostImgs[index],
        addEditPhotoInfos[index],
        editPhotoTrashCans[index],
        editImageInputs[index]
      );
    }

    if (gif !== "") {
      console.log("gif:", gif);
      openAddImageToEditBtns[index].style.pointerEvents = "none";
      openBookEditBtns[index].style.pointerEvents = "none";
      displayGifEditToSection(gif, index);
    }
    if (bookCoverPhoto !== "") {
      displayEditBookToSection(
        bookTitle,
        bookAuthor,
        bookSynopsis,
        bookCoverPhoto,
        bookGenres,
        index
      );
      openAddImageToEditBtns[index].style.pointerEvents = "none";
      openGifEditBtns[index].style.pointerEvents = "none";
    }

    openCloseEditPostModal(modal, postModal, index, true);
  });

  closeBtn.addEventListener("click", () => {
    openCloseEditPostModal(modal, postModal, index, false);
  });
}

function openCloseEditPostModal(modal, postModal, index, isOpen) {
  const displayStyle = isOpen ? "block" : "none";
  const overflowStyle = isOpen ? "hidden" : "auto";
  const heightStyle = isOpen ? "100%" : "auto";

  console.log("modal index", index);

  closePostEllipsisDropDown(index);
  modal.style.display = displayStyle;
  postModal.style.display = displayStyle;
  document.body.style.overflow = overflowStyle;
  document.body.style.height = heightStyle;
  document.documentElement.style.overflow = overflowStyle;
  document.documentElement.style.height = heightStyle;
}

///// ======== EDIT POST MODAL ==============  //////////////
// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
  initializeEditModalButtons();
  // initializeEditPostModal();
  initializeEmojiPostEditSection();
  // initializeEditImageButtons();
  initializeEditGifButtons();
  initializeEditGifSection();
  initializeEditBookButtons();
  // initializeEditClickableBook();
});

/////ADD EMOJIS
function initializeEmojiPostEditSection() {
  const inputTexts = document.querySelectorAll(".edit-post-textarea");
  const emojiInputs = document.querySelectorAll(".editEmoji i");

  emojiInputs.forEach((emojiInput, index) => {
    const picker = createPopup(
      {},
      {
        referenceElement: emojiInput,
        triggerElement: emojiInput,
        position: "bottom-end",
        className: "emojiPopup",
        onPositionLost: "hold", // Adjust the behavior when the reference element is hidden
      }
    );

    emojiInput.addEventListener("click", () => {
      const rect = emojiInput.getBoundingClientRect();
      const position = {
        top: rect.bottom,
        left: rect.left,
      };

      picker.setPosition(position);
      picker.toggle();
    });

    picker.addEventListener("emoji:select", (selection) => {
      inputTexts[index].value += selection.emoji;
    });
  });
}

//CONSTANTS BUTTONS FOR IMAGE, GIF AND BOOK
const openAddImageToEditBtns = document.querySelectorAll(
  ".profileEditPostModal .add-edit-image"
);
const openGifEditBtns = document.querySelectorAll(
  ".profileEditPostModal .add-edit-gif"
);
const openBookEditBtns = document.querySelectorAll(
  ".profileEditPostModal .add-edit-book"
);

//IMAGE ARRAY
let editImageUrl = [];

// Update the initializeImageContents function to check the modalIndex
function initializeImageContents(index, modalIndex) {
  console.log("initial currentIndex", index);
  // Check if this modal's index matches the open modal's index

  /// ADD IMAGE TO POST PREVIEW
  const editDropZones = document.querySelectorAll(".edit-dropzone-wrapper");
  const editInputElements = document.querySelectorAll(
    ".edit-dropzone-wrapper .dropzone"
  );
  const editPostImageUrlInputs = document.querySelectorAll(
    ".edit-post-image .edit-dropzone-wrapper .editImageUrl"
  );
  const addEditPostImgs = document.querySelectorAll(
    ".edit-post-image img[name='postImage']"
  );
  const addEditPhotoInfos = document.querySelectorAll(
    ".edit-dropzone-wrapper .dropzone-desc"
  );
  const editPhotoTrashCans = document.querySelectorAll(
    ".edit-post-image .edit-cancel-btn-div .delete-edit-photo i"
  );

  //IMAGE PREVIEW
  // Attach the click event listener with the captured 'index'
  // Prevent the default behavior of the input element
  editDropZones[index].addEventListener("click", (e) => {
    // e.preventDefault();
    // console.log("clicked index", index);
    // console.log("clicked modalIndex", modalIndex);
    // You can now safely open a file dialog here
    editInputElements[index].click();
  });
  editDropZones[index].addEventListener("dragover", (e) => {
    e.preventDefault();
    editDropZones[index].classList.add("drag-over");
  });
  editDropZones[index].addEventListener("dragleave", () => {
    editDropZones[index].classList.remove("drag-over");
  });
  editDropZones[index].addEventListener("drop", (e) => {
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
        editInputElements[index].files = filelist.files;

        // Trigger the change event on the file input
        const changeEvent = new Event("change", { bubbles: true });
        editInputElements[index].dispatchEvent(changeEvent);
      }
    }

    // Check if the dropped items are URLs
    let imageUrl = e.dataTransfer.items[0].getAsString(function (url) {
      // Display the new dropped image
      displayEditDroppedImage(
        url,
        index,
        addEditPostImgs[index],
        addEditPhotoInfos[index],
        editPhotoTrashCans[index],
        editInputElements[index]
      );

      // Update the hidden input with the data URL
      editPostImageUrlInputs[index].value = url;
    });
  });

  editInputElements[index].addEventListener("change", (e) => {
    console.log("index", index);
    const clickFile = e.target.files;
    console.log("clickFile", clickFile);
    editHandleDrop(
      clickFile,
      index,
      addEditPostImgs[index],
      addEditPhotoInfos[index],
      editPhotoTrashCans[index],
      editInputElements[index]
    );
  });

  editPhotoTrashCans[index].addEventListener("click", () => {
    console.log("hello", index);
    deleteEditAddPostPhoto(
      index,
      addEditPostImgs[index],
      editPostImageUrlInputs[index],
      editInputElements[index],
      addEditPhotoInfos[index],
      editPhotoTrashCans[index]
    );
  });
}

/// OPEN AND CLOSE ADD IMAGE TO POST
function initializeEditImageButtons(index) {
  const addImageBtns = document.querySelectorAll(
    ".profileEditPostModal .add-edit-image"
  );
  const closeImageBtns = document.querySelectorAll(
    ".profileEditPostModal .edit-post-image .image-edit-cancel-btn i"
  );
  const imageSections = document.querySelectorAll(
    ".profileEditPostModal .edit-post-image"
  );
  const editInputElements = document.querySelectorAll(
    ".edit-dropzone-wrapper input[name='file']"
  );
  const editPostImageUrlInputs = document.querySelectorAll(
    ".edit-post-image .edit-dropzone-wrapper .editImageUrl"
  );
  const addEditPostImgs = document.querySelectorAll(
    ".edit-post-image img[name='postImage']"
  );
  const addEditPhotoInfos = document.querySelectorAll(
    ".edit-dropzone-wrapper .dropzone-desc"
  );
  const editPhotoTrashCans = document.querySelectorAll(
    ".edit-post-image .edit-cancel-btn-div .delete-edit-photo i"
  );

  addImageBtns[index].addEventListener("click", () =>
    openAddEditImageToPost(imageSections[index], addImageBtns[index], index)
  );

  closeImageBtns[index].addEventListener("click", () =>
    closeAddEditImageToPost(
      imageSections[index],
      addImageBtns[index],
      editInputElements[index],
      editPostImageUrlInputs[index],
      addEditPostImgs[index],
      addEditPhotoInfos[index],
      editPhotoTrashCans[index],
      index
    )
  );
}

function openAddEditImageToPost(imageSection, addImageBtn, index) {
  addImageBtn.classList.add("post-btn-active");
  imageSection.classList.add("visible");
  disableEditPostButtonsImage(index);
}

function closeAddEditImageToPost(
  imageSection,
  addImageBtn,
  inputElement,
  imageInput,
  postImg,
  photoInfo,
  trashCan,
  index
) {
  addImageBtn.classList.remove("post-btn-active");
  imageSection.classList.remove("visible");
  resetEditPostImagePreview(
    inputElement,
    imageInput,
    postImg,
    photoInfo,
    trashCan,
    index
  );
  enableEditPostButtons(index);
}

function disableEditPostButtonsImage(index) {
  openGifEditBtns[index].style.pointerEvents = "none";
  openBookEditBtns[index].style.pointerEvents = "none";
}
function resetEditPostImagePreview(
  inputElement,
  imageInput,
  postImg,
  photoInfo,
  trashCan,
  index
) {
  postImg.src = "";
  postImg.alt = "";
  imageInput.value = "";
  inputElement.value = "";
  editImageUrl = [];
  postImg.style.display = "none";
  photoInfo.style.display = "block";
  trashCan.style.display = "none";
}

//REUSEABLE CODE:
function enableEditPostButtons(index) {
  openGifEditBtns[index].style.pointerEvents = "auto";
  openBookEditBtns[index].style.pointerEvents = "auto";
  openAddImageToEditBtns[index].style.pointerEvents = "auto";
}

/// ADD IMAGE TO POST PREVIEW
function editHandleDrop(
  files,
  index,
  postImg,
  photoInfo,
  trashCan,
  inputElement
) {
  for (const file of files) {
    if (file.type.startsWith("image/")) {
      console.log("current image index", index);
      // Process the image file
      displayEditImage(file, index, postImg, photoInfo, trashCan);
    }
  }
}

function displayEditDroppedImage(url, index, postImg, photoInfo, trashCan) {
  postImg.style.display = "block";
  photoInfo.style.display = "none";
  postImg.src = url;
  postImg.alt = url;
  trashCan.style.display = "block";
}

function displayEditImage(file, index, postImg, photoInfo, trashCan) {
  const reader = new FileReader();
  postImg.style.display = "block";
  photoInfo.style.display = "none";
  reader.onload = function (e) {
    let src = e.target.result;

    postImg.style.display = "block";
    photoInfo.style.display = "none";

    postImg.src = src;
    postImg.alt = file.name;
    trashCan.style.display = "block";
  };
  console.log("file", file);
  reader.readAsDataURL(file);
}

function deleteEditAddPostPhoto(
  index,
  postImg,
  imageInput,
  inputElements,
  photoInfo,
  trashCan
) {
  postImg.src = "";
  postImg.alt = "";
  imageInput.value = "";
  inputElements.value = "";
  editImageUrl[index] = ""; // Clear the URL at the specific index
  postImg.style.display = "none";
  photoInfo.style.display = "block";
  trashCan.style.display = "none";
}

/// === DISPLAY GIF SECTION ====////
function initializeEditGifButtons() {
  const addGifBtns = document.querySelectorAll(
    ".profileEditPostModal .add-edit-gif"
  );
  const gifBackBtns = document.querySelectorAll(".gif-edit-back-btn");
  const profilePostModals = document.querySelectorAll(".profileEditPostModal");
  const gifSelections = document.querySelectorAll(".gifEditSelection");
  const targetGifSections = document.querySelectorAll(".edit-post-gif");
  const gifResultsContainers = document.querySelectorAll(".gifEditResults");

  addGifBtns.forEach((addGifBtn, index) => {
    addGifBtn.addEventListener("click", () =>
      toggleEditGifSection(
        profilePostModals[index],
        gifSelections[index],
        targetGifSections[index],
        gifResultsContainers[index],
        index,
        true
      )
    );
  });

  gifBackBtns.forEach((gifBackBtn, index) => {
    gifBackBtn.addEventListener("click", () =>
      toggleEditGifSection(
        profilePostModals[index],
        gifSelections[index],
        gifResultsContainers[index],
        index,
        false
      )
    );
  });
}

function toggleEditGifSection(
  modal,
  gifSelection,
  targetGifSection,
  gifResultsContainer,
  index,
  show
) {
  modal.style.display = show ? "none" : "block";
  gifSelection.style.display = show ? "block" : "none";
  modal.classList.toggle("active", !show);
  gifSelection.classList.toggle("active", show);
  targetGifSection.innerHTML = "";
  if (show) {
    console.log("Calling getTrendingData");
    debounce(
      getEditTrendingData(window.giphyApiKey, gifResultsContainer, index),
      300
    );
  }
}

async function getEditTrendingData(apiKey, gifResultsContainer, index) {
  const trendingUrl = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`;

  try {
    const response = await fetch(trendingUrl);
    const data = await response.json();
    console.log(data.data);
    generateEditHTML(data.data, gifResultsContainer, index); // Array of trending GIFs
  } catch (error) {
    console.error("Error fetching GIFs:", error);
    return [];
  }
}

function initializeEditGifSection() {
  const apiKey = window.giphyApiKey;
  const gifResultsContainers = document.querySelectorAll(".gifEditResults");
  const gifSearchInputs = document.querySelectorAll(".gifEditSearchInput");

  gifSearchInputs.forEach((gifSearchInput, index) => {
    gifSearchInput.addEventListener(
      "input",
      debounce(() => {
        searchEditGIFs(
          apiKey,
          gifSearchInput.value,
          gifResultsContainers[index],
          index
        );
      }, 300)
    );
  });
}

async function searchEditGIFs(
  apiKey,
  gifSearchInput,
  gifResultsContainer,
  index
) {
  const searchQuery = gifSearchInput;

  if (!searchQuery) {
    // If search input is empty, go back to trending
    await getEditTrendingData(apiKey, gifResultsContainer, index);
    return;
  }

  const searchUrl = `https://api.giphy.com/v1/gifs/search?q=${searchQuery}&api_key=${apiKey}&limit=10`;

  try {
    const response = await fetch(searchUrl);
    const data = await response.json();
    console.log(data.data);
    generateEditHTML(data.data, gifResultsContainer, index); // Array of searched GIFs
  } catch (error) {
    console.error("Error searching GIFs:", error);
  }
}

function generateEditHTML(results, container, index) {
  const postModals = document.querySelectorAll(".profileEditPostModal");
  const gifSelections = document.querySelectorAll(".gifEditSelection");

  let generatedHTML = "";
  results.map((result) => {
    generatedHTML += `
       <div class="single-gif">
          <a href="#"><img src="${result.images.fixed_width.url}" name="post-GIF" class="animated-gif"></a>
        </div>
      `;
  });
  container.innerHTML = generatedHTML;

  document.querySelectorAll(".animated-gif").forEach((gifElement) => {
    gifElement.addEventListener("click", () => {
      moveGifEditToSection(gifElement, index);
      postModals[index].style.display = "block";
      gifSelections[index].style.display = "none";
      postModals[index].classList.add("active");
      gifSelections[index].classList.remove("active");
      openAddImageToEditBtns[index].style.pointerEvents = "none";
      openBookEditBtns[index].style.pointerEvents = "none";
    });
  });
}

function moveGifEditToSection(gifElement, index) {
  console.log(gifElement);
  const targetGifSections = document.querySelectorAll(".edit-post-gif");
  const gifSearchInputs = document.querySelectorAll(".gifEditSearchInput");
  gifSearchInputs[index].value = "";

  // Clone the selected GIF element
  const clonedGifElement = gifElement.cloneNode(true);

  // Create a hidden input element
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden"; // Set the input type to "hidden"
  hiddenInput.name = "editPostGIF"; // Set a name for the input element (change as needed)
  hiddenInput.value = clonedGifElement.src; // Set the value from img.src

  // Create a container for the GIF and input
  const container = document.createElement("div");
  container.className = "single-gif-container";
  container.appendChild(clonedGifElement);
  container.appendChild(hiddenInput); // Append the hidden input element

  // Create Delete Button and Append it
  const deleteButton = createGifEditDeleteButton(
    clonedGifElement,
    container,
    index
  );
  container.appendChild(deleteButton);

  // Append the container to the target GIF section
  targetGifSections[index].innerHTML = ""; // Clear existing content
  targetGifSections[index].appendChild(container);
}

function displayGifEditToSection(gifUrl, index) {
  const targetGifSections = document.querySelectorAll(".edit-post-gif");

  targetGifSections[index].innerHTML = "";

  // Clone the selected GIF element
  const clonedGifElement = document.createElement("img");
  clonedGifElement.src = gifUrl;
  clonedGifElement.name = "post-GIF";
  clonedGifElement.classList.add("animated-gif");

  // Create a hidden input element
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "editPostGIF";
  hiddenInput.value = gifUrl;

  // Create a container for the GIF and input
  const container = document.createElement("div");
  container.className = "single-gif-container";
  container.appendChild(clonedGifElement);
  container.appendChild(hiddenInput);

  const deleteButton = createGifEditDeleteButton(
    clonedGifElement,
    container,
    index
  );

  container.appendChild(deleteButton);

  // Clear existing content and append the container to the target GIF section
  targetGifSections[index].innerHTML = "";
  targetGifSections[index].appendChild(container);
}

function createGifEditDeleteButton(clonedGifElement, container, index) {
  const deleteButton = document.createElement("a");
  deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  deleteButton.className = "gif-delete-button";
  deleteButton.addEventListener("click", () => {
    clonedGifElement.remove();
    container.remove();
    deleteButton.remove();
    enableEditPostButtons(index);
  });
  return deleteButton;
}

/// === DISPLAY BOOK SECTION ====////
function initializeEditBookButtons() {
  const addBookBtns = document.querySelectorAll(
    ".profileEditPostModal .add-edit-book"
  );
  const bookBackBtns = document.querySelectorAll(".book-edit-back-btn");
  const profilePostModals = document.querySelectorAll(".profileEditPostModal");
  const bookSelections = document.querySelectorAll(".bookEditSelection");

  addBookBtns.forEach((addBookBtn, index) => {
    addBookBtn.addEventListener("click", () =>
      toggleEditBookSection(
        profilePostModals[index],
        bookSelections[index],
        index,
        true
      )
    );
  });

  bookBackBtns.forEach((bookBackBtn, index) => {
    bookBackBtn.addEventListener("click", () =>
      toggleEditBookSection(
        profilePostModals[index],
        bookSelections[index],
        index,
        false
      )
    );
  });
}

function toggleEditBookSection(modal, bookSelection, index, show) {
  modal.style.display = show ? "none" : "block";
  bookSelection.style.display = show ? "block" : "none";
  modal.classList.toggle("active", !show);
  bookSelection.classList.toggle("active", show);
  initializeEditClickableBook(index);
}

function initializeEditClickableBook(index) {
  const postModals = document.querySelectorAll(".profileEditPostModal");
  const bookSelections = document.querySelectorAll(".bookEditSelection");

  document
    .querySelectorAll(".animated-book-container")
    .forEach((bookContainer) => {
      bookContainer.addEventListener("click", () => {
        const bookTitle = bookContainer.getAttribute("data-book-title");
        const bookAuthor = bookContainer.getAttribute("data-book-author");
        const bookSynopsis = bookContainer.getAttribute("data-book-synopsis");
        const bookCoverPhoto = bookContainer.getAttribute(
          "data-book-coverPhoto"
        );
        const bookGenresString = bookContainer.getAttribute("data-book-genres");
        console.log(bookGenresString);
        const bookGenres = bookGenresString.split(", ");
        console.log(bookGenres);
        moveEditBookToSection(
          bookContainer,
          bookTitle,
          bookAuthor,
          bookSynopsis,
          bookCoverPhoto,
          bookGenres,
          index
        );
        postModals[index].style.display = "block";
        bookSelections[index].style.display = "none";
        postModals[index].classList.add("active");
        bookSelections[index].classList.remove("active");
        openAddImageToEditBtns[index].style.pointerEvents = "none";
        openGifEditBtns[index].style.pointerEvents = "none";
      });
    });
}

function moveEditBookToSection(
  bookElement,
  bookTitle,
  bookAuthor,
  bookSynopsis,
  bookCoverPhoto,
  bookGenres,
  index
) {
  const targetBookSections = document.querySelectorAll(".edit-post-book");
  targetBookSections[index].innerHTML = "";

  // Create a hidden input for the book TITLE
  const hiddenBookTitleInput = document.createElement("input");
  hiddenBookTitleInput.type = "hidden";
  hiddenBookTitleInput.name = "bookTitle";
  hiddenBookTitleInput.value = bookTitle;

  // Create a hidden input for the book AUTHOR
  const hiddenBookAuthorInput = document.createElement("input");
  hiddenBookAuthorInput.type = "hidden";
  hiddenBookAuthorInput.name = "bookAuthor";
  hiddenBookAuthorInput.value = bookAuthor;

  // Create a hidden input for the book SYNOPSIS
  const hiddenBookSynopsisInput = document.createElement("input");
  hiddenBookSynopsisInput.type = "hidden";
  hiddenBookSynopsisInput.name = "bookSynopsis";
  hiddenBookSynopsisInput.value = bookSynopsis;

  // Create a hidden input for the book COVER PHOTO
  const hiddenBookCoverPhotoInput = document.createElement("input");
  hiddenBookCoverPhotoInput.type = "hidden";
  hiddenBookCoverPhotoInput.name = "bookCoverPhoto";
  hiddenBookCoverPhotoInput.value = bookCoverPhoto;

  // Create a hidden input for the book GENRES
  const hiddenBookGenresInput = document.createElement("input");
  hiddenBookGenresInput.type = "hidden";
  hiddenBookGenresInput.name = "bookGenres";
  hiddenBookGenresInput.value = bookGenres;

  // Clone the selected BOOK element (the img tag)
  const clonedBookElement = bookElement.cloneNode(true);

  // Create a container for the BOOK and Append the hidden input for book ID to the container
  const container = document.createElement("div");
  container.className = "single-book-container";
  container.appendChild(clonedBookElement);
  container.appendChild(hiddenBookTitleInput);
  container.appendChild(hiddenBookAuthorInput);
  container.appendChild(hiddenBookSynopsisInput);
  container.appendChild(hiddenBookCoverPhotoInput);
  container.appendChild(hiddenBookGenresInput);

  // Create and Append Delete buttont
  const deleteButton = createEditBookDeleteButton(
    clonedBookElement,
    container,
    index
  );
  container.appendChild(deleteButton);

  // Append the container to the target BOOK section
  targetBookSections[index].appendChild(container);
}

function displayEditBookToSection(
  bookTitle,
  bookAuthor,
  bookSynopsis,
  bookCoverPhoto,
  bookGenres,
  index
) {
  const targetBookSections = document.querySelectorAll(".edit-post-book");
  targetBookSections[index].innerHTML = "";

  // Create hidden input elements for book details
  const hiddenBookTitleInput = document.createElement("input");
  hiddenBookTitleInput.type = "hidden";
  hiddenBookTitleInput.name = "bookTitle";
  hiddenBookTitleInput.value = bookTitle;

  const hiddenBookAuthorInput = document.createElement("input");
  hiddenBookAuthorInput.type = "hidden";
  hiddenBookAuthorInput.name = "bookAuthor";
  hiddenBookAuthorInput.value = bookAuthor;

  const hiddenBookSynopsisInput = document.createElement("input");
  hiddenBookSynopsisInput.type = "hidden";
  hiddenBookSynopsisInput.name = "bookSynopsis";
  hiddenBookSynopsisInput.value = bookSynopsis;

  const hiddenBookCoverPhotoInput = document.createElement("input");
  hiddenBookCoverPhotoInput.type = "hidden";
  hiddenBookCoverPhotoInput.name = "bookCoverPhoto";
  hiddenBookCoverPhotoInput.value = bookCoverPhoto;

  const hiddenBookGenresInput = document.createElement("input");
  hiddenBookGenresInput.type = "hidden";
  hiddenBookGenresInput.name = "bookGenres";
  hiddenBookGenresInput.value = bookGenres;

  // Clone the selected book element (e.g., an image or a container)
  const clonedBookElement = createBookElement(
    bookCoverPhoto,
    bookTitle,
    bookAuthor,
    bookSynopsis,
    bookGenres
  );

  // Create a container for the book
  const container = document.createElement("div");
  container.className = "single-book-container";
  container.appendChild(clonedBookElement);
  container.appendChild(hiddenBookTitleInput);
  container.appendChild(hiddenBookAuthorInput);
  container.appendChild(hiddenBookSynopsisInput);
  container.appendChild(hiddenBookCoverPhotoInput);
  container.appendChild(hiddenBookGenresInput);

  // Create and append a delete button
  const deleteButton = createEditBookDeleteButton(
    clonedBookElement,
    container,
    index
  );
  container.appendChild(deleteButton);

  // Append the container to the target book section
  targetBookSections[index].appendChild(container);
}

function createBookElement(
  bookCoverPhoto,
  bookTitle,
  bookAuthor,
  bookSynopsis,
  bookGenres
) {
  // Create an element to display the book (e.g., an image or a container)
  const bookElement = document.createElement("a");
  bookElement.classList.add("animated-book-container");

  //inner html
  bookElement.innerHTML = `<img src="${bookCoverPhoto}" class="animated-book" name="postBook">`;

  // Add data attributes to store book details for later use
  bookElement.setAttribute("data-book-title", bookTitle);
  bookElement.setAttribute("data-book-author", bookAuthor);
  bookElement.setAttribute("data-book-synopsis", bookSynopsis);
  bookElement.setAttribute("data-book-coverPhoto", bookCoverPhoto);
  bookElement.setAttribute("data-book-genres", bookGenres.join(", "));

  // Attach an event listener to handle interactions with the book element
  bookElement.addEventListener("click", () => {
    // Handle interactions (e.g., open book details, remove book)
  });

  return bookElement;
}

function createEditBookDeleteButton(clonedBookElement, container, index) {
  const deleteButton = document.createElement("a");
  deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  deleteButton.className = "book-delete-button";
  deleteButton.addEventListener("click", () => {
    clonedBookElement.remove();
    container.remove();
    deleteButton.remove();
    enableEditPostButtons(index);
  });
  return deleteButton;
}
