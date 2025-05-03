import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function OnboardingGate({ children }) {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) return;

    const checkOnboarding = async () => {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:8000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!data.isOnboarded) {
          navigate("/onboarding");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to check onboarding:", err);
      }
    };

    checkOnboarding();
  }, [user, isSignedIn, navigate]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}

export default OnboardingGate;
