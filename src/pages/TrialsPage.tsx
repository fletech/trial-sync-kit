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
import { Link } from "react-router-dom";
import storage from "@/services/storage";
import { useToast } from "@/hooks/use-toast";
import { notificationEvents } from "@/hooks/useNotifications";
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

interface Trial {
  id: string;
  name: string;
  description: string;
  status: string;
  location: string;
  progress: number; // porcentaje
  upcoming: string;
  pendingTask: string;
  phase: string;
  image?: string;
  isNew?: boolean;
  sponsor?: string;
  piContact?: string;
  studyStart?: string;
  estimatedCloseOut?: string;
}

const phases = [
  "All phases",
  "Study start-up",
  "Recruitment",
  "Screening visit",

  "Routine visit",

  "Close-out",
];
const locations = [
  "All places",
  "Castellanza",
  "Bergamo",
  "Torino",
  "Milano",
  "Catania",
];

const trialImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
];

export const TrialsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhase, setActivePhase] = useState(phases[0]);
  const [activeLocation, setActiveLocation] = useState(locations[0]);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null);
  const [newTrial, setNewTrial] = useState({
    name: "",
    description: "",
    status: "Planning",
    location: "",
    phase: "Study start-up",
    upcoming: "",
    pendingTask: "",
    sponsor: "",
    piContact: "",
    studyStart: "",
    estimatedCloseOut: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load trials from localStorage only
    loadTrials();
  }, []);

  const loadTrials = () => {
    const data = storage.getTrials();
    setTrials(data);
  };

  const handleCreateTrial = () => {
    if (!newTrial.name || !newTrial.description || !newTrial.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const trial = {
      ...newTrial,
      progress: 0,
      image: "",
      isNew: true,
    };

    storage.saveTrial(trial);

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
      status: "Planning",
      location: "",
      phase: "Study start-up",
      upcoming: "",
      pendingTask: "",
      sponsor: "",
      piContact: "",
      studyStart: "",
      estimatedCloseOut: "",
    });

    // Emit event to update notification count
    notificationEvents.emit();

    toast({
      title: "Trial Created",
      description: "New trial has been created successfully.",
    });
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

  // Helper para determinar la etapa actual
  function getStage(trial: Trial) {
    if (trial.isNew) return "Start";
    if (trial.phase === "Routine visit") return "Routine visits";
    if (trial.phase === "Close-out") return "Close-out";
    return "Routine visits";
  }

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
                      onValueChange={(value) =>
                        setNewTrial({ ...newTrial, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Recruiting">Recruiting</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Randomization">
                          Randomization
                        </SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trial-location">Location *</Label>
                    <Select
                      value={newTrial.location}
                      onValueChange={(value) =>
                        setNewTrial({ ...newTrial, location: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="Milano">Milano</SelectItem>
                        <SelectItem value="Bergamo">Bergamo</SelectItem>
                        <SelectItem value="Torino">Torino</SelectItem>
                        <SelectItem value="Castellanza">Castellanza</SelectItem>
                        <SelectItem value="Catania">Catania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="trial-phase">Phase</Label>
                  <Select
                    value={newTrial.phase}
                    onValueChange={(value) =>
                      setNewTrial({ ...newTrial, phase: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      {phases.slice(1).map((phase) => (
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
          {phases.map((phase) => (
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
          {locations.map((location) => (
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
                    setActivePhase("All phases");
                    setActiveLocation("All places");
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mt-6">
          {filteredTrials.map((trial) => (
            <div
              key={trial.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col transition hover:shadow-lg cursor-pointer"
              onClick={() => setSelectedTrial(trial)}
            >
              {/* Imagen y badges */}
              <div
                className="relative h-36 w-full"
                style={{ background: "#6C757D" }}
              >
                {trial.image ? (
                  <img
                    src={trial.image}
                    alt={trial.name}
                    className="object-cover w-full h-full"
                    style={{ minHeight: 144, maxHeight: 144 }}
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  {/* Phase badge */}
                  <span className="px-2 py-0.5 rounded-full text-xs font-normal bg-success-soft text-success">
                    {trial.phase}
                  </span>
                  {/* Location badge */}
                  <span className="px-2 py-0.5 rounded-full text-xs font-normal bg-surface text-secondary">
                    {trial.location}
                  </span>
                  {/* New trial badge */}
                  {trial.isNew && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-normal bg-surface text-secondary">
                      New trial
                    </span>
                  )}
                </div>
              </div>
              {/* Contenido */}
              <div className="flex-1 flex flex-col p-5">
                <h2 className="text-base font-normal mb-1 truncate text-heading">
                  {trial.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {trial.description}
                </p>
                {/* Barra de progreso y etapas */}
                <div className="w-full flex flex-col gap-1 mb-4">
                  <div className="relative w-full h-1 bg-gray-200 rounded-full">
                    <div
                      className="h-1 rounded-full absolute top-0 left-0 bg-primary-dark"
                      style={{ width: `${trial.progress}%` }}
                    />
                    {/* Circulo de close-out */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-dark" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>
                      {getStage(trial) === "Start"
                        ? "Start"
                        : getStage(trial) === "Routine visits"
                        ? "Routine visits"
                        : ""}
                    </span>
                    <span>Close-out</span>
                  </div>
                </div>
                {/* Upcoming */}
                <div className="flex items-center gap-2 bg-[#6C757D] bg-opacity-10 text-[#6C757D] text-xs rounded-md px-3 py-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#6C757D]" />
                  <span className="font-medium">Next:</span> {trial.upcoming}
                </div>
                {/* Pending task */}
                <div className="flex items-center gap-2 bg-[#6C757D] bg-opacity-10 text-[#6C757D] text-xs rounded-md px-3 py-2">
                  <AlertCircle className="h-4 w-4 text-[#6C757D]" />
                  {trial.pendingTask}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Panel lateral de detalles del trial */}
      {selectedTrial && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setSelectedTrial(null)}
        >
          <div
            className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedTrial.name}
              </h2>
              <button
                onClick={() => setSelectedTrial(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b bg-gray-50">
              <button className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-white">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Basic Information
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <BarChart3 className="h-4 w-4" />
                Enrollment Progress
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <Zap className="h-4 w-4" />
                Quick Access
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <Clock className="h-4 w-4" />
                Comments
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Study name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study name
                </label>
                <div className="text-sm text-gray-900">
                  {selectedTrial.name}
                </div>
              </div>

              {/* Study description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study description
                </label>
                <div className="text-sm text-gray-900">
                  {selectedTrial.description}
                </div>
              </div>

              {/* Sponsor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sponsor
                </label>
                <div className="text-sm text-gray-900">
                  {selectedTrial.sponsor || "LumenPath Biosciences"}
                </div>
              </div>

              {/* PI and study coordinator contacts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PI and study coordinator contacts
                </label>
                <div className="text-sm text-gray-900">
                  {selectedTrial.piContact || "Prof. Cesare Hassan"}
                </div>
              </div>

              {/* Locations & phases */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locations & phases
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {selectedTrial.location}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {selectedTrial.phase}
                  </span>
                </div>
              </div>

              {/* Study start */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study start
                </label>
                <div className="text-sm text-gray-900">
                  {selectedTrial.studyStart || "01 September 2025"}
                </div>
              </div>

              {/* Estimated close-out date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated close-out date
                </label>
                <div className="text-sm text-gray-900">
                  {selectedTrial.estimatedCloseOut || "13 December 2025"}
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress
                </label>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${selectedTrial.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Start</span>
                  <span>Close-out</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedTrial.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : selectedTrial.status === "Recruiting"
                      ? "bg-blue-100 text-blue-800"
                      : selectedTrial.status === "Planning"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedTrial.status}
                </span>
              </div>

              {/* Upcoming task */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next upcoming task
                </label>
                <div className="text-sm text-gray-900">
                  {selectedTrial.upcoming}
                </div>
              </div>

              {/* Pending task */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pending task
                </label>
                <div className="text-sm text-gray-900">
                  {selectedTrial.pendingTask}
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Additional Details
                </h3>

                {/* Protocol Version */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Protocol Version
                  </label>
                  <div className="text-sm text-gray-900">Version 2.1</div>
                </div>

                {/* IRB Approval */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IRB Approval Status
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Approved
                  </span>
                </div>

                {/* Target Enrollment */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Enrollment
                  </label>
                  <div className="text-sm text-gray-900">150 participants</div>
                </div>

                {/* Current Enrollment */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Enrollment
                  </label>
                  <div className="text-sm text-gray-900">
                    {Math.floor((selectedTrial.progress / 100) * 150)}{" "}
                    participants ({selectedTrial.progress}%)
                  </div>
                </div>

                {/* Study Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Type
                  </label>
                  <div className="text-sm text-gray-900">Interventional</div>
                </div>

                {/* Primary Endpoint */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Endpoint
                  </label>
                  <div className="text-sm text-gray-900">
                    Change in symptom severity score from baseline to week 12
                  </div>
                </div>

                {/* Last Updated */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Updated
                  </label>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TrialsPage;
