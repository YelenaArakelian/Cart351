/* Constellations of Strangers */

document.addEventListener("DOMContentLoaded", () => {
  // Pages
  const home = document.getElementById("home");
  const formSection = document.getElementById("starFormSection");
  const skySection = document.getElementById("skySection");

  // Navigation buttons
  const leaveStarBtn = document.getElementById("leaveStarBtn");
  const exploreSkyBtn = document.getElementById("exploreSkyBtn");
  const backBtn = document.getElementById("backBtn");
  const skyBackBtn = document.getElementById("skyBackBtn");
  const skyLeaveBtn = document.getElementById("skyLeaveBtn");

  // Form
  const starForm = document.getElementById("starForm");
  const thoughtInput = document.getElementById("thought");
  const emotionInput = document.getElementById("emotion");
  const formMessage = document.getElementById("formMessage");
  const starsList = document.getElementById("starsList");

  // Collective sky
  const starfield = document.getElementById("starfield");
  const starDetails = document.getElementById("starDetails");
  const selectedThought = document.getElementById("selectedThought");
  const selectedEmotion = document.getElementById("selectedEmotion");
  const closeDetailsBtn = document.getElementById("closeDetailsBtn");
  const skyMessage = document.getElementById("skyMessage");

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
    console.error("Missing HTML elements:", missingElements);
    return;
  }

  // Colors for each emotion
  const emotionColors = {
    hope: "#f5d995",
    joy: "#ffd4a8",
    nostalgia: "#c6a8f0",
    sadness: "#729bda",
    loneliness: "#7895bc",
    calm: "#91ded5",
  };

  // ID of the most recently submitted star
  let newStarId = null;

  // Show one page at a time
  function showSection(section) {
    home.hidden = true;
    formSection.hidden = true;
    skySection.hidden = true;

    section.hidden = false;
    starDetails.hidden = true;

    window.scrollTo(0, 0);
  }

  // Navigation
  leaveStarBtn.addEventListener("click", () => {
    showSection(formSection);
  });

  exploreSkyBtn.addEventListener("click", async () => {
    showSection(skySection);
    await loadStars();
  });

  backBtn.addEventListener("click", () => {
    showSection(home);
  });

  skyBackBtn.addEventListener("click", () => {
    showSection(home);
  });

  skyLeaveBtn.addEventListener("click", () => {
    showSection(formSection);
  });

  closeDetailsBtn.addEventListener("click", () => {
    starDetails.hidden = true;
  });

  // Generate a consistent position for each star
  function hashString(text) {
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }

    return hash;
  }

  function getStarPosition(star, index) {
    const seed = hashString(star.id || String(index));

    return {
      x: 8 + (seed % 84),
      y: 10 + (Math.floor(seed / 97) % 78),
    };
  }

  // Create a clickable star
  function createStar(star, index, position) {
    const element = document.createElement("button");

    element.type = "button";
    element.className = "data-star";

    element.style.left = position.x + "%";
    element.style.top = position.y + "%";

    element.style.setProperty(
      "--star-color",
      emotionColors[star.emotion] || "#ffffff",
    );

    // Regular stars have slightly different twinkle timing
    if (star.id !== newStarId) {
      element.style.animationDelay = (index % 7) * 0.35 + "s";
    }

    element.setAttribute(
      "aria-label",
      "Read a stranger's " + star.emotion + " thought",
    );

    // Open the selected thought
    element.addEventListener("click", () => {
      selectedThought.textContent = star.thought;

      selectedEmotion.textContent =
        star.emotion.charAt(0).toUpperCase() + star.emotion.slice(1);

      selectedEmotion.style.color = emotionColors[star.emotion] || "#ffffff";

      starDetails.hidden = false;
    });

    return element;
  }

  // Animate a new star rising into the sky
  function animateNewStar(element) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    element.animate(
      [
        {
          transform: "translate(-50%, 70vh) scale(0.3)",
          opacity: 0,
        },
        {
          transform: "translate(-50%, -65%) scale(1.5)",
          opacity: 1,
          offset: 0.85,
        },
        {
          transform: "translate(-50%, -50%) scale(1)",
          opacity: 1,
        },
      ],
      {
        duration: 2200,
        easing: "ease-out",
        fill: "none",
      },
    );
  }

  // Distance between two stars
  function getDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  // Create a layer for the constellation lines
  function createConnectionLayer() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.classList.add("constellation-lines");

    return svg;
  }

  // Draw a connection between two stars
  function drawConnection(svg, first, second, emotion) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", first.x);
    line.setAttribute("y1", first.y);
    line.setAttribute("x2", second.x);
    line.setAttribute("y2", second.y);

    line.setAttribute("stroke", emotionColors[emotion] || "#ffffff");

    line.setAttribute("stroke-width", "0.16");
    line.setAttribute("stroke-opacity", "0.4");

    line.classList.add("constellation-line");

    svg.appendChild(line);
  }

  // Connect stars that share an emotion
  function createConstellations(starsWithPositions) {
    const svg = createConnectionLayer();
    const groups = {};

    // Group stars by emotion
    starsWithPositions.forEach((item) => {
      const emotion = item.star.emotion;

      if (!groups[emotion]) {
        groups[emotion] = [];
      }

      groups[emotion].push(item);
    });

    // Connect each star to the nearest connected star
    Object.entries(groups).forEach(([emotion, group]) => {
      if (group.length < 2) {
        return;
      }

      const connected = [group[0]];

      for (let i = 1; i < group.length; i++) {
        const current = group[i];

        let nearest = connected[0];
        let shortestDistance = Infinity;

        connected.forEach((candidate) => {
          const distance = getDistance(current.position, candidate.position);

          if (distance < shortestDistance) {
            shortestDistance = distance;
            nearest = candidate;
          }
        });

        drawConnection(svg, current.position, nearest.position, emotion);

        connected.push(current);
      }
    });

    return svg;
  }

  // Retrieve submissions from Flask
  async function loadStars() {
    skyMessage.textContent = "";

    try {
      const response = await fetch("/api/stars");

      if (!response.ok) {
        throw new Error("Could not retrieve stars.");
      }

      const stars = await response.json();

      starfield.replaceChildren();

      if (starsList) {
        starsList.replaceChildren();
      }

      if (stars.length === 0) {
        skyMessage.textContent =
          "The sky is empty. Be the first to leave a star.";
        return;
      }

      // Calculate star positions
      const starsWithPositions = stars.map((star, index) => {
        return {
          star: star,
          index: index,
          position: getStarPosition(star, index),
        };
      });

      // Draw connections behind the stars
      const connectionLayer = createConstellations(starsWithPositions);

      starfield.appendChild(connectionLayer);

      // Add the stars to the sky
      starsWithPositions.forEach((item) => {
        const element = createStar(item.star, item.index, item.position);

        starfield.appendChild(element);

        // Animate the newly submitted star
        if (item.star.id === newStarId) {
          requestAnimationFrame(() => {
            animateNewStar(element);
          });
        }

        // Update the original list
        if (starsList) {
          const listItem = document.createElement("li");

          listItem.textContent = `${item.star.emotion}: ${item.star.thought}`;

          starsList.appendChild(listItem);
        }
      });
    } catch (error) {
      console.error("Error loading stars:", error);

      skyMessage.textContent = "Could not load the collective sky.";
    }
  }

  // Save a new thought
  starForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const thought = thoughtInput.value.trim();
    const emotion = emotionInput.value;

    if (!thought || !emotion) {
      formMessage.textContent = "Please complete both fields.";
      return;
    }

    formMessage.textContent = "Saving your star...";

    const submitBtn = starForm.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      // Send the submission to Flask
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

      // Save the new star's ID for the animation
      newStarId = result.star.id;

      starForm.reset();
      formMessage.textContent = "";

      // Open the collective sky
      showSection(skySection);

      // Load the stars and animate the new one
      await loadStars();

      skyMessage.textContent =
        "Your star has found its place in the sky. Somewhere, someone might feel the same way.";

      newStarId = null;

      newStarId = null;
    } catch (error) {
      console.error("Submission error:", error);

      formMessage.textContent = "Something went wrong. Please try again.";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });

  // Start on the homepage
  showSection(home);

  // Load previously saved submissions
  loadStars();
});
