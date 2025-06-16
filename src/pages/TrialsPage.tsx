import { useState, useEffect } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import {
  Plus,
  Search,
  Calendar,
  AlertCircle,
  X,
  BarChart3,
  Zap,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import storage from "@/services/storage";
import { toast } from "sonner";
import { notificationEvents } from "@/hooks/useNotifications";
import { TrialCard } from "@/components/TrialCard";
import { useTrialContext } from "@/contexts/TrialContext";
import { TrialView } from "@/components/TrialView";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PHASE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  LOCATION_FILTER_OPTIONS,
  TRIAL_PHASES,
  TRIAL_STATUSES,
  TRIAL_LOCATIONS,
  type TrialPhase,
  type TrialStatusId,
  type TrialLocation,
} from "@/constants/trialConstants";

interface Trial {
  id: string;
  name: string;
  description: string;
  status: TrialStatusId; // Now aligned with Kanban columns
  location: TrialLocation;
  progress: number; // porcentaje
  upcoming: string;
  pendingTask: string;
  phase: TrialPhase; // Now refers to actual clinical trial phases
  image?: string;
  isNew?: boolean;
  sponsor?: string;
  piContact?: string;
  studyStart?: string;
  estimatedCloseOut?: string;
}

const trialImages = [
  "/trials-images/pawel-czerwinski-fRzUPSFnp04-unsplash.jpg",
  "/trials-images/pawel-czerwinski-Tyg0rVhOTrE-unsplash.jpg",
  "/trials-images/laura-vinck-Hyu76loQLdk-unsplash.jpg",
  "/trials-images/pawel-czerwinski-Lki74Jj7H-U-unsplash.jpg",
  "/trials-images/pawel-czerwinski-tMbQpdguDVQ-unsplash.jpg",
  "/trials-images/daniel-olah-VS_kFx4yF5g-unsplash.jpg",
  "/trials-images/geordanna-cordero-5NE6mX0WVfQ-unsplash.jpg",
  "/trials-images/bia-w-a-PO8Woh4YBD8-unsplash.jpg",
  "/trials-images/mymind-tZCrFpSNiIQ-unsplash.jpg",
  "/trials-images/pawel-czerwinski-ruJm3dBXCqw-unsplash.jpg",
  "/trials-images/annie-spratt-0ZPSX_mQ3xI-unsplash.jpg",
  "/trials-images/usgs-hoS3dzgpHzw-unsplash.jpg",
];

export const TrialsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhase, setActivePhase] = useState(PHASE_FILTER_OPTIONS[0]);
  const [activeLocation, setActiveLocation] = useState(
    LOCATION_FILTER_OPTIONS[0]
  );
  const [trials, setTrials] = useState<Trial[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentTrialSection, setCurrentTrialSection] = useState("overview");
  const [newTrial, setNewTrial] = useState({
    name: "",
    description: "",
    status: "planning" as TrialStatusId,
    location: "" as TrialLocation,
    phase: "Phase I" as TrialPhase,
    upcoming: "",
    pendingTask: "",
    sponsor: "",
    piContact: "",
    studyStart: "",
    estimatedCloseOut: "",
  });

  const { selectedTrial, setSelectedTrial, isTrialView } = useTrialContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Load trials from database
    loadTrials();
  }, []);

  const loadTrials = async () => {
    try {
      const data = await storage.getTrials();
      setTrials(data);
    } catch (error) {
      console.error("Error loading trials:", error);
      setTrials([]);
    }
  };

  // Function to get the next available image for a new trial
  const getNextTrialImage = async () => {
    try {
      const existingTrials = await storage.getTrials();
      const usedImages = existingTrials
        .map((trial) => trial.image)
        .filter(Boolean);

      // Find the first image that hasn't been used yet
      const availableImage = trialImages.find(
        (image) => !usedImages.includes(image)
      );

      // If all images are used, start over with the first one
      return availableImage || trialImages[0];
    } catch (error) {
      console.error("Error getting next trial image:", error);
      return trialImages[0]; // Fallback to first image
    }
  };

  const handleCreateTrial = async () => {
    if (!newTrial.name || !newTrial.description || !newTrial.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Set default values for upcoming and pending tasks if empty
    const upcomingTask = newTrial.upcoming.trim() || "Upload protocols";
    const pendingTask = newTrial.pendingTask.trim() || "Assign team members";

    const trial = {
      ...newTrial,
      upcoming: upcomingTask,
      pendingTask: pendingTask,
      progress: 0,
      image: await getNextTrialImage(),
      isNew: true,
    };

    const savedTrial = await storage.saveTrial(trial);

    // Create tasks in Task Manager for this trial
    if (savedTrial) {
      const startDate = new Date();
      const upcomingDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const pendingDueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

      // Create upcoming task
      const upcomingTaskObj = {
        columnId: "planning",
        trial: trial.name,
        site: trial.location,
        priority: "Medium",
        role: "CRA",
        owner: "Unassigned",
        dates: `${startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${upcomingDueDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`,
        startDate: startDate.toISOString().split("T")[0],
        endDate: upcomingDueDate.toISOString().split("T")[0],
        parentId: null,
        dependencies: [],
        progress: 0,
        users: 1,
        files: 0,
        comments: 0,
        title: upcomingTask,
        trialId: savedTrial.id,
        trialName: trial.name,
        category: "Protocol",
      };

      // Create pending task
      const pendingTaskObj = {
        columnId: "planning",
        trial: trial.name,
        site: trial.location,
        priority: "High",
        role: "CTM",
        owner: "Unassigned",
        dates: `${startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${pendingDueDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`,
        startDate: startDate.toISOString().split("T")[0],
        endDate: pendingDueDate.toISOString().split("T")[0],
        parentId: null,
        dependencies: [],
        progress: 0,
        users: 1,
        files: 0,
        comments: 0,
        title: pendingTask,
        trialId: savedTrial.id,
        trialName: trial.name,
        category: "Team Management",
      };

      // Save tasks to Task Manager
      storage.saveTask(upcomingTaskObj);
      storage.saveTask(pendingTaskObj);
    }

    // Create notification for new trial
    storage.saveNotification({
      type: "trial_update",
      title: "New Trial Created",
      message: `Trial "${trial.name}" has been created and is now in ${trial.status} status`,
    });

    loadTrials();
    setIsCreateModalOpen(false);
    setNewTrial({
      name: "",
      description: "",
      status: "planning" as TrialStatusId,
      location: "Milano" as TrialLocation,
      phase: "Phase I" as TrialPhase,
      upcoming: "",
      pendingTask: "",
      sponsor: "",
      piContact: "",
      studyStart: "",
      estimatedCloseOut: "",
    });

    // Emit event to update notification count
    notificationEvents.emit();

    toast.success("Trial Created", {
      description:
        "New trial has been created successfully with default tasks.",
    });
  };

  const handleTrialClick = (trial: Trial) => {
    setSelectedTrial(trial);
    navigate(`/trials/${trial.id}`);
  };

  const filteredTrials = trials.filter((trial) => {
    const matchesSearch =
      searchQuery === "" ||
      trial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase =
      activePhase === "All phases" || trial.phase === activePhase;
    const matchesLocation =
      activeLocation === "All places" || trial.location === activeLocation;
    return matchesSearch && matchesPhase && matchesLocation;
  });

  // Helper para determinar la etapa actual basada en el status del workflow
  function getStage(trial: Trial) {
    if (trial.isNew) return "Start";
    if (trial.status === "study") return "Study Conduct";
    if (trial.status === "completed") return "Completed";
    return "In Progress";
  }

  // Helper para obtener el nombre del status
  function getStatusName(statusId: TrialStatusId): string {
    const status = TRIAL_STATUSES.find((s) => s.id === statusId);
    return status ? status.name : statusId;
  }

  // Helper para obtener el color del status
  function getStatusColor(statusId: TrialStatusId): string {
    const status = TRIAL_STATUSES.find((s) => s.id === statusId);
    return status ? status.color : "#6b7280";
  }

  // Always show the trials list since trial details are now handled by routes
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-1 text-gray-900">Trials</h1>
          <p className="text-themison-gray text-base">
            {filteredTrials.length} Active Trials
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto items-center justify-end">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your trial here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            />
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-[#10121C] hover:bg-primary-hover text-white px-5 py-2 rounded-md font-medium transition-colors text-sm">
                <Plus className="h-5 w-5" /> Create trial
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Trial</DialogTitle>
                <DialogDescription>
                  Add a new clinical trial to your dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="trial-name">Trial Name *</Label>
                  <Input
                    id="trial-name"
                    value={newTrial.name}
                    onChange={(e) =>
                      setNewTrial({ ...newTrial, name: e.target.value })
                    }
                    placeholder="Enter trial name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="trial-description">Description *</Label>
                  <Textarea
                    id="trial-description"
                    value={newTrial.description}
                    onChange={(e) =>
                      setNewTrial({ ...newTrial, description: e.target.value })
                    }
                    placeholder="Brief description of the trial"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="trial-status">Status</Label>
                    <Select
                      value={newTrial.status}
                      onValueChange={(value: TrialStatusId) =>
                        setNewTrial({ ...newTrial, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {TRIAL_STATUSES.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trial-location">Location *</Label>
                    <Select
                      value={newTrial.location}
                      onValueChange={(value: TrialLocation) =>
                        setNewTrial({ ...newTrial, location: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {TRIAL_LOCATIONS.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="trial-phase">Phase</Label>
                  <Select
                    value={newTrial.phase}
                    onValueChange={(value: TrialPhase) =>
                      setNewTrial({ ...newTrial, phase: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      {TRIAL_PHASES.map((phase) => (
                        <SelectItem key={phase} value={phase}>
                          {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="trial-upcoming">Upcoming Task</Label>
                  <Input
                    id="trial-upcoming"
                    value={newTrial.upcoming}
                    onChange={(e) =>
                      setNewTrial({ ...newTrial, upcoming: e.target.value })
                    }
                    placeholder="Next upcoming task or milestone"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="trial-pending">Pending Task</Label>
                  <Input
                    id="trial-pending"
                    value={newTrial.pendingTask}
                    onChange={(e) =>
                      setNewTrial({ ...newTrial, pendingTask: e.target.value })
                    }
                    placeholder="Current pending task"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTrial}>Create Trial</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros inline con labels al inicio */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap whitespace-nowrap">
          <span className="text-xs font-medium text-gray-500 mr-2">Phases</span>
          {PHASE_FILTER_OPTIONS.map((phase) => (
            <button
              key={phase}
              className={`text-sm font-medium px-2 py-1 rounded-md transition-colors ${
                activePhase === phase
                  ? "bg-[#6C757D] text-white"
                  : "text-gray-700 bg-transparent"
              }`}
              style={
                activePhase !== phase
                  ? { background: "none", boxShadow: "none" }
                  : {}
              }
              onClick={() => setActivePhase(phase)}
            >
              {phase}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap whitespace-nowrap">
          <span className="text-xs font-medium text-gray-500 mr-2">
            Locations
          </span>
          {LOCATION_FILTER_OPTIONS.map((location) => (
            <button
              key={location}
              className={`text-sm font-medium px-2 py-1 rounded-md transition-colors ${
                activeLocation === location
                  ? "bg-[#6C757D] text-white"
                  : "text-gray-700 bg-transparent"
              }`}
              style={
                activeLocation !== location
                  ? { background: "none", boxShadow: "none" }
                  : {}
              }
              onClick={() => setActiveLocation(location)}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {filteredTrials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No trials found
            </h3>
            <p className="text-gray-500 mb-4 max-w-sm">
              No trials match your current filters. Try adjusting your search
              criteria or clearing the filters.
            </p>
            <div className="flex gap-2 justify-center">
              {(activePhase !== "All phases" ||
                activeLocation !== "All places" ||
                searchQuery !== "") && (
                <button
                  onClick={() => {
                    setActivePhase(PHASE_FILTER_OPTIONS[0]);
                    setActiveLocation(LOCATION_FILTER_OPTIONS[0]);
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {filteredTrials.map((trial) => (
            <TrialCard
              key={trial.id}
              trial={trial}
              onClick={() => handleTrialClick(trial)}
              getStage={getStage}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TrialsPage;
