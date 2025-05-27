import { useState, useEffect } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Plus, ExternalLink, Info } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

interface Integration {
  id: string;
  name: string;
  type: string;
  category: "active" | "inactive";
  status: "connected" | "disconnected";
  description: string;
  logo: string;
  documentationUrl: string;
}

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Types");
  const [inactiveFilter, setInactiveFilter] = useState("All Types");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    type: "",
    description: "",
    documentationUrl: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load integrations
    loadIntegrations();
  }, []);

  const loadIntegrations = () => {
    const data = storage.getIntegrations();
    setIntegrations(data);
  };

  const handleToggleIntegration = (id: string, currentStatus: string) => {
    const integration = integrations.find((i) => i.id === id);
    const newStatus =
      currentStatus === "connected" ? "disconnected" : "connected";
    const newCategory = newStatus === "connected" ? "active" : "inactive";

    storage.updateIntegration(id, {
      status: newStatus,
      category: newCategory,
    });

    // Create notification for integration status change
    if (integration) {
      storage.saveNotification({
        type: "integration_update",
        title: `Integration ${
          newStatus === "connected" ? "Connected" : "Disconnected"
        }`,
        message: `${integration.name} integration has been ${newStatus}`,
      });

      // Emit event to update notification count
      notificationEvents.emit();
    }

    loadIntegrations();

    toast({
      title:
        newStatus === "connected"
          ? "Integration Connected"
          : "Integration Disconnected",
      description: `Integration has been ${newStatus}.`,
    });
  };

  const handleAddIntegration = () => {
    if (!newIntegration.name || !newIntegration.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const integration = {
      ...newIntegration,
      category: "inactive" as const,
      status: "disconnected" as const,
      logo: "/placeholder.svg",
    };

    storage.saveIntegration(integration);
    loadIntegrations();
    setIsAddModalOpen(false);
    setNewIntegration({
      name: "",
      type: "",
      description: "",
      documentationUrl: "",
    });

    toast({
      title: "Integration Added",
      description: "New integration has been added successfully.",
    });
  };

  const filteredActiveIntegrations = integrations
    .filter((integration) => integration.category === "active")
    .filter(
      (integration) =>
        integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (integration) =>
        activeFilter === "All Types" || integration.type === activeFilter
    );

  const filteredInactiveIntegrations = integrations
    .filter((integration) => integration.category === "inactive")
    .filter(
      (integration) =>
        integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (integration) =>
        inactiveFilter === "All Types" || integration.type === inactiveFilter
    );

  const activeTypes = [
    ...new Set(
      integrations.filter((i) => i.category === "active").map((i) => i.type)
    ),
  ];
  const inactiveTypes = [
    ...new Set(
      integrations.filter((i) => i.category === "inactive").map((i) => i.type)
    ),
  ];

  const IntegrationCard = ({ integration }: { integration: Integration }) => (
    <Card className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
              {integration.name === "SharePoint" && (
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">S</span>
                </div>
              )}
              {integration.name === "Google Drive" && (
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-green-500 via-yellow-500 to-red-500 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              )}
              {integration.name === "Florence eTMF" && (
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                  </svg>
                </div>
              )}
              {integration.name === "Montrium" && (
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              )}
              {integration.name === "CRIO CTMS" && (
                <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
              )}
              {integration.name === "Red Cap" && (
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center p-2">
                  <img
                    src="/redcap-logo.svg"
                    alt="Red Cap"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {integration.name}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                Connection {integration.status === "connected" ? "On" : "Off"}
              </p>
              {integration.category === "active" && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 text-xs"
                >
                  {integration.type}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {integration.status === "connected" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open(integration.documentationUrl, "_blank")
                }
                className="text-gray-400 hover:text-gray-600 p-2"
                title="View Documentation"
              >
                <Info className="h-4 w-4" />
              </Button>
            )}
            <Switch
              checked={integration.status === "connected"}
              onCheckedChange={() =>
                handleToggleIntegration(integration.id, integration.status)
              }
              className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FilterButton = ({
    label,
    isActive,
    onClick,
  }: {
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={
        isActive
          ? "bg-gray-800 text-white border-gray-800 hover:bg-gray-700"
          : "border-gray-300 text-gray-600 hover:bg-gray-50"
      }
    >
      {label}
    </Button>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Integrations
            </h1>
            <p className="text-gray-500">{integrations.length} integrations</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your integration here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 w-80 h-10 border-gray-300 rounded-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800 h-10 px-6 rounded-lg font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Integration</DialogTitle>
                  <DialogDescription>
                    Create a new integration to connect with external services.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={newIntegration.name}
                      onChange={(e) =>
                        setNewIntegration({
                          ...newIntegration,
                          name: e.target.value,
                        })
                      }
                      placeholder="Integration name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type *</Label>
                    <Input
                      id="type"
                      value={newIntegration.type}
                      onChange={(e) =>
                        setNewIntegration({
                          ...newIntegration,
                          type: e.target.value,
                        })
                      }
                      placeholder="e.g., eTMF, CTMS, Collaboration Tool"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newIntegration.description}
                      onChange={(e) =>
                        setNewIntegration({
                          ...newIntegration,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of the integration"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="documentationUrl">Documentation URL</Label>
                    <Input
                      id="documentationUrl"
                      value={newIntegration.documentationUrl}
                      onChange={(e) =>
                        setNewIntegration({
                          ...newIntegration,
                          documentationUrl: e.target.value,
                        })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddIntegration}>
                    Add Integration
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Active Integrations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Active Integrations
            </h2>
            <div className="flex space-x-2">
              <FilterButton
                label="All Types"
                isActive={activeFilter === "All Types"}
                onClick={() => setActiveFilter("All Types")}
              />
              {activeTypes.map((type) => (
                <FilterButton
                  key={type}
                  label={type}
                  isActive={activeFilter === type}
                  onClick={() => setActiveFilter(type)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredActiveIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>

        {/* Inactive Integrations */}
        <div className="space-y-6 mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Inactive Integrations
            </h2>
            <div className="flex space-x-2">
              <FilterButton
                label="All Types"
                isActive={inactiveFilter === "All Types"}
                onClick={() => setInactiveFilter("All Types")}
              />
              {inactiveTypes.map((type) => (
                <FilterButton
                  key={type}
                  label={type}
                  isActive={inactiveFilter === type}
                  onClick={() => setInactiveFilter(type)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInactiveIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationsPage;
