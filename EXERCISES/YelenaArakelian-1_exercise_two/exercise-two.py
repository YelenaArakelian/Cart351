from flask import Flask, render_template, request, redirect, url_for
import requests

app = Flask(__name__)


# Home page
@app.route("/")
def index():
    return render_template("index.html")


# Task 1: Searching for one NASA image
@app.route("/t1")
def t1():
    return render_template("t1.html", have_results=False)


@app.route("/getSearchCriteria")
def getSearchCriteria():

    # Get what the user searched for
    searchTerm = request.args.get("search")

    # NASA API link and search parameters
    url = "https://images-api.nasa.gov/search"
    params = {"q": searchTerm, "media_type": "image"}

    # Request the data from NASA
    response = requests.get(url, params=params)
    data = response.json()

    # Get the search results
    items = data["collection"]["items"]

    # Check if there are any results
    if not items:
        return render_template("t1.html", have_results=False)

    # Get the first image and its description
    firstResult = items[0]
    imgFromNasa = firstResult["links"][0]["href"]
    description = firstResult["data"][0].get(
        "description", "No description available."
    )

    # Replace spaces in the image link
    imgFromNasa = imgFromNasa.replace(' ', '%20')

    return render_template("t1.html",
                           have_results=True,
                           description=description,
                           imgPath=imgFromNasa
                           )


# Task 2: Searching for multiple NASA images
@app.route("/t2")
def t2():
    return render_template("t2.html")


@app.route("/getSearchCriteria_adv")
def getSearchCriteria_adv():

    # Get what the user searched for
    searchTerm = request.args.get("search")

    # NASA API link and search parameters
    url = "https://images-api.nasa.gov/search"
    params = {"q": searchTerm, "media_type": "image"}

    # Request the data from NASA
    response = requests.get(url, params=params)
    data = response.json()

    # Get all the search results
    items = data["collection"]["items"]

    # List to store the image links
    encodedImageLinks = []

    # Go through each result and get its image
    for item in items:
        if item.get("links"):
            singleImage = item["links"][0]["href"]

            # Replace spaces in the link
            singleImage = singleImage.replace(' ', '%20')

            # Add the image to the list
            encodedImageLinks.append(singleImage)

    # Send the images to the HTML page
    return render_template("t2.html", images=encodedImageLinks)


# This runs the application
if __name__ == "__main__":
    app.run(debug=True)