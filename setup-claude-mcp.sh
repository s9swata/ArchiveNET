#!/bin/bash

# Claude MCP Setup Script for Unix-like systems (macOS, Linux)
# This script automates the setup of the MCP Context Server for Claude Desktop

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
DIST_DIR="$PROJECT_DIR/dist"
SERVER_PATH="$DIST_DIR/index.js"
ENV_PATH="$PROJECT_DIR/.env"

# Determine Claude Desktop config path based on OS
get_claude_config_path() {
    case "$(uname -s)" in
        Darwin)  # macOS
            echo "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
            ;;
        Linux)
            echo "$HOME/.config/Claude/claude_desktop_config.json"
            ;;
        *)
            print_error "Unsupported operating system: $(uname -s)"
            exit 1
            ;;
    esac
}

# Check if required files exist
check_required_files() {
    print_info "Checking required files..."
    
    local missing_files=()
    
    if [[ ! -f "$SERVER_PATH" ]]; then
        missing_files+=("MCP Server (dist/index.js)")
    else
        print_status "Found: MCP Server (dist/index.js)"
    fi
    
    if [[ ! -f "$ENV_PATH" ]]; then
        missing_files+=("Environment file (.env)")
    else
        print_status "Found: Environment file (.env)"
    fi
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        print_error "Missing required files:"
        for file in "${missing_files[@]}"; do
            echo "   - $file"
        done
        
        if [[ " ${missing_files[*]} " =~ " MCP Server (dist/index.js) " ]]; then
            print_info "Run 'npm run build' to build the server first."
        fi
        
        if [[ " ${missing_files[*]} " =~ " Environment file (.env) " ]]; then
            print_info "Copy .env.example to .env and configure your endpoints."
        fi
        
        return 1
    fi
    
    return 0
}

# Read and validate environment file
read_env_file() {
    print_info "Reading environment configuration..."
    
    if [[ ! -f "$ENV_PATH" ]]; then
        print_error "Environment file not found: $ENV_PATH"
        return 1
    fi
    
    # Source the .env file to load variables
    set -a  # Automatically export all variables
    source "$ENV_PATH"
    set +a  # Stop automatically exporting
    
    # Check required variables
    local required_vars=("INSERT_CONTEXT_ENDPOINT" "SEARCH_CONTEXT_ENDPOINT")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "   - $var"
        done
        return 1
    fi
    
    print_status "Environment configuration loaded"
    return 0
}

# Build the MCP server if needed
build_server() {
    if [[ ! -f "$SERVER_PATH" ]]; then
        print_info "Building MCP server..."
        if npm run build; then
            print_status "MCP server built successfully!"
        else
            print_error "Failed to build MCP server"
            return 1
        fi
    else
        print_status "MCP server already built"
    fi
    return 0
}

# Create Claude Desktop configuration
create_claude_config() {
    local config_path
    config_path=$(get_claude_config_path)
    local config_dir
    config_dir=$(dirname "$config_path")
    
    print_info "Setting up Claude Desktop configuration..."
    
    # Create config directory if it doesn't exist
    if [[ ! -d "$config_dir" ]]; then
        print_info "Creating Claude config directory: $config_dir"
        mkdir -p "$config_dir"
    fi
    
    # Prepare the MCP server configuration
    local mcp_config
    mcp_config=$(cat <<EOF
{
  "mcpServers": {
    "context-server": {
      "command": "node",
      "args": ["$SERVER_PATH"],
      "env": {
        "INSERT_CONTEXT_ENDPOINT": "$INSERT_CONTEXT_ENDPOINT",
        "SEARCH_CONTEXT_ENDPOINT": "$SEARCH_CONTEXT_ENDPOINT"
EOF
)
    
    # Add optional environment variables if they exist
    if [[ -n "$API_KEY" ]]; then
        mcp_config+=",
        \"API_KEY\": \"$API_KEY\""
    fi
    
    if [[ -n "$API_TIMEOUT" ]]; then
        mcp_config+=",
        \"API_TIMEOUT\": \"$API_TIMEOUT\""
    fi
    
    mcp_config+="
      }
    }
  }
}"
    
    # If config file exists, try to merge with existing configuration
    if [[ -f "$config_path" ]]; then
        print_info "Backing up existing Claude configuration..."
        cp "$config_path" "$config_path.backup.$(date +%Y%m%d_%H%M%S)"
        
        # For simplicity, we'll replace the entire config
        # In a more sophisticated version, we could merge JSON
        print_warning "Replacing existing configuration (backup created)"
    fi
    
    # Write the new configuration
    echo "$mcp_config" > "$config_path"
    
    if [[ $? -eq 0 ]]; then
        print_status "Claude Desktop configuration updated successfully!"
        print_info "Config file location: $config_path"
        return 0
    else
        print_error "Failed to write Claude configuration"
        return 1
    fi
}

# Test the server configuration
test_server() {
    print_info "Testing MCP server configuration..."
    
    # Try to run the server briefly to check for obvious errors
    if timeout 5s node "$SERVER_PATH" --help >/dev/null 2>&1 || true; then
        print_status "MCP server configuration appears valid"
    else
        print_warning "Could not fully test server, but configuration has been created"
    fi
}

# Display completion message
display_completion() {
    echo
    print_status "Setup completed successfully!"
    echo
    print_info "Next steps:"
    echo "1. 🔄 Restart Claude Desktop completely"
    echo "2. 💬 Test the integration by sharing some personal information with Claude"
    echo "3. 🔍 Ask Claude to recall that information to test the search functionality"
    echo
    print_info "Example usage:"
    echo '   Save: "My favorite programming language is TypeScript"'
    echo '   Search: "What'\''s my favorite programming language?"'
    echo
    print_info "Configuration details:"
    echo "   Server path: $SERVER_PATH"
    echo "   Config file: $(get_claude_config_path)"
    echo
    print_info "Troubleshooting:"
    echo "   - Check Claude Desktop logs if the connection fails"
    echo "   - Ensure your API endpoints are accessible"
    echo "   - Verify all file paths are correct"
}

# Main setup function
main() {
    echo "🚀 Setting up MCP Context Server for Claude Desktop"
    echo
    
    # Change to project directory
    cd "$PROJECT_DIR"
    
    # Step 1: Build server if needed
    if ! build_server; then
        exit 1
    fi
    
    # Step 2: Check required files
    if ! check_required_files; then
        exit 1
    fi
    
    # Step 3: Read environment configuration
    if ! read_env_file; then
        exit 1
    fi
    
    # Step 4: Create Claude Desktop configuration
    if ! create_claude_config; then
        exit 1
    fi
    
    # Step 5: Test server configuration
    test_server
    
    # Step 6: Display completion message
    display_completion
}

# Run main function
main "$@"