import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  MessageSquare,
  BookOpen,
  Users,
  Trash2,
  Send,
  X,
  ChevronDown,
  Calendar,
  Download,
  Eye,
  Plus,
  Upload,
  Loader2,
  Highlighter,
  AtSign,
  Copy,
  Share,
  MessageCircle,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  History,
} from "lucide-react";
import documentAI from "@/services/documentAI";
import storage from "@/services/storage";

interface DocumentAssistantInterfaceProps {
  documents: any[];
  trialName: string;
  onRemoveDocument: (documentId: string) => void;
  onUploadDocument?: () => void;
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  source?: string;
  highlights?: string[];
  documentId?: string;
  documentName?: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface DocumentComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  position: number;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

const tabs = [
  { id: "document-search", label: "Document Search", icon: Search },
  { id: "document-hub", label: "Document Hub", icon: FileText },
  { id: "qa-repository", label: "QA Repository", icon: BookOpen },
  { id: "trial-communication", label: "Trial Communication", icon: Users },
];

export const DocumentAssistantInterface: React.FC<
  DocumentAssistantInterfaceProps
> = ({ documents, trialName, onRemoveDocument, onUploadDocument }) => {
  const [activeTab, setActiveTab] = useState("document-search");
  const [chatInput, setChatInput] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(
    documents[0] || null
  );
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [documentComments, setDocumentComments] = useState<DocumentComment[]>(
    []
  );
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showSourcePanel, setShowSourcePanel] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sample chat sessions for left panel
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "When should the next lab test be conducted for OPERA Study?",
      timestamp: "1h ago",
      preview: "8 days following the last dose administration",
    },
    {
      id: "2",
      title: "What were the inclusion and exclusion criteria?",
      timestamp: "2h ago",
      preview: "Adults aged 18-75 years, confirmed diagnosis...",
    },
    {
      id: "3",
      title: "How was the watch-and-wait approach implemented?",
      timestamp: "3h ago",
      preview: "The watch-and-wait strategy was used for...",
    },
  ]);

  // Sample document content for right panel
  const documentContent = {
    title: "Chapter 6: Laboratory Testing and Monitoring",
    subtitle: "6.1 Laboratory Testing Schedule",
    sections: [
      {
        id: "6.4",
        content:
          "Blood and urine samples will be collected at each scheduled visit to monitor safety parameters, including liver and renal function.",
      },
      {
        id: "6.5",
        content:
          "Lab tests must be conducted within 8 days following the last dose administration.",
        highlighted: true,
      },
      {
        id: "6.6",
        content:
          "In cases where the subject discontinues treatment early, laboratory assessments must still be completed within the designated timeframe to ensure proper safety evaluation.",
      },
      {
        id: "6.7",
        content:
          "Laboratory assessments will include, at minimum, hematology, clinical chemistry, and urinalysis panels. Specific parameters include but are not limited to: hemoglobin, white blood cell count with differential, platelet count, ALT, AST, creatinine, total bilirubin, and glucose levels.",
      },
      {
        id: "6.8",
        content:
          "All samples must be processed and shipped according to procedures outlined in the Laboratory Manual. Deviations from the manual (e.g., delayed shipment or improper storage conditions) must be documented in the site file and reported to the sponsor within 24 hours.",
      },
      {
        id: "6.9",
        content:
          "Investigators are responsible for reviewing laboratory results within 48 hours of receipt. Any clinically significant abnormal findings must be assessed for seriousness and causality and followed up until resolution or stabilization.",
      },
      {
        id: "7.0",
        content:
          "Repeat or unscheduled laboratory testing may be performed at the discretion of the Investigator or upon request by the medical monitor if safety concerns arise.",
      },
    ],
  };

  // Sample comments
  useEffect(() => {
    setDocumentComments([
      {
        id: "1",
        author: "Desirae Mango",
        avatar:
          "https://ui-avatars.com/api/?name=Desirae+Mango&background=5B6CFF&color=fff",
        content:
          "@Carla George If a subject drops out mid-week, when should the clock start for the 8-day window?",
        timestamp: "1h ago",
        position: 0,
      },
      {
        id: "2",
        author: "Carla George",
        avatar:
          "https://ui-avatars.com/api/?name=Carla+George&background=10b981&color=fff",
        content: "From the date of their last dose — that day counts as day 1.",
        timestamp: "45m ago",
        position: 0,
      },
    ]);
  }, []);

  // Load team members
  useEffect(() => {
    const members = storage.getTeamMembers();
    setTeamMembers(members);
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);

    try {
      const response = await documentAI.generateResponse(
        chatInput,
        documents[0]
      );

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.answer,
        timestamp: new Date().toISOString(),
        source: response.source,
        highlights: response.highlights,
      };

      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I apologize, but I encountered an error while processing your question. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart || 0;

    setChatInput(value);
    setCursorPosition(position);

    // Check for @ mention
    const beforeCursor = value.substring(0, position);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentionDropdown(true);
    } else {
      setShowMentionDropdown(false);
      setMentionQuery("");
    }
  };

  const handleMentionSelect = (member: TeamMember) => {
    const beforeMention = chatInput.substring(
      0,
      cursorPosition - mentionQuery.length - 1
    );
    const afterCursor = chatInput.substring(cursorPosition);
    const newValue = `${beforeMention}@${member.name} ${afterCursor}`;

    setChatInput(newValue);
    setShowMentionDropdown(false);
    setMentionQuery("");
  };

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const highlightText = (text: string, highlights: string[] = []) => {
    if (!highlights.length) return text;

    let highlightedText = text;
    highlights.forEach((highlight) => {
      const regex = new RegExp(
        `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
      );
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
      );
    });

    return highlightedText;
  };

  const exampleQuestions = [
    {
      category: "Patient Fit",
      questions: [
        "What are the eligibility criteria for this study?",
        "Can a patient with [specific condition] be enrolled?",
      ],
    },
    {
      category: "Study Steps",
      questions: [
        "When should the next lab test be conducted for OPERA Study?",
        "How many biopsies are needed for this procedure?",
      ],
    },
    {
      category: "Find Info",
      questions: [
        "What are the latest amendments to the protocol?",
        "What are the safety monitoring requirements?",
      ],
    },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewSource = (source: string) => {
    setSelectedSource(source);
    setShowSourcePanel(true);
  };

  const handleCloseSource = () => {
    setShowSourcePanel(false);
    setSelectedSource(null);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const renderDocumentSearch = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* Chat History Overlay */}
      {showChatHistory && (
        <div className="absolute top-0 left-0 w-80 h-full bg-white border-r border-gray-200 flex flex-col z-20 shadow-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Chat History
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChatHistory(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {session.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {session.preview}
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {session.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Center Panel - Chat Conversation */}
      <div
        className="flex-1 flex flex-col bg-white relative"
        style={{ height: "calc(100vh - 200px)" }}
      >
        {/* Top Bar with History Icon */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="text-gray-500 hover:text-gray-700"
            >
              <History className="w-4 h-4 mr-2" />
              Chat History
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setChatHistory([]);
                setChatInput("");
              }}
              className="text-gray-500 hover:text-gray-700"
              title="Start a new conversation"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {!showSourcePanel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSourcePanel(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Show Source
            </Button>
          )}
        </div>

        {/* Selected Document Indicator */}
        {selectedDocument && (
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-900">
                  Consulting: {selectedDocument.name}
                </span>
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-blue-600">
                AI responses will be based on this document
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDocument(null)}
              className="text-blue-500 hover:text-blue-700"
              title="Clear document selection"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Chat Messages or Example Questions - SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <div className="p-6">
              <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Example Questions
                  </h2>
                  <p className="text-gray-600">
                    Not sure what to ask? Check these
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exampleQuestions.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="font-medium text-gray-900 text-center">
                        {category.category}
                      </h3>
                      <div className="space-y-2">
                        {category.questions.map((question, qIndex) => (
                          <button
                            key={qIndex}
                            onClick={() => setChatInput(question)}
                            className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-sm text-gray-700 hover:text-gray-900"
                          >
                            <Search className="w-4 h-4 inline mr-2 text-gray-400" />
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div ref={chatContainerRef} className="p-6 space-y-6">
              {chatHistory.map((message) => (
                <div key={message.id} className="space-y-4">
                  {message.type === "user" ? (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-gray-900">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="space-y-3">
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-900 whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>

                          {message.source && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedSource(message.source!);
                                  setShowSourcePanel(true);
                                }}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                View Source
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Regenerate response
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area - ALWAYS VISIBLE AT BOTTOM */}
        <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
          {/* Mention Dropdown */}
          {showMentionDropdown && filteredMembers.length > 0 && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto">
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleMentionSelect(member)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 relative">
              <Input
                value={chatInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className="pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 h-8 w-8"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Document Source */}
      {showSourcePanel && (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Source</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSourcePanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {documentContent.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {documentContent.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                {documentContent.sections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {section.id}
                      </span>
                      <span className="text-xs text-gray-500">
                        OPERA Study protocol
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        section.highlighted
                          ? "bg-black text-white p-3 rounded-lg"
                          : "text-gray-700"
                      }`}
                    >
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Next Actions</div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDocumentHub = () => (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Document Hub</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage all documents for {trialName}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {documents.length} document{documents.length !== 1 ? "s" : ""}{" "}
            uploaded
          </div>
          {onUploadDocument && (
            <Button
              onClick={onUploadDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {documents.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No documents uploaded
            </h3>
            <p className="text-gray-500 mb-4">
              Upload your first document to get started with AI assistance.
            </p>
            {onUploadDocument && (
              <Button
                onClick={onUploadDocument}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {documents.map((doc, index) => (
              <div
                key={doc.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {doc.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Uploaded {formatDate(doc.uploadedAt)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(doc.size || 0)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {doc.type || "PDF"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDocument(doc);
                        setActiveTab("document-search");
                      }}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Ask AI about this document"
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                      title="View document"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveDocument(doc.id)}
                      className="text-gray-500 hover:text-red-600"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Document Assistant
        </h1>

        {/* Tabs */}
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === "document-search" && renderDocumentSearch()}
        {activeTab === "document-hub" && renderDocumentHub()}
        {activeTab === "qa-repository" && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                QA Repository
              </h3>
              <p className="text-gray-500">
                Coming soon - Knowledge base and FAQ management
              </p>
            </div>
          </div>
        )}
        {activeTab === "trial-communication" && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Trial Communication
              </h3>
              <p className="text-gray-500">
                Coming soon - Team communication and updates
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
