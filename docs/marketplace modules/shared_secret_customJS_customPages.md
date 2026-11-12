# User Context in Marketplace Apps

HighLevel provides a secure mechanism for accessing authenticated user information through signed tokens. This guide explains how you can generate and use `Shared Secret` key to access user context in secured manner.

## Setting Up Shared Secret

### Generating a Shared Secret Key

First you'll need to generate a Shared Secret key for your application:

1. Navigate to your application's Advanced Settings
2. Go to the Auth section
3. Under Shared Secret, click the Generate button to create your Shared Secret key

<div style="display: flex; justify-content: left">
  <img src="https://i.imgur.com/Xw3LGpo.png" alt="Shared Secret Key Generation" width="600" height="200"/>
</div>

## Frontend Implementation Methods

There are two ways in which you can access this data in your frontend, depending on where your code runs:

### 1. Custom JavaScript Implementation

If you're using custom JavaScript injected into HighLevel pages, use the `exposeSessionDetails` method:

```javascript
async function getUserData() {
  try {
    // APP_ID is your application's unique identifier
    const encryptedUserData = await window.exposeSessionDetails(APP_ID)

    // Send this encrypted data to your backend for decryption
    const response = await fetch('your-backend-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ encryptedData: encryptedUserData })
    })

    const userData = await response.json()
    return userData
  } catch (error) {
    console.error('Failed to fetch session details:', error)
    throw error
  }
}
```

### 2. Custom Pages Implementation

If you're trying to get user context in custom page, use the `postMessage` method to communicate with the parent window:

```javascript
async function getUserData() {
  try {
    const encryptedUserData = await new Promise((resolve) => {
      // Request user data from parent window
      window.parent.postMessage({ message: 'REQUEST_USER_DATA' }, '*')

      // Listen for the response
      const messageHandler = ({ data }) => {
        if (data.message === 'REQUEST_USER_DATA_RESPONSE') {
          window.removeEventListener('message', messageHandler)
          resolve(data.payload)
        }
      }

      window.addEventListener('message', messageHandler)
    })

    // Send encrypted data to your backend for decryption
    const response = await fetch('your-backend-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ encryptedData: encryptedUserData })
    })

    const userData = await response.json()
    return userData
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    throw error
  }
}
```

#### `REQUEST_USER_DATA_RESPONSE` Message Fields

| Field   | Type   | Description                                                                                                                                                                           |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| message | string | Always `'REQUEST_USER_DATA_RESPONSE'`                                                                                                                                                 |
| payload | string | Encrypted user data. Decrypt it on your backend with your Shared Secret key (see below)                                                                                               |
| locale  | string | The active HighLevel UI language of the user, as a BCP 47 style code with hyphens (e.g. `'en-US'`, `'pt-BR'`, `'fr'`). Empty string (`''`) when the locale is unavailable or invalid |

#### Matching the HighLevel UI Language

Custom pages load in a cross-origin iframe, so they cannot read HighLevel's language setting directly. Use the `locale` field to render your page in the same language as the user's HighLevel UI:

```javascript
const messageHandler = ({ data }) => {
  if (data.message === 'REQUEST_USER_DATA_RESPONSE') {
    // Fall back to your app's default language when locale is empty
    const language = data.locale || 'en-US'
    document.documentElement.lang = language
    // e.g. i18n.changeLanguage(language)
  }
}
```

> **Note:** `locale` is not part of the encrypted `payload`, so treat it as a display preference only. Do not use it for authorization or other security decisions.

## Backend Implementation

Regardless of which frontend method you use, the backend decryption process remains the same:

```javascript
const CryptoJS = require('crypto-js')

function decryptUserData(encryptedUserData, sharedSecretKey) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedUserData, sharedSecretKey).toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
  } catch (error) {
    throw new Error('Failed to decrypt user data')
  }
}

// Example Express endpoint
app.post('/decrypt-user-data', (req, res) => {
  try {
    const { encryptedData } = req.body
    const userData = decryptUserData(encryptedData, process.env.GHL_APP_SHARED_SECRET)
    res.json(userData)
  } catch (error) {
    res.status(400).json({ error: 'Failed to decrypt user data' })
  }
})
```

## Decrypted Data Structure

After decryption, the data will be returned as a JSON object containing user information. The structure varies based on whether the user is accessing from an Agency or Location context.

### Agency Context

When accessing from an Agency context, the decrypted data will have the following structure:

```json
{
  "userId": "MKQJ7wOVVmNOMvrnKKKK", // Unique identifier for the user
  "companyId": "GNb7aIv4rQFVb9iwNl5K", // Unique identifier for the company/agency
  "role": "admin", // User's role in the system
  "type": "agency", // Indicates this is an agency user
  "userName": "John Doe", // Full name of the user
  "email": "johndoe@gmail.com" // User's email address
}
```

### Location Context

When accessing from a Location context, the decrypted data will include an additional `activeLocation` field:

```json
{
  "userId": "MKQJ7wOVVmNOMvrnKKKK", // Unique identifier for the user
  "companyId": "GNb7aIv4rQFVb9iwNl5K", // Unique identifier for the company/agency
  "role": "admin", // User's role in the system
  "type": "agency", // Indicates this is an agency user
  "activeLocation": "yLKVZpNppIdYpah4RjNE", // Unique identifier for the active location
  "userName": "John Doe", // Full name of the user
  "email": "johndoe@gmail.com" // User's email address
}
```

### Field Descriptions

| Field          | Type   | Description                                                       |
| -------------- | ------ | ----------------------------------------------------------------- |
| userId         | string | Unique identifier for the user                                    |
| companyId      | string | Unique identifier for the company/agency                          |
| role           | string | User's role in the system (e.g., 'admin', 'user')                 |
| type           | string | Context type ('agency' or 'location')                             |
| activeLocation | string | (Location context only) Unique identifier for the active location |
| userName       | string | Full name of the user                                             |
| email          | string | User's email address                                              |

### Reference Implementation

For a complete example implementation, you can refer to our marketplace app template repository:

[GoHighLevel Marketplace App Template](https://github.com/GoHighLevel/ghl-marketplace-app-template/tree/main)

The relevant implementation can be found in the `/decrypt-sso` endpoint of the template.

### Security Considerations

- Never expose your Shared Secret key in client-side code
- Always perform decryption on your backend
- Store your Shared Secret key securely using environment variables
- Use HTTPS for all communications between your frontend and backend
- Regularly rotate your Shared Secret keys for enhanced security
