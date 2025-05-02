// src/HomePage.jsx
function HomePage() {
    return (
      <div className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 to-purple-100 py-16 px-4">
        {/* Headline */}
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to Lingua.IO</h1>
  
        {/* Subtext */}
        <p className="text-lg text-gray-700 mb-6 max-w-xl">
          Learn new languages using AI! Practice grammar, vocabulary, and have real-time conversations with your AI language tutor.
        </p>
  
        {/* Explore Button */}
        <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">
          Explore Now
        </button>
  
        {/* Features */}
        <div className="mt-12 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <Feature title="Grammar Correction" desc="Fix your grammar in real-time while chatting." />
          <Feature title="AI Conversations" desc="Talk with your AI tutor like a real person." />
          <Feature title="Vocabulary Practice" desc="Expand your word power through quizzes and examples." />
          <Feature title="Progress Tracking" desc="View your improvement over time with smart analytics." />
        </div>
      </div>
    );
  }
  
  function Feature({ title, desc }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <h3 className="text-xl font-semibold text-blue-600 mb-2">{title}</h3>
        <p className="text-gray-600">{desc}</p>
      </div>
    );
  }
  
  export default HomePage;