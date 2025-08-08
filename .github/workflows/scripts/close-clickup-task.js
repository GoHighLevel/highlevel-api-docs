const axios = require('axios');

function makeRequest(options, data = null) {
  const config = {
    method: options.method,
    url: `https://${options.hostname}${options.path}`,
    headers: options.headers,
    timeout: 10000
  };
  
  if (data) {
    config.data = data;
  }
  return axios(config)
    .then(response => response.data)
    .catch(error => {
      console.error(`API Error: ${error.response?.status} - ${error.response?.data?.err || error.message}`);
      throw error;
    });
}

async function findTaskInList(listId, issueId, githubFieldId, apiToken) {
  console.log(`🔍 Searching for issue #${issueId}...`);
  
  let page = 0;
  const maxPages = 50; // Prevent infinite loops
  
  while (page < maxPages) {
    const options = {
      hostname: 'api.clickup.com',
      path: `/api/v2/list/${listId}/task?page=${page}`,
      method: 'GET',
      headers: {
        'Authorization': apiToken,
        'Content-Type': 'application/json'
      }
    };

    const response = await makeRequest(options);
    const tasks = response.tasks || [];
    
    if (tasks.length === 0) break;
    
    // Check each task for matching GitHub issue field
    for (const task of tasks) {
      if (task.custom_fields) {
        const githubField = task.custom_fields.find(field => field.id === githubFieldId);
        if (githubField && githubField.value?.trim() == issueId) {
          console.log(`✅ Found task: ${task.id} - "${task.name}"`);
          return task.id;
        }
      }
    }
    
    if (response.last_page === true) break;
    page++;
  }
  
  console.log(`⚠️ Searched ${maxPages} pages but no matching task found`);
  return null;
}

async function closeTask(taskId, apiToken) {
  const options = {
    hostname: 'api.clickup.com',
    path: `/api/v2/task/${taskId}`,
    method: 'PUT',
    headers: {
      'Authorization': apiToken.trim(),
      'Content-Type': 'application/json'
    }
  };

  await makeRequest(options, { status: 'closed' });
  console.log(`🔒 Task closed successfully!`);
}

async function main() {
  console.log(`🚀 ClickUp Task Closer - Issue #${process.env.ISSUE_NUMBER}`);
  
  // Get environment variables
  const issueId = process.env.ISSUE_NUMBER;
  const apiToken = process.env.CLICKUP_API_TOKEN;
  const listId = process.env.CLICKUP_SPACE_ID; // This is actually the list ID
  const githubFieldId = process.env.CLICKUP_GITHUB_FIELD_ID;
  
  // Validate required variables
  if (!issueId || !apiToken || !listId || !githubFieldId) {
    console.error(`❌ Missing required environment variables`);
    process.exit(1);
  }
  
  try {
    // Find the task
    const taskId = await findTaskInList(listId, issueId, githubFieldId, apiToken);
    
    if (!taskId) {
      console.log(`❌ No matching task found`);
      process.exit(0);
    }
    
    // Close the task
    await closeTask(taskId, apiToken);
    
  } catch (error) {
    console.error(`💥 Error:`, error);
    process.exit(1);
  }
}

main(); 