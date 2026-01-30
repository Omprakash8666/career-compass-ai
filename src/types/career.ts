export interface UserProfile {
  education: string;
  experience: string;
  skills: string;
  interests: string;
  location: string;
  constraints: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  userProfile: UserProfile | null;
}
