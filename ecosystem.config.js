// ============================================
// PM2 Ecosystem Configuration
// Fashion E-Commerce Store
// ============================================

module.exports = {
  apps: [
    {
      name: 'fashion-store',
      script: './dist/server/node-build.mjs',
      instances: 'max',
      exec_mode: 'cluster',
      node_args: '--max_old_space_size=512',
      
      // Environment Variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // File Watching & Restart
      watch: false,
      ignore_watch: ['node_modules', 'dist', 'logs'],
      watch_delay: 1000,

      // Auto Restart Config
      error_file: '/app/logs/error.log',
      out_file: '/app/logs/out.log',
      log_file: '/app/logs/combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Crash & Restart
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      kill_timeout: 5000,
      listen_timeout: 10000,

      // Graceful Shutdown
      shutdown_delay: 5000,
      wait_ready: true,
      
      // Advanced Features
      merge_logs: true,
      autorestart: true,
      vizion: true,
      
      // Health Check
      cron_restart: '0 3 * * *', // Daily restart at 3 AM for stability
      
      // Process Events
      events: {
        restart: 'restart',
        reload: 'reload',
        stop: 'stop',
        exit: 'exit',
        'restart overlimit': 'overlimit'
      }
    }
  ],

  // Deployment Configuration
  deploy: {
    production: {
      user: 'appuser',
      host: 'yourdomain.com',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/fashion-store.git',
      path: '/app/src',
      
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      
      'pre-deploy-local': 'echo "Deploying to production"',
      
      env: {
        NODE_ENV: 'production'
      }
    },
    
    staging: {
      user: 'appuser',
      host: 'staging.yourdomain.com',
      ref: 'origin/develop',
      repo: 'https://github.com/yourusername/fashion-store.git',
      path: '/app/src',
      
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      
      env: {
        NODE_ENV: 'staging'
      }
    }
  },

  // Monitoring Configuration
  ignore_signals: ['SIGTERM'],
  error_handler: 'logs/error.log',
  
  // Instance Configuration
  cluster_mode: true,
  
  // Monitoring URLs (for PM2 Plus - optional)
  pmx: true,
  instance_var: 'INSTANCE_ID'
};
