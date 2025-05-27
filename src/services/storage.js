// services/storage.js - UN SOLO SERVICE SIMPLE
const storage = {
  // Trials
  getTrials: () => JSON.parse(localStorage.getItem("trials") || "[]"),
  saveTrial: (trial) => {
    const trials = storage.getTrials();
    trials.push({ ...trial, id: Date.now().toString() });
    localStorage.setItem("trials", JSON.stringify(trials));
    return trial;
  },
  updateTrial: (id, updatedTrial) => {
    const trials = storage.getTrials();
    const index = trials.findIndex((trial) => trial.id === id);
    if (index !== -1) {
      trials[index] = { ...trials[index], ...updatedTrial };
      localStorage.setItem("trials", JSON.stringify(trials));
      return trials[index];
    }
    return null;
  },
  deleteTrial: (id) => {
    const trials = storage.getTrials();
    const filteredTrials = trials.filter((trial) => trial.id !== id);
    localStorage.setItem("trials", JSON.stringify(filteredTrials));
    return true;
  },

  // Team
  getTeamMembers: () => JSON.parse(localStorage.getItem("team") || "[]"),
  saveTeamMember: (member) => {
    const team = storage.getTeamMembers();
    const newMember = { ...member, id: Date.now().toString() };
    team.push(newMember);
    localStorage.setItem("team", JSON.stringify(team));
    return newMember;
  },
  updateTeamMember: (id, updatedMember) => {
    const team = storage.getTeamMembers();
    const index = team.findIndex((member) => member.id === id);
    if (index !== -1) {
      team[index] = { ...team[index], ...updatedMember };
      localStorage.setItem("team", JSON.stringify(team));
      return team[index];
    }
    return null;
  },
  deleteTeamMember: (id) => {
    const team = storage.getTeamMembers();
    const filteredTeam = team.filter((member) => member.id !== id);
    localStorage.setItem("team", JSON.stringify(filteredTeam));
    return true;
  },

  // Notifications
  getNotifications: () =>
    JSON.parse(localStorage.getItem("notifications") || "[]"),
  saveNotification: (notification) => {
    const notifications = storage.getNotifications();
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    notifications.unshift(newNotification); // Add to beginning for newest first
    localStorage.setItem("notifications", JSON.stringify(notifications));
    return newNotification;
  },
  markNotificationAsRead: (id) => {
    const notifications = storage.getNotifications();
    const notification = notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      localStorage.setItem("notifications", JSON.stringify(notifications));
      return notification;
    }
    return null;
  },
  markAllNotificationsAsRead: () => {
    const notifications = storage.getNotifications();
    notifications.forEach((notification) => (notification.read = true));
    localStorage.setItem("notifications", JSON.stringify(notifications));
    return notifications;
  },
  deleteNotification: (id) => {
    const notifications = storage.getNotifications();
    const filteredNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    localStorage.setItem(
      "notifications",
      JSON.stringify(filteredNotifications)
    );
    return true;
  },
  markNotificationAsUnread: (id) => {
    const notifications = storage.getNotifications();
    const notification = notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = false;
      localStorage.setItem("notifications", JSON.stringify(notifications));
      return notification;
    }
    return null;
  },
  getUnreadNotificationsCount: () => {
    const notifications = storage.getNotifications();
    return notifications.filter((notification) => !notification.read).length;
  },

  // Integrations
  getIntegrations: () =>
    JSON.parse(localStorage.getItem("integrations") || "[]"),
  saveIntegration: (integration) => {
    const integrations = storage.getIntegrations();
    const newIntegration = { ...integration, id: Date.now().toString() };
    integrations.push(newIntegration);
    localStorage.setItem("integrations", JSON.stringify(integrations));
    return newIntegration;
  },
  updateIntegration: (id, updatedIntegration) => {
    const integrations = storage.getIntegrations();
    const index = integrations.findIndex(
      (integration) => integration.id === id
    );
    if (index !== -1) {
      integrations[index] = { ...integrations[index], ...updatedIntegration };
      localStorage.setItem("integrations", JSON.stringify(integrations));
      return integrations[index];
    }
    return null;
  },
  deleteIntegration: (id) => {
    const integrations = storage.getIntegrations();
    const filteredIntegrations = integrations.filter(
      (integration) => integration.id !== id
    );
    localStorage.setItem("integrations", JSON.stringify(filteredIntegrations));
    return true;
  },

  // Tasks
  getTasks: () => JSON.parse(localStorage.getItem("tasks") || "[]"),
  saveTasks: (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return tasks;
  },
  updateTask: (id, updatedTask) => {
    const tasks = storage.getTasks();
    const index = tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
      localStorage.setItem("tasks", JSON.stringify(tasks));
      return tasks[index];
    }
    return null;
  },
  saveTask: (task) => {
    const tasks = storage.getTasks();
    const newTask = { ...task, id: Date.now().toString() };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return newTask;
  },
  deleteTask: (id) => {
    const tasks = storage.getTasks();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    return true;
  },

  // Initialize data for new users
  initializeNewUser: () => {
    // Check if this is a first-time user
    const isFirstTime = localStorage.getItem("themison_initialized") === null;

    // Also check if integrations are empty (for existing users who need integrations)
    const integrations = storage.getIntegrations();
    const needsIntegrations = integrations.length === 0;

    if (isFirstTime) {
      // Initialize empty arrays for new users - trials will be created during onboarding

      // Default integrations available for connection
      const defaultIntegrations = [
        {
          id: "1",
          name: "SharePoint",
          type: "Collaboration Tool",
          category: "inactive",
          status: "disconnected",
          description:
            "Microsoft SharePoint integration for document management and collaboration",
          logo: "/placeholder.svg",
          documentationUrl: "https://docs.microsoft.com/en-us/sharepoint/",
        },
        {
          id: "2",
          name: "Google Drive",
          type: "Collaboration Tool",
          category: "inactive",
          status: "disconnected",
          description: "Google Drive integration for file storage and sharing",
          logo: "/placeholder.svg",
          documentationUrl: "https://developers.google.com/drive",
        },
        {
          id: "3",
          name: "Florence eTMF",
          type: "eTMF",
          category: "inactive",
          status: "disconnected",
          description: "Florence eTMF system for trial master file management",
          logo: "/placeholder.svg",
          documentationUrl: "https://www.florence.global/",
        },
        {
          id: "4",
          name: "Montrium",
          type: "eTMF",
          category: "inactive",
          status: "disconnected",
          description: "Montrium Connect for clinical trial management",
          logo: "/placeholder.svg",
          documentationUrl: "https://www.montrium.com/",
        },
        {
          id: "5",
          name: "CRIO CTMS",
          type: "CTMS",
          category: "inactive",
          status: "disconnected",
          description: "CRIO Clinical Trial Management System",
          logo: "/placeholder.svg",
          documentationUrl: "https://www.crio.com/",
        },
        {
          id: "6",
          name: "Red Cap",
          type: "eTMF",
          category: "inactive",
          status: "disconnected",
          description:
            "Research Electronic Data Capture - Secure web application for building and managing online surveys and databases",
          logo: "/redcap-logo.svg",
          documentationUrl: "https://projectredcap.org/software/requirements/",
        },
      ];

      localStorage.setItem("trials", JSON.stringify([]));
      localStorage.setItem("team", JSON.stringify([]));
      localStorage.setItem("notifications", JSON.stringify([]));
      localStorage.setItem("integrations", JSON.stringify(defaultIntegrations));
      localStorage.setItem("tasks", JSON.stringify([]));

      // Mark as initialized
      localStorage.setItem("themison_initialized", "true");
    } else if (needsIntegrations) {
      // For existing users who don't have integrations yet
      const defaultIntegrations = [
        {
          id: "1",
          name: "SharePoint",
          type: "Collaboration Tool",
          category: "inactive",
          status: "disconnected",
          description:
            "Microsoft SharePoint integration for document management and collaboration",
          logo: "/placeholder.svg",
          documentationUrl: "https://docs.microsoft.com/en-us/sharepoint/",
        },
        {
          id: "2",
          name: "Google Drive",
          type: "Collaboration Tool",
          category: "inactive",
          status: "disconnected",
          description: "Google Drive integration for file storage and sharing",
          logo: "/placeholder.svg",
          documentationUrl: "https://developers.google.com/drive",
        },
        {
          id: "3",
          name: "Florence eTMF",
          type: "eTMF",
          category: "inactive",
          status: "disconnected",
          description: "Florence eTMF system for trial master file management",
          logo: "/placeholder.svg",
          documentationUrl: "https://www.florence.global/",
        },
        {
          id: "4",
          name: "Montrium",
          type: "eTMF",
          category: "inactive",
          status: "disconnected",
          description: "Montrium Connect for clinical trial management",
          logo: "/placeholder.svg",
          documentationUrl: "https://www.montrium.com/",
        },
        {
          id: "5",
          name: "CRIO CTMS",
          type: "CTMS",
          category: "inactive",
          status: "disconnected",
          description: "CRIO Clinical Trial Management System",
          logo: "/placeholder.svg",
          documentationUrl: "https://www.crio.com/",
        },
        {
          id: "6",
          name: "Red Cap",
          type: "eTMF",
          category: "inactive",
          status: "disconnected",
          description:
            "Research Electronic Data Capture - Secure web application for building and managing online surveys and databases",
          logo: "/redcap-logo.svg",
          documentationUrl: "https://projectredcap.org/software/requirements/",
        },
      ];

      localStorage.setItem("integrations", JSON.stringify(defaultIntegrations));
    }
  },

  // Clear all data (for testing/reset purposes)
  clearAllData: () => {
    localStorage.removeItem("trials");
    localStorage.removeItem("team");
    localStorage.removeItem("notifications");
    localStorage.removeItem("integrations");
    localStorage.removeItem("tasks");
    localStorage.removeItem("themison_initialized");
  },

  // Check if user is initialized
  isUserInitialized: () => {
    return localStorage.getItem("themison_initialized") !== null;
  },
};

export default storage;
