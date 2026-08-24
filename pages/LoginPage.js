class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    // domcontentloaded use garda full network loading nabasi text boxes dekhenebittikai move-on hunchha
    await this.page.goto('/web/index.php/auth/login', { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });
    // Form visible bhae-nabhaeko confirm garcha
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };