// src/components/Contact/Contact.jsx
import { useRef, useState } from 'react';
import { FiMapPin, FiGithub, FiClock, FiSend } from 'react-icons/fi';
import MagneticButton from '../shared/MagneticButton';
import Toast from '../shared/Toast';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { sendContactEmail } from '../../utils/emailService';
import { saveContact } from '../../utils/adminStorage';
import './Contact.css';

const MAX_MSG = 500;

// REPLACE with your actual contact info
const CONTACT_INFO = [
  { img: '/assets/social/gmail.png', label: 'Email', value: 'gopalmuri2004@gmail.com', href: 'mailto:gopalmuri2004@gmail.com' },
  { icon: <FiMapPin />, label: 'Location', value: 'India', href: null },
  { img: '/assets/social/linkedin.png', label: 'LinkedIn', value: 'linkedin.com/in/gopalmuri', href: 'https://www.linkedin.com/in/gopalmuri' },
  { icon: <FiGithub />, label: 'GitHub', value: 'github.com/gopalmuri', href: 'https://github.com/gopalmuri' },
  { icon: <FiClock />, label: 'Response Time', value: 'Usually within 24 hours', href: null },
];

export default function Contact() {
  const ref = useScrollAnimation();
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const OWNER_EMAIL  = 'gopalmuri2004@gmail.com';
  const MAX_SUBMITS  = 2;
  const STORAGE_KEY  = 'portfolio_contact_counts';

  const getSubmitCount = (email) => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return data[email.toLowerCase()] || 0;
  };

  const incrementSubmitCount = (email) => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    data[email.toLowerCase()] = (data[email.toLowerCase()] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    else if (form.email.toLowerCase() === OWNER_EMAIL) errs.email = 'Please use your own email address';
    else if (getSubmitCount(form.email) >= MAX_SUBMITS) errs.email = 'You have reached the maximum of 2 messages. Please email me directly.';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.length > MAX_MSG) errs.message = `Max ${MAX_MSG} characters`;
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSending(true);
    saveContact(form);

    sendContactEmail(
      formRef,
      () => {
        incrementSubmitCount(form.email);
        setSending(false);
        setForm({ name: '', email: '', subject: '', message: '' });
        setToast({ message: "✅ Message sent! I'll reply within 24 hours.", type: 'success' });
      },
      () => {
        setSending(false);
        setToast({ message: '❌ Failed to send. Please email me directly.', type: 'error' });
      }
    );
  };

  return (
    <section id="contact" className="contact section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title fade-up stagger-child">Get In Touch</h2>
          <p className="section-subtitle fade-up stagger-child">
            Have a project in mind? Let's build something amazing together.
          </p>
        </div>

        <div className="contact__grid">
          {/* Left — Info cards */}
          <div className="contact__info fade-left stagger-child">
            {/* Info items */}
            {CONTACT_INFO.map(({ img, icon, label, value, href }) => (
              <div key={label} className="contact__info-card">
                <div className="contact__info-icon">
                  {img ? (
                    <img src={img} alt={label} className="contact__icon-img" />
                  ) : (
                    <div className="contact__icon-svg">{icon}</div>
                  )}
                </div>
                <div>
                  <p className="contact__info-label">{label}</p>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="contact__info-value contact__info-value--link">
                      {value}
                    </a>
                  ) : (
                    <p className="contact__info-value">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right — Form */}
          <form
            ref={formRef}
            className="contact__form fade-right stagger-child"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={errors.name ? 'form-input--error' : ''}
                  autoComplete="name"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={errors.email ? 'form-input--error' : ''}
                  autoComplete="email"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                className={errors.subject ? 'form-input--error' : ''}
              />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">
                Message
                <span className={`form-char-count ${form.message.length > MAX_MSG ? 'form-char-count--over' : ''}`}>
                  {form.message.length}/{MAX_MSG}
                </span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project or just say hello..."
                rows={5}
                className={errors.message ? 'form-input--error' : ''}
              />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>

            <MagneticButton
              type="submit"
              className="magnetic-btn--primary contact__submit"
              disabled={sending}
            >
              {sending ? '⌛ Sending...' : <><FiSend /> Send Message</>}
            </MagneticButton>
          </form>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
