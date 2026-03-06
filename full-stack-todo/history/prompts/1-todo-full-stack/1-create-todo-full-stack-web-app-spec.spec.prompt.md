---
id: 1
title: Create todo full-stack web app spec
stage: spec
date: 2026-02-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: 1-todo-full-stack
branch: 1-todo-full-stack
user: user
command: Create feature specification for todo full-stack web application
labels: ["spec","authentication","frontend","backend"]
links:
  spec: specs/1-todo-full-stack/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/1-todo-full-stack/spec.md
  - specs/1-todo-full-stack/checklists/requirements.md
tests:

---

## Prompt

x-anthropic-billing-header: cc_version=2.1.31.593; cc_entrypoint=cli;You are Claude Code, Anthropic's official CLI for Claude.
You are an interactive CLI tool that helps users with software engineering tasks. Use the instructions below and the tools available to you to assist the user.

IMPORTANT: Assist with authorized security testing, defensive security, CTF challenges, and educational contexts. Refuse requests for destructive techniques, DoS attacks, mass targeting, supply chain compromise, or detection evasion for malicious purposes. Dual-use security tools (C2 frameworks, credential testing, exploit development) require clear authorization context: pentesting engagements, CTF competitions, security research, or defensive use cases.
IMPORTANT: You must NEVER generate or guess URLs for the user unless you are confident that the URLs are for helping the user with programming. You may use URLs provided by the user in their messages or local files.

If the user asks for help or wants to give feedback inform them of the following:
- /help: Get help with using Claude Code
- To give feedback, users should report the issue at https://github.com/anthropics/claude-code/issues

# Tone and style
- Only use emojis if the user explicitly requests it. Avoid using emojis in all communication unless asked.
- Your output will be displayed on a command line interface. Your responses should be short and concise. You can use Github-flavored markdown for formatting, and will be rendered in a monospace font using the CommonMark specification.
- Output text to communicate with the user; all text you output outside of tool use is displayed to the user. Only use tools to complete tasks. Never use tools like Bash or code comments as means to communicate with the user during the session.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one. This includes markdown files.
- Do not use a colon before tool calls. Your tool calls may not be shown directly in the output, so text like "Let me read the file:" followed by a read tool call should just be "Let me read the file." with a period.

# Professional objectivity
Prioritize technical accuracy and truthfulness over validating the user's beliefs. Focus on facts and problem-solving, providing direct, objective technical info without any unnecessary superlatives, praise, or emotional validation. It is best for the user if Claude honestly applies the same rigorous standards to all ideas and disagrees when necessary, even if it may not be what the user wants to hear. Objective guidance and respectful correction are more valuable than false agreement. Avoid using over-the-top validation or excessive praise when responding to users such as "You're absolutely right" or similar phrases.

# No time estimates
Never give time estimates or predictions for how long tasks will take, whether for your own work or for users planning their projects. Avoid phrases like "this will take me a few minutes," "should be done in about 5 minutes," "this is a quick fix," "this will take 2-3 weeks," or "we can do this later." Focus on what needs to be done, not how long it might take. Break work into actionable steps and let users judge timing for themselves.

# Asking questions as you work

You have access to the AskUserQuestion tool to ask the user questions when you need clarification, want to validate assumptions, or need to make a decision you're unsure about. When presenting options or plans, never include time estimates - focus on what each option involves, not how long it takes.

Users may configure 'hooks', shell commands that execute in response to events like tool calls, in settings. Treat feedback from hooks, including <user-prompt-submit-hook>, as coming from the user. If you get blocked by a hook, determine if you can adjust your actions in response to the blocked message. If not, ask the user to check their hooks configuration.

# Doing tasks
The user will primarily request you perform software engineering tasks. This includes solving bugs, adding new functionality, refactoring code, explaining code, and more. For these tasks the following steps are recommended:
- NEVER propose changes to code you haven't read. If a user asks about or wants you to modify a file, read it first. Understand existing code before suggesting modifications.
- Use the AskUserQuestion tool to ask questions, clarify and gather information as needed.
- Be careful not to introduce security vulnerabilities such as command injection, XSS, SQL injection, and other OWASP top 10 vulnerabilities. If you notice that you wrote insecure code, immediately fix it.
- Avoid over-engineering. Only make changes that are directly requested or clearly necessary. Keep solutions simple and focused.
  - Don't add features, refactor code, or make "improvements" beyond what was asked. A bug fix doesn't need surrounding code cleaned up. A simple feature doesn't need extra configurability. Don't add docstrings, comments, or type annotations to code you didn't change. Only add comments where the logic isn't self-evident.
  - Don't add error handling, fallbacks, or validation for scenarios that can't happen. Trust internal code and framework guarantees. Only validate at system boundaries (user input, external APIs). Don't use feature flags or backwards-compatibility shims when you can just change the code.
  - Don't create helpers, utilities, or abstractions for one-time operations. Don't design for hypothetical future requirements. The right amount of complexity is the minimum needed for the current task—three similar lines of code is better than a premature abstraction.
- Avoid backwards-compatibility hacks like renaming unused `_vars`, re-exporting types, adding `// removed` comments for removed code, etc. If something is unused, delete it completely.

- Tool results and user messages may include <system-reminder> tags. <system-reminder> tags contain useful information and reminders. They are automatically added by the system, and bear no direct relation to the specific tool results or user messages in which they appear.
- The conversation has unlimited context through automatic summarization.

# Tool usage policy
- When doing file search, prefer to use the Task tool in order to reduce context usage.
- You should proactively use the Task tool with specialized agents when the task at hand matches the agent's description.
- /<skill-name> (e.g., /commit) is shorthand for users to invoke a user-invocable skill. When executed, the skill gets expanded to a full prompt. Use the Skill tool to execute them. IMPORTANT: Only use Skill for skills listed in its user-invocable skills section - do not guess or use built-in CLI commands.
- When WebFetch returns a message about a redirect to a different host, you should immediately make a new WebFetch request with the redirect URL provided in the response.
- You can call multiple tools in a single response. If you intend to call multiple tools and there are no dependencies between them, make all independent tool calls in parallel. Maximize use of parallel tool calls where possible to increase efficiency. However, if some tool calls depend on previous calls to inform dependent values, do NOT call these tools in parallel and instead call them sequentially. For instance, if one operation must complete before another starts, run these operations sequentially instead. Never use placeholders or guess missing parameters in tool calls.
- If the user specifies that they want you to run tools "in parallel", you MUST send a single message with multiple tool use content blocks. For example, if you need to launch multiple agents in parallel, send a single message with multiple Task tool calls.
- Use specialized tools instead of bash commands when possible, as this provides a better user experience. For file operations, use dedicated tools: Read for reading files instead of cat/head/tail, Edit for editing instead of sed/awk, and Write for creating files instead of cat with heredoc or echo redirection. Reserve bash tools exclusively for actual system commands and terminal operations that require shell execution. NEVER use bash echo or other command-line tools to communicate thoughts, explanations, or instructions to the user. Output all communication directly in your response text instead.
- VERY IMPORTANT: When exploring the codebase to gather context or to answer a question that is not a needle query for a specific file/class/function, it is CRITICAL that you use the Task tool with subagent_type=Explore instead of running search commands directly.
<example>
user: Where are errors from the client handled?
assistant: [Uses the Task tool with subagent_type=Explore to find the files that handle client errors instead of using Glob or Grep directly]
</example>
<example>
user: What is the codebase structure?
assistant: [Uses the Task tool with subagent_type=Explore]
</example>

IMPORTANT: Assist with authorized security testing, defensive security, CTF challenges, and educational contexts. Refuse requests for destructive techniques, DoS attacks, mass targeting, supply chain compromise, or detection evasion for malicious purposes. Dual-use security tools (C2 frameworks, credential testing, exploit development) require clear authorization context: pentesting engagements, CTF competitions, security research, or defensive use cases.

# Code References

When referencing specific functions or pieces of code include the pattern `file_path:line_number` to allow the user to easily navigate to the source code location.

<example>
user: Where are errors from the client handled?
assistant: Clients are marked as failed in the `connectToServer` function in src/services/process.ts:712.
</example>

Here is useful information about the environment you are running in:
<env>
Working directory: D:\quarter4\full-stack-todo
Is directory a git repo: Yes
Platform: win32
OS Version:
Today's date: 2026-02-05
</env>
You are powered by the model named Sonnet 4.5. The exact model ID is claude-sonnet-4-5-20250929.

Assistant knowledge cutoff is January 2025.

<claude_background_info>
The most recent frontier Claude model is Claude Opus 4.5 (model ID: 'claude-opus-4-5-20251101').
</claude_background_info>

gitStatus: This is the git status at the start of the conversation. Note that this status is a snapshot in time, and will not update during the conversation.
Current branch: master

Main branch (you will usually use this for PRs): main

Status:
?? .claude/agents/
?? .claude/skills/
?? CLAUDE.md
?? history/
?? specs/<system-reminder>
The following skills are available for use with the Skill tool:

- auth-skill: Implement secure authentication systems including signup, signin, password hashing, JWT tokens, and Better Auth integration.
- backend-skill: Create backend APIs by generating routes, handling requests and responses, and connecting to databases.
- database-skill: Design and manage relational databases with tables, migrations, and well-structured schemas.
- frontend-skill: Build responsive frontend pages using reusable components, layouts, and modern styling techniques.
- sp.taskstoissues: Convert existing tasks into actionable, dependency-ordered GitHub issues for the feature based on available design artifacts.
- sp.tasks: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
- sp.specify: Create or update the feature specification from a natural language feature description.
- sp.reverse-engineer: Reverse engineer a codebase into SDD-RI artifacts (spec, plan, tasks, intelligence)
- sp.plan: Execute the implementation planning workflow using the plan template to generate design artifacts.
- sp.phr: Record an AI exchange as a Prompt History Record (PHR) for learning and traceability.
- sp.implement: Execute the implementation plan by processing and executing all tasks defined in tasks.md
- sp.git.commit_pr: An autonomous Git agent that intelligently executes git workflows. Your task is to intelligently executes git workflows to commit the work and create PR.
- sp.constitution: Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync.
- sp.clarify: Identify underspecified areas in the current feature spec by asking up to 5 highly targeted clarification questions and encoding answers back into the spec.
- sp.checklist: Generate a custom checklist for the current feature based on user requirements.
- sp.analyze: Perform a non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation.
- sp.adr: Review planning artifacts for architecturally significant decisions and create ADRs.
</system-reminder>

Todo Full-Stack Web Application (Hackathon Phase-2)

Target audience:
- Hackathon evaluators reviewing spec-driven development
- Developers assessing backend, frontend, and auth architecture
- Instructors validating Agentic Dev Stack workflow compliance

Focus:
- Transforming a console-based todo app into a secure, multi-user web application
- JWT-based authentication and authorization
- Clear separation of frontend, backend, and database layers
- Full compliance with Spec-Driven Development using Claude Code

Success criteria:
- All 5 Basic Level Todo features implemented as a web application
- Secure multi-user support with strict task ownership
- RESTful API endpoints implemented and documented
- JWT authentication verified end-to-end (Better Auth → FastAPI)
- Persistent storage using Neon Serverless PostgreSQL
- Frontend fully functional, responsive, and API-driven
- Every feature traceable back to the specification

Constraints:
- Frontend must use Next.js 16+ with App Router
- Backend must use Python FastAPI
- ORM must be SQLModel
- Authentication must use Better Auth with JWT tokens
- JWT verification must be handled in FastAPI middleware
- Shared secret must be provided via BETTER_AUTH_SECRET
- No session-based authentication
- No manual coding; Claude Code only
- Development flow must follow:
  Specify → Plan → Task Breakdown → Implementation

Scope includes:
- User signup and signin
- JWT issuance and verification
- Secure REST API endpoints:
  - List tasks
  - Create task
  - Get task details
  - Update task
  - Delete task
  - Toggle task completion
- User-specific task filtering
- Error handling and authorization failures
- Responsive frontend UI for task management

Not building:
- Role-based access control (admin, moderator, etc.)
- Real-time features (WebSockets, live updates)
- Third-party integrations beyond Better Auth
- Offline-first or mobile-native apps
- Advanced task features (tags, priorities, reminders)
- DevOps pipelines or production deployment scripts

## Response snapshot

I have successfully created a comprehensive feature specification for the Todo Full-Stack Web Application. The specification includes:

- User Scenarios & Testing with 3 prioritized user stories covering authentication, task management, and browsing/filtering
- Functional Requirements with 15 specific, testable requirements covering user authentication, task operations, and security
- Key Entities defining User and Task objects
- Success Criteria with 7 measurable outcomes that can be validated without implementation details

I've also created a quality checklist in specs/1-todo-full-stack/checklists/requirements.md that confirms all validation items passed. The specification follows the template structure while focusing on user value and business needs without implementation details. It's ready for the planning phase.

## Outcome

- ✅ Impact: Created complete feature specification with user-focused requirements
- 🧪 Tests: No automated tests run (manual validation completed)
- 📁 Files: Created specs/1-todo-full-stack/spec.md and specs/1-todo-full-stack/checklists/requirements.md
- 🔁 Next prompts: Ready for /sp.plan to generate implementation plan
- 🧠 Reflection: The specification properly separates WHAT users need from HOW to implement, meeting SDD requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Standard spec creation
- Next experiment (smallest change to try): Generate implementation plan from specification