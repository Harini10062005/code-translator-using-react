import { Link } from "react-router-dom"; 

export default function HomePage() {
  const features = [
    { icon: "⚡", title: "Fast Translation",   desc: "Instantly convert Java code to any language." },
    { icon: "🎯", title: "Accurate Syntax",    desc: "Correct syntax for Python, JS, C++, C#." },
    { icon: "🛠️", title: "All Constructs",     desc: "Variables, loops, classes, methods and more." },
    { icon: "🌐", title: "4 Languages",        desc: "Python, JavaScript, C++, C# supported." },
  ];

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-badge">✦ AI-Powered Code Translator</div>
        <h1 className="hero-title">
          Translate Java Code<br />
          <span className="hero-gradient">To Any Language</span>
        </h1>
        <p className="hero-desc">
          Paste your Java code and instantly get accurate translations
          in Python, JavaScript, C++, or C#.
        </p>
        <div className="hero-btns">
          <Link to="/translator" className="btn-hero-primary">Start Translating →</Link>
          <Link to="/about"      className="btn-hero-ghost">Learn More</Link>
        </div>
      </div>
      <div className="home-nav-btns">
          <Link to="/"           className="home-nav-btn">🏠 Home</Link>
          <Link to="/translator" className="home-nav-btn">⇄ Translator</Link>
          <Link to="/about"      className="home-nav-btn">💡 About</Link>
          <Link to="/login"      className="home-nav-btn">🔑 Login</Link>
          <Link to="/signup"     className="home-nav-btn signup">🚀 Sign Up</Link>
        </div>

      <div className="features-grid">
        {features.map(f => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}