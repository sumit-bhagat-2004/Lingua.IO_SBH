export const generateMilestones = (preferences) => {
  const { learningLanguage, currentLevel, goals } = preferences;

  const goalsArray = Array.isArray(goals)
    ? goals
    : goals
        ?.split(",")
        .map((g) => g.trim())
        .filter(Boolean) || [];

  const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  const milestones = [
    {
      title: `Master 100 Common ${learningLanguage} Words`,
      description: `Focus on common vocabulary for ${goalsArray.join(", ")}`,
      targetDate: addDays(7),
    },
    {
      title: `Basic Grammar: ${learningLanguage} Sentence Structure`,
      description: `Learn how to form simple sentences as a ${currentLevel}`,
      targetDate: addDays(14),
    },
    {
      title: `Conversation Practice: Daily Dialogues`,
      description: `Practice AI-based mock conversations tailored to your ${goalsArray.join(
        ", "
      )} goals.`,
      targetDate: addDays(21),
    },
  ];

  return milestones;
};
