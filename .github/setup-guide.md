# Setup Guide: Google Sheets Integration for Issue Reporting

This guide will walk you through setting up the Google Sheets integration for the GoHighLevel API documentation issue reporting system.

## Prerequisites

- Access to Google Cloud Console
- Admin access to the GoHighLevel GitHub repository
- Access to the Google Sheet: https://docs.google.com/spreadsheets/d/1M41yAqW5XcfMUaHA6h6ewJ6tabF_eOVoyu7JfD1iC_U/

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `ghl-api-docs-reporting`
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Enter details:
   - **Service account name**: `ghl-api-docs-service`
   - **Service account ID**: `ghl-api-docs-service` (auto-filled)
   - **Description**: `Service account for GoHighLevel API docs issue reporting`
4. Click "Create and Continue"
5. Skip role assignment (click "Continue")
6. Skip user access (click "Done")

## Step 4: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to "Keys" tab
4. Click "Add Key" → "Create new key"
5. Select "JSON" format
6. Click "Create"
7. **Save the downloaded JSON file securely**

## Step 5: Share Google Sheet with Service Account

1. Open the downloaded JSON file and copy the `client_email` value
   ```json
   {
     "client_email": "ghl-api-docs-service@your-project.iam.gserviceaccount.com",
     ...
   }
   ```

2. Open the Google Sheet: https://docs.google.com/spreadsheets/d/1M41yAqW5XcfMUaHA6h6ewJ6tabF_eOVoyu7JfD1iC_U/

3. Click "Share" button

4. Add the service account email with "Editor" permissions

5. Uncheck "Notify people" and click "Share"

## Step 6: Add GitHub Secret

1. Go to GitHub repository: https://github.com/GoHighLevel/highlevel-api-docs

2. Navigate to "Settings" → "Secrets and variables" → "Actions"

3. Click "New repository secret"

4. Enter:
   - **Name**: `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON`
   - **Secret**: Paste the entire content of the downloaded JSON file

5. Click "Add secret"

## Step 7: Verify Google Sheet Format

Ensure your Google Sheet has the following structure:

| Column A (Product Area) | Column B (Engineering Manager) | Column C (Team) |
|------------------------|--------------------------------|-----------------|
| contacts               | Yogesh                         | crm             |
| workflows              | Baibhab                        | automations     |
| payments               | Vatsal Mehta                   | leadgen         |
| ...                    | ...                            | ...             |

**Important Notes:**
- Column A should contain product area names (lowercase, hyphen-separated)
- Column B should contain the exact engineering manager names as they appear in the ClickUp system
- Column C should contain team names (crm, automations, leadgen, revex, mobile)
- First row should be headers

## Step 8: Test the Integration

1. Go to GitHub repository → "Actions"

2. Run the "Update Issue Templates with Product Areas" workflow:
   - Click on the workflow
   - Click "Run workflow"
   - Leave default settings and click "Run workflow"

3. Check the workflow run:
   - Should complete successfully
   - May create a PR with updated issue templates if there are changes

4. Create a test issue:
   - Use any issue template
   - Select a product area from the dropdown
   - Submit the issue
   - Check that the "API Documentation Issue Processing" workflow runs
   - Verify ClickUp task creation and Slack notifications

## Step 9: Configure ClickUp User IDs (Optional)

If you want to assign ClickUp tasks directly to engineering managers:

1. Get ClickUp user IDs for each engineering manager
2. Update the `MANAGER_TO_CLICKUP_USER_ID` mapping in `.github/process-issue.js`
3. Commit the changes

## Troubleshooting

### Google Sheets Access Issues

**Error**: `Error creating Google Sheets client`
- Verify the JSON secret is correctly formatted
- Check that the service account email has access to the sheet

**Error**: `No data found in the Google Sheet`
- Verify sheet ID in `google-sheets-service.js` is correct
- Check that data exists in columns A, B, C
- Ensure service account has "Editor" permissions

### Authentication Issues

**Error**: `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON is not set`
- Verify the GitHub secret name matches exactly
- Check that the secret contains valid JSON

### Testing the Setup

Run this command locally to test Google Sheets access:

```bash
# Install dependencies
npm install googleapis

# Set environment variable (replace with your JSON content)
export GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# Test the service
node -e "
const service = require('./.github/google-sheets-service.js');
service.getAllProductAreas().then(areas => {
  console.log('Product areas:', areas);
}).catch(console.error);
"
```

## Security Best Practices

1. **Never commit the service account JSON file to Git**
2. **Limit service account permissions to read-only**
3. **Regularly rotate service account keys**
4. **Monitor Google Cloud audit logs**
5. **Use least-privilege access for all integrations**

## Maintenance

### Weekly Tasks
- The system automatically updates issue templates weekly
- Monitor the "Update Issue Templates" workflow for any failures

### Monthly Tasks
- Review Google Sheets data for accuracy
- Check that all engineering managers are correctly mapped
- Verify ClickUp user ID mappings are up to date

### As Needed
- Add new product areas to Google Sheets
- Update engineering manager assignments
- Run manual template updates after major changes

---

## Support

For issues with this setup:
1. Check GitHub Actions logs for detailed error messages
2. Review the comprehensive documentation in `README-REPORTING-SYSTEM.md`
3. Create an issue in the repository with setup problems
4. Contact the API team for assistance

The system is designed to be robust with fallbacks, so even if Google Sheets is temporarily unavailable, the issue processing will continue using the hardcoded product mappings.