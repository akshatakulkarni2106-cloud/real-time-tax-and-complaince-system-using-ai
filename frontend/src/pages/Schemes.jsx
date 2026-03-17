import { useApp } from '../context/AppContext';

const SCHEMES = [
  {
    title: 'PM SVANidhi',
    tag: 'Street Vendors',
    eligibility: 'Street vendors with vending certificate',
    desc: 'Working capital loan from Rs.10,000 to Rs.50,000 with no collateral needed.',
    benefits: ['Loan up to Rs.50,000', 'No collateral', 'Subsidized interest', 'Credit score building'],
    link: 'https://pmsvanidhi.mohua.gov.in',
    check: (p) => p?.businessType === 'Small Trader'
  },
  {
    title: 'MUDRA Loan (Shishu)',
    tag: 'Micro Businesses',
    eligibility: 'Non-farm micro enterprises',
    desc: 'Collateral-free loans to help micro-businesses start and grow operations.',
    benefits: ['Up to Rs.50,000', 'Low interest', 'No collateral', 'Multiple banks'],
    link: 'https://www.mudra.org.in',
    check: (p) => ['Small Trader', 'Micro Manufacturer', 'Freelancer'].includes(p?.businessType)
  },
  {
    title: 'Udyam Registration',
    tag: 'MSME Benefit',
    eligibility: 'All micro, small and medium enterprises',
    desc: 'Free registration that unlocks priority lending and government scheme access.',
    benefits: ['Priority credit', 'Tender preference', 'Patent subsidy', 'Late payment protection'],
    link: 'https://udyamregistration.gov.in',
    check: (p) => ['Small Trader', 'Micro Manufacturer', 'Consultant'].includes(p?.businessType)
  },
  {
    title: 'Jan Dhan Overdraft',
    tag: 'Gig Workers',
    eligibility: 'Jan Dhan account holders',
    desc: 'Overdraft facility up to Rs.10,000 - a safety net for gig workers.',
    benefits: ['Rs.10,000 overdraft', 'No processing fee', 'Instant access'],
    link: 'https://pmjdy.gov.in',
    check: (p) => p?.businessType === 'Gig Worker'
  },
  {
    title: 'Presumptive Tax 44AD',
    tag: 'Tax Benefit',
    eligibility: 'Businesses with turnover under Rs.2 crore',
    desc: 'Declare 8% of turnover as income - no bookkeeping or audit required.',
    benefits: ['No books needed', '8% presumptive', 'Simple ITR', 'No audit'],
    link: 'https://www.incometax.gov.in',
    check: (p) => ['Small Trader', 'Micro Manufacturer', 'Freelancer', 'Consultant'].includes(p?.businessType)
  },
  {
    title: 'GST Composition Scheme',
    tag: 'GST Benefit',
    eligibility: 'Businesses with turnover under Rs.1.5 crore',
    desc: 'Pay GST at a flat rate instead of regular GST - less compliance burden.',
    benefits: ['Flat 1-6% GST', 'Quarterly filing', 'Less paperwork', 'Lower tax burden'],
    link: 'https://www.gst.gov.in',
    check: (p) => p?.gstRegistered === 'Yes'
  },
  {
    title: 'Startup India Scheme',
    tag: 'Startup Benefit',
    eligibility: 'DPIIT recognized startups',
    desc: 'Tax exemptions, funding support and mentorship for recognized startups.',
    benefits: ['3 year tax holiday', 'Easy compliance', 'Funding access', 'Mentorship'],
    link: 'https://www.startupindia.gov.in',
    check: (p) => ['Freelancer', 'Consultant'].includes(p?.businessType)
  },
  {
    title: 'Professional Tax Exemption',
    tag: 'Tax Benefit',
    eligibility: 'Income below Rs.2.5 lakh per year',
    desc: 'No professional tax if your annual income is below the basic exemption limit.',
    benefits: ['Zero tax liability', 'No filing needed', 'Simple compliance'],
    link: 'https://www.incometax.gov.in',
    check: (p) => p?.income === 'Under Rs.2.5L'
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
          <div style={{ textAlign: 'center', padding: '40px', color: '#555', fontSize: '14px' }}>
            Please complete your profile to see eligible schemes!
          </div>
        )}

        {eligibleSchemes.length > 0 && (
          <div>
            <div style={{
              margin: '24px 0 12px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#00C896',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              You are eligible for {eligibleSchemes.length} scheme(s)
            </div>

            {eligibleSchemes.map((s, i) => (
              <div key={i} className="scheme-card" style={{ border: '1px solid rgba(0,200,150,0.2)' }}>
                <div className="scheme-header">
                  <div className="scheme-title">{s.title}</div>
                  <div className="scheme-tag" style={{ background: 'rgba(0,200,150,0.1)', color: '#00C896' }}>
                    {s.tag}
                  </div>
                </div>
                <div className="scheme-desc">{s.desc}</div>
                <div className="scheme-benefits">
                  {s.benefits.map((b, j) => (
                    <span key={j} className="scheme-benefit">✓ {b}</span>
                  ))}
                </div>
                <div className="scheme-eligibility">Eligibility: {s.eligibility}</div>
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: '12px',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    background: 'rgba(0,200,150,0.1)',
                    border: '1px solid rgba(0,200,150,0.3)',
                    color: '#00C896'
                  }}
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        )}

        {otherSchemes.length > 0 && (
          <div>
            <div style={{
              margin: '24px 0 12px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#555',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Other Schemes (Not eligible based on your profile)
            </div>

            {otherSchemes.map((s, i) => (
              <div key={i} className="scheme-card" style={{ opacity: '0.5' }}>
                <div className="scheme-header">
                  <div className="scheme-title">{s.title}</div>
                  <div className="scheme-tag">{s.tag}</div>
                </div>
                <div className="scheme-desc">{s.desc}</div>
                <div className="scheme-eligibility">Eligibility: {s.eligibility}</div>
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: '12px',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid #222',
                    color: '#555'
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
