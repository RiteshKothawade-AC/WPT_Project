function Home() {
  return (
    <main>

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <p className="small-heading">
            ONLINE ASSESSMENTS 
          </p>

          <h1>
            Smart examinations.
            <br />
            Simple assessments.
          </h1>

          <p className="hero-description">
            A dependable platform for students to attend
            online examinations and track their progress.
          </p>

          <button className="get-started-btn">
            Get Started
          </button>

        </div>

      </section>

      {/* Features Section */}
      <section className="features">

        <h2>Everything you need in one place.</h2>

        <p className="features-description">
          Simple tools for better examination experiences.
        </p>

        <div className="feature-container">

          <div className="feature-card">
            <h3>Timed Exams</h3>
            <p>Attend examinations with a timer.</p>
          </div>

          <div className="feature-card">
            <h3>Instant Results</h3>
            <p>View your marks after submitting the exam.</p>
          </div>

          <div className="feature-card">
            <h3>Secure Exams</h3>
            <p>Student results remain private.</p>
          </div>

        </div>

      </section>
      <section className="how-it-works">

  <h2>How QuizDesk Works</h2>

  <p className="how-description">
    Get started with online examinations in three simple steps.
  </p>

  <div className="steps-container">

    <div className="step-card">
      <h3>01</h3>
      <h4>Sign In</h4>
      <p>Create your account and log in.</p>
    </div>

    <div className="step-card">
      <h3>02</h3>
      <h4>Attend Exam</h4>
      <p>Choose an available exam and answer questions.</p>
    </div>

    <div className="step-card">
      <h3>03</h3>
      <h4>View Results</h4>
      <p>Submit your exam and check your marks.</p>
    </div>

  </div>

</section>

    </main>
  );
}

export default Home;