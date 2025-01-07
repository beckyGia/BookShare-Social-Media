// Declare an array to store image URLs
let editImageUrls = [];

const editDropZones = document.querySelectorAll(".edit-drop-zone");
const editFileInputs = document.querySelectorAll(".editImageUpload");
const editFileListContainers = document.querySelectorAll(
  ".edit-file-list-container"
);
const editImageUrlInputs = document.querySelectorAll(".row .editImageUrl");
const originalBookCoverIcons = document.querySelectorAll("#originalBookCover");

// Initialize the image URL
editImageUrls[0] = editImageUrlInputs[0].value;
if (editImageUrls[0]) {
  displayDroppedEditImage(editImageUrls[0], 0);
}

editDropZones.forEach((dropZone, index) => {
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
        editFileInputs[index].files = filelist.files;

        // Trigger the change event on the file input
        const changeEvent = new Event("change", { bubbles: true });
        editFileInputs[index].dispatchEvent(changeEvent);
      }
    }

    // Check if the dropped items are URLs
    let imageUrl = e.dataTransfer.items[0].getAsString(function (url) {
      // Remove previous images
      clearImageAndInput(index);

      // Display the new dropped image
      displayDroppedEditImage(url, index);

      // Store the URL in the array
      editImageUrls[0] = url;

      // Update the hidden input with the image URLs
      editImageUrlInputs[index].value = url;
      console.log(editImageUrlInputs[index].value);

      // // Store the URL in the array
      // imageUrls.push(url);

      // Update the hidden input with the image URLs
      updateEditHiddenInput(index);

      // Remove the 'required' attribute from the file input
      editFileInputs[index].removeAttribute("required");
    });
  });
});

// editDropZones.forEach((dropZone, index) => {
//   dropZone.addEventListener("dragover", (e) => {
//     e.preventDefault();
//     dropZone.classList.add("drag-over");
//   });

//   dropZone.addEventListener("dragleave", () => {
//     dropZone.classList.remove("drag-over");
//   });

//   dropZone.addEventListener("drop", (e) => {
//     e.preventDefault();

//     // Check if the dropped items are files
//     if (e.dataTransfer.items) {
//       for (const item of e.dataTransfer.items) {
//         if (item.kind === "file" && item.type.startsWith("image/")) {
//           const file = item.getAsFile();

//           // Display the new image
//           displayEditImage(URL.createObjectURL(file), index);

//           // Update the hidden input with the new image URL
//           editImageUrlInputs[index].value = URL.createObjectURL(file);

//           // Remove the 'required' attribute from the file input
//           editFileInputs[index].removeAttribute("required");
//         }
//       }
//     }
//   });
// });

function updateEditHiddenInput(index) {
  // Filter out null, undefined, or empty string values
  const filteredImageUrls = editImageUrls.filter(
    (url) => url !== null && url !== undefined && url !== ""
  );

  editImageUrlInputs[index].value = filteredImageUrls.join(",");
  console.log(editImageUrlInputs[index].value);
  console.log(`filteredImageUrls: ${filteredImageUrls}`);
  console.log(`imageUrls: ${imageUrls}`);
}

function displayDroppedEditImage(url, index) {
  // Remove previous images
  editFileListContainers[index].innerHTML = "";

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
    clearImageAndInput(index);
  });

  fileItem.appendChild(img);
  fileItem.appendChild(fileName);
  fileItem.appendChild(removeIcon);

  editFileListContainers[index].appendChild(fileItem);
  console.log(editFileListContainers);
  // reader.readAsDataURL(file);
}

function displayEditImage(file, index) {
  // Remove previous images
  editFileListContainers[index].innerHTML = "";

  const reader = new FileReader();

  reader.onload = function (e) {
    // Remove previous images

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
      // Clear the image and input
      clearImageAndInput(index);
    });

    fileItem.appendChild(img);
    fileItem.appendChild(fileName);
    fileItem.appendChild(removeIcon);

    editFileListContainers[index].appendChild(fileItem);
    console.log("editFileListContainers:", editFileListContainers);
  };
  reader.readAsDataURL(file); // Start reading the file
}

// Function to clear the image and input
function clearImageAndInput(index) {
  // Remove the image element
  editFileListContainers[index].innerHTML = "";

  // Clear the image URL and update the hidden input
  editImageUrlInputs[index].value = "";

  // Reset the file input
  editFileInputs[index].value = "";
  originalBookCoverIcons[index].style.display = "none"; // Hide the trash icon
}

originalBookCoverIcons.forEach((icon, index) => {
  icon.addEventListener("click", () => {
    // Clear the original image manually placed in the EJS
    clearImageAndInput(index);
  });
});

editDropZones.forEach((dropZone, index) => {
  dropZone.addEventListener("click", () => {
    clearImageAndInput(index);
    editFileInputs[index].click();
  });
});

editFileInputs.forEach((fileInput, index) => {
  fileInput.addEventListener("change", (e) => {
    const files = e.target.files;
    handleEditFiles(files, index);
  });
});

function handleEditFiles(files, index) {
  for (const file of files) {
    if (file.type.startsWith("image/")) {
      console.log(file);
      displayEditImage(file, index);
    }
  }
}
