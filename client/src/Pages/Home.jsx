// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="bg-black text-gray-100 h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Build, Validate & Practice Your Resume
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          Create your resume, validate it with AI, and practice mock interviews tailored to your resume. Get ready to ace your dream job!
        </p>
        <div className="flex gap-6">
          <Link
            to="/signup"
            className="bg-gray-800 text-gray-100 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-700 transition"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="border-2 border-gray-100 text-gray-100 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 hover:text-black transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 md:px-20 bg-gray-900 text-gray-100"
      >
        <h2 className="text-4xl font-bold mb-12 text-center">Features</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-gray-800 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-4">Resume Builder</h3>
            <p>
              Create professional resumes easily with our guided templates and AI suggestions.
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-4">AI Resume Validation</h3>
            <p>
              AI validates your resume according to industry standards and provides improvement tips.
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-4">AI Interview Practice</h3>
            <p>
              Practice interviews with AI that asks questions tailored to your resume, just like real interviews.
            </p>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 px-4 md:px-20 text-center bg-gray-900 text-gray-100">
        <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
        <p className="text-lg mb-8">Sign up and take the first step towards mastering your interviews.</p>
        <Link
          to="/signup"
          className="bg-gray-800 text-gray-100 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-700 transition"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
