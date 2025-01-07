// ============== THEME/DISPLAY CUSTOMIZATION ================ //

// THEME
const display = document.querySelector("#display");
const themeModal = document.querySelector(".customize-theme");
const closeModal = document.querySelector("#close-theme");
const themeBtnA = document.querySelector("#themeBtn");

// FONT SIZES
const fontSizes = document.querySelectorAll(".choose-size span");

//ROOT VARIABLE
let root = document.querySelector(":root");

// PRIMARY COLOR
const colorPalette = document.querySelectorAll(".choose-color span");

// BACKGROUND COLORS
const Bg1 = document.querySelector(".bg-1");
const Bg2 = document.querySelector(".bg-2");
const Bg3 = document.querySelector(".bg-3");

// THEME/DISPLAY CUSTOMIZATION

// opens modal when you click theme customization button
const openThemeModal = () => {
  themeModal.style.display = "grid";
};

// closes modal when you click anyway but the modal itself
const closeThemeModal = (e) => {
  if (e.target.classList.contains("customize-theme")) {
    themeModal.style.display = "none";
  }
};

function closeThemeModalUsingX() {
  themeModal.style.display = "none";
}

// close modal
themeModal.addEventListener("click", closeThemeModal);
closeModal.addEventListener("click", closeThemeModalUsingX);

// open modal
themeBtnA.addEventListener("click", openThemeModal);
display.addEventListener("click", openThemeModal);

// ===================== FONTS ===================== //

// // Wait for the DOM to fully load
// document.addEventListener("DOMContentLoaded", function () {
//   const defaultFontSize = "16px"; // Set the default font size

//   // Function to set active class based on the current font size
//   const setActiveFontSize = (fontSizeIndex) => {
//     fontSizes.forEach((size) => {
//       size.classList.remove("active");
//     });

//     const activeSize = Array.from(fontSizes).find((size) =>
//       size.classList.contains(`font-size-${fontSizeIndex}`)
//     );

//     if (activeSize) {
//       activeSize.classList.add("active");
//     }
//   };

//   // Retrieve the saved font size from local storage
//   let savedFontSizeIndex = localStorage.getItem("fontSizeIndex");

//   // Set initial font size based on the saved font size or use the default
//   const initialFontSizeIndex = savedFontSizeIndex || "3";
//   setActiveFontSize(initialFontSizeIndex);

//   // Set the initial font size for the root html element
//   const applyFontSize = (fontSizeIndex) => {
//     let fontSize;

//     if (fontSizeIndex === 1) {
//       fontSize = "10px";
//     } else if (fontSizeIndex === 2) {
//       fontSize = "13px";
//     } else if (fontSizeIndex === 3) {
//       fontSize = "16px";
//     } else if (fontSizeIndex === 4) {
//       fontSize = "19px";
//     } else if (fontSizeIndex === 5) {
//       fontSize = "22px";
//     } else {
//       fontSize = defaultFontSize;
//     }

//     document.querySelector("html").style.fontSize = fontSize;
//   };

//   // Apply the initial font size
//   applyFontSize(initialFontSizeIndex);

//   //remove active class from spans of font size selectors
//   const removeSizeSelector = () => {
//     fontSizes.forEach((size) => {
//       size.classList.remove("active");
//     });
//   };

//   fontSizes.forEach((size) => {
//     size.addEventListener("click", () => {
//       removeSizeSelector();
//       let fontSizeIndex; // Set the font size index to 1

//       if (size.classList.contains("font-size-1")) {
//         fontSizeIndex = 1;
//         root.style.setProperty(" --sticky-top-left", "5.4rem");
//         root.style.setProperty(" --sticky-top-right", "5.4rem");
//       } else if (size.classList.contains("font-size-2")) {
//         fontSizeIndex = 2;
//         root.style.setProperty(" --sticky-top-left", "5.4rem");
//         root.style.setProperty(" --sticky-top-right", "-7rem");
//       } else if (size.classList.contains("font-size-3")) {
//         fontSizeIndex = 3;
//         root.style.setProperty(" --sticky-top-left", "-2rem");
//         root.style.setProperty(" --sticky-top-right", "-17rem");
//       } else if (size.classList.contains("font-size-4")) {
//         fontSizeIndex = 4;
//         root.style.setProperty(" --sticky-top-left", "-5rem");
//         root.style.setProperty(" --sticky-top-right", "25rem");
//       } else if (size.classList.contains("font-size-5")) {
//         fontSizeIndex = 5;
//         root.style.setProperty(" --sticky-top-left", "-12rem");
//         root.style.setProperty(" --sticky-top-right", "-35rem");
//       }

//       // Apply font size to the root html element
//       applyFontSize(fontSizeIndex);

//       // Set active class for the selected font size
//       setActiveFontSize(fontSizeIndex);

//       // Save the selected font size index to local storage
//       localStorage.setItem("fontSizeIndex", fontSizeIndex);
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  const fontSizes = document.querySelectorAll(".choose-size span");

  // Function to set active class based on the current font size
  const setActiveFontSize = (fontSizeIndex) => {
    fontSizes.forEach((size) => {
      size.classList.remove("active");
    });

    const activeSize = document.querySelector(`.font-size-${fontSizeIndex}`);

    if (activeSize) {
      activeSize.classList.add("active");
    }
  };

  // Retrieve the saved font size from local storage
  let savedFontSizeIndex = localStorage.getItem("fontSizeIndex");

  // Set initial font size based on the saved font size or use the default
  const initialFontSizeIndex = savedFontSizeIndex || "3";
  setActiveFontSize(initialFontSizeIndex);

  // Apply the initial font size
  const applyFontSize = (fontSizeIndex) => {
    let fontSize;

    if (fontSizeIndex === "1") {
      fontSize = "10px";
      root.style.setProperty("--sticky-top-left", "5.4rem");
      root.style.setProperty("--sticky-top-right", "5.4rem");
    } else if (fontSizeIndex === "2") {
      fontSize = "13px";
      root.style.setProperty("--sticky-top-left", "5.4rem");
      root.style.setProperty("--sticky-top-right", "-7rem");
    } else if (fontSizeIndex === "3") {
      fontSize = "16px";
      root.style.setProperty("--sticky-top-left", "-2rem");
      root.style.setProperty("--sticky-top-right", "-17rem");
    } else if (fontSizeIndex === "4") {
      fontSize = "19px";
      root.style.setProperty("--sticky-top-left", "-5rem");
      root.style.setProperty("--sticky-top-right", "25rem");
    } else if (fontSizeIndex === "5") {
      fontSize = "22px";
      root.style.setProperty("--sticky-top-left", "-12rem");
      root.style.setProperty("--sticky-top-right", "-35rem");
    }

    document.querySelector("html").style.fontSize = fontSize;
  };

  applyFontSize(initialFontSizeIndex);

  // Event listener for changing font size
  fontSizes.forEach((size) => {
    size.addEventListener("click", () => {
      const fontSizeIndex = size.dataset.fontSize;
      let fontSize = size;

      console.log("Font Size:", fontSize, "Index:", fontSizeIndex);

      // Apply font size to the root html element
      applyFontSize(fontSizeIndex);

      // Set active class for the selected font size
      setActiveFontSize(fontSizeIndex);

      // Save the selected font size index to local storage
      localStorage.setItem("fontSizeIndex", fontSizeIndex);
    });
  });
});

// ===================== CHANGE PRIMARY COLORS ===================== //

// Retrieve the saved primary hue from local storage
const savedPrimaryHue = localStorage.getItem("primaryHue");

// Apply the saved primary hue to the CSS custom property
if (savedPrimaryHue) {
  root.style.setProperty("--primary-color-hue", savedPrimaryHue);
  let position;

  if (savedPrimaryHue == 202) {
    position = 1;
  } else if (savedPrimaryHue == 52) {
    position = 2;
  } else if (savedPrimaryHue == 352) {
    position = 3;
  } else if (savedPrimaryHue == 152) {
    position = 4;
  } else if (savedPrimaryHue == 252) {
    position = 5;
  }

  // Add "active" class to the corresponding color picker based on saved hue
  colorPalette.forEach((color) => {
    if (color.classList.contains(`color-${position}`)) {
      color.classList.add("active");
    }
  });
}

const changeActiveColorClass = () => {
  colorPalette.forEach((colorPicker) => {
    colorPicker.classList.remove("active");
  });
};

colorPalette.forEach((color) => {
  color.addEventListener("click", () => {
    let primaryHue;
    // remove active class from colors
    changeActiveColorClass();

    if (color.classList.contains("color-1")) {
      primaryHue = 202;
    } else if (color.classList.contains("color-2")) {
      primaryHue = 52;
    } else if (color.classList.contains("color-3")) {
      primaryHue = 352;
    } else if (color.classList.contains("color-4")) {
      primaryHue = 152;
    } else if (color.classList.contains("color-5")) {
      primaryHue = 252;
    }

    color.classList.add("active");

    // Save the selected primary hue in local storage
    localStorage.setItem("primaryHue", primaryHue);

    // Apply the primary hue to the CSS custom property
    root.style.setProperty("--primary-color-hue", primaryHue);
  });
});

// ===================== CHANGE BACKGROUND COLOR ===================== //

// theme BACKGROUND values
let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;
let primaryColorLightness;

// changes background color
const changeBG = () => {
  root.style.setProperty("--light-color-lightness", lightColorLightness);
  root.style.setProperty("--white-color-lightness", whiteColorLightness);
  root.style.setProperty("--dark-color-lightness", darkColorLightness);
  root.style.setProperty("--primary-color-lightness", primaryColorLightness);
};

// Function to set active class based on the current theme
const setActiveTheme = (theme) => {
  Bg1.classList.remove("active");
  Bg2.classList.remove("active");
  Bg3.classList.remove("active");

  if (theme === "light") {
    Bg1.classList.add("active");
  } else if (theme === "dim") {
    Bg2.classList.add("active");
  } else if (theme === "dark") {
    Bg3.classList.add("active");
  }
};

// Retrieve the saved theme from local storage
const savedTheme = localStorage.getItem("theme");

// Set initial theme based on the saved theme or use a default
const initialTheme = savedTheme || "light";
setActiveTheme(initialTheme);

// change background colors
Bg1.addEventListener("click", () => {
  darkColorLightness = "17%";
  whiteColorLightness = "100%";
  lightColorLightness = "95%";
  primaryColorLightness = "64%";

  indexLogoImg.src = "/img/black-logo.png";
  root.style.setProperty("--color-text", "#000");

  changeBG();
  localStorage.setItem("theme", "light");
  setActiveTheme("light"); // Set active class
  // remove customized changes from local storage
  window.location.reload();
});

Bg2.addEventListener("click", () => {
  darkColorLightness = "95%";
  whiteColorLightness = "20%";
  lightColorLightness = "15%";
  primaryColorLightness = "40%";

  indexLogoImg.src = "/img/white-logo.png";
  root.style.setProperty("--color-text", "#fff");
  changeBG();
  localStorage.setItem("theme", "dim");
  setActiveTheme("dim"); // Set active class
});

Bg3.addEventListener("click", () => {
  darkColorLightness = "95%";
  whiteColorLightness = "10%";
  lightColorLightness = "0%";
  primaryColorLightness = "30%";

  indexLogoImg.src = "/img/white-logo.png";
  root.style.setProperty("--color-text", "#fff");
  changeBG();
  localStorage.setItem("theme", "dark");
  setActiveTheme("dark"); // Set active class
});

// function setMode(item) {
//   const wrapper = document.querySelector(":root");
//   if (Bg1) {
//     wrapper.setAttribute("data-theme", "light");
//     localStorage.setItem("theme", "light");
//     indexLogoImg.src = "/img/black-logo.png";
//   } else if (Bg2) {
//     wrapper.setAttribute("data-theme", "dim");
//     localStorage.setItem("theme", "dim");
//     indexLogoImg.src = "/img/white-logo.png";
//   } else if (Bg3) {
//     wrapper.setAttribute("data-theme", "dark");
//     localStorage.setItem("theme", "dark");
//     indexLogoImg.src = "/img/white-logo.png";
//   }
// }
