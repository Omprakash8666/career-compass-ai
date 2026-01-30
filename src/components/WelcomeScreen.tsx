import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, BookOpen, Rocket, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: Target,
    title: "Personalized Career Paths",
    description: "Get tailored recommendations based on your unique skills and interests",
  },
  {
    icon: BookOpen,
    title: "Educational Roadmaps",
    description: "Discover courses, certifications, and programs to level up",
  },
  {
    icon: Rocket,
    title: "Action Plans",
    description: "Step-by-step guidance to achieve your career goals",
  },
];

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-6 shadow-accent"
          >
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
            Your AI Career Advisor
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Navigate your career journey with personalized guidance, educational recommendations, 
            and actionable plans tailored just for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={onGetStarted}
            size="xl"
            variant="hero"
            className="group"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Takes about 2 minutes to set up
          </p>
        </motion.div>
      </div>
    </div>
  );
}
