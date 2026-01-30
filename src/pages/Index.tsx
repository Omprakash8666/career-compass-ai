import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { OnboardingForm } from "@/components/OnboardingForm";
import { ChatInterface } from "@/components/ChatInterface";
import { useCareerAdvisor } from "@/hooks/useCareerAdvisor";
import { UserProfile } from "@/types/career";

type AppState = "welcome" | "onboarding" | "chat";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("welcome");
  const { messages, isLoading, userProfile, sendMessage, updateProfile, clearChat } = useCareerAdvisor();

  const handleGetStarted = () => {
    setAppState("onboarding");
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    updateProfile(profile);
    setAppState("chat");
    
    // Send initial greeting with profile context
    const hasProfile = Object.values(profile).some(v => v.trim());
    if (hasProfile) {
      const intro = `Hi! I just completed my profile. Here's my background:
- Education: ${profile.education || "Not specified"}
- Experience: ${profile.experience || "Not specified"}
- Skills: ${profile.skills || "Not specified"}
- Interests: ${profile.interests || "Not specified"}
- Location: ${profile.location || "Flexible"}
- Constraints: ${profile.constraints || "None"}

Based on this, what career paths and educational opportunities would you recommend for me?`;
      sendMessage(intro);
    }
  };

  const handleEditProfile = () => {
    setAppState("onboarding");
  };

  const handleClearChat = () => {
    clearChat();
  };

  if (appState === "welcome") {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (appState === "onboarding") {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
        <OnboardingForm onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <ChatInterface
      messages={messages}
      isLoading={isLoading}
      userProfile={userProfile}
      onSendMessage={sendMessage}
      onClearChat={handleClearChat}
      onEditProfile={handleEditProfile}
    />
  );
};

export default Index;
