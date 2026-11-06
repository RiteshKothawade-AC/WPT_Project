import './Footer.css';

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div>
          <h2>QuizDesk</h2>
          <p>
            Test Your Knowledge, Track Your Progress.
          </p>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 QuizDesk. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;