import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib
import json

# Load dataset
print("Loading dataset...")
df = pd.read_csv("adult.csv")

# Clean data
df = df.replace('?', None).dropna()

# Features we need
features = ['age', 'workclass', 'education', 'marital_status', 
            'occupation', 'hours_per_week']

X = df[features].copy()
y = df['income'].copy()

# Clean income column
y = y.str.strip().str.replace('.', '', regex=False)

# Encode categorical columns
encoders = {}
categorical_cols = ['workclass', 'education', 'marital_status', 'occupation']

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))
    encoders[col] = le

# Encode target
le_income = LabelEncoder()
y_encoded = le_income.fit_transform(y)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

# Train model
print("Training model... please wait ⏳")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Check accuracy
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\n✅ Model Accuracy: {accuracy * 100:.2f}%")
print("\nDetailed Report:")
print(classification_report(y_test, y_pred, target_names=le_income.classes_))

# Save model and encoders
joblib.dump(model, "model.pkl")
joblib.dump(encoders, "encoders.pkl")
joblib.dump(le_income, "income_encoder.pkl")

print("\n✅ Model saved as model.pkl")
print("✅ Encoders saved as encoders.pkl")
print("✅ Done! Now run app.py")