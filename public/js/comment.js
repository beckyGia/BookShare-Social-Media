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

///====== COMMMENT SECTIONS =========== ////////
document.addEventListener("DOMContentLoaded", () => {
  initializeCommentSection();
  initializeCommentsTextarea();
  initializeEmojiCommentSection();
  initializeImageToComments();
  initializeGifsToComments();
  initializeCommentReplies();
  initializeBookmarkCommentReplies();
  initializeBookmarkCommentReplies();
});

// HIDE AND SHOW COMMENTS SECTION:
function initializeCommentSection() {
  const commentsShowButtons = document.querySelectorAll(
    ".action-buttons .comment-post-btn"
  );
  const commentsShowWordButtons = document.querySelectorAll(
    ".comments .post-comments"
  );
  const commentsContainers = document.querySelectorAll(".comments-container");

  commentsShowButtons.forEach((button, index) =>
    button.addEventListener("click", () =>
      toggleCommentsDisplay(commentsContainers[index], commentsContainers)
    )
  );

  commentsShowWordButtons.forEach((button, index) =>
    button.addEventListener("click", () =>
      toggleCommentsDisplay(commentsContainers[index], commentsContainers)
    )
  );
}

function toggleCommentsDisplay(clickedContainer, allContainers) {
  // Check if the clicked container has the "display-comments" class
  const isOpen = clickedContainer.classList.contains("display-comments");

  // Close all comment containers
  allContainers.forEach((container) => {
    container.classList.remove("display-comments");
  });

  // If it's open, remove the class to close it; otherwise, add the class to open it
  if (isOpen) {
    clickedContainer.classList.remove("display-comments");
  } else {
    clickedContainer.classList.add("display-comments");
  }
}

function initializeCommentsTextarea() {
  const commentsTextareas = document.querySelectorAll(".comment-textarea");
  const commentGifTooltips = document.querySelectorAll(".comment-gif-tooltip");

  commentsTextareas.forEach((textarea, index) => {
    textarea.addEventListener("click", () => {
      hideTooltip(commentGifTooltips[index]);
    });
  });

  commentsTextareas.forEach((textarea) => {
    textarea.addEventListener("keydown", preventEnterWithoutShift);
  });
}

function preventEnterWithoutShift(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
  }
}

/////ADD EMOJIS TO COMMENTS
function initializeEmojiCommentSection() {
  const inputTexts = document.querySelectorAll(".comment-textarea");
  const emojiIcons = document.querySelectorAll(".add-comment-emoji i");

  emojiIcons.forEach((emojiIcon, index) => {
    const picker = createPopup(
      {},
      {
        referenceElement: emojiIcon,
        triggerElement: emojiIcon,
        position: "bottom-end",
        className: "emojiPopup",
      }
    );

    emojiIcon.addEventListener("click", () => {
      console.log("Emoji icon clicked");
      picker.toggle();
    });

    picker.addEventListener("emoji:select", (selection) => {
      inputTexts[index].value += selection.emoji;
    });
  });
}

// ADD IMAGES TO COMMENTS:
function initializeImageToComments() {
  const addPictureToComments = document.querySelectorAll(
    ".add-comment-picture"
  );
  const commentImageInputs = document.querySelectorAll(".comment-image-input");
  const commentGifTooltips = document.querySelectorAll(".comment-gif-tooltip");
  const commentsPicturePlaceholders = document.querySelectorAll(
    ".comments-picture-placeholder"
  );
  const commentsPicturePlaceholderImgs = document.querySelectorAll(
    ".comments-picture-placeholder img"
  );
  const commentsPicturePlaceholderCancelBtns = document.querySelectorAll(
    ".comments-picture-placeholder i"
  );
  const addGifToComments = document.querySelectorAll(".add-comment-gif");

  addPictureToComments.forEach((addPictureBtn, index) => {
    addPictureBtn.addEventListener("click", () => {
      hideTooltip(commentGifTooltips[index]);
      commentImageInputs[index].click();
    });
  });

  commentImageInputs.forEach((commentImageInput, index) => {
    commentImageInput.addEventListener("change", function (e) {
      const selectedImage = this.files[0];
      if (selectedImage) {
        displayCommentsImage(
          selectedImage,
          commentsPicturePlaceholders[index],
          commentsPicturePlaceholderImgs[index],
          addGifToComments[index],
          commentsPicturePlaceholderCancelBtns[index]
        );
      }
    });
  });

  commentsPicturePlaceholderCancelBtns.forEach((cancelBtn, index) => {
    cancelBtn.addEventListener("click", () => {
      deleteAddCommentPhoto(
        commentsPicturePlaceholderImgs[index],
        commentsPicturePlaceholderCancelBtns[index],
        addGifToComments[index]
      );
    });
  });
}

function displayCommentsImage(
  file,
  placeholder,
  imgElement,
  addGifBtn,
  placeholderCancelBtn
) {
  const commentsPlaceholderDiv = placeholder.closest(".comments-placeholder");
  const commentsGifPlaceholder = placeholder.nextElementSibling;

  commentsPlaceholderDiv.style.display = "block";

  const reader = new FileReader();
  reader.onloadend = function (e) {
    let src = e.target.result;
    placeholder.style.display = "flex";
    commentsGifPlaceholder.style.display = "none";
    placeholderCancelBtn.style.display = "block";
    imgElement.style.display = "block";
    imgElement.src = src;
    imgElement.alt = file.name;
    addGifBtn.style.pointerEvents = "none";
  };
  reader.readAsDataURL(file);
}

function deleteAddCommentPhoto(imgElement, cancelBtn, addGifBtn) {
  imgElement.src = "";
  imgElement.alt = "";
  imgElement.style.display = "none";
  cancelBtn.style.display = "none";
  addGifBtn.style.pointerEvents = "auto";
}

//// REUSEABLE FUNCTIONS:
function hideTooltip(tooltip) {
  tooltip.style.display = "none";
}

// ADD GIFS TO COMMENTS:
function initializeGifsToComments() {
  const apiKey = window.giphyApiKey;
  const addGifToComments = document.querySelectorAll(".add-comment-gif");
  const commentGifTooltips = document.querySelectorAll(".comment-gif-tooltip");
  const gifCommentSearchInputs = document.querySelectorAll(
    ".gifCommentSearchInput"
  );
  // const commentsGifPlaceholder = document.querySelectorAll(
  //   ".comments-gif-placeholder"
  // );

  addGifToComments.forEach((addGifBtn, index) => {
    addGifBtn.addEventListener("click", () => {
      toggleGifTooltip(
        gifCommentSearchInputs[index],
        apiKey,
        commentGifTooltips[index]
      );
    });
  });

  // addGifToComments.addEventListener("click", () =>
  //   toggleGifTooltip(commentGifTooltip, gifCommentSearchInput, apiKey)
  // );

  gifCommentSearchInputs.forEach((commentSearchInput, index) => {
    commentSearchInput.addEventListener(
      "input",
      debounce(
        () =>
          searchCommentsGIFs(
            commentSearchInput,
            apiKey,
            commentGifTooltips[index]
          ),
        300
      )
    );
  });

  // gifCommentSearchInput.addEventListener(
  //   "input",
  //   debounce(() => searchCommentsGIFs(gifCommentSearchInput, apiKey), 300)
  // );
}

async function searchCommentsGIFs(gifCommentSearchInput, apiKey, gifTooltip) {
  const searchQuery = gifCommentSearchInput.value;

  if (!searchQuery) {
    // If search input is empty, go back to trending
    await fetchAndGenerateCommentGIFs("trending", apiKey, "", gifTooltip);
    return;
  }

  await fetchAndGenerateCommentGIFs("search", apiKey, searchQuery, gifTooltip);
}

async function toggleGifTooltip(gifCommentSearchInput, apiKey, gifTooltip) {
  gifTooltip.style.display =
    gifTooltip.style.display === "block" ? "none" : "block";

  if (gifTooltip.style.display === "none" && gifCommentSearchInput) {
    gifCommentSearchInput.value = "";
  }

  // Check if gifTooltip is defined before passing it to fetchAndGenerateCommentGIFs
  if (gifTooltip) {
    await fetchAndGenerateCommentGIFs("trending", apiKey, "", gifTooltip);
  }
}

async function fetchAndGenerateCommentGIFs(
  type,
  apiKey,
  query = "",
  gifTooltip
) {
  const apiUrl =
    type === "trending"
      ? `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`
      : `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${apiKey}&limit=10`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    // console.log(data);
    generateCommentHTML(data.data, gifTooltip);
  } catch (error) {
    console.error("Error fetching GIFs:", error);
  }
}

function generateCommentHTML(results, gifTooltip) {
  const gifCommentResultsContainer =
    gifTooltip.querySelector(".gifCommentResults");
  const addPictureToComments = gifTooltip
    .closest(".comment-gif-tooltip")
    .parentElement.parentElement.querySelector(".add-comment-picture");

  const generatedHTML = results
    .map(
      (result) =>
        `<div class="comment-single-gif"><a><img src="${result.images.fixed_width.url}" class="comment-animated-gif"></a></div>`
    )
    .join("");

  gifCommentResultsContainer.innerHTML = generatedHTML;

  document.querySelectorAll(".comment-animated-gif").forEach((gifElement) => {
    gifElement.addEventListener("click", () => {
      moveCommentGifToSection(gifElement, gifTooltip);
      gifTooltip.style.display = "none";
      addPictureToComments.style.pointerEvents = "none";
    });
  });
}

function moveCommentGifToSection(gifElement, gifTooltip) {
  const gifCommentSearchInput = gifTooltip.querySelector(
    ".gifCommentSearchInput"
  );
  gifCommentSearchInput.value = "";
  console.log("hello world");
  const gifSrc = gifElement.getAttribute("src");
  const gifImage = createGifImage(gifSrc);
  appendGifAndDeleteButton(gifImage, gifTooltip);
}

function createGifImage(src) {
  const gifImage = document.createElement("img");
  gifImage.setAttribute("src", src);
  gifImage.classList.add("comment-added-gif");
  return gifImage;
}

function appendGifAndDeleteButton(gifImage, gifTooltip) {
  // Traverse up the DOM to find the comments-container
  let currentElement = gifTooltip;
  let commentsPlaceholder = null;

  while (currentElement) {
    if (currentElement.classList.contains("comments-container")) {
      commentsPlaceholder = currentElement;
      break;
    }
    currentElement = currentElement.parentElement;
  }
  const commentsPlaceholderDiv = commentsPlaceholder.querySelector(
    ".comments-placeholder"
  );
  const commentsPicturePlaceholder = commentsPlaceholder.querySelector(
    ".comments-picture-placeholder"
  );

  const commentsGifPlaceholder = commentsPlaceholder.querySelector(
    ".comments-gif-placeholder"
  );
  const addPictureToComments = commentsPlaceholder.querySelector(
    ".add-comment-picture"
  );
  console.log(commentsPlaceholder);

  commentsPlaceholderDiv.style.display = "block";
  commentsPicturePlaceholder.style.display = "none";
  commentsGifPlaceholder.style.display = "flex";
  addPictureToComments.style.pointerEvents = "none";
  gifTooltip.style.display = "none";

  const deleteButton = createGifCommentsDeleteButton(
    gifImage,
    commentsGifPlaceholder
  );

  // Create a hidden input element
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden"; // Set the input type to "hidden"
  hiddenInput.name = "commentGIF"; // Set a name for the input element (change as needed)
  hiddenInput.value = gifImage.src; // Set the value from img.src

  commentsGifPlaceholder.innerHTML = ""; // Clear existing content
  commentsGifPlaceholder.appendChild(gifImage);
  commentsGifPlaceholder.appendChild(hiddenInput);
  commentsGifPlaceholder.appendChild(deleteButton);
}

function createGifCommentsDeleteButton(gifImage, commentsGifPlaceholder) {
  const addPictureToComments = commentsGifPlaceholder
    .closest(".comments-container")
    .querySelector(".add-comment-picture");
  const deleteButton = document.createElement("a");
  deleteButton.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
  deleteButton.className = "gif-comment-delete-button";
  deleteButton.addEventListener("click", () => {
    gifImage.remove();
    deleteButton.remove();
    addPictureToComments.style.pointerEvents = "auto";
  });
  return deleteButton;
}

////========== COMMENT REPLYS ==================//////
function initializeCommentReplies() {
  const commentsReply = document.querySelectorAll(
    ".result_comment .tools_comment .reply"
  );

  commentsReply.forEach((reply) => {
    reply.addEventListener("click", (e) => {
      handleReply(e);
    });
  });
}

function initializeDashboardCommentReplies() {
  const commentsReply = document.querySelectorAll(
    ".result_comment .tools_comment .reply-dashboard"
  );

  commentsReply.forEach((reply) => {
    reply.addEventListener("click", (e) => {
      handleDashboardReply(e);
    });
  });
}

function initializeBookmarkCommentReplies() {
  const commentsReply = document.querySelectorAll(
    ".result_comment .tools_comment .reply-bookmark"
  );

  commentsReply.forEach((reply) => {
    reply.addEventListener("click", (e) => {
      handleBookmarkReply(e);
    });
  });
}

function handleReply(e) {
  e.preventDefault();
  const replyButton = e.currentTarget;
  toggleReplyForm(replyButton);
}

function handleDashboardReply(e) {
  e.preventDefault();
  const replyButton = e.currentTarget;
  toggleDashboardReplyForm(replyButton);
}

function handleBookmarkReply(e) {
  e.preventDefault();
  const replyButton = e.currentTarget;
  toggleBookmarkReplyForm(replyButton);
}

function toggleReplyForm(element) {
  const current = element.closest(".result_comment");
  const replyForm = current.querySelector(".comments");

  if (replyForm) {
    replyForm.remove();
  } else {
    createReplyForm(element);
  }
}

function toggleDashboardReplyForm(element) {
  const current = element.closest(".result_comment");
  const replyForm = current.querySelector(".comments");

  if (replyForm) {
    replyForm.remove();
  } else {
    createReplyFormDashboard(element);
  }
}

function toggleBookmarkReplyForm(element) {
  const current = element.closest(".result_comment");
  const replyForm = current.querySelector(".comments");

  if (replyForm) {
    replyForm.remove();
  } else {
    createReplyFormBookmark(element);
  }
}

function createReplyForm(element) {
  const current = element.closest(".result_comment");

  // Retrieve data attributes from the current comment element
  const userProfilePic = element.dataset.userProfilePic;
  const postId = element.dataset.postId;
  const commentId = element.dataset.commentId;

  const childReplayList = current.querySelector(".child_replay");

  const replyForm = document.createElement("div");
  replyForm.className = "row";
  replyForm.innerHTML = `
  <form action="/comment/createComment/${postId}/${commentId}" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container">
    <div class="comments comments-reply" id="comments">
      <div class="comments-profile-photo">
        <img src=${userProfilePic} alt="Profile-Picture" />
      </div>
      <div class="comment-utilities">
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" placeholder="Write a comment" oninput="adjustInputHeight(this)"></textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder">
        <img src="" alt="">
        <a><i class="fa-solid fa-circle-xmark"></i></a>
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder">
      </div>
    </div> 
  </div>
  </form>   
  `;

  // ADD GIFS && PICTURES
  childReplayList.appendChild(replyForm);

  // Add event listeners to elements within the created form
  const commentReplyTextarea = replyForm.querySelector(
    ".comment-reply-textarea"
  );
  const addCommentReplyEmoji = replyForm.querySelector(
    ".add-comment-reply-emoji i"
  );
  const addCommentReplyPicture = replyForm.querySelector(
    ".add-comment-reply-picture"
  );
  const addCommentReplyGif = replyForm.querySelector(".add-comment-reply-gif");
  const commentReplyGifTooltip = replyForm.querySelector(
    ".reply-comment-gif-tooltip"
  );
  const commentsPlaceholderDiv = replyForm.querySelector(
    "#comments-placeholder"
  );
  const gifCommentResultsContainer =
    replyForm.querySelector("#gifCommentResults");

  const gifCommentSearchInput = replyForm.querySelector(
    "#gifCommentSearchInput"
  );
  const commentsGifPlaceholder = replyForm.querySelector(
    "#comments-gif-placeholder"
  );

  const commentsPicturePlaceholder = replyForm.querySelector(
    "#comments-picture-placeholder"
  );
  const commentsPicturePlaceholderImg = replyForm.querySelector(
    "#comments-picture-placeholder img"
  );
  const commentImageInput = replyForm.querySelector("#comment-image-input");
  const commentsPicturePlaceholderCancelBtn = replyForm.querySelector(
    "#comments-picture-placeholder i"
  );

  commentReplyTextarea.addEventListener("input", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
  });

  addCommentReplyGif.addEventListener("click", function (e) {
    commentReplyGifTooltip.style.display =
      commentReplyGifTooltip.style.display === "block" ? "none" : "block";
    getTrendingCommentReplyData(
      gifCommentResultsContainer,
      commentReplyGifTooltip,
      gifCommentSearchInput,
      commentsGifPlaceholder,
      commentsPlaceholderDiv,
      commentsPicturePlaceholder,
      addCommentReplyPicture
    );
  });

  gifCommentSearchInput.addEventListener(
    "input",
    debounce(function () {
      searchReplyCommentsGIFs(
        gifCommentResultsContainer,
        commentReplyGifTooltip,
        gifCommentSearchInput,
        commentsGifPlaceholder,
        commentsPlaceholderDiv,
        commentsPicturePlaceholder,
        addCommentReplyPicture
      );
    }, 300)
  );

  // ADD EMOJI TO COMMENTS REPLY
  addCommentReplyEmoji.addEventListener(
    "click",
    openReplyEmoji(addCommentReplyEmoji, commentReplyTextarea)
  );

  // ADD PICTURE TO COMMENTS REPLY
  addCommentReplyPicture.addEventListener("click", function () {
    commentReplyGifTooltip.style.display = "none";
    commentImageInput.click();
  });

  commentImageInput.addEventListener("change", function (e) {
    const selectedImage = this.files[0];
    if (selectedImage) {
      displayReplysImage(
        selectedImage,
        commentsPlaceholderDiv,
        commentsPicturePlaceholderImg,
        commentsPicturePlaceholder,
        commentsGifPlaceholder,
        commentsPicturePlaceholderCancelBtn,
        addCommentReplyGif
      );
    }
  });

  commentsPicturePlaceholderCancelBtn.addEventListener("click", function () {
    deleteAddReplyPhoto(
      commentsPicturePlaceholderImg,
      commentsPicturePlaceholderCancelBtn,
      addCommentReplyGif
    );
  });
}

function createReplyFormDashboard(element) {
  const current = element.closest(".result_comment");

  // Retrieve data attributes from the current comment element
  const userProfilePic = element.dataset.userProfilePic;
  const postId = element.dataset.postId;
  const commentId = element.dataset.commentId;

  const childReplayList = current.querySelector(".child_replay");

  const replyForm = document.createElement("div");
  replyForm.className = "row";
  replyForm.innerHTML = `
  <form action="/comment/createCommentDashboard/${postId}/${commentId}" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container">
    <div class="comments comments-reply" id="comments">
      <div class="comments-profile-photo">
        <img src=${userProfilePic} alt="Profile-Picture" />
      </div>
      <div class="comment-utilities">
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" placeholder="Write a comment" oninput="adjustInputHeight(this)"></textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder">
        <img src="" alt="">
        <a><i class="fa-solid fa-circle-xmark"></i></a>
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder">
      </div>
    </div> 
  </div>
  </form>   
  `;

  // ADD GIFS && PICTURES
  childReplayList.appendChild(replyForm);

  // Add event listeners to elements within the created form
  const commentReplyTextarea = replyForm.querySelector(
    ".comment-reply-textarea"
  );
  const addCommentReplyEmoji = replyForm.querySelector(
    ".add-comment-reply-emoji i"
  );
  const addCommentReplyPicture = replyForm.querySelector(
    ".add-comment-reply-picture"
  );
  const addCommentReplyGif = replyForm.querySelector(".add-comment-reply-gif");
  const commentReplyGifTooltip = replyForm.querySelector(
    ".reply-comment-gif-tooltip"
  );
  const commentsPlaceholderDiv = replyForm.querySelector(
    "#comments-placeholder"
  );
  const gifCommentResultsContainer =
    replyForm.querySelector("#gifCommentResults");

  const gifCommentSearchInput = replyForm.querySelector(
    "#gifCommentSearchInput"
  );
  const commentsGifPlaceholder = replyForm.querySelector(
    "#comments-gif-placeholder"
  );

  const commentsPicturePlaceholder = replyForm.querySelector(
    "#comments-picture-placeholder"
  );
  const commentsPicturePlaceholderImg = replyForm.querySelector(
    "#comments-picture-placeholder img"
  );
  const commentImageInput = replyForm.querySelector("#comment-image-input");
  const commentsPicturePlaceholderCancelBtn = replyForm.querySelector(
    "#comments-picture-placeholder i"
  );

  commentReplyTextarea.addEventListener("input", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
  });

  addCommentReplyGif.addEventListener("click", function (e) {
    commentReplyGifTooltip.style.display =
      commentReplyGifTooltip.style.display === "block" ? "none" : "block";
    getTrendingCommentReplyData(
      gifCommentResultsContainer,
      commentReplyGifTooltip,
      gifCommentSearchInput,
      commentsGifPlaceholder,
      commentsPlaceholderDiv,
      commentsPicturePlaceholder,
      addCommentReplyPicture
    );
  });

  gifCommentSearchInput.addEventListener(
    "input",
    debounce(function () {
      searchReplyCommentsGIFs(
        gifCommentResultsContainer,
        commentReplyGifTooltip,
        gifCommentSearchInput,
        commentsGifPlaceholder,
        commentsPlaceholderDiv,
        commentsPicturePlaceholder,
        addCommentReplyPicture
      );
    }, 300)
  );

  // ADD EMOJI TO COMMENTS REPLY
  addCommentReplyEmoji.addEventListener(
    "click",
    openReplyEmoji(addCommentReplyEmoji, commentReplyTextarea)
  );

  // ADD PICTURE TO COMMENTS REPLY
  addCommentReplyPicture.addEventListener("click", function () {
    commentReplyGifTooltip.style.display = "none";
    commentImageInput.click();
  });

  commentImageInput.addEventListener("change", function (e) {
    const selectedImage = this.files[0];
    if (selectedImage) {
      displayReplysImage(
        selectedImage,
        commentsPlaceholderDiv,
        commentsPicturePlaceholderImg,
        commentsPicturePlaceholder,
        commentsGifPlaceholder,
        commentsPicturePlaceholderCancelBtn,
        addCommentReplyGif
      );
    }
  });

  commentsPicturePlaceholderCancelBtn.addEventListener("click", function () {
    deleteAddReplyPhoto(
      commentsPicturePlaceholderImg,
      commentsPicturePlaceholderCancelBtn,
      addCommentReplyGif
    );
  });
}

function createReplyFormBookmark(element) {
  const current = element.closest(".result_comment");

  // Retrieve data attributes from the current comment element
  const userProfilePic = element.dataset.userProfilePic;
  const postId = element.dataset.postId;
  const commentId = element.dataset.commentId;

  const childReplayList = current.querySelector(".child_replay");

  const replyForm = document.createElement("div");
  replyForm.className = "row";
  replyForm.innerHTML = `
  <form action="/comment/createCommentBookmark/${postId}/${commentId}" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container">
    <div class="comments comments-reply" id="comments">
      <div class="comments-profile-photo">
        <img src=${userProfilePic} alt="Profile-Picture" />
      </div>
      <div class="comment-utilities">
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" placeholder="Write a comment" oninput="adjustInputHeight(this)"></textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder">
        <img src="" alt="">
        <a><i class="fa-solid fa-circle-xmark"></i></a>
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder">
      </div>
    </div> 
  </div>
  </form>   
  `;

  // ADD GIFS && PICTURES
  childReplayList.appendChild(replyForm);

  // Add event listeners to elements within the created form
  const commentReplyTextarea = replyForm.querySelector(
    ".comment-reply-textarea"
  );
  const addCommentReplyEmoji = replyForm.querySelector(
    ".add-comment-reply-emoji i"
  );
  const addCommentReplyPicture = replyForm.querySelector(
    ".add-comment-reply-picture"
  );
  const addCommentReplyGif = replyForm.querySelector(".add-comment-reply-gif");
  const commentReplyGifTooltip = replyForm.querySelector(
    ".reply-comment-gif-tooltip"
  );
  const commentsPlaceholderDiv = replyForm.querySelector(
    "#comments-placeholder"
  );
  const gifCommentResultsContainer =
    replyForm.querySelector("#gifCommentResults");

  const gifCommentSearchInput = replyForm.querySelector(
    "#gifCommentSearchInput"
  );
  const commentsGifPlaceholder = replyForm.querySelector(
    "#comments-gif-placeholder"
  );

  const commentsPicturePlaceholder = replyForm.querySelector(
    "#comments-picture-placeholder"
  );
  const commentsPicturePlaceholderImg = replyForm.querySelector(
    "#comments-picture-placeholder img"
  );
  const commentImageInput = replyForm.querySelector("#comment-image-input");
  const commentsPicturePlaceholderCancelBtn = replyForm.querySelector(
    "#comments-picture-placeholder i"
  );

  commentReplyTextarea.addEventListener("input", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
  });

  addCommentReplyGif.addEventListener("click", function (e) {
    commentReplyGifTooltip.style.display =
      commentReplyGifTooltip.style.display === "block" ? "none" : "block";
    getTrendingCommentReplyData(
      gifCommentResultsContainer,
      commentReplyGifTooltip,
      gifCommentSearchInput,
      commentsGifPlaceholder,
      commentsPlaceholderDiv,
      commentsPicturePlaceholder,
      addCommentReplyPicture
    );
  });

  gifCommentSearchInput.addEventListener(
    "input",
    debounce(function () {
      searchReplyCommentsGIFs(
        gifCommentResultsContainer,
        commentReplyGifTooltip,
        gifCommentSearchInput,
        commentsGifPlaceholder,
        commentsPlaceholderDiv,
        commentsPicturePlaceholder,
        addCommentReplyPicture
      );
    }, 300)
  );

  // ADD EMOJI TO COMMENTS REPLY
  addCommentReplyEmoji.addEventListener(
    "click",
    openReplyEmoji(addCommentReplyEmoji, commentReplyTextarea)
  );

  // ADD PICTURE TO COMMENTS REPLY
  addCommentReplyPicture.addEventListener("click", function () {
    commentReplyGifTooltip.style.display = "none";
    commentImageInput.click();
  });

  commentImageInput.addEventListener("change", function (e) {
    const selectedImage = this.files[0];
    if (selectedImage) {
      displayReplysImage(
        selectedImage,
        commentsPlaceholderDiv,
        commentsPicturePlaceholderImg,
        commentsPicturePlaceholder,
        commentsGifPlaceholder,
        commentsPicturePlaceholderCancelBtn,
        addCommentReplyGif
      );
    }
  });

  commentsPicturePlaceholderCancelBtn.addEventListener("click", function () {
    deleteAddReplyPhoto(
      commentsPicturePlaceholderImg,
      commentsPicturePlaceholderCancelBtn,
      addCommentReplyGif
    );
  });
}

async function getTrendingCommentReplyData(
  gifContainer,
  replyTooltip,
  searchInput,
  gifPlaceholder,
  replyPlaceholderDiv,
  picturePlaceholder,
  addPictureReply
) {
  const apiKey = window.giphyApiKey;
  const trendingUrl = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`;

  try {
    const response = await fetch(trendingUrl);
    const data = await response.json();
    // console.log(data.data);
    generateCommentReplyHTML(
      data.data,
      gifContainer,
      replyTooltip,
      searchInput,
      gifPlaceholder,
      replyPlaceholderDiv,
      picturePlaceholder,
      addPictureReply
    ); // Array of trending GIFs
  } catch (error) {
    console.error("Error fetching GIFs:", error);
    return [];
  }
}

function generateCommentReplyHTML(
  results,
  gifContainer,
  replyTooltip,
  searchInput,
  gifPlaceholder,
  replyPlaceholderDiv,
  picturePlaceholder,
  addPictureReply
) {
  let generatedHTML = "";
  results.map((result) => {
    generatedHTML += `
     <div class="comment-single-gif">
        <a><img src="${result.images.fixed_width.url}" class="comment-animated-gif"></a>
      </div>
    `;
  });
  gifContainer.innerHTML = generatedHTML;

  // Get all the GIF elements and add click event listeners
  const gifElements = document.querySelectorAll(".comment-animated-gif");
  gifElements.forEach((gifElement) => {
    gifElement.addEventListener("click", () => {
      console.log("hello world");
      moveCommentReplyGifToSection(
        replyTooltip,
        gifElement,
        searchInput,
        gifPlaceholder,
        replyPlaceholderDiv,
        picturePlaceholder,
        addPictureReply
      );
      replyTooltip.style.display = "none";
      addPictureReply.style.pointerEvents = "none";
    });
  });
}

async function searchReplyCommentsGIFs(
  gifContainer,
  replyTooltip,
  searchInput,
  gifPlaceholder,
  replyPlaceholderDiv,
  picturePlaceholder,
  addPictureReply
) {
  const apiKey = window.giphyApiKey;
  const searchQuery = searchInput.value;

  if (!searchQuery) {
    // If search input is empty, go back to trending
    await getTrendingCommentReplyData(
      gifContainer,
      replyTooltip,
      searchInput,
      gifPlaceholder,
      replyPlaceholderDiv,
      picturePlaceholder,
      addPictureReply
    );
    return;
  }

  const searchUrl = `https://api.giphy.com/v1/gifs/search?q=${searchQuery}&api_key=${apiKey}&limit=10`;

  try {
    const response = await fetch(searchUrl);
    const data = await response.json();
    // console.log(data.data);
    generateCommentReplyHTML(
      data.data,
      gifContainer,
      replyTooltip,
      searchInput,
      gifPlaceholder,
      replyPlaceholderDiv,
      picturePlaceholder,
      addPictureReply
    ); // Array of searched GIFs
  } catch (error) {
    console.error("Error searching GIFs:", error);
  }
}

function moveCommentReplyGifToSection(
  replyTooltip,
  gifElement,
  searchInput,
  gifPlaceholder,
  replyPlaceholderDiv,
  picturePlaceholder,
  addPictureReply
) {
  //Empty the search input
  searchInput.value = "";

  const gifSrc = gifElement.getAttribute("src");
  const gifImage = document.createElement("img");
  gifImage.setAttribute("src", gifSrc);
  gifImage.classList.add("comment-added-gif");

  replyPlaceholderDiv.style.display = "block";
  picturePlaceholder.style.display = "none";
  gifPlaceholder.style.display = "flex";
  addPictureReply.style.pointerEvents = "none";
  replyTooltip.style.display = "none";

  // Create a hidden input element
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden"; // Set the input type to "hidden"
  hiddenInput.name = "commentGIF"; // Set a name for the input element (change as needed)
  hiddenInput.value = gifSrc; // Set the value from img.src

  // Create a delete button for the cloned GIF
  const deleteButton = document.createElement("a");
  deleteButton.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
  deleteButton.className = "gif-comment-delete-button";
  deleteButton.addEventListener("click", () => {
    // Remove the GIF and the delete button
    gifImage.remove();
    hiddenInput.value = "";
    deleteButton.remove();
    addPictureReply.style.pointerEvents = "auto";
  });

  gifPlaceholder.appendChild(gifImage);
  gifPlaceholder.appendChild(hiddenInput);
  gifPlaceholder.appendChild(deleteButton);
}

/////ADD EMOJIS
function openReplyEmoji(replyEmoji, replyTextarea) {
  const picker = createPopup(
    {},
    {
      referenceElement: replyEmoji,
      triggerElement: replyEmoji,
      position: "bottom-end",
      className: "emojiPopup",
    }
  );

  replyEmoji.addEventListener("click", () => {
    console.log("hello world");
    picker.toggle();
  });

  picker.addEventListener("emoji:select", (selection) => {
    replyTextarea.value += selection.emoji;
  });
}

////// ADD IMAGEEE
function displayReplysImage(
  file,
  placeholderDiv,
  picturePlaceholderImg,
  picturePlaceholder,
  gifPlaceholder,
  picturePlaceholderCancelBtn,
  addReplyGif
) {
  // console.log("displayReplysImage function executed");

  const reader = new FileReader();
  reader.onload = function () {
    const src = reader.result;

    placeholderDiv.style.display = "block";
    picturePlaceholder.style.display = "flex";
    gifPlaceholder.style.display = "none";
    picturePlaceholderCancelBtn.style.display = "block";

    picturePlaceholderImg.style.display = "block";
    picturePlaceholderImg.src = src;
    picturePlaceholderImg.alt = file.name;

    addReplyGif.style.pointerEvents = "none";
  };

  reader.readAsDataURL(file);
}

function deleteAddReplyPhoto(
  picturePlaceholderImg,
  picturePlaceholderCancelBtn,
  addReplyGif
) {
  console.log("hello world");
  picturePlaceholderImg.src = "";
  picturePlaceholderImg.alt = "";
  picturePlaceholderImg.style.display = "none";
  picturePlaceholderCancelBtn.style.display = "none";
  addReplyGif.style.pointerEvents = "auto";
}

/////////// COMMENT EDIT /////////////
// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
  initializeEditCommentReplies();
  initializeDashboardEditCommentReplies();
  initializeBookmarkEditCommentReplies();
});

function initializeEditCommentReplies() {
  const commentsEdit = document.querySelectorAll(
    ".result_comment .tools_comment .edit"
  );

  commentsEdit.forEach((edit) => {
    edit.addEventListener("click", (e) => {
      handleEdit(e);
    });
  });
}

function initializeDashboardEditCommentReplies() {
  const commentsEdit = document.querySelectorAll(
    ".result_comment .tools_comment .edit-dashboard"
  );

  commentsEdit.forEach((edit) => {
    edit.addEventListener("click", (e) => {
      handleDashboardEdit(e);
    });
  });
}

function initializeBookmarkEditCommentReplies() {
  const commentsEdit = document.querySelectorAll(
    ".result_comment .tools_comment .edit-bookmark"
  );

  commentsEdit.forEach((edit) => {
    edit.addEventListener("click", (e) => {
      handleBookmarkEdit(e);
    });
  });
}

function handleEdit(e) {
  e.preventDefault();
  const editButton = e.currentTarget;
  openEditForm(editButton);
}

function handleDashboardEdit(e) {
  e.preventDefault();
  const editButton = e.currentTarget;
  openDashboardEditForm(editButton);
}

function handleBookmarkEdit(e) {
  e.preventDefault();
  const editButton = e.currentTarget;
  openBookmarkEditForm(editButton);
}

function openEditForm(element) {
  const current = element.closest(".result_comment");
  const regularComment = current.querySelector(".result_comment-container");
  const editModal = current.querySelector(".edit-comment-modal");
  const editForm = current.querySelector(".comment-edit-form");

  if (!editForm) {
    regularComment.style.display = "none";
    editModal.style.display = "flex";
    createEditForm(element);
  }
}

function openDashboardEditForm(element) {
  const current = element.closest(".result_comment");
  const regularComment = current.querySelector(".result_comment-container");
  const editModal = current.querySelector(".edit-comment-modal");
  const editForm = current.querySelector(".comment-edit-form");

  if (!editForm) {
    regularComment.style.display = "none";
    editModal.style.display = "flex";
    createDashboardEditForm(element);
  }
}

function openBookmarkEditForm(element) {
  const current = element.closest(".result_comment");
  const regularComment = current.querySelector(".result_comment-container");
  const editModal = current.querySelector(".edit-comment-modal");
  const editForm = current.querySelector(".comment-edit-form");

  if (!editForm) {
    regularComment.style.display = "none";
    editModal.style.display = "flex";
    createBookmarkEditForm(element);
  }
}

function closeEditForm(element) {
  const current = element.closest(".result_comment");
  const regularComment = current.querySelector(".result_comment-container");
  const editModal = current.querySelector(".edit-comment-modal");

  if (editModal) {
    // If the edit form exists, close and remove it
    regularComment.style.display = "flex";
    editModal.style.display = "none";
    editModal.innerHTML = "";
  }
}

function createEditForm(element) {
  console.log(element);
  const current = element.closest(".result_comment");

  // Retrieve data attributes from the current comment element
  const postId = element.getAttribute("data-post-id");
  const commentId = element.getAttribute("data-comment-id");
  const commentCaption = element.getAttribute("data-comment-caption");
  const commentPhoto = element.getAttribute("data-comment-photo");
  const commentPhotoCloudinary = element.getAttribute(
    "data-comment-photo-cloudinary"
  );
  const commentGif = element.getAttribute("data-comment-gif");
  const commentGifCloudinary = element.getAttribute(
    "data-comment-gif-cloudinary"
  );

  const childReplayList = current.querySelector(".edit-comment-modal");

  const editForm = document.createElement("div");
  editForm.className = "row";

  console.log(postId);
  console.log(commentId);

  if (commentPhoto !== "") {
    editForm.innerHTML = `
  <form action="/comment/editComment/${postId}/${commentId}?_method=PUT" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container comment-edit-form">
    <div class="comments comments-reply" id="comments">
      <div class="comment-utilities">
      <a class="close-comment-edit"><i class="fa-solid fa-x"></i></a>
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" oninput="adjustInputHeight(this)">${commentCaption}</textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder" style="display: block;">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder" style="display: flex;">
        <img src="${commentPhoto}" alt="${commentPhotoCloudinary}" style="display: block;">
        <a><i class="fa-solid fa-circle-xmark" style="display: block;"></i></a>
         <input type="hidden" name="commentPhoto" value="${commentPhoto}">
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder" style="display: none;"></div>
    </div> 
  </div>
  </form>   
  `;
    const addCommentReplyGif = editForm.querySelector(".add-comment-reply-gif");

    addCommentReplyGif.style.pointerEvents = "none";
    // Create a delete button for the cloned GIF
    const deleteButton = editForm.querySelector(
      ".comments-picture-placeholder i"
    );
    const imgElement = editForm.querySelector(
      ".comments-picture-placeholder img"
    );
    const pictureHiddenInput = editForm.querySelector(
      ".comments-picture-placeholder input"
    );

    deleteButton.addEventListener("click", () => {
      imgElement.src = "";
      imgElement.alt = "";
      imgElement.style.display = "none";
      deleteButton.style.display = "none";
      pictureHiddenInput.remove();
      addCommentReplyGif.style.pointerEvents = "auto";
    });
  } else if (commentGif !== "") {
    editForm.innerHTML = `
  <form action="/comment/editComment/${postId}/${commentId}?_method=PUT" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container comment-edit-form">
    <div class="comments comments-reply" id="comments">
      <div class="comment-utilities">
      <a class="close-comment-edit"><i class="fa-solid fa-x"></i></a>
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" oninput="adjustInputHeight(this)">${commentCaption}</textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder" style="display: block;">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder" style="display: none;">
        <img src="" alt="">
        <a><i class="fa-solid fa-circle-xmark"></i></a>
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder" style="display: flex;">
      <img src="${commentGif}" alt="${commentGifCloudinary}" class="comment-added-gif">
      <input type="hidden" name="commentGIF" value="${commentGif}">
      <a class="gif-comment-delete-button"><i class="fa-solid fa-circle-xmark"></i></a></div>
    </div> 
  </div>
  </form>   
  `;
    const addCommentReplyPicture = editForm.querySelector(
      ".add-comment-reply-picture"
    );

    // Create a delete button for the cloned GIF
    const deleteButton = editForm.querySelector(
      ".comments-gif-placeholder .gif-comment-delete-button"
    );

    const gifImage = editForm.querySelector(".comment-added-gif");
    const gifHiddenInput = editForm.querySelector(
      ".comments-gif-placeholder input"
    );

    deleteButton.addEventListener("click", () => {
      // Remove the GIF and the delete button
      gifImage.remove();
      gifHiddenInput.remove();
      deleteButton.remove();
      addCommentReplyPicture.style.pointerEvents = "auto";
    });

    addCommentReplyPicture.style.pointerEvents = "none";
  } else {
    editForm.innerHTML = `
  <form action="/comment/editComment/${postId}/${commentId}?_method=PUT" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container comment-edit-form">
    <div class="comments comments-reply" id="comments">
      <div class="comment-utilities">
      <a class="close-comment-edit"><i class="fa-solid fa-x"></i></a>
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" oninput="adjustInputHeight(this)">${commentCaption}</textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder">
        <img src="" alt="">
        <a><i class="fa-solid fa-circle-xmark"></i></a>
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder">
      </div>
    </div> 
  </div>
  </form>   
  `;
  }

  // Add event listener to the close button within the edit form
  const closeCommentEditButton = editForm.querySelector(".close-comment-edit");
  closeCommentEditButton.addEventListener("click", () => {
    closeEditForm(element);
  });

  // ADD GIFS && PICTURES
  childReplayList.appendChild(editForm);

  // Add event listeners to elements within the created form
  const addCommentReplyPicture = editForm.querySelector(
    ".add-comment-reply-picture"
  );
  const addCommentReplyGif = editForm.querySelector(".add-comment-reply-gif");
  const commentReplyTextarea = editForm.querySelector(
    ".comment-reply-textarea"
  );
  const addCommentReplyEmoji = editForm.querySelector(
    ".add-comment-reply-emoji i"
  );
  const commentReplyGifTooltip = editForm.querySelector(
    ".reply-comment-gif-tooltip"
  );
  const commentsPlaceholderDiv = editForm.querySelector(
    "#comments-placeholder"
  );
  const gifCommentResultsContainer =
    editForm.querySelector("#gifCommentResults");

  const gifCommentSearchInput = editForm.querySelector(
    "#gifCommentSearchInput"
  );
  const commentsGifPlaceholder = editForm.querySelector(
    "#comments-gif-placeholder"
  );

  const commentsPicturePlaceholder = editForm.querySelector(
    "#comments-picture-placeholder"
  );
  const commentsPicturePlaceholderImg = editForm.querySelector(
    "#comments-picture-placeholder img"
  );
  const commentImageInput = editForm.querySelector("#comment-image-input");
  const commentsPicturePlaceholderCancelBtn = editForm.querySelector(
    "#comments-picture-placeholder i"
  );

  commentReplyTextarea.addEventListener("input", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
  });

  addCommentReplyGif.addEventListener("click", function (e) {
    commentReplyGifTooltip.style.display =
      commentReplyGifTooltip.style.display === "block" ? "none" : "block";
    getTrendingCommentReplyData(
      gifCommentResultsContainer,
      commentReplyGifTooltip,
      gifCommentSearchInput,
      commentsGifPlaceholder,
      commentsPlaceholderDiv,
      commentsPicturePlaceholder,
      addCommentReplyPicture
    );
  });

  gifCommentSearchInput.addEventListener(
    "input",
    debounce(function () {
      searchReplyCommentsGIFs(
        gifCommentResultsContainer,
        commentReplyGifTooltip,
        gifCommentSearchInput,
        commentsGifPlaceholder,
        commentsPlaceholderDiv,
        commentsPicturePlaceholder,
        addCommentReplyPicture
      );
    }, 300)
  );

  // ADD EMOJI TO COMMENTS REPLY
  addCommentReplyEmoji.addEventListener(
    "click",
    openReplyEmoji(addCommentReplyEmoji, commentReplyTextarea)
  );

  // ADD PICTURE TO COMMENTS REPLY
  addCommentReplyPicture.addEventListener("click", function () {
    commentReplyGifTooltip.style.display = "none";
    commentImageInput.click();
  });

  commentImageInput.addEventListener("change", function (e) {
    const selectedImage = this.files[0];
    if (selectedImage) {
      displayReplysImage(
        selectedImage,
        commentsPlaceholderDiv,
        commentsPicturePlaceholderImg,
        commentsPicturePlaceholder,
        commentsGifPlaceholder,
        commentsPicturePlaceholderCancelBtn,
        addCommentReplyGif
      );
    }
  });

  commentsPicturePlaceholderCancelBtn.addEventListener("click", function () {
    deleteAddReplyPhoto(
      commentsPicturePlaceholderImg,
      commentsPicturePlaceholderCancelBtn,
      addCommentReplyGif
    );
  });
}

function createDashboardEditForm(element) {
  console.log(element);
  const current = element.closest(".result_comment");

  // Retrieve data attributes from the current comment element
  const postId = element.getAttribute("data-post-id");
  const commentId = element.getAttribute("data-comment-id");
  const commentCaption = element.getAttribute("data-comment-caption");
  const commentPhoto = element.getAttribute("data-comment-photo");
  const commentPhotoCloudinary = element.getAttribute(
    "data-comment-photo-cloudinary"
  );
  const commentGif = element.getAttribute("data-comment-gif");
  const commentGifCloudinary = element.getAttribute(
    "data-comment-gif-cloudinary"
  );

  const childReplayList = current.querySelector(".edit-comment-modal");

  const editForm = document.createElement("div");
  editForm.className = "row";

  console.log(postId);
  console.log(commentId);

  if (commentPhoto !== "") {
    editForm.innerHTML = `
  <form action="/comment/editCommentDashboard/${postId}/${commentId}?_method=PUT" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container comment-edit-form">
    <div class="comments comments-reply" id="comments">
      <div class="comment-utilities">
      <a class="close-comment-edit"><i class="fa-solid fa-x"></i></a>
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" oninput="adjustInputHeight(this)">${commentCaption}</textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder" style="display: block;">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder" style="display: flex;">
        <img src="${commentPhoto}" alt="${commentPhotoCloudinary}" style="display: block;">
        <a><i class="fa-solid fa-circle-xmark" style="display: block;"></i></a>
         <input type="hidden" name="commentPhoto" value="${commentPhoto}">
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder" style="display: none;"></div>
    </div> 
  </div>
  </form>   
  `;
    const addCommentReplyGif = editForm.querySelector(".add-comment-reply-gif");

    addCommentReplyGif.style.pointerEvents = "none";
    // Create a delete button for the cloned GIF
    const deleteButton = editForm.querySelector(
      ".comments-picture-placeholder i"
    );
    const imgElement = editForm.querySelector(
      ".comments-picture-placeholder img"
    );
    const pictureHiddenInput = editForm.querySelector(
      ".comments-picture-placeholder input"
    );

    deleteButton.addEventListener("click", () => {
      imgElement.src = "";
      imgElement.alt = "";
      imgElement.style.display = "none";
      deleteButton.style.display = "none";
      pictureHiddenInput.remove();
      addCommentReplyGif.style.pointerEvents = "auto";
    });
  } else if (commentGif !== "") {
    editForm.innerHTML = `
  <form action="/comment/editCommentDashboard/${postId}/${commentId}?_method=PUT" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container comment-edit-form">
    <div class="comments comments-reply" id="comments">
      <div class="comment-utilities">
      <a class="close-comment-edit"><i class="fa-solid fa-x"></i></a>
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" oninput="adjustInputHeight(this)">${commentCaption}</textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder" style="display: block;">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder" style="display: none;">
        <img src="" alt="">
        <a><i class="fa-solid fa-circle-xmark"></i></a>
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder" style="display: flex;">
      <img src="${commentGif}" alt="${commentGifCloudinary}" class="comment-added-gif">
      <input type="hidden" name="commentGIF" value="${commentGif}">
      <a class="gif-comment-delete-button"><i class="fa-solid fa-circle-xmark"></i></a></div>
    </div> 
  </div>
  </form>   
  `;
    const addCommentReplyPicture = editForm.querySelector(
      ".add-comment-reply-picture"
    );

    // Create a delete button for the cloned GIF
    const deleteButton = editForm.querySelector(
      ".comments-gif-placeholder .gif-comment-delete-button"
    );

    const gifImage = editForm.querySelector(".comment-added-gif");
    const gifHiddenInput = editForm.querySelector(
      ".comments-gif-placeholder input"
    );

    deleteButton.addEventListener("click", () => {
      // Remove the GIF and the delete button
      gifImage.remove();
      gifHiddenInput.remove();
      deleteButton.remove();
      addCommentReplyPicture.style.pointerEvents = "auto";
    });

    addCommentReplyPicture.style.pointerEvents = "none";
  } else {
    editForm.innerHTML = `
  <form action="/comment/editCommentDashboard/${postId}/${commentId}?_method=PUT" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container comment-edit-form">
    <div class="comments comments-reply" id="comments">
      <div class="comment-utilities">
      <a class="close-comment-edit"><i class="fa-solid fa-x"></i></a>
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" oninput="adjustInputHeight(this)">${commentCaption}</textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder">
        <img src="" alt="">
        <a><i class="fa-solid fa-circle-xmark"></i></a>
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder">
      </div>
    </div> 
  </div>
  </form>   
  `;
  }

  // Add event listener to the close button within the edit form
  const closeCommentEditButton = editForm.querySelector(".close-comment-edit");
  closeCommentEditButton.addEventListener("click", () => {
    closeEditForm(element);
  });

  // ADD GIFS && PICTURES
  childReplayList.appendChild(editForm);

  // Add event listeners to elements within the created form
  const addCommentReplyPicture = editForm.querySelector(
    ".add-comment-reply-picture"
  );
  const addCommentReplyGif = editForm.querySelector(".add-comment-reply-gif");
  const commentReplyTextarea = editForm.querySelector(
    ".comment-reply-textarea"
  );
  const addCommentReplyEmoji = editForm.querySelector(
    ".add-comment-reply-emoji i"
  );
  const commentReplyGifTooltip = editForm.querySelector(
    ".reply-comment-gif-tooltip"
  );
  const commentsPlaceholderDiv = editForm.querySelector(
    "#comments-placeholder"
  );
  const gifCommentResultsContainer =
    editForm.querySelector("#gifCommentResults");

  const gifCommentSearchInput = editForm.querySelector(
    "#gifCommentSearchInput"
  );
  const commentsGifPlaceholder = editForm.querySelector(
    "#comments-gif-placeholder"
  );

  const commentsPicturePlaceholder = editForm.querySelector(
    "#comments-picture-placeholder"
  );
  const commentsPicturePlaceholderImg = editForm.querySelector(
    "#comments-picture-placeholder img"
  );
  const commentImageInput = editForm.querySelector("#comment-image-input");
  const commentsPicturePlaceholderCancelBtn = editForm.querySelector(
    "#comments-picture-placeholder i"
  );

  commentReplyTextarea.addEventListener("input", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
  });

  addCommentReplyGif.addEventListener("click", function (e) {
    commentReplyGifTooltip.style.display =
      commentReplyGifTooltip.style.display === "block" ? "none" : "block";
    getTrendingCommentReplyData(
      gifCommentResultsContainer,
      commentReplyGifTooltip,
      gifCommentSearchInput,
      commentsGifPlaceholder,
      commentsPlaceholderDiv,
      commentsPicturePlaceholder,
      addCommentReplyPicture
    );
  });

  gifCommentSearchInput.addEventListener(
    "input",
    debounce(function () {
      searchReplyCommentsGIFs(
        gifCommentResultsContainer,
        commentReplyGifTooltip,
        gifCommentSearchInput,
        commentsGifPlaceholder,
        commentsPlaceholderDiv,
        commentsPicturePlaceholder,
        addCommentReplyPicture
      );
    }, 300)
  );

  // ADD EMOJI TO COMMENTS REPLY
  addCommentReplyEmoji.addEventListener(
    "click",
    openReplyEmoji(addCommentReplyEmoji, commentReplyTextarea)
  );

  // ADD PICTURE TO COMMENTS REPLY
  addCommentReplyPicture.addEventListener("click", function () {
    commentReplyGifTooltip.style.display = "none";
    commentImageInput.click();
  });

  commentImageInput.addEventListener("change", function (e) {
    const selectedImage = this.files[0];
    if (selectedImage) {
      displayReplysImage(
        selectedImage,
        commentsPlaceholderDiv,
        commentsPicturePlaceholderImg,
        commentsPicturePlaceholder,
        commentsGifPlaceholder,
        commentsPicturePlaceholderCancelBtn,
        addCommentReplyGif
      );
    }
  });

  commentsPicturePlaceholderCancelBtn.addEventListener("click", function () {
    deleteAddReplyPhoto(
      commentsPicturePlaceholderImg,
      commentsPicturePlaceholderCancelBtn,
      addCommentReplyGif
    );
  });
}

function createBookmarkEditForm(element) {
  console.log(element);
  const current = element.closest(".result_comment");

  // Retrieve data attributes from the current comment element
  const postId = element.getAttribute("data-post-id");
  const commentId = element.getAttribute("data-comment-id");
  const commentCaption = element.getAttribute("data-comment-caption");
  const commentPhoto = element.getAttribute("data-comment-photo");
  const commentPhotoCloudinary = element.getAttribute(
    "data-comment-photo-cloudinary"
  );
  const commentGif = element.getAttribute("data-comment-gif");
  const commentGifCloudinary = element.getAttribute(
    "data-comment-gif-cloudinary"
  );

  const childReplayList = current.querySelector(".edit-comment-modal");

  const editForm = document.createElement("div");
  editForm.className = "row";

  console.log(postId);
  console.log(commentId);

  if (commentPhoto !== "") {
    editForm.innerHTML = `
  <form action="/comment/editCommentBookmark/${postId}/${commentId}?_method=PUT" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container comment-edit-form">
    <div class="comments comments-reply" id="comments">
      <div class="comment-utilities">
      <a class="close-comment-edit"><i class="fa-solid fa-x"></i></a>
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" oninput="adjustInputHeight(this)">${commentCaption}</textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder" style="display: block;">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder" style="display: flex;">
        <img src="${commentPhoto}" alt="${commentPhotoCloudinary}" style="display: block;">
        <a><i class="fa-solid fa-circle-xmark" style="display: block;"></i></a>
         <input type="hidden" name="commentPhoto" value="${commentPhoto}">
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder" style="display: none;"></div>
    </div> 
  </div>
  </form>   
  `;
    const addCommentReplyGif = editForm.querySelector(".add-comment-reply-gif");

    addCommentReplyGif.style.pointerEvents = "none";
    // Create a delete button for the cloned GIF
    const deleteButton = editForm.querySelector(
      ".comments-picture-placeholder i"
    );
    const imgElement = editForm.querySelector(
      ".comments-picture-placeholder img"
    );
    const pictureHiddenInput = editForm.querySelector(
      ".comments-picture-placeholder input"
    );

    deleteButton.addEventListener("click", () => {
      imgElement.src = "";
      imgElement.alt = "";
      imgElement.style.display = "none";
      deleteButton.style.display = "none";
      pictureHiddenInput.remove();
      addCommentReplyGif.style.pointerEvents = "auto";
    });
  } else if (commentGif !== "") {
    editForm.innerHTML = `
  <form action="/comment/editCommentBookmark/${postId}/${commentId}?_method=PUT" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container comment-edit-form">
    <div class="comments comments-reply" id="comments">
      <div class="comment-utilities">
      <a class="close-comment-edit"><i class="fa-solid fa-x"></i></a>
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" oninput="adjustInputHeight(this)">${commentCaption}</textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder" style="display: block;">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder" style="display: none;">
        <img src="" alt="">
        <a><i class="fa-solid fa-circle-xmark"></i></a>
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder" style="display: flex;">
      <img src="${commentGif}" alt="${commentGifCloudinary}" class="comment-added-gif">
      <input type="hidden" name="commentGIF" value="${commentGif}">
      <a class="gif-comment-delete-button"><i class="fa-solid fa-circle-xmark"></i></a></div>
    </div> 
  </div>
  </form>   
  `;
    const addCommentReplyPicture = editForm.querySelector(
      ".add-comment-reply-picture"
    );

    // Create a delete button for the cloned GIF
    const deleteButton = editForm.querySelector(
      ".comments-gif-placeholder .gif-comment-delete-button"
    );

    const gifImage = editForm.querySelector(".comment-added-gif");
    const gifHiddenInput = editForm.querySelector(
      ".comments-gif-placeholder input"
    );

    deleteButton.addEventListener("click", () => {
      // Remove the GIF and the delete button
      gifImage.remove();
      gifHiddenInput.remove();
      deleteButton.remove();
      addCommentReplyPicture.style.pointerEvents = "auto";
    });

    addCommentReplyPicture.style.pointerEvents = "none";
  } else {
    editForm.innerHTML = `
  <form action="/comment/editCommentBookmark/${postId}/${commentId}?_method=PUT" enctype="multipart/form-data" method="POST">
  <div class="comments-reply-container comment-edit-form">
    <div class="comments comments-reply" id="comments">
      <div class="comment-utilities">
      <a class="close-comment-edit"><i class="fa-solid fa-x"></i></a>
        <div class="comment_search">
          <textarea class="comment-reply-textarea" name="comment-textarea" id="comment-textarea" type="text" oninput="adjustInputHeight(this)">${commentCaption}</textarea>
          <div class="comment-btns">
            <div class="comment-btns-btn">
              <a class="addCommentBtns add-comment-reply-emoji" id="add-comment-emoji">
                <i class="fa-regular fa-face-smile"></i>
              </a>
              <a class="addCommentBtns add-comment-reply-picture" id="add-comment-picture">
                <i class="fa-solid fa-camera"></i>
              </a>
              <input name="file" type="file" accept="image/*" id="comment-image-input">
              <div class="comment-gif-container" id="comment-gif-container">
                <a class="addCommentBtns add-comment-reply-gif" id="add-comment-gif">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 75" enable-background="new 0 0 60 60" xml:space="preserve" preserveAspectRatio="xMidYMid meet">
                    <path d="M41,6H19C11.83,6,6,11.83,6,19v22c0,7.17,5.83,13,13,13h22c7.17,0,13-5.83,13-13V19C54,11.83,48.17,6,41,6z M26,33  c0,3.31-2.69,6-6,6s-6-2.69-6-6v-6c0-3.31,2.69-6,6-6c0.81,0,1.6,0.16,2.34,0.47c0.5,0.22,0.74,0.81,0.53,1.32  c-0.22,0.51-0.81,0.74-1.31,0.53C21.06,23.11,20.54,23,20,23c-2.21,0-4,1.8-4,4v6c0,2.21,1.79,4,4,4s4-1.79,4-4v-2h-3  c-0.55,0-1-0.45-1-1s0.45-1,1-1h4c0.55,0,1,0.45,1,1V33z M32,38c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1s1,0.45,1,1V38z   M46,28c0.55,0,1,0.45,1,1s-0.45,1-1,1h-7v8c0,0.55-0.45,1-1,1s-1-0.45-1-1V22c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1s-0.45,1-1,1  h-7v5H46z" />
                  </svg>
                </a>
                <div class="comment-gif-tooltip reply-comment-gif-tooltip" id="comment-gif-tooltip">
                  <div class="comment-gif-row-search">
                    <i class="fa-solid fa-magnifying-glass comment-gif-search-icon"></i>
                    <input type="text" id="gifCommentSearchInput" placeholder="Search GIFs">
                  </div>
                  <div id="gifCommentResults" class="gifCommentResults">
                  </div>
                </div>
              </div>
            </div>
          <div class="addCommentBtn" id="add-comment-to-post-btn">
            <button class="fa-solid fa-paper-plane"></button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="comments-placeholder" id="comments-placeholder">
      <div class="comments-picture-placeholder" id="comments-picture-placeholder">
        <img src="" alt="">
        <a><i class="fa-solid fa-circle-xmark"></i></a>
      </div>
      <div class="comments-gif-placeholder" id="comments-gif-placeholder">
      </div>
    </div> 
  </div>
  </form>   
  `;
  }

  // Add event listener to the close button within the edit form
  const closeCommentEditButton = editForm.querySelector(".close-comment-edit");
  closeCommentEditButton.addEventListener("click", () => {
    closeEditForm(element);
  });

  // ADD GIFS && PICTURES
  childReplayList.appendChild(editForm);

  // Add event listeners to elements within the created form
  const addCommentReplyPicture = editForm.querySelector(
    ".add-comment-reply-picture"
  );
  const addCommentReplyGif = editForm.querySelector(".add-comment-reply-gif");
  const commentReplyTextarea = editForm.querySelector(
    ".comment-reply-textarea"
  );
  const addCommentReplyEmoji = editForm.querySelector(
    ".add-comment-reply-emoji i"
  );
  const commentReplyGifTooltip = editForm.querySelector(
    ".reply-comment-gif-tooltip"
  );
  const commentsPlaceholderDiv = editForm.querySelector(
    "#comments-placeholder"
  );
  const gifCommentResultsContainer =
    editForm.querySelector("#gifCommentResults");

  const gifCommentSearchInput = editForm.querySelector(
    "#gifCommentSearchInput"
  );
  const commentsGifPlaceholder = editForm.querySelector(
    "#comments-gif-placeholder"
  );

  const commentsPicturePlaceholder = editForm.querySelector(
    "#comments-picture-placeholder"
  );
  const commentsPicturePlaceholderImg = editForm.querySelector(
    "#comments-picture-placeholder img"
  );
  const commentImageInput = editForm.querySelector("#comment-image-input");
  const commentsPicturePlaceholderCancelBtn = editForm.querySelector(
    "#comments-picture-placeholder i"
  );

  commentReplyTextarea.addEventListener("input", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
  });

  addCommentReplyGif.addEventListener("click", function (e) {
    commentReplyGifTooltip.style.display =
      commentReplyGifTooltip.style.display === "block" ? "none" : "block";
    getTrendingCommentReplyData(
      gifCommentResultsContainer,
      commentReplyGifTooltip,
      gifCommentSearchInput,
      commentsGifPlaceholder,
      commentsPlaceholderDiv,
      commentsPicturePlaceholder,
      addCommentReplyPicture
    );
  });

  gifCommentSearchInput.addEventListener(
    "input",
    debounce(function () {
      searchReplyCommentsGIFs(
        gifCommentResultsContainer,
        commentReplyGifTooltip,
        gifCommentSearchInput,
        commentsGifPlaceholder,
        commentsPlaceholderDiv,
        commentsPicturePlaceholder,
        addCommentReplyPicture
      );
    }, 300)
  );

  // ADD EMOJI TO COMMENTS REPLY
  addCommentReplyEmoji.addEventListener(
    "click",
    openReplyEmoji(addCommentReplyEmoji, commentReplyTextarea)
  );

  // ADD PICTURE TO COMMENTS REPLY
  addCommentReplyPicture.addEventListener("click", function () {
    commentReplyGifTooltip.style.display = "none";
    commentImageInput.click();
  });

  commentImageInput.addEventListener("change", function (e) {
    const selectedImage = this.files[0];
    if (selectedImage) {
      displayReplysImage(
        selectedImage,
        commentsPlaceholderDiv,
        commentsPicturePlaceholderImg,
        commentsPicturePlaceholder,
        commentsGifPlaceholder,
        commentsPicturePlaceholderCancelBtn,
        addCommentReplyGif
      );
    }
  });

  commentsPicturePlaceholderCancelBtn.addEventListener("click", function () {
    deleteAddReplyPhoto(
      commentsPicturePlaceholderImg,
      commentsPicturePlaceholderCancelBtn,
      addCommentReplyGif
    );
  });
}
