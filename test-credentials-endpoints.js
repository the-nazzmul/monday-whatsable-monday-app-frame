#!/usr/bin/env node

/**
 * Test script for credentials endpoints
 * Run this script to test your credentials management endpoints
 *
 * Usage: node test-credentials-endpoints.js [base-url]
 * Example: node test-credentials-endpoints.js https://your-app-domain.com
 */

import fetch from 'node-fetch';

const BASE_URL = process.argv[2] || 'http://localhost:8080';
const TEST_USER_ID = 'test-user-123';
const TEST_API_KEY = 'test-api-key-12345';

// Mock JWT token for testing (you'll need to generate a real one)
const MOCK_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwiYWNjb3VudElkIjoiYWNjb3VudC0xMjMiLCJiYWNrVG9VcmwiOiJodHRwczovL2FwcC5tb25kYXkuY29tIiwiaWF0IjoxNjQwOTk1MjAwfQ.test-signature';

console.log('🧪 Testing Credentials Endpoints');
console.log('================================');
console.log(`Base URL: ${BASE_URL}`);
console.log('');

async function testEndpoint(name, url, options = {}) {
  console.log(`Testing ${name}...`);
  console.log(`URL: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: MOCK_TOKEN,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response:`, responseData);

    if (response.ok) {
      console.log('✅ SUCCESS');
    } else {
      console.log('❌ FAILED');
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }

  console.log('');
}

async function runTests() {
  // Test 1: Check API key status (should return 404 initially)
  await testEndpoint('Get API Key Status (Initial)', `${BASE_URL}/get-api-key`);

  // Test 2: Test authorization page
  await testEndpoint('Authorization Page', `${BASE_URL}/monday/authorize`);

  // Test 3: Save API key
  await testEndpoint('Save API Key', `${BASE_URL}/save-api-key`, {
    method: 'POST',
    body: JSON.stringify({ apiKey: TEST_API_KEY }),
  });

  // Test 4: Check API key status (should return 200 now)
  await testEndpoint('Get API Key Status (After Save)', `${BASE_URL}/get-api-key`);

  // Test 5: Delete API key
  await testEndpoint('Delete API Key', `${BASE_URL}/delete-api-key`, {
    method: 'POST',
  });

  // Test 6: Check API key status (should return 404 again)
  await testEndpoint('Get API Key Status (After Delete)', `${BASE_URL}/get-api-key`);

  console.log('🏁 All tests completed!');
  console.log('');
  console.log('📝 Notes:');
  console.log('- Make sure your server is running');
  console.log('- Update the MOCK_TOKEN with a real JWT token for production testing');
  console.log('- Check your server logs for any authentication errors');
  console.log('- Verify that the endpoints match your Monday.com field type configuration');
}

// Run the tests
runTests().catch(console.error);
