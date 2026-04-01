import { useApp } from '../context/AppContext';

const SCHEMES = [
  {
    title: 'PM SVANidhi',
    tag: 'Street Vendors',
    icon: '🏪',
    eligibility: 'Street vendors with vending certificate',
    desc: 'Working capital loan from Rs.10,000 to Rs.50,000 with no collateral needed.',
    benefits: ['Loan up to Rs.50,000', 'No collateral', 'Subsidized interest', 'Credit score building'],
    link: 'https://pmsvanidhi.mohua.gov.in',
    check: (p) =>
      p?.businessType === 'Small Trader' &&
      ['Under \u20b92.5L', '\u20b92.5L \u2013 \u20b95L'].includes(p?.income),
    reason: (p) => [
      'Business Type: Small Trader',
      'Income: ' + p?.income + ' (low income qualifies)',
    ]
  },
  {
    title: 'MUDRA Loan (Shishu)',
    tag: 'Micro Businesses',
    icon: '💼',
    eligibility: 'Non-farm micro enterprises with income under Rs.10L',
    desc: 'Collateral-free loans to help micro-businesses start and grow operations.',
    benefits: ['Up to Rs.50,000', 'Low interest', 'No collateral', 'Multiple banks'],
    link: 'https://www.mudra.org.in',
    check: (p) =>
      ['Small Trader', 'Micro Manufacturer', 'Freelancer'].includes(p?.businessType) &&
      ['Under \u20b92.5L', '\u20b92.5L \u2013 \u20b95L', '\u20b95L \u2013 \u20b910L'].includes(p?.income),
    reason: (p) => [
      'Business Type: ' + p?.businessType,
      'Income: ' + p?.income + ' (under Rs.10L required)',
    ]
  },
  {
    title: 'Udyam Registration',
    tag: 'MSME Benefit',
    icon: '🏭',
    eligibility: 'All micro, small and medium enterprises',
    desc: 'Free registration that unlocks priority lending and government scheme access.',
    benefits: ['Priority credit', 'Tender preference', 'Patent subsidy', 'Late payment protection'],
    link: 'https://udyamregistration.gov.in',
    check: (p) =>
      ['Small Trader', 'Micro Manufacturer', 'Consultant'].includes(p?.businessType) &&
      p?.income !== undefined,
    reason: (p) => [
      'Business Type: ' + p?.businessType + ' qualifies as MSME',
      'Income: ' + p?.income,
    ]
  },
  {
    title: 'Jan Dhan Overdraft',
    tag: 'Gig Workers',
    icon: '🛵',
    eligibility: 'Gig workers with low income',
    desc: 'Overdraft facility up to Rs.10,000 - a safety net for gig workers.',
    benefits: ['Rs.10,000 overdraft', 'No processing fee', 'Instant access'],
    link: 'https://pmjdy.gov.in',
    check: (p) =>
      p?.businessType === 'Gig Worker' &&
      ['Under \u20b92.5L', '\u20b92.5L \u2013 \u20b95L'].includes(p?.income),
    reason: (p) => [
      'Business Type: Gig Worker',
      'Income: ' + p?.income + ' (low income safety net)',
    ]
  },
  {
    title: 'Presumptive Tax 44AD',
    tag: 'Tax Benefit',
    icon: '🧾',
    eligibility: 'Businesses with income under Rs.25L',
    desc: 'Declare 8% of turnover as income - no bookkeeping or audit required.',
    benefits: ['No books needed', '8% presumptive', 'Simple ITR', 'No audit'],
    link: 'https://www.incometax.gov.in',
    check: (p) =>
      ['Small Trader', 'Micro Manufacturer', 'Freelancer', 'Consultant'].includes(p?.businessType) &&
      ['Under \u20b92.5L', '\u20b92.5L \u2013 \u20b95L', '\u20b95L \u2013 \u20b910L', '\u20b910L \u2013 \u20b925L'].includes(p?.income),
    reason: (p) => [
      'Business Type: ' + p?.businessType,
      'Income: ' + p?.income + ' (under Rs.2 crore turnover)',
    ]
  },
  {
    title: 'GST Composition Scheme',
    tag: 'GST Benefit',
    icon: '📊',
    eligibility: 'GST registered businesses with income under Rs.10L',
    desc: 'Pay GST at a flat rate instead of regular GST - less compliance burden.',
    benefits: ['Flat 1-6% GST', 'Quarterly filing', 'Less paperwork', 'Lower tax burden'],
    link: 'https://www.gst.gov.in',
    check: (p) =>
      p?.gstRegistered === 'Yes' &&
      ['Under \u20b92.5L', '\u20b92.5L \u2013 \u20b95L', '\u20b95L \u2013 \u20b910L'].includes(p?.income),
    reason: (p) => [
      'GST Status: Registered',
      'Income: ' + p?.income + ' (under Rs.1.5 crore required)',
    ]
  },
  {
    title: 'Startup India Scheme',
    tag: 'Startup Benefit',
    icon: '🚀',
    eligibility: 'Freelancers and Consultants with growing income above Rs.5L',
    desc: 'Tax exemptions, funding support and mentorship for recognized startups.',
    benefits: ['3 year tax holiday', 'Easy compliance', 'Funding access', 'Mentorship'],
    link: 'https://www.startupindia.gov.in',
    check: (p) =>
      ['Freelancer', 'Consultant'].includes(p?.businessType) &&
      ['\u20b95L \u2013 \u20b910L', '\u20b910L \u2013 \u20b925L', 'Above \u20b925L'].includes(p?.income),
    reason: (p) => [
      'Business Type: ' + p?.businessType,
      'Income: ' + p?.income + ' (growing income profile)',
    ]
  },
  {
    title: 'Professional Tax Exemption',
    tag: 'Tax Benefit',
    icon: '💰',
    eligibility: 'Anyone with income below Rs.2.5 lakh per year',
    desc: 'No professional tax if your annual income is below the basic exemption limit.',
    benefits: ['Zero tax liability', 'No filing needed', 'Simple compliance'],
    link: 'https://www.incometax.gov.in',
    check: (p) => p?.income === 'Under \u20b92.5L',
    reason: (p) => [
      'Income: ' + p?.income + ' (below Rs.2.5L exemption limit)',
    ]
  },
];

export default function Schemes() {
  const { profile } = useApp();

  const eligibleSchemes = SCHEMES.filter(s => s.check(profile));
  const otherSchemes = SCHEMES.filter(s => !s.check(profile));

  return (
    <div className="page">
      <div className="schemes-container">

        <div className="page-title">Government Schemes</div>
        <div className="page-sub">
          Benefits you may be eligible for - most people do not know these exist!
        </div>

        {!profile?.businessType && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#555',
            fontSize: '14px',
            border: '1px dashed #333',
            borderRadius: '12px',
            marginTop: '24px'
          }}>
            Please complete your profile to see eligible schemes!
          </div>
        )}

        {eligibleSchemes.length > 0 && (
          <div>
            <div style={{
              margin: '28px 0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00C896',
                boxShadow: '0 0 8px #00C896'
              }} />
              <span style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#00C896',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}>
                You are eligible for {eligibleSchemes.length} scheme(s)
              </span>
            </div>

            {eligibleSchemes.map((s, i) => (
              <div key={i} style={{
                border: '1px solid rgba(0,200,150,0.3)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #0d1a14 0%, #0a0f0d 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '24px',
                  right: '24px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.4), transparent)'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{s.title}</div>
                      <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>👤 {s.eligibility}</div>
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '10px',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: 'rgba(0,200,150,0.08)',
                    border: '1px solid rgba(0,200,150,0.25)',
                    color: '#00C896',
                    whiteSpace: 'nowrap'
                  }}>
                    {s.tag}
                  </div>
                </div>

                <div style={{ fontSize: '14px', color: '#888', lineHeight: '1.6', marginBottom: '16px' }}>
                  {s.desc}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {s.benefits.map((b, j) => (
                    <span key={j} style={{
                      padding: '5px 12px',
                      borderRadius: '100px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: 'rgba(0,200,150,0.06)',
                      border: '1px solid rgba(0,200,150,0.15)',
                      color: '#00C896'
                    }}>
                      ✓ {b}
                    </span>
                  ))}
                </div>

                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(0,200,150,0.04)',
                  border: '1px solid rgba(0,200,150,0.12)',
                  borderRadius: '10px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#00C896',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}>
                    Why you are eligible:
                  </div>
                  {s.reason(profile).map((r, k) => (
                    <div key={k} style={{
                      fontSize: '12px',
                      color: '#aaa',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ color: '#00C896', fontSize: '10px' }}>✓</span>
                      {r}
                    </div>
                  ))}
                </div>

                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, rgba(0,200,150,0.15), rgba(0,200,150,0.08))',
                    border: '1px solid rgba(0,200,150,0.35)',
                    color: '#00C896'
                  }}
                >
                  Apply Now →
                </a>
              </div>
            ))}
          </div>
        )}

        {otherSchemes.length > 0 && (
          <div>
            <div style={{
              margin: '28px 0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#333'
              }} />
              <span style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#bfbdbd',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}>
                Other Schemes (Not eligible based on your profile)
              </span>
            </div>

            {otherSchemes.map((s, i) => (
              <div key={i} style={{
                border: '1px solid #1a1a1a',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '16px',
                background: '#0a0a0a',
                opacity: '0.55'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px', filter: 'grayscale(1)' }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#555' }}>{s.title}</div>
                      <div style={{ fontSize: '11px', color: '#333', marginTop: '2px' }}>👤 {s.eligibility}</div>
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '10px',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid #222',
                    color: '#bfbdbd'
                  }}>
                    {s.tag}
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: '#bfbdbd', lineHeight: '1.6', marginBottom: '12px' }}>
                  {s.desc}
                </div>

                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid #222',
                    color: '#bfbdbd'
                  }}
                >
                  Learn More
                </a>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
