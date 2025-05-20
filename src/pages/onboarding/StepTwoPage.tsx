import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "@/features/onboarding/components/OnboardingLayout";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown } from "lucide-react";
import {
  updateOnboardingStep,
  getOnboardingStatus,
} from "@/services/userService";

const phases = ["Phase 1", "Phase 2", "Phase 3", "Phase 4"];

export const StepTwoPage = () => {
  const [studyName, setStudyName] = useState("");
  const [location, setLocation] = useState("");
  const [sponsorName, setSponsorName] = useState("");
  const [phase, setPhase] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved study data if available
  useEffect(() => {
    const onboardingStatus = getOnboardingStatus();
    if (onboardingStatus?.studyInfo) {
      const {
        name,
        location: loc,
        sponsor,
        phase: ph,
      } = onboardingStatus.studyInfo;
      setStudyName(name || "");
      setLocation(loc || "");
      setSponsorName(sponsor || "");
      setPhase(ph || "");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studyName || !location || !sponsorName || !phase) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all fields to continue",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage using our service
    updateOnboardingStep(2, {
      name: studyName,
      location,
      sponsor: sponsorName,
      phase,
    });

    // Navigate to next step
    navigate("/onboarding/step3");
  };

  return (
    <OnboardingLayout currentStep={2} previousStep="/onboarding/step1">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Create a Study/Trial</h2>

        <div>
          <h3 className="text-xl font-medium mb-2">Tell us about your study</h3>
          <p className="text-themison-gray mb-6">
            Get tools and content tailored to your role for faster setup.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div>
              <label
                htmlFor="study-name"
                className="block text-sm font-medium mb-1"
              >
                Name of the study/trial
              </label>
              <input
                id="study-name"
                type="text"
                value={studyName}
                onChange={(e) => setStudyName(e.target.value)}
                placeholder="Study name"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-1"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="sponsor"
                className="block text-sm font-medium mb-1"
              >
                Sponsor name
              </label>
              <input
                id="sponsor"
                type="text"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="Sponsor name"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="phase" className="block text-sm font-medium mb-1">
                Phase
              </label>
              <div className="relative">
                <div
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary flex justify-between items-center cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span
                    className={
                      phase ? "text-themison-text" : "text-themison-gray"
                    }
                  >
                    {phase || "Select phase for your study"}
                  </span>
                  <ChevronDown className="h-5 w-5 text-themison-gray" />
                </div>

                {isOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                    <ul className="py-1">
                      {phases.map((p) => (
                        <li
                          key={p}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setPhase(p);
                            setIsOpen(false);
                          }}
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover focus:bg-primary-selected text-white px-4 py-3 rounded transition-colors font-medium"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </OnboardingLayout>
  );
};
