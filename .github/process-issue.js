const axios = require('axios');

// Configuration constants
const CLICKUP_LIST_ID = "901002929528";
const CLICKUP_API_BASE_URL = "https://api.clickup.com/api/v2";
const CUSTOM_FIELD_IDS = {
  API_ISSUE_TYPE: "49bc39d0-e792-4b70-a706-422c06ebc47f",
  MODULE: "710f1ecb-36ca-4beb-9c84-476a839275be",
  GITHUB_ISSUE_ID: "879f5d73-a102-49a5-bfb1-83d6ccbb0a41"
};

// Team Definitions
const TEAM = {
  CRM: 'crm',
  AUTOMATIONS: 'automations',
  LEADGEN: 'leadgen',
  REVEX: 'revex',
  PLATFORM: 'platform',
  MOBILE: 'mobile'
};

// Sub-team Definitions
const CRM_SUB_TEAM = {
  MARKETPLACE: 'marketplace',
  API_QUERIES: 'API Queries',
  MARKETPLACE_MODULES: 'marketplace-modules',
  INTEGRATIONS: 'integrations',
  CONTACTS: 'contacts',
  OPPORTUNITIES: 'opportunities',
  BULK_ACTIONS: 'bulk-actions',
  CONVERSATIONS_AI: 'conversations-ai',
  CONVERSATIONS: 'conversations'
};

const AUTOMATIONS_SUB_TEAM = {
  WORKFLOWS: 'workflows',
  CALENDARS: 'calendars',
  REPORTING: 'reporting',
  AFFILIATE_MANAGER: 'am',
  AD_PUBLISHING: 'ad-publishing',
  ELIZA: 'eliza'
};

const LEADGEN_SUB_TEAM = {
  BLOGS: 'blogs',
  FUNNELS: 'funnels',
  MEDIA_LIBRARY: 'cm-medias',
  FORMS: 'forms',
  SURVEYS: 'surveys',
  PAYMENT_PRODUCTS: 'payment-products',
  PAYMENTS: 'payments',
  PROPOSALS: 'proposals',
  ECOM_STORE: 'ecomm-store',
  EMAIL_BUILDER: 'emails',
  TEMPLATES: 'templates',
  WIDGETS: 'Widgets',
  BLOGGING: 'Blogging',
  SOCIAL_PLANNER: 'social-media',
  ONBOARDING: 'onboarding',
  LAUNCHPAD: 'LaunchPad',
  CONTENT_AI: 'blogs',
  LOCALIZATION: 'localization',
  FRONTEND_PLATFORM: 'platform-ui',
  TASK_SCHEDULER: 'cm-ts'
};

const REVEX_SUB_TEAM = {
  AGENCY: 'agency_dashboard',
  AFFILIATE_PORTAL: 'affiliate_portal',
  INTERNAL_TOOLS: 'internal-tools',
  ISV_LC_EMAIL: 'lc-email',
  GATEKEEPER: 'gatekeeper',
  ISV_LC_WHATSAPP: 'whatsapp',
  ISV_LC_PHONE: 'lc-phone',
  BLADE_PLATFORM: 'blade-platform',
  SUBACCOUNTS: 'subaccounts',
  SAAS: 'saas',
  AGENCY_DASHBOARD: 'agency_dashboard',
  YEXT: 'yext',
  RESELLING: 'reselling',
  PROSPECTING: 'prospecting',
  REPUTATION_MANAGEMENT: 'reputation',
  WORDPRESS: 'wordpress',
  MEMBERSHIP: 'membership',
  CERTIFICATES: 'certificates',
  COMMUNITIES: 'communities',
  CLIENT_PORTAL: 'client-portal',
  SNAPSHOTS: 'snapshots',
  STRIPE_CONSUMER: 'stripe-consumer',
  MOBILE_APP_CUSTOMISER: 'mobile-app-customiser',
  GOKOLLAB: 'gokollab'
};

const PLATFORM_SUB_TEAM = {
  DATA: 'data',
  INFRA: 'infra',
  SERVICES: 'services',
  AI: 'ai',
  SRE: 'sre'
};

const MOBILE_SUB_TEAM = {
  BACKEND: 'backend'
};

// Product Channel Mapping
const PRODUCT_CHANNELS = {
  // REVEX_SUB_TEAM
  "wordpress": { em: "Hemant", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.WORDPRESS },
  "saas": { em: "Daljeet Singh", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.SAAS },
  "lc-phone": { em: "Neha", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.ISV_LC_PHONE },
  "lc-whatsapp": { em: "Anurag Singh", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.ISV_LC_WHATSAPP },
  "lc-phone-sms": { em: "Neha", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.ISV_LC_PHONE },
  "lc-phone-voice": { em: "Neha", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.ISV_LC_PHONE },
  "membership": { em: "Sayeed", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.MEMBERSHIP },
  "client-portal": { em: "Abhishek", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.CLIENT_PORTAL },
  "prospecting": { em: "Nikita", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.PROSPECTING },
  "reputation": { em: "Upamanyu Sarangi", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.REPUTATION_MANAGEMENT },
  "yext": { em: "Pranoy Sarkar", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.YEXT },
  "communities": { em: "Dhruv", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.COMMUNITIES },
  "snapshots": { em: "Abhishek Maheshwari", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.SNAPSHOTS },
  "lc-email": { em: "Anwar", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.ISV_LC_EMAIL },
  "reselling": { em: "Pranoy Sarkar", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.RESELLING },
  "gokollab": { em: "Dhruv", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.GOKOLLAB },
  "certificates": { em: "Manish KR", team: TEAM.REVEX, sub_team: REVEX_SUB_TEAM.CERTIFICATES },

  // LEADGEN_SUB_TEAM
  "funnels": { em: "Ajay Dev", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.FUNNELS },
  "launchpad": { em: "Vinamra Sareen", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.LAUNCHPAD },
  "forms": { em: "Sai Allu", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.FORMS },
  "surveys": { em: "Sai Allu", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.SURVEYS },
  "blogs": { em: "Ajay Dev", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.CONTENT_AI },
  "emails": { em: "Harsh Kurra", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.EMAIL_BUILDER },
  "onboarding": { em: "Vinamra Sareen", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.ONBOARDING },
  "payments": { em: "Vatsal Mehta", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.PAYMENTS },
  "payment-products": { em: "Vatsal Mehta", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.PAYMENT_PRODUCTS },
  "proposals": { em: "Jees", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.PROPOSALS },
  "social-planner": { em: "Mayur", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.SOCIAL_PLANNER },
  "templates": { em: "Sunil", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.TEMPLATES },

  // CRM_SUB_TEAM
  "contacts": { em: "Yogesh", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.CONTACTS },
  "conversations": { em: "Ravi", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.CONVERSATIONS },
  "marketplace": { em: "Gaurav Kanted", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.MARKETPLACE },
  "conversations-ai": { em: "Debayan", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.CONVERSATIONS_AI },
  "bulk-actions": { em: "Yogesh", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.BULK_ACTIONS },
  "custom-objects": { em: "Yogesh", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.CONTACTS },
  "opportunities": { em: "Yogesh", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.OPPORTUNITIES },
  "integrations": { em: "Gaurav Kanted", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.INTEGRATIONS },
  "marketplace-modules": { em: "Gaurav Kanted", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.MARKETPLACE_MODULES },

  // AUTOMATIONS_SUB_TEAM
  "reporting": { em: "Hemant Goyal", team: TEAM.AUTOMATIONS, sub_team: AUTOMATIONS_SUB_TEAM.REPORTING },
  "calendars": { em: "Ankit Jain", team: TEAM.AUTOMATIONS, sub_team: AUTOMATIONS_SUB_TEAM.CALENDARS },
  "workflows": { em: "Baibhab", team: TEAM.AUTOMATIONS, sub_team: AUTOMATIONS_SUB_TEAM.WORKFLOWS },
  "ad-publishing": { em: "Harsh Tomar", team: TEAM.AUTOMATIONS, sub_team: AUTOMATIONS_SUB_TEAM.AD_PUBLISHING },

  // PLATFORM_SUB_TEAM
  "voice": { em: "Shivendra", team: TEAM.PLATFORM, sub_team: PLATFORM_SUB_TEAM.SERVICES },
  "text": { em: "Arvind", team: TEAM.PLATFORM, sub_team: PLATFORM_SUB_TEAM.SERVICES }
};

// SLA Definitions
const SLA_DEFINITIONS = {
  "critical": 1,
  "high": 3,
  "medium": 7,
  "low": 14
};
const DEFAULT_SLA_DAYS = 7;


// API Issue Type to SLA Days Mapping
const API_ISSUE_TYPE_SLA_DAYS = {
  "Documentation Errors": 7,
  "API Issues / Defects": 7,
  "Missing fields in APIs": 3,
  "New APIs": 14,
  "New Products": 20
};

// Helper function to retry failed API calls
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        continue;
      }
    }
  }
  throw lastError;
}

// Helper function to extract Product Area
function extractProductArea(body) {
  if (!body) return null;
  const productAreaMatch = body.match(/### Product Area\s*\n\s*(.*?)(?:\n|$)/);
  return productAreaMatch ? productAreaMatch[1].trim() : null;
}

function getDefaultProduct() {
  return {
    product: 'marketplace',
    ...PRODUCT_CHANNELS['marketplace']
  };
}

// Determine product info from issue title and body
function determineProductInfo(title, body) {
  if (!title) throw new Error("Issue title is required");
  
  // Extract Product Area field
  const productArea = extractProductArea(body);
  
  if (productArea && PRODUCT_CHANNELS[productArea.toLowerCase()]) {
    const productInfo = {
      product: productArea.toLowerCase(),
      ...PRODUCT_CHANNELS[productArea.toLowerCase()]
    };
    
    if (!productInfo.team || !productInfo.sub_team) {
      console.warn(`Invalid product channel configuration for ${productArea}`);
      return getDefaultProduct();
    }
    
    return productInfo;
  }
  
  // Fallback to searching in title if Product Area is not found
  const textToSearch = title.toLowerCase();
  for (const product in PRODUCT_CHANNELS) {
    if (textToSearch.includes(product)) {
      const productInfo = {
        product,
        ...PRODUCT_CHANNELS[product]
      };
      
      if (!productInfo.team || !productInfo.sub_team) {
        console.warn(`Invalid product channel configuration for ${product}`);
        return getDefaultProduct();
      }
      
      return productInfo;
    }
  }
  
  return getDefaultProduct();
}

// Determine API issue type from labels
function determineApiIssueType(labels) {
  const API_ISSUE_TYPE_VALUES = {
    'bug': 1,
    'bug-missing-api-field': 1,
    'documentation': 2,
    'missing-fields': 3,
    'new-api': 4,
    'new-product': 5
  };

  if (!Array.isArray(labels)) {
    console.warn("Labels is not an array, defaulting to new-api");
    return API_ISSUE_TYPE_VALUES['new-api'];
  }

  for (const label of labels) {
    const labelName = (label.name || "").toLowerCase();
    if (API_ISSUE_TYPE_VALUES[labelName]) {
      return API_ISSUE_TYPE_VALUES[labelName];
    }
  }

  return API_ISSUE_TYPE_VALUES['new-api'];
}

// Calculate due date based on labels and API issue type
function calculateDueDate(labels, apiIssueType) {
  if (!Array.isArray(labels)) {
    console.warn("Labels is not an array, using API issue type for SLA");
    labels = [];
  }

  // First check for priority labels
  for (const label of labels) {
    const labelName = (label.name || "").toLowerCase();
    if (SLA_DEFINITIONS[labelName] !== undefined) {
      return new Date().getTime() + (SLA_DEFINITIONS[labelName] * 24 * 60 * 60 * 1000);
    }
  }

  // If no priority label found, use API issue type based SLA
  const issueTypeMap = {
    1: "API Issues / Defects",
    2: "Documentation Errors",
    3: "Missing fields in APIs",
    4: "New APIs",
    5: "New Products"
  };

  const issueTypeName = issueTypeMap[apiIssueType] || "Documentation Errors";
  const slaDays = API_ISSUE_TYPE_SLA_DAYS[issueTypeName] || DEFAULT_SLA_DAYS;
  
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + slaDays);
  return dueDate.getTime();
}

// Create ClickUp task
async function createClickUpTask(issueData, productInfo, apiIssueTypeValue, dueDateMs) {
  if (!issueData?.title) throw new Error("Issue data is invalid");
  if (!productInfo?.product) throw new Error("Product info is invalid");
  if (!apiIssueTypeValue) throw new Error("API issue type is required");
  if (!dueDateMs) throw new Error("Due date is required");

  return retryOperation(async () => {
    const url = `${CLICKUP_API_BASE_URL}/list/${CLICKUP_LIST_ID}/task`;
    const headers = {
      "Authorization": process.env.CLICKUP_API_TOKEN,
      "Content-Type": "application/json"
    };

    const taskName = issueData.title;
    const description = `GitHub Issue: #${issueData.number}\nLink: ${issueData.html_url}\n\n--- Issue Details ---\n${issueData.body || "No description provided."}\n\n⚠️ Important: Please do not close this ClickUp task directly. The task will be automatically closed when the corresponding GitHub issue is closed.`;

    const payload = {
      name: taskName,
      description: description,
      due_date: dueDateMs,
      custom_fields: [
        {
          id: CUSTOM_FIELD_IDS.API_ISSUE_TYPE,
          value: apiIssueTypeValue
        },
        {
          id: CUSTOM_FIELD_IDS.GITHUB_ISSUE_ID,
          value: issueData.number.toString()
        }
      ]
    };

    const response = await axios.post(url, payload, { 
      headers,
      timeout: 10000
    });

    if (!response.data?.id) {
      throw new Error("Invalid response from ClickUp API");
    }

    return response.data;
  });
}

// Send notification to OnCall service
async function sendOnCallNotification(message, productInfo) {
  if (!message) throw new Error("Notification message is required");
  if (!productInfo?.team || !productInfo?.sub_team) {
    throw new Error("Invalid product info for notification");
  }

  try {
    const response = await axios.get(process.env.ONCALL_SERVICE_URL, {
      params: { subTeam: productInfo.sub_team },
      headers: {
        'Authorization': `Bearer ${process.env.ONCALL_AUTH_TOKEN}`,
        'version': process.env.ONCALL_API_VERSION
      },
      timeout: 10000
    });
    
    if (!response.data?.endpoint) {
      throw new Error("OnCall endpoint not found in response");
    }

    const endpoint = response.data.endpoint;
    const alertMessage = `Doc for this alert: https://github.com/GoHighLevel/private-github-workflows/blob/main/alerts/api_documentation_issue.md

    Hey, we have received a new GitHub issue that needs attention,
    Team: ${productInfo.team}
    Sub-team: ${productInfo.sub_team}
    Product: ${productInfo.product}

    --- Issue Details ---
    ${message}

    --- Links ---
    GitHub Issue: ${message.match(/GitHub URL: (.*)/)?.[1] || 'N/A'}
    ClickUp Task: ${message.match(/ClickUp Task Created: (.*)/)?.[1] || 'N/A'}
    API Issue Type: ${message.match(/API Issue Type: (.*)/)?.[1] || 'N/A'}
    Due Date: ${message.match(/Due Date: (.*)/)?.[1] || 'N/A'}

    If you are facing any difficulties or need assistance, please reach out to @api-team on Slack.`;

    const payload = {
      labels: {
        team: productInfo.team,
        category: "API Documentation",
        severity: "p2",
        sub_team: productInfo.sub_team,
        alertname: "API Documentation Issue"
      },
      status: "firing",
      annotations: {
        AlertValues: alertMessage
      }
    };

    await axios.post(endpoint, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000
    });
    console.log("OnCall notification sent successfully.");
  } catch (error) {
    console.error("Error sending OnCall notification:", error.response?.data || error.message);
    // Don't throw error for notification failure
  }
}

// Main function to process GitHub issues
async function processIssue(github, context, core) {
  try {
    // Get issue number
    let issueNumber;
    if (context.eventName === 'workflow_dispatch') {
      // For manual triggers, get from workflow dispatch inputs
      issueNumber = context.payload.inputs.issue_number;
      // Since input type is number, we don't need string cleaning
      if (!issueNumber || issueNumber <= 0) {
        throw new Error(`Invalid issue number: ${issueNumber}. Please provide a valid positive number.`);
      }
    } else {
      // For automatic triggers from issues
      issueNumber = context.issue.number;
    }

    // Get issue data
    let issueData;
    if (context.eventName === 'workflow_dispatch') {
      const { data: issue } = await github.rest.issues.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber
      });
      issueData = issue;
    } else {
      issueData = context.payload.issue;
    }

    if (!issueData?.title) {
      throw new Error("Could not get valid issue data");
    }

    // Add processing label
    await github.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      labels: ['processing']
    });

    // Process the issue
    const productInfo = determineProductInfo(issueData.title, issueData.body);
    const apiIssueTypeValue = determineApiIssueType(issueData.labels);
    const dueDateMs = calculateDueDate(issueData.labels, apiIssueTypeValue);
    const dueDateStr = new Date(dueDateMs).toISOString().split('T')[0];

    // Create ClickUp task
    const createdTask = await createClickUpTask(issueData, productInfo, apiIssueTypeValue, dueDateMs);

    if (createdTask && createdTask.id) {
      const message = `New GitHub Issue Processed: #${issueData.number} ${issueData.title}\nGitHub URL: ${issueData.html_url}\n🚀 ClickUp Task Created: ${createdTask.url}\n📢 Product: ${productInfo.product}\n🗂️ API Issue Type: ${apiIssueTypeValue}\n🗓️ Due Date: ${dueDateStr}`;
      await sendOnCallNotification(message, productInfo);

      // Add success comment and label
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        body: `✅ Issue processed successfully!\n\nYour issue has been reviewed and assigned to the appropriate team.`
      });

      await github.rest.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        labels: ['processed']
      });

      core.setOutput('clickup_task_id', createdTask.id);
      core.setOutput('clickup_task_url', createdTask.url);
    }

    // Remove processing label
    try {
      await github.rest.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        name: 'processing'
      });
    } catch (e) {
      // Ignore error if label doesn't exist
    }

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    
    const issueNumber = context.issue.number || core.getInput('issue_number');
    if (issueNumber) {
      await github.rest.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        labels: ['processing-error']
      });

      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        body: `❌ Error processing issue:\n\`\`\`\n${errorMessage}\n\`\`\``
      });

      try {
        await github.rest.issues.removeLabel({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issueNumber,
          name: 'processing'
        });
      } catch (e) {
        // Ignore error if label doesn't exist
      }

      core.setOutput('error', errorMessage);
    }
    throw error;
  }
}

module.exports = processIssue; 