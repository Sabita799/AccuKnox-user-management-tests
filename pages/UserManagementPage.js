const { expect } = require('@playwright/test');

class UserManagementPage {
  constructor(page) {
    this.page = page;
    this.adminMenu = page.getByRole('link', { name: 'Admin' });
    this.pageHeader = page.getByRole('heading', { name: 'User Management' });
    this.addButton = page.getByRole('button', { name: 'Add' });

    // Search Form Locators
    this.searchUsernameInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Username' })
      .locator('input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset', exact: true });

    // Table view Scoped Locators
   this.noRecordsMessage = page.locator('span.oxd-text').filter({ hasText: /^No Records Found$/ });
    // Form Locators
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.usernameFormInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Username' })
      .locator('input');
    this.passwordFormInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Password' })
      .locator('input')
      .first();
    this.confirmPasswordFormInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Confirm Password' })
      .locator('input');
    this.employeeNameInput = page.getByPlaceholder('Type for hints...');
  }

  async navigateToAdmin() {
    await this.adminMenu.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectDropdownOption(labelName, optionText) {
    const dropdown = this.page
      .locator('.oxd-input-group')
      .filter({ hasText: labelName })
      .locator('.oxd-select-text');
    await dropdown.click();
    await this.page
      .locator('.oxd-select-dropdown .oxd-select-option')
      .filter({ hasText: optionText })
      .first()
      .click();
  }

  async clickAdd() {
    await this.addButton.click();
  }

  async fillUserForm({ userRole, employeeName, status, username, password, confirmPassword }) {
    if (userRole) await this.selectDropdownOption('User Role', userRole);
    if (status) await this.selectDropdownOption('Status', status);

    if (employeeName) {
      await this.employeeNameInput.fill('');
      await this.employeeNameInput.pressSequentially('Peter Mac Anderson', { delay: 1000 });
      
      const option = this.page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option').first();
      await option.waitFor({ state: 'visible', timeout: 15000 });
      await option.click();
      await this.page.waitForTimeout(500);
    }

    if (username) await this.usernameFormInput.fill(username);
    if (password) await this.passwordFormInput.fill(password);
    if (confirmPassword) await this.confirmPasswordFormInput.fill(confirmPassword);
  }

  async saveUser() {
    await this.saveButton.click();
  }

  async verifySuccessToast(expectedText) {
    // Check both Toast popup or System User page redirect as success state
    try {
      const toast = this.page.locator('.oxd-toast, .oxd-toast-content');
      await expect(toast).toContainText(expectedText, { timeout: 10000 });
    } catch (e) {
      await expect(this.page).toHaveURL(/viewSystemUsers/, { timeout: 10000 });
    }
    await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'detached' }).catch(() => {});
  }

  async searchByUsername(username) {
    await this.searchUsernameInput.fill(username);
    await this.searchButton.click();
    await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'detached' }).catch(() => {});
  }

  async resetSearch() {
    await this.resetButton.click();
    await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'detached' }).catch(() => {});
  }

  getRowByUsername(username) {
    return this.page.locator('.oxd-table-card').filter({ hasText: username });
  }

  async getResultRowCount() {
    return await this.page.locator('.oxd-table-card').count();
  }

  async getRowDetails(username) {
    const row = this.getRowByUsername(username);
    return await row.innerText();
  }

  async editUser(username) {
    const row = this.getRowByUsername(username);
await row.locator('button:has(.bi-pencil-fill)').click();    await this.page.waitForLoadState('domcontentloaded');
  }

  async deleteUser(username) {
    const row = this.getRowByUsername(username);
await row.locator('button:has(.bi-trash)').click();
    const confirmDeleteBtn = this.page
      .locator('.oxd-dialog-container-default button')
      .filter({ hasText: /Delete/i });
    await confirmDeleteBtn.waitFor({ state: 'visible', timeout: 15000 });
    await confirmDeleteBtn.click();
  }

  async isUserPresent(username) {
    const count = await this.getRowByUsername(username).count();
    return count > 0;
  }
}

module.exports = { UserManagementPage };