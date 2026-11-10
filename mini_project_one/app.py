
from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime, timezone
from uuid import uuid4

app = Flask(__name__)

# Location of our JSON file
DATA_FILE = os.path.join(app.root_path, "data", "stars.json")

EMOTIONS = [
    "hope", "joy", "nostalgia",
    "sadness", "loneliness", "calm"
]


# Read existing submissions
def load_stars():
    if not os.path.exists(DATA_FILE):
        return []

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


# Save submissions to JSON
def save_stars(stars):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

    with open(DATA_FILE, "w", encoding="utf-8") as file:
        json.dump(stars, file, indent=4, ensure_ascii=False)


# Homepage
@app.route("/")
def home():
    return render_template("index.html")


# Retrieve all saved stars
@app.route("/api/stars", methods=["GET"])
def get_stars():
    return jsonify(load_stars())


# Receive and save a new star
@app.route("/api/stars", methods=["POST"])
def add_star():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid submission."}), 400

    thought = data.get("thought")
    emotion = data.get("emotion")

    if not isinstance(thought, str) or not isinstance(emotion, str):
        return jsonify({"error": "Invalid submission."}), 400

    thought = thought.strip()
    emotion = emotion.lower().strip()

    if not thought or len(thought) > 200 or emotion not in EMOTIONS:
        return jsonify({"error": "Invalid thought or emotion."}), 400

    new_star = {
        "id": str(uuid4()),
        "thought": thought,
        "emotion": emotion,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    stars = load_stars()
    stars.append(new_star)
    save_stars(stars)

    return jsonify({
        "message": "Your star has been saved!",
        "star": new_star
    }), 201


if __name__ == "__main__":
    app.run(debug=True)
