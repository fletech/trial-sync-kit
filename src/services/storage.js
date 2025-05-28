// services/storage.js - UN SOLO SERVICE SIMPLE
const storage = {
  // Trials
  getTrials: () => JSON.parse(localStorage.getItem("trials") || "[]"),
  saveTrial: (trial) => {
    const trials = storage.getTrials();
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTrial = { ...trial, id: uniqueId };
    trials.push(newTrial);
    localStorage.setItem("trials", JSON.stringify(trials));
    return newTrial;
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
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newMember = { ...member, id: uniqueId };
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
    // Generate a more unique ID to avoid collisions
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = {
      ...notification,
      id: uniqueId,
      createdAt: new Date().toISOString(),
      read: false,
    };
    notifications.unshift(newNotification); // Add to beginning for newest first
    localStorage.setItem("notifications", JSON.stringify(notifications));
    return newNotification;
  },
  markNotificationAsRead: (id) => {
    try {
      const notifications = storage.getNotifications();
      const notificationIndex = notifications.findIndex((n) => n.id === id);
      if (notificationIndex !== -1) {
        notifications[notificationIndex].read = true;
        localStorage.setItem("notifications", JSON.stringify(notifications));

        return notifications[notificationIndex];
      } else {
        console.warn("Notification not found with ID:", id);
        return null;
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return null;
    }
  },
  markAllNotificationsAsRead: () => {
    try {
      const notifications = storage.getNotifications();
      notifications.forEach((notification) => (notification.read = true));
      localStorage.setItem("notifications", JSON.stringify(notifications));
      return notifications;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return [];
    }
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
    // Only assign ID if task doesn't have one, and make it more unique
    const taskId =
      task.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTask = { ...task, id: taskId };
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

  // Task Comments
  getTaskComments: (taskId) => {
    const comments = JSON.parse(localStorage.getItem("taskComments") || "[]");
    const filtered = comments.filter((comment) => comment.taskId === taskId);

    return filtered;
  },

  // Debug function to check comment integrity
  debugTaskComments: () => {
    const allComments = JSON.parse(
      localStorage.getItem("taskComments") || "[]"
    );
    const commentsByTask = {};

    allComments.forEach((comment) => {
      if (!commentsByTask[comment.taskId]) {
        commentsByTask[comment.taskId] = [];
      }
      commentsByTask[comment.taskId].push(comment);
    });

    console.log("[Storage Debug] Comments by task:", commentsByTask);
    return commentsByTask;
  },
  saveTaskComment: (comment) => {
    const comments = JSON.parse(localStorage.getItem("taskComments") || "[]");
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newComment = {
      ...comment,
      id: uniqueId,
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    localStorage.setItem("taskComments", JSON.stringify(comments));

    // Emit custom event for same-tab updates
    window.dispatchEvent(new CustomEvent("taskCommentsUpdated"));

    return newComment;
  },
  updateTaskComment: (id, updatedComment) => {
    const comments = JSON.parse(localStorage.getItem("taskComments") || "[]");
    const index = comments.findIndex((comment) => comment.id === id);
    if (index !== -1) {
      comments[index] = {
        ...comments[index],
        ...updatedComment,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("taskComments", JSON.stringify(comments));
      return comments[index];
    }
    return null;
  },
  deleteTaskComment: (id) => {
    const comments = JSON.parse(localStorage.getItem("taskComments") || "[]");
    const filteredComments = comments.filter((comment) => comment.id !== id);
    localStorage.setItem("taskComments", JSON.stringify(filteredComments));
    return true;
  },

  // Documents
  getTrialDocuments: (trialId) => {
    const documents = JSON.parse(
      localStorage.getItem("trialDocuments") || "[]"
    );
    return documents.filter((doc) => doc.trialId === trialId);
  },
  saveTrialDocument: (trialId, document) => {
    const documents = JSON.parse(
      localStorage.getItem("trialDocuments") || "[]"
    );
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newDocument = {
      ...document,
      id: uniqueId,
      trialId,
      uploadedAt: new Date().toISOString(),
    };
    documents.push(newDocument);
    localStorage.setItem("trialDocuments", JSON.stringify(documents));
    return newDocument;
  },
  deleteTrialDocument: (id) => {
    const documents = JSON.parse(
      localStorage.getItem("trialDocuments") || "[]"
    );
    const filteredDocuments = documents.filter((doc) => doc.id !== id);
    localStorage.setItem("trialDocuments", JSON.stringify(filteredDocuments));
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

      // Sample documents for demonstration
      const sampleDocuments = [
        {
          id: `${Date.now()}-1`,
          trialId: "demo-trial", // This will be updated when trials are created
          name: "OPERA Study protocol.pdf",
          size: 2456789,
          type: "application/pdf",
          uploadedAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 days ago
        },
        {
          id: `${Date.now()}-2`,
          trialId: "demo-trial",
          name: "Protocol Amendment v2.1.pdf",
          size: 1234567,
          type: "application/pdf",
          uploadedAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(), // 3 days ago
        },
        {
          id: `${Date.now()}-3`,
          trialId: "demo-trial",
          name: "Informed Consent Form.pdf",
          size: 987654,
          type: "application/pdf",
          uploadedAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1 day ago
        },
      ];

      localStorage.setItem("trials", JSON.stringify([]));
      localStorage.setItem("team", JSON.stringify([]));
      localStorage.setItem("notifications", JSON.stringify([]));
      localStorage.setItem("integrations", JSON.stringify(defaultIntegrations));
      localStorage.setItem("tasks", JSON.stringify([]));
      localStorage.setItem("taskComments", JSON.stringify([]));
      localStorage.setItem("trialDocuments", JSON.stringify(sampleDocuments));

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
    localStorage.removeItem("taskComments");
    localStorage.removeItem("trialDocuments");
    localStorage.removeItem("themison_initialized");
  },

  // Clear only task-related data
  clearTaskData: () => {
    localStorage.removeItem("tasks");
    localStorage.removeItem("taskComments");
  },

  // Check if user is initialized
  isUserInitialized: () => {
    return localStorage.getItem("themison_initialized") !== null;
  },
};

export default storage;
