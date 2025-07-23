const https = require('https');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseData));
        } else {
          reject(`Request failed: ${res.statusCode} ${responseData}`);
        }
      });
    });

    req.on('error', (error) => reject(error));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function findTaskInList(listId, issueId, githubFieldId, apiToken) {
  console.log(`🔍 Searching for issue #${issueId}...`);
  
  let page = 0;
  
  while (true) {
    const options = {
      hostname: 'api.clickup.com',
      path: `/api/v2/list/${listId}/task?page=${page}&include_closed=true`,
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
        if (githubField && githubField.value == issueId) {
          console.log(`✅ Found task: ${task.id} - "${task.name}"`);
          return task.id;
        }
      }
    }
    
    if (response.last_page === true) break;
    page++;
  }
  
  return null;
}

async function closeTask(taskId, apiToken) {
  const options = {
    hostname: 'api.clickup.com',
    path: `/api/v2/task/${taskId}`,
    method: 'PUT',
    headers: {
      'Authorization': apiToken,
      'Content-Type': 'application/json'
    }
  };

  await makeRequest(options, { status: 'closed' });
  console.log(`🔒 Task closed successfully!`);
}

async function main() {
  console.log(`🚀 ClickUp Task Closer - Issue #${process.env.GITHUB_ISSUE_NUMBER}`);
  
  // Get environment variables
  const issueId = process.env.GITHUB_ISSUE_NUMBER;
  const apiToken = process.env.CLICKUP_API_TOKEN;
  const listId = process.env.CLICKUP_SPACE_ID; // This is actually the list ID
  const githubFieldId = process.env.GITHUB_ISSUE_FIELD_ID;
  
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