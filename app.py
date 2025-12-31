from flask import Flask, jsonify, render_template, request
import pandas as pd
import os

app = Flask(__name__)

# <---------- LOAD DATA ---------->
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "accident_map_ready.csv")

df = pd.read_csv(DATA_PATH)

# <---------- CLEAN DATA ---------->
df["State/UT/City"] = df["State/UT/City"].astype(str).str.strip().str.lower()
df["region_type"] = df["region_type"].astype(str).str.strip()

# <---------- ROUTES ---------->
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/locations")
def locations():
    region_type = request.args.get("type")
    data = df.copy()

    if region_type:
        data = data[data["region_type"] == region_type]

    return jsonify(data.to_dict(orient="records"))

# <---------- LOCAL RUN ---------->
if __name__ == "__main__":
    app.run(debug=True)
