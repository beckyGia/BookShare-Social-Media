//// ====== TRUNCATE SYNOPSIS ========== /////

function toggleSynopsis(bookId) {
  const truncatedSynopsis = document.getElementById(
    `truncatedSynopsis${bookId}`
  );
  const fullSynopsis = document.getElementById(`fullSynopsis${bookId}`);
  const readMoreBtn = document.getElementById(`readMoreBtn${bookId}`);
  const readLessBtn = document.getElementById(`readLessBtn${bookId}`);

  if (truncatedSynopsis && fullSynopsis && readMoreBtn && readLessBtn) {
    if (fullSynopsis.style.display === "none") {
      truncatedSynopsis.style.display = "none";
      fullSynopsis.style.display = "inline";
      readMoreBtn.style.display = "none";
      readLessBtn.style.display = "inline";
    } else {
      truncatedSynopsis.style.display = "inline";
      fullSynopsis.style.display = "none";
      readMoreBtn.style.display = "inline";
      readLessBtn.style.display = "none";
    }
  }
}
