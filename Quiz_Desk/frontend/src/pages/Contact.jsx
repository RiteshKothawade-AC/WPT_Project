
import { useState } from 'react';
import './Contact.css';

function Contact() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    alert('Thank you for contacting QuizDesk!');

    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <div className="contact-page">

      <div className="contact-box">

        <h1>Contact Us</h1>
        <p>Have any questions? Send us a message.</p>

        <form onSubmit={handleSubmit}>

          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit">Send Message</button>

        </form>

      </div>

    </div>
  );
}

export default Contact;
