const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { UserManagementPage } = require('../pages/UserManagementPage');
const { generateUniqueUsername, config } = require('../utils/testData');

test.describe.serial('OrangeHRM - Admin User Management E2E', () => {
  let page;
  let userManagementPage;
  let originalUsername;
  let editedUsername;

  // Single browser context share garera 1-time login matra garne
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    
    const loginPage = new LoginPage(page);
    userManagementPage = new UserManagementPage(page);

    await loginPage.goto();
    await loginPage.login(
      config.adminCredentials.username,
      config.adminCredentials.password
    );
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('TC_UM_01 Verify Admin can log in with valid credentials', async () => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible({ timeout: 15000 });
  });

  test('TC_UM_02 Navigate to Admin and view System Users', async () => {
    await userManagementPage.navigateToAdmin();
    await expect(page).toHaveURL(/viewSystemUsers/, { timeout: 15000 });
  });

  test('TC_UM_03 Add a new user with valid details', async () => {
    await userManagementPage.navigateToAdmin();
    originalUsername = generateUniqueUsername('qaTrainee');

    await userManagementPage.clickAdd();
    await userManagementPage.fillUserForm({
      userRole: config.newUser.userRole,
      employeeName: config.newUser.employeeName,
      status: config.newUser.status,
      username: originalUsername,
      password: config.newUser.password,
      confirmPassword: config.newUser.password,
    });

    await userManagementPage.saveUser();
    await userManagementPage.verifySuccessToast('Successfully Saved');
  });

  test('TC_UM_04 Search for newly created user', async () => {
    test.skip(!originalUsername, 'User was not created in TC_UM_03');

    await userManagementPage.navigateToAdmin();
    await userManagementPage.searchByUsername(originalUsername);

    await expect(userManagementPage.getRowByUsername(originalUsername)).toBeVisible({ timeout: 15000 });
    expect(await userManagementPage.getResultRowCount()).toBe(1);
  });

  test('TC_UM_05 Edit the created user details', async () => {
    test.skip(!originalUsername, 'User was not created in TC_UM_03');

    await userManagementPage.navigateToAdmin();
    await userManagementPage.searchByUsername(originalUsername);
    await userManagementPage.editUser(originalUsername);

    editedUsername = generateUniqueUsername('qaTraineeEdited');

    await userManagementPage.fillUserForm({
      userRole: config.editedUser.userRole,
      status: config.editedUser.status,
      username: editedUsername,
    });

    await userManagementPage.saveUser();
    await userManagementPage.verifySuccessToast('Successfully Updated');
  });

  test('TC_UM_06 Validate updated user details', async () => {
    test.skip(!editedUsername, 'User was not edited in TC_UM_05');

    await userManagementPage.navigateToAdmin();
    await userManagementPage.searchByUsername(editedUsername);
    
    const details = await userManagementPage.getRowDetails(editedUsername);
    expect(details).toContain(config.editedUser.userRole);
    expect(details).toContain(config.editedUser.status);

    await userManagementPage.resetSearch();
    await userManagementPage.searchByUsername(originalUsername);

    expect(await userManagementPage.isUserPresent(originalUsername)).toBeFalsy();
    await expect(userManagementPage.noRecordsMessage).toBeVisible();
  });

  test('TC_UM_07 Delete the edited user', async () => {
    test.skip(!editedUsername, 'User was not edited in TC_UM_05');

    await userManagementPage.navigateToAdmin();
    await userManagementPage.searchByUsername(editedUsername);
    await userManagementPage.deleteUser(editedUsername);

    await userManagementPage.verifySuccessToast('Successfully Deleted');
  });

  test('TC_UM_08 Verify deleted user is no longer found in search', async () => {
    test.skip(!editedUsername, 'User was not edited in TC_UM_05');

    await userManagementPage.navigateToAdmin();
    await userManagementPage.searchByUsername(editedUsername);

    expect(await userManagementPage.isUserPresent(editedUsername)).toBeFalsy();
    await expect(userManagementPage.noRecordsMessage).toBeVisible();
  });
});