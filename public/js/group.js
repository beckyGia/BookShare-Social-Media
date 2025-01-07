/// OPEN + CLOSE CREATE GROUP MODAL
const createGroupBtn = document.querySelector(".create-group-btn");
const createGroupModal = document.querySelector(".create-group-modal");
const createGroupCancelBtn = document.querySelector(".choose-group-cancel-btn");
const createCloseGroupBtn = document.querySelector(
  ".newGroup .closeGroupModal"
);

// Open Group modal
createGroupBtn.addEventListener("click", () => {
  resetImagesGroup();
  toggleCreateGroupModal(true, createGroupModal);
});

// Close Group modal
createGroupCancelBtn.addEventListener("click", () => {
  toggleCreateGroupModal(false, createGroupModal);
});
createCloseGroupBtn.addEventListener("click", () => {
  toggleCreateGroupModal(false, createGroupModal);
});

function toggleCreateGroupModal(isOpen, modal) {
  modal.style.display = isOpen ? "block" : "none";
  const bodyStyle = isOpen ? ["hidden", "100%"] : ["auto", "auto"];
  Object.assign(document.body.style, {
    overflow: bodyStyle[0],
    height: bodyStyle[1],
  });
}

// CREATE GROUP DRAG & DROP IMAGE:
// Declare an array to store image URLs
let groupImageUrls = [];

const dropZoneGroup = document.querySelector("#group-drop-zone");
const fileInputGroup = document.querySelector("#groupImageUpload");
const fileListContainerGroup = document.querySelector(
  "#group-file-list-container"
);
const imageUrlInputGroup = document.querySelector(".row #groupImageUrl");
const groupNameInput = document.querySelector(".newGroup #name");

dropZoneGroup.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZoneGroup.classList.add("drag-over");
});

dropZoneGroup.addEventListener("dragleave", () => {
  dropZoneGroup.classList.remove("drag-over");
});

dropZoneGroup.addEventListener("drop", (e) => {
  e.preventDefault();

  if (e.dataTransfer.items) {
    const files = Array.from(e.dataTransfer.items)
      .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
      .map((item) => item.getAsFile());

    if (files.length > 0) {
      // Create a FileList from the dropped files
      const filelist = new DataTransfer();
      files.forEach((file) => {
        filelist.items.add(file);
      });

      // Set the files property of the file input with the FileList
      fileInputGroup.files = filelist.files;

      // Trigger the change event on the file input
      const changeEvent = new Event("change", { bubbles: true });
      fileInputGroup.dispatchEvent(changeEvent);
    }
  }

  // Check if the dropped items are URLs
  let imageUrl = e.dataTransfer.items[0].getAsString(function (url) {
    // Remove previous images
    resetImageGroup();

    // Display the new dropped image
    displayDroppedImageGroup(url);

    // Store the URL in the array
    groupImageUrls[0] = url;

    // Update the hidden input with the image URLs
    imageUrlInputGroup.value = url;
    console.log(imageUrlInputGroup.value);

    // // Store the URL in the array
    // groupImageUrls.push(url);

    // Update the hidden input with the image URLs
    updateHiddenInputGroup();

    // Remove the 'required' attribute from the file input
    fileInputGroup.removeAttribute("required");
  });
});

function resetImagesGroup() {
  // Remove previous images
  fileListContainerGroup.innerHTML = "";

  //   Reset file input
  fileInputGroup.value = "";

  //Erase The Name Input
  groupNameInput.value = "";

  // Add back the drop zone text
  dropZoneGroup.textContent = "Drop files here or click to choose";
}

function resetImageGroup() {
  // Remove previous images
  fileListContainerGroup.innerHTML = "";

  // //Erase The Name Input
  // groupNameInput.value = "";

  //   //   Reset file input
  //   fileInputGroup.value = "";

  // Add back the drop zone text
  dropZoneGroup.textContent = "Drop files here or click to choose";
}

function updateHiddenInputGroup() {
  // Filter out null, undefined, or empty string values
  const filteredGroupImageUrls = groupImageUrls.filter(
    (url) => url !== null && url !== undefined && url !== ""
  );

  imageUrlInputGroup.value = filteredGroupImageUrls.join(",");
  console.log(imageUrlInputGroup.value);
  console.log(`filteredGroupImageUrls: ${filteredGroupImageUrls}`);
  console.log(`groupImageUrls: ${groupImageUrls}`);

  // Remove the 'required' attribute from the file input
  fileInputGroup.removeAttribute("required");
}

function displayDroppedImageGroup(url) {
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
    resetImagesGroup();
  });

  fileItem.appendChild(img);
  fileItem.appendChild(fileName);
  fileItem.appendChild(removeIcon);

  fileListContainerGroup.appendChild(fileItem);
  // reader.readAsDataURL(file);
}

function displayImageGroup(file) {
  //delete previous image
  resetImageGroup();

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
      resetImagesGroup();
    });

    fileItem.appendChild(img);
    fileItem.appendChild(fileName);
    fileItem.appendChild(removeIcon);

    fileListContainerGroup.appendChild(fileItem);
    // imageUrls.push(e.target.result);
    // updateHiddenInputGroup();
  };

  reader.readAsDataURL(file);
}

dropZoneGroup.addEventListener("click", () => {
  fileInputGroup.click();
});

fileInputGroup.addEventListener("change", (e) => {
  const files = e.target.files;
  handleFilesGroup(files);
});

function handleFilesGroup(files) {
  for (const file of files) {
    if (file.type.startsWith("image/")) {
      // Process the image file
      displayImageGroup(file);
    }
  }
}

///// ======== OPEN EDIT MODAL =========== ////////
const allEditGroupBtns = document.querySelectorAll(
  ".group .request .action .editGroupBtn"
);
const allGroupCloseEditBtns = document.querySelectorAll(
  ".edit-group-modal .closeEditGroupModal"
);

const allEditGroupModals = document.querySelectorAll(
  ".group .edit-group-modal"
);

const allGroupEditCancelButtons = document.querySelectorAll(
  ".edit-group-modal .edit-group-cancel-btn"
);

allEditGroupBtns.forEach((editBtn, index) => {
  editBtn.addEventListener("click", () => openEditGroupModal(index));
});

allGroupCloseEditBtns.forEach((closeBtn, index) => {
  closeBtn.addEventListener("click", () => closeEditGroupModal(index));
});

allGroupEditCancelButtons.forEach((cancelButton, index) => {
  cancelButton.addEventListener("click", () => closeEditGroupModal(index));
});

function openEditGroupModal(index) {
  allEditGroupModals[index].style.display = "block";
  document.body.style.overflow = "hidden";
  document.body.style.height = "100%";
}

function closeEditGroupModal(index) {
  allEditGroupModals[index].style.display = "none";
  document.body.style.overflow = "auto";
  document.body.style.height = "auto";
}

// EDIT GROUP DRAG & DROP IMAGE:
// Declare an array to store image URLs
let editGroupImageUrls = [];

const editDropZoneGroups = document.querySelectorAll(
  ".edit-group-modal .edit-group-drop-zone"
);
const editFileInputGroups = document.querySelectorAll(
  ".edit-group-modal .editGroupImageUpload"
);
const editFileListContainerGroups = document.querySelectorAll(
  ".edit-group-modal .edit-group-file-list-container"
);
const editImageUrlInputGroups = document.querySelectorAll(
  ".edit-group-modal .row .editGroupImageUrl"
);
const editGroupNameInputs = document.querySelectorAll(
  ".edit-group-modal .editNewGroup .name"
);
const groupCoverPhotos = document.querySelectorAll(
  ".edit-group-file-list-container .file-item .removeGroupIcon"
);

// Initialize the image URL
editGroupImageUrls[0] = editImageUrlInputGroups[0].value;
if (editGroupImageUrls[0]) {
  displayGroupDroppedEditImage(editGroupImageUrls[0], 0);
}

editDropZoneGroups.forEach((dropZoneGroup, index) => {
  dropZoneGroup.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneGroup.classList.add("drag-over");
  });

  dropZoneGroup.addEventListener("dragleave", () => {
    dropZoneGroup.classList.remove("drag-over");
  });

  dropZoneGroup.addEventListener("drop", (e) => {
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
        editFileInputGroups[index].files = filelist.files;

        // Trigger the change event on the file input
        const changeEvent = new Event("change", { bubbles: true });
        editFileInputGroups[index].dispatchEvent(changeEvent);
      }
    }

    // Check if the dropped items are URLs
    let imageUrl = e.dataTransfer.items[0].getAsString(function (url) {
      // Display the new dropped image
      displayGroupDroppedEditImage(url, index);

      // Store the URL in the array
      editGroupImageUrls[0] = url;

      // Update the hidden input with the image URLs
      editImageUrlInputGroups[index].value = url;
      console.log(editImageUrlInputGroups[index].value);

      // // Store the URL in the array
      // groupImageUrls.push(url);

      // Update the hidden input with the image URLs
      updateEditHiddenInputGroup(index);

      // Remove the 'required' attribute from the file input
      editFileInputGroups[index].removeAttribute("required");
    });
  });
});

function updateEditHiddenInputGroup(index) {
  // Filter out null, undefined, or empty string values
  const filteredImageUrls = editGroupImageUrls.filter(
    (url) => url !== null && url !== undefined && url !== ""
  );

  editImageUrlInputGroups[index].value = filteredImageUrls.join(",");
  console.log(editImageUrlInputGroups[index].value);
  console.log(`filteredImageUrls: ${filteredImageUrls}`);
}

function displayGroupDroppedEditImage(url, index) {
  // Remove previous images
  editFileListContainerGroups[index].innerHTML = "";

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

    // Clear the image and input
    clearGroupImageAndInput(index);
  });

  fileItem.appendChild(img);
  fileItem.appendChild(fileName);
  fileItem.appendChild(removeIcon);

  editFileListContainerGroups[index].appendChild(fileItem);
  console.log(editFileListContainerGroups);
  // reader.readAsDataURL(file);
}

function displayEditImageGroup(file, index) {
  // Remove previous images
  editFileListContainerGroups[index].innerHTML = "";

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
      clearGroupImageAndInput(index);
    });

    fileItem.appendChild(img);
    fileItem.appendChild(fileName);
    fileItem.appendChild(removeIcon);

    editFileListContainerGroups[index].appendChild(fileItem);
    console.log(editFileListContainerGroups[index]);
    // imageUrls.push(e.target.result);
    // updateHiddenInputGroup();
  };

  reader.readAsDataURL(file);
}

// Function to clear the image and input
function clearGroupImageAndInput(index) {
  // Remove the image element
  editFileListContainerGroups[index].innerHTML = "";

  // Clear the image URL and update the hidden input
  editImageUrlInputGroups[index].value = "";

  // Reset the file input
  editFileInputGroups[index].value = "";
  groupCoverPhotos[index].style.display = "none"; // Hide the trash icon
}

groupCoverPhotos.forEach((icon, index) => {
  icon.addEventListener("click", () => {
    // Clear the original image manually placed in the EJS
    clearGroupImageAndInput(index);
  });
});

editDropZoneGroups.forEach((dropZone, index) => {
  dropZone.addEventListener("click", () => {
    clearGroupImageAndInput(index);
    editFileInputGroups[index].click();
  });
});

editFileInputGroups.forEach((fileInput, index) => {
  fileInput.addEventListener("change", (e) => {
    const files = e.target.files;
    handleGroupEditFiles(files, index);
  });
});

function handleGroupEditFiles(files, index) {
  for (const file of files) {
    if (file.type.startsWith("image/")) {
      console.log(file);
      displayEditImageGroup(file, index);
    }
  }
}
