// services/documentAI.js - Mocked AI responses based on document content

// OPERA Study Protocol Content (extracted from the images)
const OPERA_STUDY_CONTENT = {
  title: "OPERA Study Protocol",
  sections: {
    6.1: {
      title: "Laboratory Testing Schedule",
      content:
        "Blood and urine samples will be collected at each scheduled visit to monitor safety parameters, including liver and renal function.",
    },
    6.4: {
      title: "Safety Monitoring",
      content:
        "Blood and urine samples will be collected at each scheduled visit to monitor safety parameters, including liver and renal function.",
    },
    6.5: {
      title: "Laboratory Testing Requirements",
      content:
        "Lab tests must be conducted within 8 days following the last dose administration.",
    },
    6.6: {
      title: "Early Discontinuation Protocol",
      content:
        "In cases where the subject discontinues treatment early, laboratory assessments must still be completed within the designated timeframe to ensure proper safety evaluation.",
    },
    6.7: {
      title: "Laboratory Parameters",
      content:
        "Laboratory assessments will include, at minimum, hematology, clinical chemistry, and urinalysis panels. Specific parameters include but are not limited to: hemoglobin, white blood cell count with differential, platelet count, ALT, AST, creatinine, total bilirubin, and glucose levels.",
    },
    6.8: {
      title: "Sample Processing and Shipping",
      content:
        "All samples must be processed and shipped according to procedures outlined in the Laboratory Manual. Deviations from the manual (e.g., delayed shipment or improper storage conditions) must be documented in the site file and reported to the sponsor within 24 hours.",
    },
    6.9: {
      title: "Laboratory Results Review",
      content:
        "Investigators are responsible for reviewing laboratory results within 48 hours of receipt. Any clinically significant abnormal findings must be assessed for seriousness and causality and followed up until resolution or stabilization.",
    },
    "7.0": {
      title: "Repeat Laboratory Testing",
      content:
        "Repeat or unscheduled laboratory testing may be performed at the discretion of the Investigator or upon request by the medical monitor if safety concerns arise.",
    },
  },
  eligibilityCriteria: {
    inclusion: [
      "Adults aged 18-75 years",
      "Confirmed diagnosis of the target condition",
      "Adequate organ function as defined by laboratory values",
      "Written informed consent",
    ],
    exclusion: [
      "Pregnancy or nursing",
      "Severe hepatic impairment",
      "Active malignancy within 5 years",
      "Concurrent participation in another clinical trial",
    ],
  },
  studyDesign: {
    phase: "Phase II",
    design: "Randomized, double-blind, placebo-controlled",
    duration: "12 weeks treatment period with 4-week follow-up",
    primaryEndpoint:
      "Change in symptom severity score from baseline to week 12",
  },
};

// Knowledge base for different document types
const DOCUMENT_KNOWLEDGE_BASE = {
  "OPERA Study protocol": OPERA_STUDY_CONTENT,
  "Protocol Amendment v2.1.pdf": {
    title: "Protocol Amendment v2.1",
    sections: {
      amendment_summary: {
        title: "Amendment Summary",
        content:
          "This amendment introduces clarifications to the laboratory testing schedule and updates safety monitoring procedures.",
      },
      changes: {
        title: "Key Changes",
        content:
          "Modified laboratory testing window from 5 days to 8 days following last dose administration to improve operational feasibility.",
      },
    },
  },
  "Informed Consent Form.pdf": {
    title: "Informed Consent Form",
    sections: {
      purpose: {
        title: "Study Purpose",
        content:
          "This study aims to evaluate the safety and efficacy of the investigational treatment in patients with the target condition.",
      },
      risks: {
        title: "Risks and Benefits",
        content:
          "Potential risks include mild to moderate side effects. Benefits may include improvement in symptoms.",
      },
    },
  },
};

// AI Response patterns based on question types
const AI_RESPONSE_PATTERNS = {
  eligibility: {
    keywords: [
      "eligibility",
      "criteria",
      "inclusion",
      "exclusion",
      "enroll",
      "qualify",
    ],
    responses: [
      {
        question: "What are the eligibility criteria for this study?",
        answer:
          "Based on the OPERA Study protocol, the main eligibility criteria include:\n\n**Inclusion Criteria:**\n• Adults aged 18-75 years\n• Confirmed diagnosis of the target condition\n• Adequate organ function as defined by laboratory values\n• Written informed consent\n\n**Exclusion Criteria:**\n• Pregnancy or nursing\n• Severe hepatic impairment\n• Active malignancy within 5 years\n• Concurrent participation in another clinical trial",
        source: "Section 4.1-4.2: Eligibility Criteria",
        highlights: [
          "Adults aged 18-75 years",
          "Adequate organ function",
          "Severe hepatic impairment",
        ],
      },
    ],
  },
  laboratory: {
    keywords: [
      "lab",
      "laboratory",
      "blood",
      "urine",
      "test",
      "sample",
      "monitoring",
    ],
    responses: [
      {
        question: "When should the next lab test be conducted for OPERA Study?",
        answer:
          "According to the OPERA Study protocol, laboratory tests must be conducted within **8 days following the last dose administration**.\n\nKey requirements:\n• Blood and urine samples at each scheduled visit\n• Monitor safety parameters including liver and renal function\n• Laboratory assessments include hematology, clinical chemistry, and urinalysis panels\n• Results must be reviewed within 48 hours of receipt",
        source: "Chapter 6: Laboratory Testing and Monitoring, Section 6.5",
        highlights: [
          "8 days following the last dose administration",
          "within 48 hours of receipt",
        ],
      },
    ],
  },
  safety: {
    keywords: ["safety", "adverse", "side effect", "monitoring", "risk"],
    responses: [
      {
        question: "What are the safety monitoring requirements?",
        answer:
          "The OPERA Study has comprehensive safety monitoring requirements:\n\n**Laboratory Monitoring:**\n• Blood and urine samples at each scheduled visit\n• Monitor liver and renal function parameters\n• Include hemoglobin, WBC, platelets, ALT, AST, creatinine, bilirubin\n\n**Review Timeline:**\n• Investigators must review results within 48 hours\n• Clinically significant abnormal findings require immediate assessment\n• Follow-up until resolution or stabilization required",
        source: "Chapter 6: Laboratory Testing and Monitoring",
        highlights: [
          "within 48 hours",
          "immediate assessment",
          "resolution or stabilization",
        ],
      },
    ],
  },
  procedures: {
    keywords: ["procedure", "steps", "process", "how to", "protocol"],
    responses: [
      {
        question: "What are the next steps?",
        answer:
          "Based on the current study phase, the next steps typically include:\n\n1. **Laboratory Sample Collection**\n   • Collect blood and urine samples per schedule\n   • Process according to Laboratory Manual procedures\n\n2. **Sample Processing**\n   • Ship samples within designated timeframe\n   • Document any deviations immediately\n\n3. **Results Review**\n   • Review laboratory results within 48 hours\n   • Assess any abnormal findings for clinical significance",
        source: "Chapter 6: Laboratory Testing and Monitoring",
        highlights: [
          "within 48 hours",
          "Laboratory Manual procedures",
          "Document any deviations",
        ],
      },
    ],
  },
};

// Function to find the best matching response
const findBestResponse = (question, documentName) => {
  const lowerQuestion = question.toLowerCase();

  // Check each response pattern
  for (const [category, pattern] of Object.entries(AI_RESPONSE_PATTERNS)) {
    const hasKeyword = pattern.keywords.some((keyword) =>
      lowerQuestion.includes(keyword.toLowerCase())
    );

    if (hasKeyword && pattern.responses.length > 0) {
      // Return the first matching response (in a real system, this would be more sophisticated)
      return pattern.responses[0];
    }
  }

  // Default response if no pattern matches
  return {
    question: question,
    answer: `Based on the ${
      documentName || "selected document"
    }, I can help you find specific information. Could you please be more specific about what you're looking for? \n\nFor example, you could ask about:\n• Eligibility criteria\n• Laboratory testing requirements\n• Safety monitoring procedures\n• Study procedures and timelines`,
    source: "General Document Information",
    highlights: [],
  };
};

// Main AI service functions
export const documentAI = {
  // Generate AI response based on question and document
  generateResponse: async (question, document) => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const documentName = document?.name || "Unknown Document";
    const response = findBestResponse(question, documentName);

    return {
      id: `response-${Date.now()}`,
      question: question,
      answer: response.answer,
      source: response.source,
      highlights: response.highlights,
      timestamp: new Date().toISOString(),
      documentId: document?.id,
      documentName: documentName,
    };
  },

  // Get document content for highlighting
  getDocumentContent: (documentName) => {
    const docKey = Object.keys(DOCUMENT_KNOWLEDGE_BASE).find(
      (key) =>
        documentName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(documentName.toLowerCase())
    );

    return DOCUMENT_KNOWLEDGE_BASE[docKey] || null;
  },

  // Get suggested questions based on document
  getSuggestedQuestions: (document) => {
    const documentName = document?.name || "";

    if (documentName.toLowerCase().includes("opera")) {
      return [
        "When should the next lab test be conducted for OPERA Study?",
        "What are the eligibility criteria for this study?",
        "What are the safety monitoring requirements?",
        "What laboratory parameters need to be monitored?",
      ];
    }

    return [
      "What are the key requirements in this document?",
      "What are the main procedures described?",
      "What are the safety considerations?",
      "What are the timelines mentioned?",
    ];
  },

  // Search within document content
  searchDocument: async (query, document) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const content = documentAI.getDocumentContent(document?.name || "");
    if (!content) return [];

    const results = [];
    const lowerQuery = query.toLowerCase();

    // Search through sections
    Object.entries(content.sections || {}).forEach(([sectionId, section]) => {
      if (
        section.title.toLowerCase().includes(lowerQuery) ||
        section.content.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          sectionId,
          title: section.title,
          content: section.content,
          relevance: Math.random() * 0.5 + 0.5, // Mock relevance score
        });
      }
    });

    return results.sort((a, b) => b.relevance - a.relevance);
  },
};

export default documentAI;
