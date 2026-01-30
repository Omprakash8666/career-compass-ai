import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/career";
import { 
  GraduationCap, 
  Briefcase, 
  Lightbulb, 
  Target, 
  MapPin, 
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react";

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
}

const steps = [
  {
    key: "education",
    icon: GraduationCap,
    title: "Educational Background",
    description: "Tell us about your degrees, certifications, and academic achievements",
    placeholder: "e.g., Bachelor's in Computer Science from MIT, AWS Certified Solutions Architect, Google Data Analytics Certificate...",
  },
  {
    key: "experience",
    icon: Briefcase,
    title: "Work Experience",
    description: "Share your professional journey and key accomplishments",
    placeholder: "e.g., 3 years as Software Developer at TechCorp, 2 years as Data Analyst at DataCo, Led team of 5 developers...",
  },
  {
    key: "skills",
    icon: Lightbulb,
    title: "Skills & Competencies",
    description: "What are your technical skills, soft skills, and languages?",
    placeholder: "e.g., Python, JavaScript, Machine Learning, Project Management, Fluent in Spanish, Strong communication skills...",
  },
  {
    key: "interests",
    icon: Target,
    title: "Career Interests",
    description: "What fields or roles excite you?",
    placeholder: "e.g., AI/ML engineering, Product Management, Startup environment, Healthcare technology, Remote leadership roles...",
  },
  {
    key: "location",
    icon: MapPin,
    title: "Location Preferences",
    description: "Where would you like to work?",
    placeholder: "e.g., San Francisco Bay Area, Open to remote work, Willing to relocate to Europe, Prefer hybrid setup...",
  },
  {
    key: "constraints",
    icon: Clock,
    title: "Constraints & Considerations",
    description: "Any limitations we should know about?",
    placeholder: "e.g., Available for part-time study only, Budget of $5000 for courses, Need to transition within 6 months, Visa sponsorship required...",
  },
];

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = formData[step.key as keyof UserProfile]?.trim();

  const handleNext = () => {
    if (isLastStep) {
      onComplete(formData as UserProfile);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    if (isLastStep) {
      onComplete({
        education: formData.education || "",
        experience: formData.experience || "",
        skills: formData.skills || "",
        interests: formData.interests || "",
        location: formData.location || "",
        constraints: formData.constraints || "",
      });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.key}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl p-8 shadow-medium"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <step.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold">{step.title}</h2>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor={step.key} className="sr-only">
              {step.title}
            </Label>
            <Textarea
              id={step.key}
              value={formData[step.key as keyof UserProfile] || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [step.key]: e.target.value }))
              }
              placeholder={step.placeholder}
              className="min-h-[120px] resize-none"
              autoFocus
            />
          </div>

          <div className="flex justify-between mt-8">
            <div>
              {currentStep > 0 && (
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSkip}>
                Skip
              </Button>
              <Button variant="hero" onClick={handleNext}>
                {isLastStep ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Step indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => index < currentStep && setCurrentStep(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStep
                ? "w-6 bg-primary"
                : index < currentStep
                ? "bg-primary/50 cursor-pointer hover:bg-primary/70"
                : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
