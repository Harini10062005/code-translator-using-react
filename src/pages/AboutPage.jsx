export default function AboutPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">About CodeBridge</h1>
        <p className="page-sub">What this project is about</p>
      </div>
      <div className="about-card">
        <p>CodeBridge is a Java code translator built with React. It converts Java syntax into Python, JavaScript, C++, and C# — covering variables, loops, conditions, methods, classes, arrays, and more.</p>
        <br />
        <p>Built by <strong>Harini.K</strong> as a frontend project using React + Vite.</p>
      </div>
    </div>
  );
}