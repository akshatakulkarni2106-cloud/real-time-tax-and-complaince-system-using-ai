from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and encoders
print("Loading model...")
model = joblib.load("model.pkl")
encoders = joblib.load("encoders.pkl")
income_encoder = joblib.load("income_encoder.pkl")
print("✅ Model loaded!")

# Indian Rupee to USD conversion (approximate)
INR_TO_USD = 83.0

def inr_to_usd(inr):
    return float(inr) / INR_TO_USD

def calculate_tax(income):
    income = float(income)
    tax = 0

    if income <= 250000:
        tax = 0
        slab = "0%"
        risk = "Low"
    elif income <= 500000:
        tax = (income - 250000) * 0.05
        slab = "5%"
        risk = "Low"
    elif income <= 750000:
        tax = 12500 + (income - 500000) * 0.10
        slab = "10%"
        risk = "Low"
    elif income <= 1000000:
        tax = 37500 + (income - 750000) * 0.15
        slab = "15%"
        risk = "Medium"
    elif income <= 1250000:
        tax = 75000 + (income - 1000000) * 0.20
        slab = "20%"
        risk = "Medium"
    elif income <= 1500000:
        tax = 125000 + (income - 1250000) * 0.25
        slab = "25%"
        risk = "High"
    else:
        tax = 187500 + (income - 1500000) * 0.30
        slab = "30%"
        risk = "High"

    # Add 4% Health & Education Cess
    cess = tax * 0.04
    total_tax = tax + cess

    return f"₹{total_tax:,.0f}", slab, risk

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("📊 Received:", data)

        # Convert INR to USD for ML model
        income_inr = float(data.get('income', 500000))
        income_usd = inr_to_usd(income_inr)
        print(f"💱 Income: ₹{income_inr:,.0f} = ${income_usd:,.0f} USD")

        # Prepare input for ML model
        input_data = {
            'age': int(data['age']),
            'workclass': data['workclass'],
            'education': data['education'],
            'marital_status': data['marital_status'],
            'occupation': data['occupation'],
            'hours_per_week': int(data['hours_per_week'])
        }

        df = pd.DataFrame([input_data])

        # Encode categorical columns
        categorical_cols = ['workclass', 'education', 'marital_status', 'occupation']
        for col in categorical_cols:
            le = encoders[col]
            val = df[col].astype(str).values[0]
            if val in le.classes_:
                df[col] = le.transform([val])
            else:
                df[col] = 0

        # ML Model Predict income bracket
        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0]
        confidence = round(float(np.max(probability)) * 100, 1)

        # Get income bracket from ML model
        income_bracket = income_encoder.inverse_transform([prediction])[0]
        income_bracket = income_bracket.strip()

        # Verify with actual income
        # If user income > $50K equivalent (₹41.5 lakh) → override to >50K
        if income_usd > 50000:
            income_bracket = '>50K'
        elif income_usd <= 50000 and income_inr > 0:
            income_bracket = '<=50K'

        print(f"🤖 ML Bracket: {income_bracket} | USD: ${income_usd:,.0f}")

        # Calculate Indian tax
        estimated_tax, tax_slab, risk_level = calculate_tax(income_inr)

        print(f"✅ Tax: {estimated_tax} | Slab: {tax_slab} | Risk: {risk_level}")

        return jsonify({
            "income_bracket": income_bracket,
            "tax_slab": tax_slab,
            "estimated_tax": estimated_tax,
            "risk_level": risk_level,
            "confidence": confidence
        })

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ML Service Running! ✅"})

if __name__ == "__main__":
    print("🚀 Starting ML Service on port 5001...")
    app.run(port=5001, debug=True)
