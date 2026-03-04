Prerequisites
Before using this template, ensure you have the following installed and configured:

Required Software
Docker Desktop - Required for running the devcontainer

Download Docker Desktop
VS Code - Recommended IDE with devcontainer support

Download VS Code
Install the "Dev Containers" extension
Required Environment Variables
Set these in your local environment before opening the devcontainer.

Variable	Description
GITHUB_TOKEN	GitHub Personal Access Token with repo permissions. Branch protection recommended for production repositories.
TEAM_TFE_TOKEN	HCP Terraform Team Token - Must be a Team API Token (not user/org token) associated with a dedicated project for workspace management
Important: The TEAM_TFE_TOKEN must be a Team API Token, not a user or organization token. Create one in HCP Terraform under Settings > Teams > [Your Team] > Team API Token. The team should have access to a dedicated project where workspaces will be created.

HCP Terraform Setup (Pre-requisite)
Before using this template, you must configure HCP Terraform with an isolated environment for testing:

Create a Dedicated Project

Navigate to Projects in HCP Terraform
Create a new project (e.g., sandbox)
This isolates test workspaces from production infrastructure
Create a Dedicated Team

Go to Settings > Teams

Create a new team and assign it to the dedicated project

Configure Project Team Access with the following permissions:

Project Access:

Read - Baseline permission for reading the project record
Create Workspaces - Create workspaces in the project (grants read access on all workspaces)
Delete Workspaces - Delete workspaces in the project
Workspace Permissions:

Read Variables - Access existing variable values for validation
Read State - View Terraform state for existing resources
Write State - Update state during apply operations
Download Sentinel Mocks - Download Sentinel mock data for policy testing
Manage Workspace Run Tasks - Assign and unassign run tasks on workspaces
Lock/Unlock Workspaces - Control workspace locking for safe operations
Generate Team API Token

In Settings > Teams > [Your Team]
Click "Create a team token"
Save this as your TEAM_TFE_TOKEN
Configure Credential Inheritance

Create a Variable Set with AWS credentials (see below)
Attach the Variable Set to your dedicated project
All workspaces created in the project will inherit credentials automatically
AWS Credentials
AWS credentials should not be set locally. Instead, they are inherited from an HCP Terraform Variable Set attached to your project or workspace.

Recommended approaches (in order of preference):

Dynamic Provider Credentials (Recommended) - Use OIDC federation between HCP Terraform and AWS for short-lived, automatically rotated credentials. See Dynamic Provider Credentials.

Variable Set with Environment Variables - Create a Variable Set in HCP Terraform containing:

AWS_ACCESS_KEY_ID (environment variable, sensitive)
AWS_SECRET_ACCESS_KEY (environment variable, sensitive)
AWS_REGION (environment variable)
Attach the Variable Set to your project so all workspaces inherit the credentials.

Note: Variable Sets can be configured at Settings > Variable Sets in HCP Terraform. Attach them to projects for automatic inheritance by all workspaces in that project.

For Bash - Add to ~/.bashrc or ~/.bash_profile:

# GitHub Personal Access Token with repo permissions
export GITHUB_TOKEN="ghp_your_token_here"

# HCP Terraform Team Token - MUST be a Team Token with a dedicated project
# Create at: HCP Terraform > Settings > Teams > [Your Team] > Team API Token
export TEAM_TFE_TOKEN="your_terraform_team_token_here"
For Zsh - Add to ~/.zshrc:

# GitHub Personal Access Token with repo permissions
export GITHUB_TOKEN="ghp_your_token_here"

# HCP Terraform Team Token - MUST be a Team Token with a dedicated project
# Create at: HCP Terraform > Settings > Teams > [Your Team] > Team API Token
export TEAM_TFE_TOKEN="your_terraform_team_token_here"
After adding, reload your shell configuration:

# Bash
source ~/.bashrc

# Zsh
source ~/.zshrc
Getting Started
1. Create Repository from Template
Navigate to this repository on GitHub
Click "Use this template" button
Select "Create a new repository"
Name your repository and configure settings
Click "Create repository"
2. Clone and Open in VS Code
# Clone your new repository
git clone https://github.com/YOUR_ORG/your-new-repo.git

# Open in VS Code
code your-new-repo
3. Open in Devcontainer
When VS Code opens the repository, you should see a prompt:

"Folder contains a Dev Container configuration file. Reopen folder to develop in a container?"

Click "Reopen in Container" to launch the devcontainer with all tools pre-configured.

If the prompt doesn't appear, use the Command Palette (Cmd+Shift+P / Ctrl+Shift+P) and select:

"Dev Containers: Reopen in Container"