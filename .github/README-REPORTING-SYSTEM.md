# GoHighLevel API Documentation Reporting System

This document describes the comprehensive reporting system for the GoHighLevel API documentation repository that automatically processes GitHub issues, assigns them to the correct engineering managers, creates ClickUp tasks, and sends Slack notifications.

## 🎯 Overview

When a new issue is created in the repository, the system:

1. **Extracts product area** from the issue form
2. **Looks up engineering manager** from Google Sheets
3. **Creates ClickUp task** assigned to the appropriate manager
4. **Sends Slack notification** to the relevant team channel
5. **Updates GitHub issue** with processing status

## 📊 Google Sheets Integration

### Configuration
- **Spreadsheet ID**: `1M41yAqW5XcfMUaHA6h6ewJ6tabF_eOVoyu7JfD1iC_U`
- **Range**: Columns A:C (Product Area, Engineering Manager, Team)
- **Access**: Read-only via service account

### Expected Sheet Format
```
Column A: Product Area (e.g., "contacts", "workflows", "payments")
Column B: Engineering Manager (e.g., "Yogesh", "Baibhab", "Vatsal Mehta")
Column C: Team (e.g., "crm", "automations", "leadgen")
```

### Fallback Mechanism
If Google Sheets is unavailable, the system falls back to the hardcoded `PRODUCT_CHANNELS` mapping in `process-issue.js`.

## 🎫 ClickUp Integration

### Task Creation
- **Board**: Uses `CLICKUP_LIST_ID` from configuration
- **Assignee**: Engineering manager based on Google Sheets lookup
- **Custom Fields**:
  - `API_ISSUE_TYPE`: Determined from GitHub labels
  - `GITHUB_ISSUE_ID`: Links back to the original GitHub issue
- **Due Date**: Calculated based on issue priority and type

### Task Details
- **Title**: Matches GitHub issue title
- **Description**: Includes GitHub link, product area details, and issue content
- **Manager Assignment**: Automatic assignment using ClickUp user ID mapping

## 💬 Slack Integration

### Team Notifications
Each team has its own Slack webhook:
- **CRM**: `SLACK_WEBHOOK_CRM`
- **Automations**: `SLACK_WEBHOOK_AUTOMATIONS`
- **RevEx**: `SLACK_WEBHOOK_REVEX`
- **LeadGen**: `SLACK_WEBHOOK_LEADGEN`
- **Mobile**: `SLACK_WEBHOOK_MOBILE`

### Message Format
Rich Slack messages include:
- Issue title and description
- Assigned engineering manager (with @mention if available)
- Team and product area information
- Due date
- Quick action buttons for GitHub and ClickUp links

## 🛠️ Setup Instructions

### 1. Google Sheets Service Account
1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Create a service account
4. Download the JSON key file
5. Share the Google Sheet with the service account email (Editor permissions)
6. Add the JSON content to GitHub secret: `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON`

### 2. ClickUp Configuration
1. Get your ClickUp API token
2. Find your list/board ID
3. Map engineering managers to ClickUp user IDs (see `MANAGER_TO_CLICKUP_USER_ID`)
4. Add token to GitHub secret: `CLICKUP_API_TOKEN`

### 3. Slack Webhooks
1. Create incoming webhook for each team channel
2. Add webhook URLs to GitHub secrets:
   - `SLACK_WEBHOOK_CRM`
   - `SLACK_WEBHOOK_AUTOMATIONS`
   - `SLACK_WEBHOOK_REVEX`
   - `SLACK_WEBHOOK_LEADGEN`
   - `SLACK_WEBHOOK_MOBILE`

## 📝 Issue Templates

### Dynamic Product Areas
Issue templates are automatically updated with current product areas from Google Sheets using the `update-issue-templates.js` script.

### Template Structure
All issue templates include a dropdown for "Product Area" that:
- Lists all available product areas from Google Sheets
- Is required for proper routing
- Automatically updates weekly via GitHub Actions

### Manual Updates
Run the "Update Issue Templates" workflow manually to refresh product areas immediately.

## 🔄 Workflows

### 1. Issue Processing (`api-docs-issue-processing.yml`)
- **Trigger**: New issue creation or manual dispatch
- **Actions**: Process issue, create ClickUp task, send Slack notification
- **Environment**: Requires all API tokens and webhooks

### 2. Template Updates (`update-issue-templates.yml`)
- **Trigger**: Weekly schedule or manual dispatch
- **Actions**: Fetch current product areas, update templates, create PR if changes
- **Frequency**: Mondays at 9 AM UTC

## 📁 File Structure

```
.github/
├── workflows/
│   ├── api-docs-issue-processing.yml    # Main issue processing workflow
│   └── update-issue-templates.yml       # Template update workflow
├── ISSUE_TEMPLATE/
│   ├── bug-report-api-field-missing-form.yaml
│   ├── bug-report-documentation-errors-form.yaml
│   ├── feature-request-new-api-form.yaml
│   └── feature-request-new-product-form.yaml
├── process-issue.js                     # Main processing logic
├── google-sheets-service.js             # Google Sheets integration
├── update-issue-templates.js            # Template update script
└── highlevel-teams.json                 # Team mappings (auto-updated)
```

## 🔧 Key Functions

### `google-sheets-service.js`
- `fetchProductAreaData()`: Retrieves all product area data from Google Sheets
- `getProductInfo(productArea)`: Gets manager and team info for specific product
- `getAllProductAreas()`: Returns list of all available product areas

### `process-issue.js`
- `determineProductInfo()`: Enhanced with Google Sheets lookup
- `createClickUpTask()`: Creates and assigns ClickUp tasks
- `sendSlackNotification()`: Sends rich Slack messages with team mentions

### `update-issue-templates.js`
- `updateAllIssueTemplates()`: Updates all YAML templates with current product areas
- `updateHighlevelTeamsJson()`: Syncs team mappings with Google Sheets data

## 🏃‍♂️ Usage Examples

### Creating an Issue
1. User creates new issue using any template
2. Selects product area from dropdown (auto-populated from Google Sheets)
3. System automatically:
   - Looks up engineering manager for that product area
   - Creates ClickUp task assigned to manager
   - Sends Slack notification to team channel
   - Updates GitHub issue with success/error status

### Adding New Product Areas
1. Add new row to Google Sheets with: Product Area | Engineering Manager | Team
2. Run "Update Issue Templates" workflow (or wait for weekly update)
3. New product area automatically appears in all issue forms

### Updating Manager Assignments
1. Update engineering manager name in Google Sheets
2. New issues will automatically be assigned to the updated manager
3. No code changes required

## 🔍 Monitoring and Debugging

### Logs
- Check GitHub Actions logs for processing details
- Google Sheets errors fall back to hardcoded mappings
- ClickUp and Slack failures are logged but don't stop processing

### Testing
- Use `workflow_dispatch` to manually process specific issues
- Set `DRY_RUN = true` in `process-issue.js` for testing without API calls
- Check Slack channels for notification delivery

### Troubleshooting

#### Google Sheets Issues
- Verify service account has access to spreadsheet
- Check JSON key format in GitHub secrets
- Monitor API quotas and rate limits

#### ClickUp Issues
- Verify API token permissions
- Check manager to user ID mappings
- Ensure list/board ID is correct

#### Slack Issues
- Test webhook URLs manually
- Verify channel permissions
- Check message formatting

## 🔐 Security Considerations

- Service account keys are stored as GitHub secrets
- All API tokens use least-privilege access
- Webhooks only send to authorized channels
- No sensitive data is logged or exposed

## 📈 Metrics and Analytics

The system tracks:
- Issue processing success/failure rates
- Manager assignment accuracy
- Response times for ClickUp task creation
- Slack notification delivery status

## 🚀 Future Enhancements

Potential improvements:
- Add more sophisticated SLA tracking
- Integrate with GitHub Projects for better visibility
- Add automated follow-up notifications
- Implement manager workload balancing
- Add analytics dashboard for issue trends

---

For questions or issues with the reporting system, contact the API team or create an issue in this repository.