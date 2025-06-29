#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class GlobalSetup {
  constructor() {
    this.projectPath = this.findProjectRoot(__dirname);
    this.packageJsonPath = join(this.projectPath, 'package.json');
  }

  // Find the project root (handles both dev and npm package scenarios)
  findProjectRoot(startDir) {
    let currentDir = startDir;
    
    // Go up one level from scripts/ directory
    const parentDir = dirname(currentDir);
    
    // Check if we're in the MCP package directory
    if (existsSync(join(parentDir, 'package.json')) && 
        existsSync(join(parentDir, 'src'))) {
      return parentDir;
    }
    
    // If not found, assume we're in development mode
    return parentDir;
  }

  // Display help information
  displayHelp() {
    console.log(`
🚀 ArchiveNET MCP Global Setup Tool

Usage: node scripts/setup-global.js [options]

Commands:
  install     Install ArchiveNET MCP globally as 'archivenet-mcp'
  uninstall   Remove global ArchiveNET MCP installation
  link        Create development link (for local development)
  unlink      Remove development link
  status      Check global installation status

Options:
  --help, -h  Show this help message

Examples:
  node scripts/setup-global.js install    # Install globally
  node scripts/setup-global.js status     # Check installation status
  node scripts/setup-global.js uninstall  # Remove global installation

Global Commands Available After Installation:
  archivenet-mcp          # Run the MCP server
  archivenet-setup-mcp    # Setup MCP for Claude/Cursor
  archivenet-edit-env     # Configure environment variables

Note: This script requires npm to be installed and accessible.
`);
  }

  // Check if the package is built
  checkBuild() {
    const distPath = join(this.projectPath, 'dist');
    if (!existsSync(distPath)) {
      console.log('📦 Building package...');
      try {
        execSync('npm run build', { 
          cwd: this.projectPath, 
          stdio: 'inherit' 
        });
        console.log('✅ Package built successfully');
      } catch (error) {
        console.error('❌ Failed to build package:', error.message);
        throw new Error('Build failed. Please fix build errors and try again.');
      }
    } else {
      console.log('✅ Package already built');
    }
  }

  // Install globally
  async install() {
    try {
      console.log('🔧 Installing ArchiveNET MCP globally...');
      
      // Ensure package is built
      this.checkBuild();
      
      // Install globally using npm pack and install
      console.log('📦 Packing package...');
      const packResult = execSync('npm pack', { 
        cwd: this.projectPath, 
        encoding: 'utf8' 
      });
      
      const tarballName = packResult.trim();
      const tarballPath = join(this.projectPath, tarballName);
      
      console.log('🌐 Installing globally...');
      execSync(`npm install -g "${tarballPath}"`, { 
        stdio: 'inherit' 
      });
      
      // Clean up the tarball
      execSync(`rm "${tarballPath}"`, { 
        cwd: this.projectPath 
      });
      
      console.log('✅ ArchiveNET MCP installed globally successfully!');
      console.log('\n📋 Available global commands:');
      console.log('  archivenet-mcp          # Run the MCP server');
      console.log('  archivenet-setup-mcp    # Setup MCP for Claude/Cursor');
      console.log('  archivenet-edit-env     # Configure environment variables');
      
      console.log('\n🧪 Test the installation:');
      console.log('  archivenet-mcp --help');
      console.log('  archivenet-setup-mcp --help');
      
    } catch (error) {
      console.error('❌ Failed to install globally:', error.message);
      throw error;
    }
  }

  // Uninstall globally
  async uninstall() {
    try {
      console.log('🗑️  Uninstalling ArchiveNET MCP globally...');
      
      // Get package name from package.json
      const packageJson = JSON.parse(
        execSync('cat package.json', { 
          cwd: this.projectPath, 
          encoding: 'utf8' 
        })
      );
      
      const packageName = packageJson.name;
      
      execSync(`npm uninstall -g "${packageName}"`, { 
        stdio: 'inherit' 
      });
      
      console.log('✅ ArchiveNET MCP uninstalled globally successfully!');
      
    } catch (error) {
      console.error('❌ Failed to uninstall globally:', error.message);
      throw error;
    }
  }

  // Create development link
  async link() {
    try {
      console.log('🔗 Creating development link...');
      
      // Ensure package is built
      this.checkBuild();
      
      execSync('npm link', { 
        cwd: this.projectPath, 
        stdio: 'inherit' 
      });
      
      console.log('✅ Development link created successfully!');
      console.log('\n📋 Available global commands (development):');
      console.log('  archivenet-mcp          # Run the MCP server');
      console.log('  archivenet-setup-mcp    # Setup MCP for Claude/Cursor');
      console.log('  archivenet-edit-env     # Configure environment variables');
      
    } catch (error) {
      console.error('❌ Failed to create development link:', error.message);
      throw error;
    }
  }

  // Remove development link
  async unlink() {
    try {
      console.log('🔗 Removing development link...');
      
      execSync('npm unlink', { 
        cwd: this.projectPath, 
        stdio: 'inherit' 
      });
      
      console.log('✅ Development link removed successfully!');
      
    } catch (error) {
      console.error('❌ Failed to remove development link:', error.message);
      throw error;
    }
  }

  // Check installation status
  async status() {
    try {
      console.log('📊 Checking ArchiveNET MCP installation status...');
      
      // Check if commands are available globally
      const commands = [
        'archivenet-mcp',
        'archivenet-setup-mcp', 
        'archivenet-edit-env'
      ];
      
      console.log('\n🔍 Global Command Status:');
      
      for (const command of commands) {
        try {
          execSync(`which ${command}`, { stdio: 'pipe' });
          console.log(`  ✅ ${command} - Available`);
        } catch {
          console.log(`  ❌ ${command} - Not found`);
        }
      }
      
      // Check npm global packages
      console.log('\n📦 NPM Global Package Status:');
      try {
        const globalPackages = execSync('npm list -g --depth=0', { 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        if (globalPackages.includes('@s9swata/archivenet-mcp') || 
            globalPackages.includes('archivenet-mcp')) {
          console.log('  ✅ ArchiveNET MCP is installed globally');
        } else {
          console.log('  ❌ ArchiveNET MCP is not installed globally');
        }
      } catch (error) {
        console.log('  ⚠️  Could not check global packages');
      }
      
      // Check local build status
      console.log('\n🏗️  Local Build Status:');
      const distPath = join(this.projectPath, 'dist');
      if (existsSync(distPath)) {
        console.log('  ✅ Package is built (dist/ exists)');
      } else {
        console.log('  ❌ Package is not built (run npm run build)');
      }
      
    } catch (error) {
      console.error('❌ Failed to check status:', error.message);
      throw error;
    }
  }

  // Main execution
  async run() {
    const args = process.argv.slice(2);
    const command = args[0];
    const help = args.includes('--help') || args.includes('-h');

    if (help || !command) {
      this.displayHelp();
      return;
    }

    try {
      switch (command) {
        case 'install':
          await this.install();
          break;
        case 'uninstall':
          await this.uninstall();
          break;
        case 'link':
          await this.link();
          break;
        case 'unlink':
          await this.unlink();
          break;
        case 'status':
          await this.status();
          break;
        default:
          console.error(`❌ Unknown command: ${command}`);
          console.log('Use --help to see available commands');
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new GlobalSetup();
  setup.run();
}

export default GlobalSetup;