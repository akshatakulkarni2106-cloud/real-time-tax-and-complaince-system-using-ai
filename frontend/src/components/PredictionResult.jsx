export default function PredictionResult({ result }) {
  const isHighIncome = result.income_bracket === '>50K';

  return (
    <div style={{
      marginTop: '28px',
      padding: '24px',
      borderRadius: '12px',
      backgroundColor: '#2a2a2a',
      border: `1px solid ${isHighIncome ? '#f5a623' : '#28a745'}`
    }}>

      {/* Header */}
      <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '18px' }}>
        {isHighIncome ? '📈' : '📊'} Prediction Result
      </h3>

      {/* Income Bracket */}
      <div style={rowStyle}>
        <span style={labelStyle}>💰 Income Bracket</span>
        <span style={{
          ...valueStyle,
          color: isHighIncome ? '#f5a623' : '#28a745',
          fontWeight: '700'
        }}>
          {result.income_bracket}
        </span>
      </div>

      {/* Tax Slab */}
      <div style={rowStyle}>
        <span style={labelStyle}>📊 Tax Slab</span>
        <span style={valueStyle}>{result.tax_slab}</span>
      </div>

      {/* Estimated Tax */}
      <div style={rowStyle}>
        <span style={labelStyle}>🧾 Estimated Tax</span>
        <span style={{ ...valueStyle, color: '#f5a623', fontWeight: '700' }}>
          {result.estimated_tax}
        </span>
      </div>

      {/* Risk Level */}
      <div style={rowStyle}>
        <span style={labelStyle}>⚠️ Risk Level</span>
        <span style={{
          ...valueStyle,
          fontWeight: '700',
          color: result.risk_level === 'High' ? '#ff6b6b'
               : result.risk_level === 'Medium' ? '#f5a623'
               : '#28a745'
        }}>
          {result.risk_level}
        </span>
      </div>

      {/* Confidence */}
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <span style={labelStyle}>🎯 Confidence</span>
        <span style={valueStyle}>{result.confidence}%</span>
      </div>

      {/* Confidence Bar */}
      <div style={{
        marginTop: '16px',
        backgroundColor: '#3a3a3a',
        borderRadius: '999px',
        height: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${result.confidence}%`,
          height: '100%',
          backgroundColor: '#f5a623',
          borderRadius: '999px',
          transition: 'width 0.5s ease'
        }} />
      </div>
      <p style={{ color: '#666', fontSize: '11px', marginTop: '6px', textAlign: 'right' }}>
        Confidence Score: {result.confidence}%
      </p>

      {/* Summary Box */}
      <div style={{
        marginTop: '20px',
        padding: '14px',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        border: '1px solid #3a3a3a'
      }}>
        <p style={{ color: '#aaa', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>
          📌 Based on your profile, your estimated annual income falls in the
          <strong style={{ color: '#fff' }}> {result.income_bracket} </strong>
          bracket with a tax slab of
          <strong style={{ color: '#fff' }}> {result.tax_slab}</strong>.
          Your estimated tax liability is
          <strong style={{ color: '#f5a623' }}> {result.estimated_tax}</strong>.
        </p>
      </div>

      {/* Disclaimer */}
      <p style={{
        marginTop: '16px',
        fontSize: '11px',
        color: '#555',
        textAlign: 'center'
      }}>
        ⚠️ This is an estimated prediction only. Please consult a CA for accurate tax advice.
      </p>

    </div>
  );
}

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid #3a3a3a'
};

const labelStyle = {
  color: '#aaa',
  fontSize: '14px'
};

const valueStyle = {
  color: '#fff',
  fontWeight: '600',
  fontSize: '14px'
};