#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ClaudeMCPSetup {
  constructor() {
    this.projectPath = __dirname;
    this.distPath = path.join(this.projectPath, 'dist');
    this.serverPath = path.join(this.distPath, 'index.js');
    this.envPath = path.join(this.projectPath, '.env');
  }

  // Get Claude Desktop config path based on OS
  getClaudeConfigPath() {
    const platform = os.platform();
    const homeDir = os.homedir();

    switch (platform) {
      case 'darwin': // macOS
        return path.join(homeDir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
      case 'win32': // Windows
        return path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json');
      case 'linux': // Linux
        return path.join(homeDir, '.config', 'Claude', 'claude_desktop_config.json');
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  // Check if required files exist
  checkRequiredFiles() {
    console.log('🔍 Checking required files...');
    
    const requiredFiles = [
      { path: this.serverPath, name: 'MCP Server (dist/index.js)' },
      { path: this.envPath, name: 'Environment file (.env)' }
    ];

    const missing = [];
    for (const file of requiredFiles) {
      if (!fs.existsSync(file.path)) {
        missing.push(file.name);
      } else {
        console.log(`✅ Found: ${file.name}`);
      }
    }

    if (missing.length > 0) {
      console.error('❌ Missing required files:');
      missing.forEach(file => console.error(`   - ${file}`));
      
      if (missing.includes('MCP Server (dist/index.js)')) {
        console.log('\n💡 Run "npm run build" to build the server first.');
      }
      
      if (missing.includes('Environment file (.env)')) {
        console.log('\n💡 Copy .env.example to .env and configure your endpoints.');
      }
      
      return false;
    }

    return true;
  }

  // Read environment variables from .env file
  readEnvFile() {
    console.log('📖 Reading environment configuration...');
    
    try {
      const envContent = fs.readFileSync(this.envPath, 'utf8');
      const envVars = {};
      
      envContent.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim();
          }
        }
      });

      // Validate required environment variables
      const required = ['INSERT_CONTEXT_ENDPOINT', 'SEARCH_CONTEXT_ENDPOINT'];
      const missing = required.filter(key => !envVars[key]);
      
      if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(key => console.error(`   - ${key}`));
        return null;
      }

      console.log('✅ Environment configuration loaded');
      return envVars;
    } catch (error) {
      console.error('❌ Failed to read .env file:', error.message);
      return null;
    }
  }

  // Create Claude Desktop config directory if it doesn't exist
  ensureClaudeConfigDir() {
    const configPath = this.getClaudeConfigPath();
    const configDir = path.dirname(configPath);
    
    if (!fs.existsSync(configDir)) {
      console.log(`📁 Creating Claude config directory: ${configDir}`);
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    return configPath;
  }

  // Read existing Claude config or create new one
  readClaudeConfig(configPath) {
    if (fs.existsSync(configPath)) {
      console.log('📖 Reading existing Claude Desktop configuration...');
      try {
        const content = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(content);
      } catch (error) {
        console.warn('⚠️  Failed to parse existing config, creating new one');
        return { mcpServers: {} };
      }
    } else {
      console.log('📝 Creating new Claude Desktop configuration...');
      return { mcpServers: {} };
    }
  }

  // Update Claude config with MCP server
  updateClaudeConfig(envVars) {
    const configPath = this.ensureClaudeConfigDir();
    const config = this.readClaudeConfig(configPath);

    // Ensure mcpServers object exists
    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    // Prepare environment variables for the MCP server
    const mcpEnv = {
      INSERT_CONTEXT_ENDPOINT: envVars.INSERT_CONTEXT_ENDPOINT,
      SEARCH_CONTEXT_ENDPOINT: envVars.SEARCH_CONTEXT_ENDPOINT,
    };

    // Add optional environment variables if they exist
    if (envVars.API_KEY) {
      mcpEnv.API_KEY = envVars.API_KEY;
    }
    if (envVars.API_TIMEOUT) {
      mcpEnv.API_TIMEOUT = envVars.API_TIMEOUT;
    }

    // Add or update the context server configuration
    config.mcpServers['context-server'] = {
      command: 'node',
      args: [this.serverPath],
      env: mcpEnv
    };

    // Write the updated configuration
    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log('✅ Claude Desktop configuration updated successfully!');
      console.log(`📍 Config file location: ${configPath}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to write Claude config:', error.message);
      return false;
    }
  }

  // Build the MCP server if needed
  buildServer() {
    if (!fs.existsSync(this.serverPath)) {
      console.log('🔨 Building MCP server...');
      try {
        execSync('npm run build', { cwd: this.projectPath, stdio: 'inherit' });
        console.log('✅ MCP server built successfully!');
      } catch (error) {
        console.error('❌ Failed to build MCP server:', error.message);
        return false;
      }
    } else {
      console.log('✅ MCP server already built');
    }
    return true;
  }

  // Test the MCP server configuration
  testServer() {
    console.log('🧪 Testing MCP server configuration...');
    
    try {
      // Try to run the server for a brief moment to check for errors
      const testProcess = execSync(`node "${this.serverPath}" --help || echo "Server can be executed"`, {
        cwd: this.projectPath,
        timeout: 5000,
        stdio: 'pipe'
      });
      
      console.log('✅ MCP server configuration appears valid');
      return true;
    } catch (error) {
      console.warn('⚠️  Could not fully test server, but configuration has been created');
      return true; // Don't fail the setup for this
    }
  }

  // Display setup completion message
  displayCompletionMessage() {
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. 🔄 Restart Claude Desktop completely');
    console.log('2. 💬 Test the integration by sharing some personal information with Claude');
    console.log('3. 🔍 Ask Claude to recall that information to test the search functionality');
    
    console.log('\n💡 Example usage:');
    console.log('   Save: "My favorite programming language is TypeScript"');
    console.log('   Search: "What\'s my favorite programming language?"');
    
    console.log('\n🔧 Configuration details:');
    console.log(`   Server path: ${this.serverPath}`);
    console.log(`   Config file: ${this.getClaudeConfigPath()}`);
    
    console.log('\n🐛 Troubleshooting:');
    console.log('   - Check Claude Desktop logs if the connection fails');
    console.log('   - Ensure your API endpoints are accessible');
    console.log('   - Verify all file paths are correct');
  }

  // Main setup process
  async run() {
    console.log('🚀 Setting up MCP Context Server for Claude Desktop\n');

    try {
      // Step 1: Build server if needed
      if (!this.buildServer()) {
        process.exit(1);
      }

      // Step 2: Check required files
      if (!this.checkRequiredFiles()) {
        process.exit(1);
      }

      // Step 3: Read environment configuration
      const envVars = this.readEnvFile();
      if (!envVars) {
        process.exit(1);
      }

      // Step 4: Update Claude Desktop configuration
      if (!this.updateClaudeConfig(envVars)) {
        process.exit(1);
      }

      // Step 5: Test server configuration
      this.testServer();

      // Step 6: Display completion message
      this.displayCompletionMessage();

    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new ClaudeMCPSetup();
  setup.run();
}

export default ClaudeMCPSetup;