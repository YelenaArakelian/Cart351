const home = document.getElementById("home");
const formSection = document.getElementById("starFormSection");

const leaveStarBtn = document.getElementById("leaveStarBtn");
const backBtn = document.getElementById("backBtn");

const starForm = document.getElementById("starForm");
const formMessage = document.getElementById("formMessage");
const starsList = document.getElementById("starsList");

// Open the submission form
leaveStarBtn.addEventListener("click", () => {
  home.hidden = true;
  formSection.hidden = false;
});

// Return to homepage
backBtn.addEventListener("click", () => {
  formSection.hidden = true;
  home.hidden = false;
});

// Retrieve saved stars from Flask
async function loadStars() {
  try {
    const response = await fetch("/api/stars");

    if (!response.ok) {
      throw new Error("Could not retrieve stars.");
    }

    const stars = await response.json();

    starsList.replaceChildren();

    if (stars.length === 0) {
      starsList.textContent = "No stars yet.";
      return;
    }

    stars.forEach((star) => {
      const item = document.createElement("li");
      item.textContent = `${star.emotion}: ${star.thought}`;
      starsList.appendChild(item);
    });
  } catch (error) {
    console.error(error);
    starsList.textContent = "Could not load the sky.";
  }
}

// Submit a new star to Flask
starForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const thought = document.getElementById("thought").value.trim();
  const emotion = document.getElementById("emotion").value;

  if (!thought || !emotion) {
    formMessage.textContent = "Please complete both fields.";
    return;
  }

  formMessage.textContent = "Saving your star...";

  try {
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
      throw new Error(result.error || "Could not save star.");
    }

    formMessage.textContent = result.message;

    starForm.reset();

    // Retrieve the updated collective data
    await loadStars();
  } catch (error) {
    console.error(error);
    formMessage.textContent = "Something went wrong. Try again.";
  }
});

// Load stored stars when the page opens
loadStars();
