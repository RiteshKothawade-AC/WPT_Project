
import './About.css';

function About() {
  return (
    <div className="about-page">

      <h1>About QuizDesk</h1>

      <p className="about-intro">
        QuizDesk is an online examination and assessment
        system designed to make exams simple and convenient.
      </p>

      <div className="about-content">
        <h2>Our Purpose</h2>
        <p>
          Our purpose is to provide a platform where students
          can attend online exams and check their results easily.
        </p>

        <h2>What We Offer</h2>
        <p>
          QuizDesk allows students to attend timed exams,
          view their scores and track their performance.
          Administrators can manage exams and questions.
        </p>

        <h2>Our Goal</h2>
        <p>
          We aim to make the examination process easier,
          faster and more organised.
        </p>
      </div>

    </div>
  );
}

export default About;
