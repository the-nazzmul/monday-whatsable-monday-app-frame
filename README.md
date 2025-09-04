# API Key Integration - Monday App

## Overview

This repository contains a Monday app that demonstrates how to securely manage third-party API keys for automation workflows. The app provides a complete credentials management system that allows users to:

1. **Store API Keys Securely**: Users can input and store their third-party service API keys
2. **Manage Existing Keys**: View masked versions of existing keys and update or delete them
3. **Use in Automations**: The stored API keys are automatically included in automation requests

## Features

This app showcases how to use various Monday app functionalities, including:

- **Secure API Key Storage**: Using Monday.com's secure storage for sensitive credentials
- **Credentials Management**: Complete CRUD operations for API key management
- **Modern UI**: Clean, responsive interface for credential management
- **Authentication**: JWT-based authentication for all endpoints
- **Error Handling**: Comprehensive error handling and user feedback
- **Security Best Practices**: API keys are masked when displayed and never logged

## Key Components

- **API Key Management**: Store, retrieve, update, and delete third-party API keys
- **User Interface**: Modern web interface for credential management
- **Security**: All operations are authenticated and secure
- **Integration Ready**: Designed to work seamlessly with Monday.com automations

## Installation

1. Ensure you have Node.js (v18+), npm, and [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) installed on your system.

2. Use the correct Node.js version by running the following command:

```bash
$ nvm use
```

3. Install node modules by running:

```bash
$ npm install
```

## Setup

1. Follow the instructions listed in the [SETUP.md](SETUP.md) file

## Run

1. To start the server in development, run the following command:

```bash
$ npm run dev
```

## Deploying the App

1. For the first-time deployment, use this command to initialize Monday code:

```bash
$ npm run mapps:init
```

You will be prompted to insert your Monday access token. To get your token, go to Developer section > My access tokens.

2. Start deployment to monday-code using the following command [monday apps cli](https://github.com/mondaycom/monday-code-cli#mapps-codepush):

```bash
$ npm run deploy
```

    1. Choose your app that will be associated with the deployment.
    2. Choose the draft version to deploy.
    3. Optionally, you can run the following command to receive your server logs if you [are] using [Monday logger](https://github.com/mondaycom/monday-code-cli#mapps-codelogs) :

```bash
$ npm run logs
```

# Using Monday Apps CLI

To use [Monday apps-cli](https://github.com/mondaycom/monday-code-cli) globally, you can run the following command:

```bash
$ npm i -g @mondaycom/apps-cli
```
