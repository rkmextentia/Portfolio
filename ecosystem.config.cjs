module.exports = {
  apps: [
    {
      name: 'rkmidigi-admin-api',
      script: 'server/admin-api.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        ADMIN_API_PORT: 4322,
        ADMIN_SECRET_KEY: 'rkmidigi2026!'
      }
    }
  ]
};
