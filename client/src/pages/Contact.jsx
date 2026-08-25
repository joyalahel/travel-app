import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // TODO: wire this to a real backend endpoint (e.g. POST /api/contact) once built
      console.log('Contact form submitted:', form);
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    }
  }

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="contact-success">
          <h1>Message sent</h1>
          <p>Thanks for reaching out — we'll get back to you soon.</p>
          <button onClick={() => setSubmitted(false)}>Send another message</button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact us</h1>
        <p>Have a question about a trip or booking? Send us a message.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="6"
            value={form.message}
            onChange={handleChange}
          />
          {errors.message && <p className="field-error">{errors.message}</p>}
        </div>

        <button type="submit" className="submit-btn">Send message</button>
      </form>
    </div>
  );
}

export default Contact;