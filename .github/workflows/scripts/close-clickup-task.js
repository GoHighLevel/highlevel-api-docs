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

async function findTaskByIssueId(issueId, workspaceId, apiToken) {
  // First get the list of spaces
  const spacesOptions = {
    hostname: 'api.clickup.com',
    path: `/api/v2/team/${workspaceId}/space`,
    method: 'GET',
    headers: {
      'Authorization': apiToken,
      'Content-Type': 'application/json'
    }
  };

  const spacesResponse = await makeRequest(spacesOptions);
  const spaces = spacesResponse.spaces || [];

  // For each space, get lists and search tasks
  for (const space of spaces) {
    // Get all folderless lists
    const folderlessListsOptions = {
      hostname: 'api.clickup.com',
      path: `/api/v2/space/${space.id}/list`,
      method: 'GET',
      headers: {
        'Authorization': apiToken,
        'Content-Type': 'application/json'
      }
    };

    const listsResponse = await makeRequest(folderlessListsOptions);
    const lists = listsResponse.lists || [];

    // Get all folders
    const foldersOptions = {
      hostname: 'api.clickup.com',
      path: `/api/v2/space/${space.id}/folder`,
      method: 'GET',
      headers: {
        'Authorization': apiToken,
        'Content-Type': 'application/json'
      }
    };

    const foldersResponse = await makeRequest(foldersOptions);
    const folders = foldersResponse.folders || [];

    // Get lists from folders
    for (const folder of folders) {
      const folderListsOptions = {
        hostname: 'api.clickup.com',
        path: `/api/v2/folder/${folder.id}/list`,
        method: 'GET',
        headers: {
          'Authorization': apiToken,
          'Content-Type': 'application/json'
        }
      };

      const folderListsResponse = await makeRequest(folderListsOptions);
      lists.push(...(folderListsResponse.lists || []));
    }

    // Search tasks in each list
    for (const list of lists) {
      const tasksOptions = {
        hostname: 'api.clickup.com',
        path: `/api/v2/list/${list.id}/task?custom_fields=[{"field_id":"${process.env.GITHUB_ISSUE_FIELD_ID}","operator":"=","value":"${issueId}"}]`,
        method: 'GET',
        headers: {
          'Authorization': apiToken,
          'Content-Type': 'application/json'
        }
      };

      const tasksResponse = await makeRequest(tasksOptions);
      const tasks = tasksResponse.tasks || [];

      if (tasks.length > 0) {
        return tasks[0].id;
      }
    }
  }

  return null;
}

async function closeClickUpTask(taskId, apiToken) {
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
}

async function main() {
  try {
    const issueId = process.env.GITHUB_ISSUE_NUMBER;
    const clickupToken = process.env.CLICKUP_API_TOKEN;
    const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

    if (!clickupToken || !workspaceId) {
      console.error('Required environment variables are missing');
      process.exit(1);
    }

    const taskId = await findTaskByIssueId(issueId, workspaceId, clickupToken);
    
    if (!taskId) {
      console.log('No ClickUp task found with matching GitHub issue ID');
      process.exit(0);
    }

    await closeClickUpTask(taskId, clickupToken);
    console.log(`Successfully closed ClickUp task ${taskId}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 