import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const Dashboard = () => {
  const { getToken } = useAuth();
  const [milestones, setMilestones] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState(null); // New state for preferences

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = await getToken();
      try {
        // Fetch milestones
        const milestonesResponse = await fetch(
          "http://localhost:8000/api/users/me/milestones",
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (!milestonesResponse.ok) {
          throw new Error(
            `Failed to fetch milestones: ${milestonesResponse.status}`
          );
        }
        const milestonesData = await milestonesResponse.json();
        setMilestones(milestonesData.milestones || []);

        // Fetch user preferences (assuming you have a separate endpoint)
        const preferencesResponse = await fetch(
          "http://localhost:8000/api/users/me", //  Adjust the endpoint as necessary
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (!preferencesResponse.ok) {
          throw new Error(
            `Failed to fetch preferences: ${preferencesResponse.status}`
          );
        }
        const preferencesData = await preferencesResponse.json();
        setPreferences(preferencesData.preferences); // Extract the preferences
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  if (loading) {
    return <div className="text-center py-4">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!milestones || milestones.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="font-bold text-lg mb-2">No Milestones</div>
        <p className="text-gray-700">
          No milestones have been set for you yet.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Learning Milestones</h1>
      {preferences && (
        <div className="bg-white shadow-md rounded-lg mb-4 p-4">
          <h2 className="text-xl font-semibold mb-2">Your Preferences</h2>
          <p className="text-gray-700">
            <strong>Learning Language:</strong> {preferences.learningLanguage}
          </p>
          <p className="text-gray-700">
            <strong>Current Level:</strong> {preferences.currentLevel}
          </p>
          <p className="text-gray-700">
            <strong>Goals:</strong> {preferences.goals}
          </p>
        </div>
      )}
      {milestones.map((milestone, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg mb-4 p-4">
          <h2 className="text-xl font-semibold mb-2">{milestone.title}</h2>
          <p className="text-gray-700 mb-2">{milestone.description}</p>
          <p className="text-gray-900">
            <strong className="font-semibold">Target Date:</strong>{" "}
            {milestone.targetDate
              ? new Date(milestone.targetDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
