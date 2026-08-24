OrangeHRM Admin User Management - Playwright E2E Automation

Automated End-to-End (E2E) test suite for the OrangeHRM Admin User Management module, built using Playwright and JavaScript following the Page Object Model (POM) pattern.

Prerequisites and Tech Stack:

This project requires Node.js (version 16 or higher) installed on your system. The automation framework is built with Playwright (^1.40.0) using JavaScript and structured around the Page Object Model for maintainability.

Project Setup Steps
1. Clone the repository:
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git

2. Navigate to the project directory:
cd YOUR_REPO_NAME

3. Install all npm dependencies:
npm install

4. Install the Playwright browser binaries:
npx playwright install

How to Run the Test Cases
Run all E2E test cases in headless mode:
npx playwright test

Run tests in headed mode with visible browser execution:
npx playwright test --headed

Run tests in interactive UI mode:
npx playwright test --ui

Run only the user management test file:
npx playwright test tests/userManagement.spec.js

View the generated HTML execution report:
npx playwright show-report

Test Scenarios Covered
The test suite validates 8 end-to-end scenarios sequentially:

TC_UM_01: Verify Admin can log in with valid credentials.

TC_UM_02: Navigate to Admin module and view System Users.

TC_UM_03: Add a new user with valid details.

TC_UM_04: Search for the newly created user.

TC_UM_05: Edit the created user details.

TC_UM_06: Validate updated user details and confirm the old username no longer exists.

TC_UM_07: Delete the edited user.

TC_UM_08: Verify the deleted user is no longer found in search results.