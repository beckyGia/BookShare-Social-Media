function showToast(message, type) {
  const toast = document.createElement("div");
  toast.textContent = message;
  console.log(message);
  toast.className = "toast";

  // Set styles based on the type of toast
  if (type === "success") {
    toast.style.backgroundColor = "var(--color-green)";
  } else if (type === "error") {
    toast.style.backgroundColor = "var(--color-red)";
  } else {
    // Default style for other types
    toast.style.backgroundColor = "var(--color-secondary)";
  }

  document.body.appendChild(toast);

  // Make the toast visible
  toast.style.display = "block";

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
