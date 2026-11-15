/* ========================================
   CONSTELLATIONS OF STRANGERS
   Main JavaScript
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ========================================
       HTML ELEMENTS
    ======================================== */

  // Main sections
  const home = document.getElementById("home");
  const formSection = document.getElementById("starFormSection");
  const skySection = document.getElementById("skySection");

  // Navigation buttons
  const leaveStarBtn = document.getElementById("leaveStarBtn");
  const exploreSkyBtn = document.getElementById("exploreSkyBtn");
  const backBtn = document.getElementById("backBtn");
  const skyBackBtn = document.getElementById("skyBackBtn");
  const skyLeaveBtn = document.getElementById("skyLeaveBtn");

  // Form elements
  const starForm = document.getElementById("starForm");
  const thoughtInput = document.getElementById("thought");
  const emotionInput = document.getElementById("emotion");
  const formMessage = document.getElementById("formMessage");
  const starsList = document.getElementById("starsList");

  // Collective sky elements
  const starfield = document.getElementById("starfield");
  const starDetails = document.getElementById("starDetails");
  const selectedThought = document.getElementById("selectedThought");
  const selectedEmotion = document.getElementById("selectedEmotion");
  const closeDetailsBtn = document.getElementById("closeDetailsBtn");
  const skyMessage = document.getElementById("skyMessage");

  // Check that all necessary HTML elements exist
  const requiredElements = {
    home,
    formSection,
    skySection,
    leaveStarBtn,
    exploreSkyBtn,
    backBtn,
    skyBackBtn,
    skyLeaveBtn,
    starForm,
    thoughtInput,
    emotionInput,
    formMessage,
    starfield,
    starDetails,
    selectedThought,
    selectedEmotion,
    closeDetailsBtn,
    skyMessage,
  };

  const missingElements = Object.entries(requiredElements)
    .filter(([name, element]) => !element)
    .map(([name]) => name);

  if (missingElements.length > 0) {
    console.error("Missing HTML elements:", missingElements.join(", "));

    return;
  }

  /* ========================================
       EMOTION COLORS
    ======================================== */

  const emotionColors = {
    hope: "#f5d995",
    joy: "#ffd4a8",
    nostalgia: "#c6a8f0",
    sadness: "#729bda",
    loneliness: "#7895bc",
    calm: "#91ded5",
  };

  /* ========================================
       NAVIGATION
    ======================================== */

  // Display only the selected section
  function showSection(section) {
    home.hidden = true;
    formSection.hidden = true;
    skySection.hidden = true;

    section.hidden = false;

    // Close star details when changing sections
    starDetails.hidden = true;

    window.scrollTo(0, 0);
  }

  // Homepage -> Submission form
  leaveStarBtn.addEventListener("click", () => {
    showSection(formSection);
  });

  // Homepage -> Collective sky
  exploreSkyBtn.addEventListener("click", async () => {
    showSection(skySection);
    await loadStars();
  });

  // Submission form -> Homepage
  backBtn.addEventListener("click", () => {
    showSection(home);
  });

  // Collective sky -> Homepage
  skyBackBtn.addEventListener("click", () => {
    showSection(home);
  });

  // Collective sky -> Submission form
  skyLeaveBtn.addEventListener("click", () => {
    showSection(formSection);
  });

  // Close selected star information
  closeDetailsBtn.addEventListener("click", () => {
    starDetails.hidden = true;
  });

  /* ========================================
       STAR POSITION ALGORITHM
    ======================================== */

  // Generate a repeatable number from a string.
  // This allows each star to keep the same location.

  function hashString(text) {
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }

    return hash;
  }

  // Calculate each star's position using its ID
  function getStarPosition(star, index) {
    const seed = hashString(star.id || String(index));

    return {
      x: 8 + (seed % 84),
      y: 10 + (Math.floor(seed / 97) % 78),
    };
  }

  /* ========================================
       CREATE INTERACTIVE STARS
    ======================================== */

  function createStar(star, index) {
    const position = getStarPosition(star, index);

    // Create a clickable star
    const element = document.createElement("button");

    element.type = "button";
    element.className = "data-star";

    // Place the star in the sky
    element.style.left = position.x + "%";
    element.style.top = position.y + "%";

    // Set star color based on emotion
    element.style.setProperty(
      "--star-color",
      emotionColors[star.emotion] || "#ffffff",
    );

    // Give each star a slightly different animation delay
    element.style.animationDelay = (index % 7) * 0.35 + "s";

    // Accessibility label
    element.setAttribute(
      "aria-label",
      "Read a stranger's " + star.emotion + " thought",
    );

    // Show the stored thought when clicked
    element.addEventListener("click", () => {
      selectedThought.textContent = star.thought;

      selectedEmotion.textContent =
        star.emotion.charAt(0).toUpperCase() + star.emotion.slice(1);

      selectedEmotion.style.color = emotionColors[star.emotion] || "#ffffff";

      starDetails.hidden = false;
    });

    return element;
  }

  /* ========================================
       GET DATA FROM FLASK
    ======================================== */

  async function loadStars() {
    skyMessage.textContent = "";

    try {
      // FETCH request to retrieve JSON data
      const response = await fetch("/api/stars");

      if (!response.ok) {
        throw new Error("Could not retrieve stars.");
      }

      const stars = await response.json();

      // Clear previously displayed stars
      starfield.replaceChildren();

      if (starsList) {
        starsList.replaceChildren();
      }

      // Handle an empty JSON file
      if (stars.length === 0) {
        skyMessage.textContent =
          "The sky is empty. Be the first to leave a star.";

        return;
      }

      // Create a star for every saved submission
      stars.forEach((star, index) => {
        const element = createStar(star, index);

        starfield.appendChild(element);

        // Update temporary list if it exists
        if (starsList) {
          const item = document.createElement("li");

          item.textContent = `${star.emotion}: ${star.thought}`;

          starsList.appendChild(item);
        }
      });
    } catch (error) {
      console.error("Error loading stars:", error);

      skyMessage.textContent = "Could not load the collective sky.";
    }
  }

  /* ========================================
       SAVE NEW SUBMISSION TO FLASK
    ======================================== */

  starForm.addEventListener("submit", async (event) => {
    // Prevent the form from refreshing the page
    event.preventDefault();

    // Retrieve user input
    const thought = thoughtInput.value.trim();
    const emotion = emotionInput.value;

    // Basic validation
    if (!thought || !emotion) {
      formMessage.textContent = "Please complete both fields.";

      return;
    }

    formMessage.textContent = "Saving your star...";

    // Prevent duplicate submissions
    const submitBtn = starForm.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      // FETCH request to send user input to Flask
      const response = await fetch("/api/stars", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          thought: thought,
          emotion: emotion,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save your star.");
      }

      // Clear the submission form
      starForm.reset();

      formMessage.textContent = "";

      // Open the collective sky
      showSection(skySection);

      // Retrieve updated submissions
      await loadStars();
    } catch (error) {
      console.error("Submission error:", error);

      formMessage.textContent = "Something went wrong. Please try again.";
    } finally {
      // Enable submit button again
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });

  /* ========================================
       INITIALIZE APPLICATION
    ======================================== */

  // Start on the homepage
  showSection(home);

  // Retrieve existing JSON submissions
  loadStars();
});
