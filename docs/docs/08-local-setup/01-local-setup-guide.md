---
sidebar_position: 1
custom_edit_url: null
---

# Local Setup Guide for SeedSafe Application

## Introduction

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This guide provides the necessary steps to run the SeedSafe application locally, focusing on the front-end setup. SeedSafe is a blockchain-based solution, but all required smart contracts have already been deployed. This means you won't need to set up or run a local blockchain node — the front-end is ready to interact with the contracts via the Remix IDE.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Below, you'll find an overview of the project's folder structure, the prerequisites for local development, and a step-by-step walkthrough to get the interface running on your machine.

## Project Structure

- `/src` - Folder where we put our source code  
    - `/front-end` - Folder with our front-end source code  
    - `/contracts` - Folder with already deployed smart contracts, included in the repository for reference only  
- `/docs` - Complete documentation (using Docusaurus)

## Pre-requisites

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Google Gemini API key

## Step-by-Step Guide for Local Execution

### 1. Clone the repository

```bash
git clone https://github.com/MiguelClaret/SeedSafe
cd seedsafe
cd src
cd front-end
```

### 2. Set up the Gemini API key

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You can obtain a Gemini API key by visiting the following link:
[https://ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;After obtaining your key, create a `.env` file in the front-end folder and add:

```
REACT_APP_GEMINI_API_KEY=<your key here>
```

### 3. Install dependencies

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Using npm:
```bash
npm install
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Or using Yarn:
```bash
yarn install
```

### 4. Start the application in development mode

```bash
npm start
```

Or using Yarn:
```bash
yarn start
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The application will be available at [http://localhost:3000](http://localhost:3000).


## Additional Documentation

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For more detailed information about the smart contracts and functionalities, check our complete documentation at the following [link](https://miguelclaret.github.io/SeedSafe/). Additionally, you can also run our documentation locally as follows:

```bash
# To run the documentation locally
cd docs
npm install
npm start
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The documentation will be available at [http://localhost:3000](http://localhost:3000).