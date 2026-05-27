# Authorization

HighLevel supports the Authorization Code Grant flow with v2 APIs. Please find the step-by-step procedure to use and understand the OAuth 2.0 flow.

Here's a [Loom Video](https://www.loom.com/share/f32384758de74a4dbb647e0b7962c4ea?sid=0907a66d-a160-4b51-bcd4-c47ebae37fca) to walk you through the entire process.

### 1. Register an OAuth app

1. Go to the [Marketplace](https://marketplace.gohighlevel.com)
2. Sign up for a developer account.
3. Go to "My Apps," and click on "Create App."
4. Fill up the required details in the form, then your app will be created.
5. Click on the app, and it will take you to settings where you can configure the scopes, generate the keys, etc.

### 2. Add the app to your desired location

1. Make the location/agency Admin go to the app's Authorization Page URL.
2. They select the location they want to connect.
3. They are redirected to the redirect URL with the Authorization Code.
4. Use the Authorization Code to get the Access token via the Get Access Token API under OAuth 2.0.
5. Use the Access Token to call any API.

### 3. Get the app's Authorization Page URL

To generate the Authorization Page URL for an app, replace the `client_id`, `redirect_uri`, and `scope` in the template below. Then, redirect the location/agency admin trying to install your app to the URL.

1. For standard Auth URL flow:

```
https://marketplace.gohighlevel.com/v2/oauth/chooselocation?
response_type=code&
redirect_uri=https://myapp.com/oauth/callback/gohighlevel&
client_id=CLIENT_ID&
scope=conversations/message.readonly conversations/message.write
```

2. For White-labeled Auth URL flow:

```
https://marketplace.leadconnectorhq.com/v2/oauth/chooselocation?
response_type=code&
redirect_uri=https://myapp.com/oauth/callback/gohighlevel&
client_id=CLIENT_ID&
scope=conversations/message.readonly conversations/message.write
```

<b>NOTE:</b> For the users who are not logged in to the application at the time of giving consent, developer has option to initiate login in new tab or in same tab. For initiating login in same tab, developer need to append `&loginWindowOpenMode=self` to authorization url. If the query param not passed, login in new tab would be default.

When a user grants access, their browser is redirected to the specified redirect URI, and the Authorization Code is passed inside the code query parameter.

```
https://myapp.com/oauth/callback/gohighlevel?code=7676cjcbdc6t76cdcbkjcd09821jknnkj
```

## OAuth FAQs

### How long are the access tokens valid?

The access tokens are valid for a day. After that, you can use the refresh token to get a new access token which will be valid for another day.

### How long are the refresh tokens valid?

The refresh tokens are valid for a year unless they are used. If they are used, the new refresh token is valid for a year as well.

### How should we handle token expiry?

You should:

1. Make a request to any of our APIs using the accessToken.
2. If you get a response saying that the token is expired, refresh the token using our API and save the new access token and refresh token in your database.
3. Make the request again with the new accessToken.

You can write a wrapper function on your end to achieve this. You can use it for all the API calls you make to our APIs.

### What are current rate limits for API 2.0?

GHL has implemented rate limits on our public V2 APIs using OAuth to ensure optimal performance and stability. These limits have been adjusted to:

Burst limit: A maximum of 100 API requests per 10 seconds for each Marketplace app (i.e., client) per resource (i.e., Location or Company).
Daily limit: 200,000 API requests per day for each Marketplace app (i.e., client) per resource (i.e., Location or Company).

These new limits contribute to better overall performance and stability of our system.

To monitor your limited usage, refer to the following API response headers:

'X-RateLimit-Limit-Daily': Your daily limit
'X-RateLimit-Daily-Remaining': The remaining number of requests for the day
'X-RateLimit-Interval-Milliseconds': The time interval for burst requests
'X-RateLimit-Max': The maximum request limit in the specified time interval
'X-RateLimit-Remaining': The remaining number of requests in the current time interval

Example: If the 'GHL-APP' is installed on two locations (Sub-account A and Sub-account B) on the GHL Marketplace, the rate limits for each location would be as follows:

1. Sub-account A: 'GHL-APP' can make 200,000 API requests per day and 100 API requests per 10 seconds.
2. Sub-account B: 'GHL-APP' can make 200,000 API requests per day and 100 API requests per 10 seconds.
