import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const levels = ["Beginner", "Intermediate", "Advanced"];

function Onboarding() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    learningLanguage: "",
    currentLevel: "Beginner",
    goals: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken();

    const res = await fetch("http://localhost:8000/api/users/onboard", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    console.log(res);

    if (res.ok) {
      navigate("/dashboard");
    } else {
      alert("Something went wrong during onboarding.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Welcome to Lingua.IO 🎓
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Language you want to learn
          </label>
          <input
            type="text"
            value={formData.learningLanguage}
            onChange={(e) =>
              setFormData({ ...formData, learningLanguage: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="e.g., Spanish, Japanese"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Current Level</label>
          <select
            value={formData.currentLevel}
            onChange={(e) =>
              setFormData({ ...formData, currentLevel: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Your Learning Goals</label>
          <textarea
            value={formData.goals}
            onChange={(e) =>
              setFormData({ ...formData, goals: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="e.g., Speak fluently in 3 months, Pass A2 test..."
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Complete Onboarding
        </button>
      </form>
    </div>
  );
}

export default Onboarding;
