# Monday.com Field Type Configuration Guide

## Overview

This guide explains how to properly configure your field types in the Monday.com Developer Center to enable credentials management for your automation.

## Field Type Configuration

### 1. Navigate to Field Types

1. Go to your Monday.com Developer Center
2. Select your app
3. Go to **Build** → **Features** → **test feature**
4. Click on the **Field Types** tab

### 2. Configure the API Key Field Type

#### Field Type Details:

- **Name**: `apiKey` (or any descriptive name)
- **Title**: "API Key" (user-facing name)
- **Type**: `string`
- **Required**: `true`

#### Automation Config Settings:

**Credentials**:

- Set this to the name of your credential parameter (e.g., "apiKey")

**Credentials URL**:

- Set to: `/get-api-key`
- This endpoint checks if the user already has an API key stored

**Authorization URL**:

- Set to: `https://your-domain.com/monday/authorize`
- Replace `your-domain.com` with your actual domain
- This is where users will be redirected to enter their API key

**Delete Credentials URL**:

- Set to: `/delete-api-key`
- This endpoint allows users to delete their stored API key

### 3. Credential Parameters Configuration

In the **Credentials** section of your app:

1. **Add a new credential parameter**:
   - **Name**: `apiKey`
   - **Title**: "Third-Party API Key"
   - **Type**: `string`
   - **Required**: `true`
   - **Description**: "Enter your API key for the third-party service"

### 4. URL Configuration Examples

Based on your current setup, your URLs should be:

```
Credentials URL: /get-api-key
Authorization URL: https://your-app-domain.com/monday/authorize
Delete Credentials URL: /delete-api-key
```

### 5. Testing the Configuration

1. **Test the flow**:

   - Create a new automation in Monday.com
   - Try to configure the field type
   - Verify that:
     - If no API key exists, it redirects to the authorization page
     - If an API key exists, it shows the masked version
     - Users can save new API keys
     - Users can delete existing API keys

2. **Check the logs**:
   - Monitor your application logs for any errors
   - Verify that the endpoints are being called correctly

### 6. Common Issues and Solutions

#### Issue: "Failed to load user credentials"

**Cause**: The `/get-api-key` endpoint is not returning the correct response format.

**Solution**:

- Ensure your endpoint returns `200` with `{ connected: true }` when a key exists
- Ensure your endpoint returns `404` when no key exists
- Check that the authentication middleware is working correctly

#### Issue: Authorization page not loading

**Cause**: The Authorization URL is incorrect or the endpoint is not accessible.

**Solution**:

- Verify the Authorization URL is publicly accessible
- Check that the `/monday/authorize` endpoint exists and is working
- Ensure your domain is properly configured

#### Issue: API key not saving

**Cause**: The `/save-api-key` endpoint has issues.

**Solution**:

- Check that the endpoint accepts POST requests
- Verify the request body format
- Ensure the authentication middleware is applied
- Check the database/storage connection

### 7. Security Considerations

1. **Never log API keys**: Ensure your logging doesn't capture sensitive data
2. **Use HTTPS**: Always use secure connections for credential endpoints
3. **Validate input**: Sanitize and validate all user inputs
4. **Secure storage**: Use Monday.com's secure storage for sensitive data

### 8. Endpoint Requirements Summary

| Endpoint            | Method | Purpose                 | Response                                                                             |
| ------------------- | ------ | ----------------------- | ------------------------------------------------------------------------------------ |
| `/get-api-key`      | GET    | Check if API key exists | 200: `{connected: true, maskedKey: "****"}` or 404: `{message: "API Key not found"}` |
| `/monday/authorize` | GET    | Show API key input form | HTML page                                                                            |
| `/save-api-key`     | POST   | Save new API key        | 200: Success message or 400/500: Error                                               |
| `/delete-api-key`   | POST   | Delete existing API key | 200: Success message or 500: Error                                                   |

### 9. Next Steps

After configuring the field types:

1. **Deploy your changes** to your hosting environment
2. **Test the complete flow** in Monday.com
3. **Monitor the logs** for any issues
4. **Update your automation logic** to use the stored API keys

## Troubleshooting

If you're still experiencing issues:

1. Check the browser's developer console for JavaScript errors
2. Verify all endpoints are returning the expected status codes
3. Ensure your authentication middleware is working correctly
4. Test each endpoint individually using a tool like Postman
5. Check your application logs for detailed error messages

## Support

For additional help:

- Check the Monday.com Developer Documentation
- Review the Monday.com Apps SDK documentation
- Test with the Monday.com CLI tools
