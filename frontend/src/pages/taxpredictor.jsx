import { useState } from 'react';
import axios from 'axios';
import PredictionResult from '../components/PredictionResult';

export default function TaxPredictor() {
  const [form, setForm] = useState({
    age: '',
    income: '',
    education: 'Bachelors',
    occupation: 'Prof-specialty',
    hours_per_week: '',
    marital_status: 'Never-married',
    workclass: 'Private'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.age || !form.hours_per_week || !form.income) {
      setError('Please fill all fields!');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/ml/predict', form);
      setResult(res.data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      padding: '40px 20px',
      color: '#fff'
    }}>
      <div style={{
        maxWidth: '620px',
        margin: '0 auto',
        backgroundColor: '#1a1a1a',
        borderRadius: '16px',
        padding: '36px',
        border: '1px solid #2a2a2a'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '8px'
          }}>
            🧮 Tax Liability Predictor
          </h2>
          <p style={{ color: '#888', fontSize: '14px' }}>
            Apni details bharein — hum tax estimate karenge
          </p>
        </div>

        {/* Age + Income Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="e.g. 30"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Annual Income (₹)</label>
            <input
              type="number"
              name="income"
              value={form.income}
              onChange={handleChange}
              placeholder="e.g. 800000"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Education */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Education</label>
          <select name="education" value={form.education} onChange={handleChange} style={inputStyle}>
            <option>Bachelors</option>
            <option>Masters</option>
            <option>Doctorate</option>
            <option>HS-grad</option>
            <option>Some-college</option>
            <option>Assoc-acdm</option>
            <option>11th</option>
            <option>9th</option>
          </select>
        </div>

        {/* Occupation */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Occupation</label>
          <select name="occupation" value={form.occupation} onChange={handleChange} style={inputStyle}>
            <option>Prof-specialty</option>
            <option>Exec-managerial</option>
            <option>Craft-repair</option>
            <option>Adm-clerical</option>
            <option>Sales</option>
            <option>Other-service</option>
            <option>Machine-op-inspct</option>
            <option>Transport-moving</option>
            <option>Tech-support</option>
            <option>Protective-serv</option>
          </select>
        </div>

        {/* Work Type + Marital Status Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Work Type</label>
            <select name="workclass" value={form.workclass} onChange={handleChange} style={inputStyle}>
              <option>Private</option>
              <option>Self-emp-not-inc</option>
              <option>Self-emp-inc</option>
              <option>Federal-gov</option>
              <option>Local-gov</option>
              <option>State-gov</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Marital Status</label>
            <select name="marital_status" value={form.marital_status} onChange={handleChange} style={inputStyle}>
              <option>Never-married</option>
              <option>Married-civ-spouse</option>
              <option>Divorced</option>
              <option>Separated</option>
              <option>Widowed</option>
            </select>
          </div>
        </div>

        {/* Hours per week */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Hours per Week</label>
          <input
            type="number"
            name="hours_per_week"
            value={form.hours_per_week}
            onChange={handleChange}
            placeholder="e.g. 40"
            style={inputStyle}
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: '#ff6b6b', marginBottom: '16px', fontSize: '14px' }}>{error}</p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading ? '#555' : '#f5a623',
            color: '#000',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {loading ? '⏳ Predicting...' : '🔮 Predict Tax Liability'}
        </button>

        {/* Result */}
        {result && <PredictionResult result={result} />}
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  color: '#aaa',
  fontWeight: '500'
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  backgroundColor: '#2a2a2a',
  border: '1px solid #3a3a3a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
};