const axios = require('axios');

// Configuration constants
const CLICKUP_LIST_ID = "901002929528";
const CLICKUP_API_BASE_URL = "https://api.clickup.com/api/v2";
const CUSTOM_FIELD_IDS = {
  API_ISSUE_TYPE: "49bc39d0-e792-4b70-a706-422c06ebc47f",
  GITHUB_ISSUE_ID: "879f5d73-a102-49a5-bfb1-83d6ccbb0a41"
};

// DRY RUN MODE - Set to true to skip actual API calls
const DRY_RUN = false;

// Team Definitions
const TEAM = {
  CRM: 'crm',
  AUTOMATIONS: 'automations',
  LEADGEN: 'leadgen',
  REVEX: 'revex',
  PLATFORM: 'platform',
  MOBILE: 'mobile'
};

// Slack Webhook Mapping for Team Alerts
const TEAM_SLACK_WEBHOOKS = {
  [TEAM.CRM]: process.env.SLACK_WEBHOOK_CRM,
  [TEAM.PLATFORM]: process.env.SLACK_WEBHOOK_CRM, // Platform uses same webhook as CRM
  [TEAM.AUTOMATIONS]: process.env.SLACK_WEBHOOK_AUTOMATIONS,
  [TEAM.REVEX]: process.env.SLACK_WEBHOOK_REVEX,
  [TEAM.LEADGEN]: process.env.SLACK_WEBHOOK_LEADGEN,
  [TEAM.MOBILE]: process.env.SLACK_WEBHOOK_MOBILE
};

// Sub-team Definitions
const CRM_SUB_TEAM = {
  MARKETPLACE: 'marketplace',
  MARKETPLACE_MODULES: 'marketplace-modules',
  INTEGRATIONS: 'integrations',
  CONTACTS: 'contacts',
  OPPORTUNITIES: 'opportunities',
  BULK_ACTIONS: 'bulk-actions',
  CONVERSATIONS_AI: 'conversations-ai',
  CONVERSATIONS: 'conversations',
  VOICE_AI: 'voice-ai'
};

const AUTOMATIONS_SUB_TEAM = {
  WORKFLOWS: 'workflows',
  CALENDARS: 'calendars',
  REPORTING: 'reporting',
  AD_PUBLISHING: 'ad-publishing',
  USERS: 'users'
};

const LEADGEN_SUB_TEAM = {
  FUNNELS: 'funnels',
  FORMS: 'forms',
  SURVEYS: 'surveys',
  PAYMENTS: 'payments',
  PAYMENT_PRODUCTS: 'payment-products',
  PROPOSALS: 'proposals',
  EMAIL_BUILDER: 'emails',
  TEMPLATES: 'templates',
  SOCIAL_PLANNER: 'social-media',
  ONBOARDING: 'onboarding',
  LAUNCHPAD: 'LaunchPad',
  CONTENT_AI: 'blogs',
  MEDIA_LIBRARY: 'media-library'
};

const REVEX_SUB_TEAM = {
  ISV_LC_EMAIL: 'lc-email',
  ISV_LC_WHATSAPP: 'whatsapp',
  ISV_LC_PHONE: 'lc-phone',
  SAAS: 'saas',
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
  GOKOLLAB: 'gokollab'
};

const PLATFORM_SUB_TEAM = {
  SERVICES: 'services'
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
  "media-library": { em: "Ajay Dev", team: TEAM.LEADGEN, sub_team: LEADGEN_SUB_TEAM.MEDIA_LIBRARY },

  // CRM_SUB_TEAM
  "contacts": { em: "Yogesh", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.CONTACTS },
  "conversations": { em: "Baibhab", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.CONVERSATIONS },
  "marketplace": { em: "Gaurav Kanted", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.MARKETPLACE },
  "conversations-ai": { em: "Dhairya Singh Raghav", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.CONVERSATIONS_AI },
  "voice-ai": { em: "Rashmi Pant", team: TEAM.CRM, sub_team: CRM_SUB_TEAM.VOICE_AI },
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
  "users": { em: "Raj Chandra", team: TEAM.AUTOMATIONS, sub_team: AUTOMATIONS_SUB_TEAM.USERS },
  "notifications": { em: "Raj Chandra", team: TEAM.AUTOMATIONS, sub_team: AUTOMATIONS_SUB_TEAM.USERS },

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

// Manager to ClickUp User ID Mapping
// Generated on: 2025-01-29T08:47:14.054Z
// Updated with email pattern matching verification
const MANAGER_TO_CLICKUP_USER_ID = {
  "Abhishek": "84039776",
  "Abhishek Maheshwari": "44147964",
  "Ajay Dev": "7261351",
  "Ankit Jain": "61208277",
  "Anurag Singh": "89077861",
  "Anwar": "89021242",
  "Arvind": "94818265",
  "Baibhab": "7816084",
  "Daljeet Singh": "55354445",
  "Dhairya Singh Raghav": "61338476",
  "Dhruv": "95075364",
  "Gaurav Kanted": "49407057",
  "Harsh Kurra": "5975441",
  "Harsh Tomar": "50190049",
  "Hemant": "5447247",
  "Hemant Goyal": "73224171",
  "Jees": "63077932",
  "Manish KR": "88856048",
  "Mayur": "5971589",
  "Neha": "61231059",
  "Nikita": "95078996",
  "Pranoy Sarkar": "16804265",
  "Rashmi Pant": "88924959",
  "Ravi": "61368010",
  "Sai Allu": "88952037",
  "Sayeed": "7836399",
  "Shivendra": "94952187",
  "Sunil": "57188581",
  "Upamanyu Sarangi": "57190023",
  "Vatsal Mehta": "50232305",
  "Vinamra Sareen": "88930302",
  "Yogesh": "7310064",
  "Raj Chandra": "72611602"
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

  if (DRY_RUN) {
    return { id: "dry-run-task-id", url: `https://app.clickup.com/t/${CLICKUP_LIST_ID}/dry-run-task-id` };
  }

  return retryOperation(async () => {
    const url = `${CLICKUP_API_BASE_URL}/list/${CLICKUP_LIST_ID}/task`;
    const headers = {
      "Authorization": process.env.CLICKUP_API_TOKEN,
      "Content-Type": "application/json"
    };

    const taskName = issueData.title;
    
    // Build product area details section
    const productAreaDetails = [
      `📦 **Product Area Details**`,
      `- **Product**: ${productInfo.product || 'N/A'}`,
      `- **Team**: ${productInfo.team || 'N/A'}`,
      `- **Sub-team**: ${productInfo.sub_team || 'N/A'}`,
      `- **Engineering Manager**: ${productInfo.em || 'Not assigned'}`,
      ''
    ].join('\n');
    
    const description = `GitHub Issue: #${issueData.number}\nLink: ${issueData.html_url}\n\n${productAreaDetails}\n--- Issue Details ---\n${issueData.body || "No description provided."}\n\n⚠️ Important: Please do not close this ClickUp task directly. The task will be automatically closed when the corresponding GitHub issue is closed.`;

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

    // Try to assign the manager if they have a mapped ClickUp user ID
    if (productInfo.em && MANAGER_TO_CLICKUP_USER_ID[productInfo.em]) {
      const userId = MANAGER_TO_CLICKUP_USER_ID[productInfo.em];
      payload.assignees = [userId];
      console.log(`Assigned task to manager: ${productInfo.em} (ID: ${userId})`);
    } else if (productInfo.em) {
      console.log(`No ClickUp user ID mapped for manager: ${productInfo.em}`);
    }

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

// Send notification to Slack using team-specific webhooks
async function sendSlackNotification(message, productInfo) {
  if (!message) throw new Error("Notification message is required");
  if (!productInfo?.team) {
    throw new Error("Invalid product info for Slack notification");
  }

  const webhookUrl = TEAM_SLACK_WEBHOOKS[productInfo.team];
  if (!webhookUrl) {
    return;
  }

  // Get EM's Slack user ID
  const emSlackUserId = productInfo.em ? getSlackUserId(productInfo.em) : null;

  try {
    const slackMessage = {
      text: `🚨 *New API Documentation Issue*`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🚨 New API Documentation Issue"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${emSlackUserId ? `👤 *Assigned EM:* <@${emSlackUserId}>` : productInfo.em ? `👤 *Assigned EM:* ${productInfo.em} (Slack user not found)` : '👤 *Assigned EM:* Not assigned'}`
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Team:* ${productInfo.team}`
            },
            {
              type: "mrkdwn", 
              text: `*Sub-team:* ${productInfo.sub_team || 'N/A'}`
            },
            {
              type: "mrkdwn",
              text: `*Product:* ${productInfo.product}`
            },
            {
              type: "mrkdwn",
              text: `*Due Date:* ${message.match(/Due Date: (.*)/)?.[1] || 'N/A'}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Issue Details:*\n${message}`
          }
        },
        {
          type: "actions",
          elements: [
            ...(message.match(/GitHub URL: (.*)/)?.[1] ? [{
              type: "button",
              text: {
                type: "plain_text",
                text: "View GitHub Issue"
              },
              url: message.match(/GitHub URL: (.*)/)?.[1],
              style: "primary"
            }] : []),
            ...(message.match(/ClickUp Task Created: (.*)/)?.[1] ? [{
              type: "button", 
              text: {
                type: "plain_text",
                text: "View ClickUp Task"
              },
              url: message.match(/ClickUp Task Created: (.*)/)?.[1]
            }] : [])
          ]
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "📖 For help, reach out to #api-team on Slack | 📋 <https://github.com/GoHighLevel/private-github-workflows/blob/main/alerts/api_documentation_issue.md|Documentation>"
            }
          ]
        }
      ]
    };

    // Add mention in main text if we found Slack user ID
    if (emSlackUserId) {
      slackMessage.text = `🚨 *New API Documentation Issue* - <@${emSlackUserId}>`;
    }

    await axios.post(webhookUrl, slackMessage, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000
    });
  } catch (error) {
    // Don't throw error for notification failure
  }
}

// Hardcoded Slack user ID mapping
const SLACK_USER_IDS = {
  "hemant": "U014U941QAU",
  "daljeet singh": "U03DGTZPT0W", 
  "neha": "U03VC600741",
  "anurag singh": "U07V6AMVB6C",
  "sayeed": "U01JZM889B5",
  "abhishek": "U08636YFL79", // Abhishek Dubey (HighLevel)
  "nikita": "U05SHUU0H9V", // Nikita Bathla (HighLevel)
  "upamanyu sarangi": "U04SB013EG2", // Upamanyu Sarangi (HighLevel)
  "pranoy sarkar": "U01KWLDD62Z", // Pranoy Sarkar (HighLevel)
  "dhruv": "U05J82F03SS", // Dhruv Mehta (HighLevel)
  "abhishek maheshwari": "U0549US5N0Y", // Abhishek Maheshwari (HighLevel)
  "anwar": "U04GBJQE6MC", // Mohd Anwar Hussain (HighLevel)
  "manish kr": "U06FU5YTVML", // Manish
  "vinamra sareen": "U072WN3JUF2", // Vinamra Sareen (HighLevel)
  "sai allu": "U076C0T9BJ7", // Allu Sai Prudhvi
  "harsh kurra": "U01EZBMRA68", // Harsh Kurra(HighLevel)
  "vatsal mehta": "U06493HASKC", // Vatsal Mehta (HighLevel)
  "jees": "U05D2QNGXK3", // Jees K Denny (HighLevel)
  "mayur": "U07K39SB23X", // Mayur Ghai (HighLevel)
  "sunil": "U04S3BHBR5H", // Sunil Kandpal (Highlevel)
  "hemant goyal": "U05T4CMKUHL", // Hemant Goyal (HighLevel)
  "ankit jain": "U03UXFXFNHW", // Ankit Jain (HighLevel)
  "baibhab": "U01910WRLQ6", // Baibhab (HighLevel)
  "harsh tomar": "U062ZJXAN0Y", // Harsh Tomar (HighLevel)
  "shivendra": "U085SE1QYSY", // Shivendra Soni
  "arvind": "U081TQ2QNJC", // Arvind Jain
  "yogesh": "U02G2LV4FE0",
  "vara": "U07CV4GADAB",
  "gaurav kanted": "U02SJKP0CGN",
  "dhairya singh raghav": "U04B3MR44JZ",
  "ajay dev": "U02CSM62TJ5",
  "rashmi pant": "U071W6XRQ00",
  "raj chandra": "U068TRZT89X"
};

// Get Slack user ID by name
function getSlackUserId(name) {
  if (!name) return null;
  
  const normalizedName = name.toLowerCase().trim();
  const slackUserId = SLACK_USER_IDS[normalizedName];
  
  if (slackUserId) {
    return slackUserId;
  }
  
  return null;
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
    if (DRY_RUN) {
      // Would add 'processing' label to GitHub issue
    } else {
      await github.rest.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        labels: ['processing']
      });
    }

    // Process the issue
    const productInfo = determineProductInfo(issueData.title, issueData.body);
    const apiIssueTypeValue = determineApiIssueType(issueData.labels);
    const dueDateMs = calculateDueDate(issueData.labels, apiIssueTypeValue);
    const dueDateStr = new Date(dueDateMs).toISOString().split('T')[0];



    // Create ClickUp task
    const createdTask = await createClickUpTask(issueData, productInfo, apiIssueTypeValue, dueDateMs);

    if (createdTask && createdTask.id) {
      // Construct ClickUp task URL
      const clickupTaskUrl = createdTask.url || `https://app.clickup.com/t/${CLICKUP_LIST_ID}/${createdTask.id}`;
      
      const message = `New GitHub Issue Processed: #${issueData.number} ${issueData.title}\nGitHub URL: ${issueData.html_url}\nClickUp Task Created: ${clickupTaskUrl}\nDue Date: ${dueDateStr}`;
      
      // Send Slack notification (always send, even in dry run)
      await sendSlackNotification(message, productInfo);

      // Add success comment and label
      if (DRY_RUN) {
        // Would add success comment and 'processed' label to GitHub issue
      } else {
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
      }

      core.setOutput('clickup_task_id', createdTask.id);
      core.setOutput('clickup_task_url', createdTask.url);
    }

    // Remove processing label
    if (DRY_RUN) {
      // Would remove 'processing' label from GitHub issue
    } else {
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
    }

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    
    const issueNumber = context.issue.number || core.getInput('issue_number');
    if (issueNumber) {
      if (DRY_RUN) {
        // Would add 'processing-error' label and error comment to GitHub issue
      } else {
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
      }

      core.setOutput('error', errorMessage);
    }
    throw error;
  }
}

module.exports = processIssue; 
