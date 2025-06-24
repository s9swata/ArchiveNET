@echo off
REM Claude MCP Setup Script for Windows
REM This script automates the setup of the MCP Context Server for Claude Desktop

setlocal enabledelayedexpansion

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR%"
set "DIST_DIR=%PROJECT_DIR%dist"
set "SERVER_PATH=%DIST_DIR%\index.js"
set "ENV_PATH=%PROJECT_DIR%.env"

REM Colors for output (Windows doesn't support colors in batch easily, so we'll use text)
set "SUCCESS_PREFIX=[SUCCESS]"
set "ERROR_PREFIX=[ERROR]"
set "WARNING_PREFIX=[WARNING]"
set "INFO_PREFIX=[INFO]"

echo 🚀 Setting up MCP Context Server for Claude Desktop
echo.

REM Function to get Claude Desktop config path
set "CLAUDE_CONFIG_PATH=%APPDATA%\Claude\claude_desktop_config.json"

REM Change to project directory
cd /d "%PROJECT_DIR%"

REM Step 1: Build server if needed
echo %INFO_PREFIX% Checking if MCP server needs to be built...
if not exist "%SERVER_PATH%" (
    echo %INFO_PREFIX% Building MCP server...
    call npm run build
    if errorlevel 1 (
        echo %ERROR_PREFIX% Failed to build MCP server
        pause
        exit /b 1
    )
    echo %SUCCESS_PREFIX% MCP server built successfully!
) else (
    echo %SUCCESS_PREFIX% MCP server already built
)

REM Step 2: Check required files
echo %INFO_PREFIX% Checking required files...
set "MISSING_FILES="

if not exist "%SERVER_PATH%" (
    set "MISSING_FILES=!MISSING_FILES! MCP_Server(dist/index.js)"
) else (
    echo %SUCCESS_PREFIX% Found: MCP Server ^(dist/index.js^)
)

if not exist "%ENV_PATH%" (
    set "MISSING_FILES=!MISSING_FILES! Environment_file(.env)"
) else (
    echo %SUCCESS_PREFIX% Found: Environment file ^(.env^)
)

if not "!MISSING_FILES!"=="" (
    echo %ERROR_PREFIX% Missing required files:
    echo    !MISSING_FILES!
    echo %INFO_PREFIX% Make sure to build the server and create .env file
    pause
    exit /b 1
)

REM Step 3: Read environment configuration
echo %INFO_PREFIX% Reading environment configuration...
if not exist "%ENV_PATH%" (
    echo %ERROR_PREFIX% Environment file not found: %ENV_PATH%
    pause
    exit /b 1
)

REM Parse .env file (simplified version)
set "INSERT_CONTEXT_ENDPOINT="
set "SEARCH_CONTEXT_ENDPOINT="
set "API_KEY="
set "API_TIMEOUT="

for /f "usebackq tokens=1,2 delims==" %%a in ("%ENV_PATH%") do (
    set "KEY=%%a"
    set "VALUE=%%b"
    REM Remove any leading/trailing spaces
    for /f "tokens=* delims= " %%i in ("!KEY!") do set "KEY=%%i"
    for /f "tokens=* delims= " %%i in ("!VALUE!") do set "VALUE=%%i"
    
    REM Skip comments and empty lines
    if not "!KEY:~0,1!"=="#" if not "!KEY!"=="" (
        if "!KEY!"=="INSERT_CONTEXT_ENDPOINT" set "INSERT_CONTEXT_ENDPOINT=!VALUE!"
        if "!KEY!"=="SEARCH_CONTEXT_ENDPOINT" set "SEARCH_CONTEXT_ENDPOINT=!VALUE!"
        if "!KEY!"=="API_KEY" set "API_KEY=!VALUE!"
        if "!KEY!"=="API_TIMEOUT" set "API_TIMEOUT=!VALUE!"
    )
)

REM Check required variables
if "!INSERT_CONTEXT_ENDPOINT!"=="" (
    echo %ERROR_PREFIX% Missing required environment variable: INSERT_CONTEXT_ENDPOINT
    pause
    exit /b 1
)

if "!SEARCH_CONTEXT_ENDPOINT!"=="" (
    echo %ERROR_PREFIX% Missing required environment variable: SEARCH_CONTEXT_ENDPOINT
    pause
    exit /b 1
)

echo %SUCCESS_PREFIX% Environment configuration loaded

REM Step 4: Create Claude Desktop configuration
echo %INFO_PREFIX% Setting up Claude Desktop configuration...

REM Create config directory if it doesn't exist
set "CONFIG_DIR=%APPDATA%\Claude"
if not exist "!CONFIG_DIR!" (
    echo %INFO_PREFIX% Creating Claude config directory: !CONFIG_DIR!
    mkdir "!CONFIG_DIR!"
)

REM Backup existing config if it exists
if exist "%CLAUDE_CONFIG_PATH%" (
    echo %INFO_PREFIX% Backing up existing Claude configuration...
    set "BACKUP_PATH=%CLAUDE_CONFIG_PATH%.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
    copy "%CLAUDE_CONFIG_PATH%" "!BACKUP_PATH!" >nul
    echo %WARNING_PREFIX% Replacing existing configuration ^(backup created^)
)

REM Create the configuration JSON
set "SERVER_PATH_JSON=%SERVER_PATH:\=\\%"
(
echo {
echo   "mcpServers": {
echo     "context-server": {
echo       "command": "node",
echo       "args": ["%SERVER_PATH_JSON%"],
echo       "env": {
echo         "INSERT_CONTEXT_ENDPOINT": "%INSERT_CONTEXT_ENDPOINT%",
echo         "SEARCH_CONTEXT_ENDPOINT": "%SEARCH_CONTEXT_ENDPOINT%"
if not "!API_KEY!"=="" echo         ,"API_KEY": "%API_KEY%"
if not "!API_TIMEOUT!"=="" echo         ,"API_TIMEOUT": "%API_TIMEOUT%"
echo       }
echo     }
echo   }
echo }
) > "%CLAUDE_CONFIG_PATH%"

if errorlevel 1 (
    echo %ERROR_PREFIX% Failed to write Claude configuration
    pause
    exit /b 1
) else (
    echo %SUCCESS_PREFIX% Claude Desktop configuration updated successfully!
    echo %INFO_PREFIX% Config file location: %CLAUDE_CONFIG_PATH%
)

REM Step 5: Test server configuration
echo %INFO_PREFIX% Testing MCP server configuration...
node "%SERVER_PATH%" --help >nul 2>&1
if errorlevel 1 (
    echo %WARNING_PREFIX% Could not fully test server, but configuration has been created
) else (
    echo %SUCCESS_PREFIX% MCP server configuration appears valid
)

REM Step 6: Display completion message
echo.
echo %SUCCESS_PREFIX% Setup completed successfully!
echo.
echo %INFO_PREFIX% Next steps:
echo 1. 🔄 Restart Claude Desktop completely
echo 2. 💬 Test the integration by sharing some personal information with Claude
echo 3. 🔍 Ask Claude to recall that information to test the search functionality
echo.
echo %INFO_PREFIX% Example usage:
echo    Save: "My favorite programming language is TypeScript"
echo    Search: "What's my favorite programming language?"
echo.
echo %INFO_PREFIX% Configuration details:
echo    Server path: %SERVER_PATH%
echo    Config file: %CLAUDE_CONFIG_PATH%
echo.
echo %INFO_PREFIX% Troubleshooting:
echo    - Check Claude Desktop logs if the connection fails
echo    - Ensure your API endpoints are accessible
echo    - Verify all file paths are correct
echo.

pause