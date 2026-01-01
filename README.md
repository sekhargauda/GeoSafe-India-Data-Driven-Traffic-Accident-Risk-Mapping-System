# 📍 GeoSafe India: Data-Driven Traffic Accident Risk Mapping System

The **GeoSafe India** is an interactive, web-based traffic safety analytics platform designed to analyze, assess, and visualize road accident risks across India.
The system integrates data science, AI-assisted geocoding, and geospatial mapping to identify high-risk zones at the State, Union Territory, and City levels.



---

## 🚀 Project Overview

The system processes Indian traffic accident data to calculate severity and risk scores. It visualizes these metrics through an interactive dashboard, allowing users to identify high-risk zones at a glance.

### Key Features
* **Accident Risk Scoring System:** Proprietary algorithm to rank regional safety.
* **Interactive Leaflet Map:** High-performance visualization with zoom and filter capabilities.
* **Layer-based Filtering:** Toggle views between All regions, States, UTs, or Cities.
* **Dynamic Information Panel:** Sidebar updates in real-time based on map interaction.
* **AI-powered Geocoding:** Integrates **Google Gemini API** to resolve missing latitude/longitude values automatically.
* **Responsive Design:** Fully functional across desktop and mobile browsers.

---

## 🛠 Technology Stack

### Frontend
* **HTML5 / CSS3**
* **JavaScript** (ES6+)
* **Leaflet.js** (Mapping Library)

### Backend
* **Python**
* **Flask** (REST API)

### Data & AI
* **Pandas & NumPy** (Data Processing)
* **KaggleHub** (Dataset Sourcing)
* **Google Gemini (google-generativeai)** (AI Geocoding)

---

## ⚙️ System Architecture

1.  **Data Collection:** Sourcing raw accident data via CSV/Kaggle.
2.  **Cleaning & Normalization:** Handled by Pandas for consistency.
3.  **AI Resolution:** Missing geolocations are fetched via Gemini AI.
4.  **Analysis:** Risk and severity scores are calculated.
5.  **API Layer:** Flask serves the processed data as JSON.
6.  **Visualization:** Leaflet.js renders the frontend map and choropleth layers.

---

## 📊 Risk Score Calculation

The system uses the following mathematical formulas to determine safety levels:

**Severity Score:**
$$severity\_score = (Deaths \times 2) + Injuries$$

**Risk Score:**
$$risk\_score = 0.5 \times fatality\_rate + 0.3 \times injury\_rate + 0.2 \times accident\_intensity$$

---

## 📋 Dataset Schema

| Column Name | Description |
| :--- | :--- |
| `State/UT/City` | Name of the geographical region |
| `Total Traffic Accidents - Cases` | Total number of recorded accidents |
| `Total Traffic Accidents - Injured` | Number of non-fatal injuries |
| `Total Traffic Accidents - Died` | Number of fatalities |
| `region_type` | Category (State, Union Territory, or City) |
| `latitude` / `longitude` | Geographic coordinates |
| `severity_score` | Weighted score of physical harm |
| `risk_score` | Calculated probability/impact metric |
| `risk_category` | Qualitative label (Low, Medium, High, Extreme) |

---

## 🔧 Installation and Setup

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sekhargauda/Accident_analysis.git
   cd Accident_analysis
   ```

2. **Prepare the Dataset**

    <b>Option A: Use the existing dataset (Recommended)</b>

    * If accident_map_ready.csv is already present in the repository, you can skip to Step 2.

    <b>Option B: Generate the dataset via Google Colab</b>

    * Open notebooks/accidentAnalysis.ipynb in Google Colab.

    * Install required packages:
      ```python
      !pip install pandas numpy kagglehub google-generativeai
      ```

    * Configure Gemini API key (Add your key to Colab Secrets as `GEMINI`):
      ```python
      from google.colab import userdata
      import google.generativeai as genai

      genai.configure(api_key=userdata.get("GEMINI"))
      ```

    * Run all cells to generate the processed dataset:
      `accident_map_ready.csv`

    * Download the file to your local machine:
      ```python
      from google.colab import files
      files.download("accident_map_ready.csv")
      ```

3. **Prepare Local Environment:**
   * Move the downloaded `accident_map_ready.csv` into the project root or `data/` directory.
   * Install backend dependencies on your local machine:
     ```bash
     pip install pandas numpy flask kagglehub google-generativeai
     ```

4. **Run the Application:**
   ```bash
   python app.py
    ```
5. **Open in Browser**

    Once the server is running, visit: http://127.0.0.1:5000/

---

## 👤 Author : Sekhar Gauda 
GitHub: [Sekhar Gauda](https://github.com/sekhargauda)<br>
LinkedIn: [Sekhar Gauda](https://linkedin.com/in/sekhargauda)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
