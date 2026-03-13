# GitHub Copilot CLI — Tool Architecture Reference

**Source**: `@github/copilot@0.0.420` (`/opt/homebrew/lib/node_modules/@github/copilot/`)
**Reverse-engineered from**: minified `index.js` (production bundle)

---

## 1. Built-in Tools (Core)

These are the native tools compiled into the Copilot CLI binary. Tool names are **lowercase snake_case**.

### File Operations

| Tool Name | Description | Source Reference |
|-----------|-------------|------------------|
| `view` | "Tool for viewing files and directories." | `index.js` — grep `"Tool for viewing files"` |
| `edit` | "Tool for making string replacements in files." | `index.js` — grep `"Tool for making string replacements"` |
| `create` | "Tool for creating new files." | `index.js:958` — `{name:"create",description:[...]}` |
| `str_replace_editor` | "Editing tool for viewing, creating and editing files" — multi-command tool that combines view + create + str_replace into one. Used as an alternative to separate `view`/`edit`/`create` tools. | `index.js` — grep `str_replace_editor` |

### Search Tools

| Tool Name | Description | Config Override |
|-----------|-------------|-----------------|
| `grep` | "Fast and precise code search using ripgrep. Search for patterns in file contents." | `grepToolName` config — defaults to `"grep"`, can be overridden to `"rg"` |
| `glob` | "Fast file pattern matching using glob patterns. Find files by name patterns." | `globToolName` config — defaults to `"glob"` |

**Code proof** (from `index.js`):
```javascript
// Grep tool registration
return { name: t.grepToolName ?? "grep", description: "Fast and precise code search using ripgrep..." }

// Glob tool registration
return { name: t.globToolName ?? "glob", description: "Fast file pattern matching using glob patterns..." }

// Config with rg override
grepToolName: "rg"
```

### Shell Tools (Bash / PowerShell)

The shell system is a **family of 5 tools** instantiated from a shared class. Two shell types are defined:

```javascript
// From index.js — static constructors
static bash = new t("bash", "Bash", "bash", "read_bash", "write_bash", "stop_bash", "list_bash", [...])
static powershell = new t("powershell", "PowerShell", "powershell", "read_powershell", "write_powershell", "stop_powershell", "list_powershell", [...])
```

**Bash variant (default on macOS/Linux):**

| Tool Name | Purpose |
|-----------|---------|
| `bash` | Execute shell commands (sync or async mode) |
| `read_bash` | Read output from an async bash command |
| `write_bash` | Send input to an async bash command |
| `stop_bash` | Terminate a running async bash command |
| `list_bash` | List active bash shell sessions |

**PowerShell variant (Windows):**

| Tool Name | Purpose |
|-----------|---------|
| `powershell` | Execute PowerShell commands |
| `read_powershell` | Read output from async PowerShell command |
| `write_powershell` | Send input to async PowerShell command |
| `stop_powershell` | Terminate a running async PowerShell command |
| `list_powershell` | List active PowerShell sessions |

The `shellToolName` config key defaults to `"bash"` — confirmed by:
```javascript
shellToolName ?? "bash"
```

### Code Intelligence

| Tool Name | Description |
|-----------|-------------|
| `lsp` | "Language Server Protocol tool for code intelligence." — Operations include goto definition, find references, hover, diagnostics, workspace symbols. |

### Web Tools

| Tool Name | Description |
|-----------|-------------|
| `web_fetch` | "Fetch web content" |
| `web_search` | "Web search" |

### User Interaction

| Tool Name | Description |
|-----------|-------------|
| `ask_user` | Ask the user a clarifying question. Schema: `{ question: string }` |

### Agent/Workflow Orchestration

| Tool Name | Description |
|-----------|-------------|
| `task_complete` | Signal that the assigned task is fully complete. Triggers commit/PR flow in autopilot mode. |
| `exit_plan_mode` | Exit plan mode. Supports modes: `"exit_only"`, `"interactive"`, `"autopilot"`, `"autopilot_fleet"` |
| `report_progress` | Report progress with commit message and PR description. Schema: `{ commitMessage: string, prDescription: string }` |
| `report_intent` | Describe current intent/plan. Schema: `{ intent: string }`. Surfaces as "Thinking…" in the UI. |
| `update_todo` | Update the TODO checklist. Schema: `{ todos: string }` (markdown checklist) |
| `skill` | Invoke a named skill. Schema: `{ skill: string }` |

### Internal/Utility

| Tool Name | Description |
|-----------|-------------|
| `fetch_copilot_cli_documentation` | Fetches Copilot CLI's own documentation/capabilities for self-reference |
| `reindex` | Re-index the workspace for search |
| `search_code_subagent` | Internal tool — delegates code search to a subagent |
| `accept` | Accept a suggestion/change |
| `run_setup` | Run workspace setup |
| `sharp` | Image processing (via sharp library) |
| `git_apply_patch` | Apply a git patch |
| `apply_patch` | Apply a code patch |

---

## 2. Built-in Subagents

Defined in `/opt/homebrew/lib/node_modules/@github/copilot/definitions/`:

| Agent Name | Model | Tool Access | Description |
|------------|-------|-------------|-------------|
| `explore` | `claude-haiku-4.5` | `grep`, `glob`, `view`, `lsp`, github-mcp-server (read-only), bluebird (semantic search + code structure + git history) | Fast codebase exploration, <300 word answers |
| `task` | `claude-haiku-4.5` | `"*"` (all tools) | Execute dev commands (tests, builds, lints). Brief on success, verbose on failure. |
| `code-review` | `claude-sonnet-4.5` | `"*"` (all tools, read-only usage) | High signal-to-noise code review. Only surfaces bugs, security issues, logic errors. |
| `research` | `claude-sonnet-4.6` | github MCP (search/read), `web_fetch`, `web_search`, `task`, `grep`, `glob`, `view`, `create` | Deep research with citations, saves report to file |

### Subagent Names as Referenced in Code

```javascript
// From index.js — registered agent descriptions
{ name: "explore", description: "Fast agent specialized for exploring codebases..." }
{ name: "task", description: "Agent for executing commands with verbose output..." }
{ name: "general-purpose", description: "..." }  // Sonnet model, all tools
{ name: "code-review", description: "Reviews code changes with extremely high signal-to-noise ratio..." }
```

---

## 3. MCP Tool Naming Convention

MCP tools follow this pattern in Copilot CLI:

```
<server-name>/<tool-name>
```

**Examples from `explore.agent.yaml`:**
```yaml
# GitHub MCP server (full prefix)
- github-mcp-server/get_file_contents
- github-mcp-server/search_code

# Short prefix alias (research agent uses this)
- github/get_me          # maps to github-mcp-server/get_me
- github/search_code     # maps to github-mcp-server/search_code

# Bluebird semantic search
- bluebird/search_file_content
- bluebird/do_vector_search
- bluebird/get_source_code
```

### GitHub MCP Server Tools (built-in)

| Tool Name | Purpose |
|-----------|---------|
| `get_me` | Get current authenticated user context |
| `get_file_contents` | Read file from a GitHub repo |
| `get_commit` | Get commit details |
| `get_pull_request` | Get PR details |
| `get_pull_request_comments` | Get PR comments |
| `get_pull_request_files` | Get files changed in PR |
| `get_pull_request_reviews` | Get PR reviews |
| `get_pull_request_status` | Get PR check status |
| `get_tag` | Get tag details |
| `get_copilot_space` | Get Copilot Space details |
| `list_copilot_spaces` | List available Copilot Spaces |
| `list_branches` | List repo branches |
| `list_commits` | List commits |
| `list_issues` | List issues |
| `list_pull_requests` | List PRs |
| `list_tags` | List tags |
| `issue_read` | Read issue details |
| `search_code` | Search code on GitHub |
| `search_issues` | Search issues |
| `search_repositories` | Search repos |
| `search_users` | Search users |
| `search_pull_requests` | Search PRs |
| `pull_request_read` | Read full PR |

### Bluebird Tools (semantic code intelligence)

| Category | Tools |
|----------|-------|
| **Search** | `search_file_content`, `search_file_paths`, `get_file_content`, `get_file_chunk`, `do_fulltext_search`, `do_vector_search`, `do_hybrid_search` |
| **Code Structure** | `get_source_code`, `get_hierarchical_summary`, `get_class_or_struct_*` (nested/outer/parent/child types, functions, variables), `get_function_*` (parent classes, calling/called functions), `get_macro_*` |
| **Git History** | `retrieve_commits_by_description`, `retrieve_commits_by_time`, `retrieve_commits_by_author`, `retrieve_commits_by_ids`, `retrieve_commits_by_pr_id` |

### Playwright Browser Tools (built-in MCP)

| Tool Name | Description |
|-----------|-------------|
| `browser_navigate` | Navigate to URL |
| `browser_snapshot` | Accessibility snapshot (preferred over screenshot) |
| `browser_take_screenshot` | Screenshot current page |
| `browser_click` | Click element |
| `browser_type` | Type text into element |
| `browser_fill_form` | Fill multiple form fields |
| `browser_select_option` | Select dropdown option |
| `browser_hover` | Hover over element |
| `browser_press_key` | Press keyboard key |
| `browser_drag` | Drag element |
| `browser_handle_dialog` | Accept/dismiss dialog |
| `browser_evaluate` | Execute JavaScript |
| `browser_wait_for` | Wait for text/time |
| `browser_tabs` | List/create/close/select tabs |
| `browser_resize` | Resize window |
| `browser_network_requests` | List network requests |
| `browser_console_messages` | List console messages |
| `browser_navigate_back` | Go back |
| `browser_close` | Close browser |
| `browser_install` | Install Playwright |

### Azure Extension Tools (optional)

Found in `toolName:` registrations — these are Azure-specific MCP extensions:

`extension_az`, `extension_azd`, `extension_azqr`, `aks`, `appconfig`, `cosmos`, `keyvault`, `kusto`, `loadtesting`, `marketplace`, `monitor`, `postgres`, `redis`, `servicebus`, `sql`, `storage`, `subscription`, `workbooks`

### GitHub Actions Tools

`actions_get`, `actions_list`, `actions_run_trigger`, `get_workflow`, `get_workflow_run`, `get_workflow_run_logs`, `get_job_logs`, `list_workflows`, `list_workflow_runs`, `list_workflow_run_artifacts`, `list_workflow_jobs`, `summarize_job_log_failures`

### Security Tools

`get_code_scanning_alert`, `list_code_scanning_alerts`, `get_secret_scanning_alert`, `list_secret_scanning_alerts`

---

## 4. Copilot CLI vs Claude Code — Tool Name Mapping

| Concept | Copilot CLI | Claude Code |
|---------|-------------|-------------|
| Read file | `view` | `Read` |
| Edit file | `edit` / `str_replace_editor` | `Edit` |
| Create file | `create` | `Write` |
| Run shell command | `bash` | `Bash` |
| Read async shell output | `read_bash` | *(not applicable — Bash is sync)* |
| Write to async shell | `write_bash` | *(not applicable)* |
| Stop async shell | `stop_bash` | *(not applicable)* |
| Search file contents | `grep` | `Grep` |
| Search file names | `glob` | `Glob` |
| Code intelligence | `lsp` | `LSP` |
| Fetch URL | `web_fetch` | `WebFetch` |
| Web search | `web_search` | `WebSearch` |
| Ask user | `ask_user` | `AskUserQuestion` |
| Invoke skill | `skill` | `Skill` |
| Launch subagent | `explore` / `task` / `code-review` | `Agent` (with `subagent_type`) |
| Signal completion | `task_complete` | *(no equivalent — implicit)* |
| Plan mode | `exit_plan_mode` | `ExitPlanMode` |
| Track progress | `update_todo` | `TaskCreate` / `TaskUpdate` |
| Report intent | `report_intent` | *(no equivalent)* |
| Commit/PR progress | `report_progress` | *(no equivalent — uses git directly)* |
| Apply git patch | `git_apply_patch` | *(no equivalent — uses Edit)* |
| Self-documentation | `fetch_copilot_cli_documentation` | *(no equivalent)* |

### Key Differences

1. **Case**: Copilot uses `snake_case` (`bash`, `grep`). Claude Code uses `PascalCase` (`Bash`, `Grep`).
2. **Async shell**: Copilot has a 5-tool shell family (`bash`, `read_bash`, `write_bash`, `stop_bash`, `list_bash`). Claude Code has a single `Bash` tool with `run_in_background` flag.
3. **File ops split**: Copilot separates `view` (read) / `edit` (modify) / `create` (new). Also has `str_replace_editor` as a combined alternative. Claude Code separates `Read` / `Edit` / `Write`.
4. **Task lifecycle**: Copilot has explicit `task_complete`, `report_progress`, `update_todo`, and `report_intent` tools for autonomous workflow management. Claude Code relies on implicit conversation flow.
5. **Browser**: Copilot has built-in Playwright MCP tools (`browser_*`). Claude Code does not bundle browser automation.
6. **MCP prefix**: Copilot uses `server-name/tool-name` (slash). Claude Code uses `mcp__server__tool` (double underscore). In `.github/agents/` YAML, Copilot also accepts `github/tool` as a short alias for `github-mcp-server/tool`.

---

## 5. Agent Definition Format (`.github/agents/`)

```yaml
---
name: agent-name
description: >
  Multi-line description of the agent's purpose.
model: claude-haiku-4.5    # or claude-sonnet-4.5, claude-sonnet-4.6
tools:
  - "*"                     # all tools
  # OR specific tools:
  - read                    # IMPORTANT: lowercase in agent YAML
  - edit
  - shell                   # maps to bash/powershell depending on OS
  - search                  # maps to grep
  - grep
  - glob
  - view
  - create
  - web_fetch
  - web_search
  - task                    # subagent delegation
  - lsp
  # MCP tools:
  - github-mcp-server/search_code
  - github/get_me           # short prefix alias
  - bluebird/do_vector_search
  - mcp__terraform__search_modules  # user-defined MCP
skills:
  - skill-name-1
  - skill-name-2
promptParts:
  includeAISafety: true
  includeToolInstructions: true
  includeParallelToolCalling: true
  includeCustomAgentInstructions: false
  includeEnvironmentContext: false
prompt: |
  Your system prompt here.
  {{cwd}} — template variable for working directory.
  {{reportPath}} — template variable for report output path.
---
```

**Note on `shell` vs `bash`**: In `.github/agents/` YAML tool lists, `shell` is used as the abstract name. At runtime, this maps to `bash` (macOS/Linux) or `powershell` (Windows) based on the detected OS. Similarly, `search` in YAML maps to `grep` at runtime.
