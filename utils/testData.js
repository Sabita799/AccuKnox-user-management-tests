module.exports = {
  config: {
    adminCredentials: {
      username: 'Admin',
      password: 'admin123',
    },
    newUser: {
      userRole: 'Admin',
      employeeName: 'Peter Mac Anderson',
      status: 'Enabled',
      password: 'Password@1234',
    },
    editedUser: {
      userRole: 'ESS',
      status: 'Disabled',
    },
  },
  // Timestamp unique username for valid length
  generateUniqueUsername: (prefix) => `user_${Date.now().toString().slice(-6)}`,
};