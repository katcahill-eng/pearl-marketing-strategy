# MarcomsBot: Product Brief for Claude Code

## Overview

Build a Slack bot ("MarcomsBot" or "Pearl Marketing Agent") that allows Pearl staff to request marketing support through natural conversation OR a traditional intake form. The bot conducts intake conversations, interprets responses intelligently, generates appropriate briefs, creates Google Drive folders, sets up Monday.com tasks/projects, and notifies the marketing team.

---

## The Organization

**Pearl Marketing** is an internal marketing department that serves other divisions within the Pearl organization. They receive requests from staff across the company for marketing support — graphics, campaigns, content, events, etc.

**Current workflow:**
1. Staff submits an intake form
2. Form becomes a creative brief (manual process)
3. Project folder created in Google Drive (manual)
4. Project and tasks created in Monday.com (manual)

**Desired workflow:**
1. Staff EITHER:
   - Messages @MarcomsBot in Slack and has a conversation, OR
   - Completes the traditional intake form
2. Bot generates appropriate brief automatically
3. Bot creates Drive folder and saves brief as Google Doc
4. Bot creates Monday.com project/tasks
5. Bot notifies marketing team and responds with links

---

## Two Entry Points, Same Outcome

### Option A: Conversational Intake (Primary)
Staff messages the bot, bot asks questions conversationally, collects information, confirms, and creates everything.

### Option B: Form Intake (Backup)
Staff completes a Google Form or Monday Form. Webhook triggers the bot to process the submission and create everything automatically.

**Both paths result in:**
- A generated brief (Google Doc)
- A project folder (Google Drive)
- Tasks or project (Monday.com)
- Notification to marketing team (Slack channel)

```
┌─────────────────────┐     ┌─────────────────────┐
│  @MarcomsBot in Slack │     │   Intake Form       │
│  (conversation)     │     │   (Google/Monday)   │
└──────────┬──────────┘     └──────────┬──────────┘
           │                           │
           ▼                           ▼
┌─────────────────────────────────────────────────┐
│              MarcomsBot Agent Core                │
│                                                 │
│  • Interprets request                           │
│  • Classifies size/type                         │
│  • Generates brief                              │
│  • Creates Drive folder + doc                   │
│  • Creates Monday tasks/project                 │
│  • Notifies marketing team                      │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│                   Outputs                       │
│                                                 │
│  📄 Brief (Google Doc)                          │
│  📁 Project folder (Google Drive)               │
│  ✅ Tasks/Project (Monday.com)                  │
│  📢 Notification (#marketing-requests)          │
└─────────────────────────────────────────────────┘
```

---

## User Stories

### Pearl Staff (Requesters)

**Conversational Request:**
> "As a Pearl staff member, I want to chat with @MarcomsBot to describe what I need, answer a few questions, and have my request set up automatically."

**Form Request:**
> "As a Pearl staff member, I want to complete a form if I prefer that to chatting, and still have everything set up automatically."

**Choice:**
> "As a Pearl staff member, I want the option to choose between talking to the bot or filling out a form, depending on my preference."

**Status Check:**
> "As a Pearl staff member, I want to ask the bot about the status of my request."

**Quick Request:**
> "As a Pearl staff member, I want to quickly describe a simple need and have it handled without a lengthy process."

### Pearl Marketing Team

**Notifications:**
> "As a Pearl Marketing team member, I want to be notified in Slack when new requests come in, with links to the brief and project."

**Brief Retrieval:**
> "As a Pearl Marketing team member, I want to ask the bot to find a brief or project."

---

## Conversational Intake Flow

### Initial Greeting

When someone messages @MarcomsBot without a specific request:

```
Staff: @MarcomsBot

Bot: Hey! 👋 I can help you submit a marketing request.

     You've got two options:
     1. **Chat with me** — I'll ask a few questions and set everything up
     2. **Fill out the form** — [link to intake form]

     Want to chat, or prefer the form?
```

Or if they start with a request:

```
Staff: @MarcomsBot I need help with something for HR

Bot: Happy to help! Let me ask a few questions to get this set up right.

     What do you need?
     (e.g., social graphic, flyer, email campaign, video, event support, presentation)
```

---

### Question Flow

The bot asks questions in sequence, but intelligently skips questions if the user already provided that information.

**Core Questions (all requests):**

| Question | Purpose |
|----------|---------|
| What division are you from? | Categorization, notifications |
| What do you need? (type of deliverable) | Determines workflow branch |
| What's this for? (description/context) | Brief content |
| When do you need it? | Due date, timeline |
| Anything specific to include? (details, assets, text) | Brief content |

**Additional Questions (based on request type):**

| If request type is... | Also ask... |
|-----------------------|-------------|
| Campaign | Target audience? Goals/objectives? Channels? |
| Event | Event date? Location? Expected attendance? |
| Video | Length? Where will it be shown? Voiceover or text? |
| Print | Size/format? Quantity? Distribution method? |
| Presentation | Audience? How long is the presentation? Key points to cover? |

---

### Flexible Interpretation

Claude interprets natural responses — staff don't need to answer in a specific format:

**Division detection:**
| Staff says | Bot understands |
|------------|-----------------|
| "HR" | division: HR |
| "I'm on the people team" | division: HR |
| "Finance, I report to Sarah" | division: Finance |
| "the Widget division" | division: Widget |

**Timeline detection:**
| Staff says | Bot understands |
|------------|-----------------|
| "Friday" | Calculates next Friday |
| "End of month" | Calculates date |
| "March 15" | Specific date |
| "ASAP" | Flags as urgent |
| "No rush, whenever you get to it" | Low priority, no hard date |
| "2 weeks" | Calculates date |

**Bundled responses:**
If a user provides multiple pieces of info at once, the bot extracts all of it and skips those questions:

```
Staff: @MarcomsBot I'm from HR and we need a flyer for the 
       benefits fair on March 10, should include the logo 
       and a QR code to the registration page

Bot: Got most of what I need! Just one question:

     When do you need the flyer by? (The event is March 10 — 
     do you need it a few days before?)

Staff: March 7 would be great

Bot: Perfect. Here's what I've got:

     📋 **HR Benefits Fair Flyer**
     • Flyer for benefits fair (March 10)
     • Include: Logo + QR code to registration
     • Due: March 7

     ✅ Does this look right? Reply "yes" to confirm or tell me what to change.
```

---

### Confirmation Step

Before creating anything, the bot confirms:

```
Bot: Here's what I'm setting up:

     📋 **[Request Title]**
     • Division: [division]
     • Type: [request type]
     • Description: [summary]
     • Deliverables: [list]
     • Due: [date]
     • Notes: [any special details]

     ✅ Does this look right? 
     
     Reply "yes" to confirm, or tell me what to change.
```

**If user confirms:**
Bot proceeds to create brief, folder, tasks, and notifications.

**If user wants changes:**
```
Staff: Actually make it due Thursday instead

Bot: Got it — changed to Thursday. Everything else look good?

Staff: Yes

Bot: Done! [proceeds with creation]
```

**If user wants to start over:**
```
Staff: Actually let me start over

Bot: No problem! Let's start fresh. What do you need help with?
```

---

### Completion Response

```
Bot: All set! Here's everything:

     📄 **Brief:** [Google Doc link]
     📁 **Project folder:** [Google Drive link]
     ✅ **Monday task:** [Monday.com link]

     The marketing team has been notified in #marketing-requests.
     
     Need to add files? Drop them in the project folder.
     Have questions? Reply here and I'll help.
```

---

## Project Classification

The bot determines project size based on responses:

### Quick Request (Light Workflow)
**Triggers:**
- Single deliverable
- Simple scope (graphic, quick update, small edit)
- Staff uses words like "quick," "simple," "small," "just need"
- Short timeline without complexity

**Output:**
- Mini-brief (shorter format)
- Google Doc saved to "Quick Requests" folder
- Single Monday.com task (not full project)

### Full Project (Heavy Workflow)
**Triggers:**
- Multiple deliverables
- Campaign or coordinated effort
- Event support
- Staff uses words like "campaign," "launch," "project," "multiple"
- Complex requirements or extended timeline

**Output:**
- Full creative brief
- Dedicated Google Drive folder with subfolders
- Monday.com project with multiple tasks

### Classification Logic

```
┌─────────────────────────────────────────┐
│           Request Analysis              │
│                                         │
│  Inputs:                                │
│  • Number of deliverables               │
│  • Request type                         │
│  • Keywords used                        │
│  • Timeline complexity                  │
│  • Explicit staff preference            │
└────────────────┬────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Claude API    │
         │ classifies as │
         │ quick or full │
         └───────┬───────┘
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│   Quick     │     │    Full     │
│  Workflow   │     │  Workflow   │
└─────────────┘     └─────────────┘
```

If uncertain, the bot asks:

```
Bot: This could be a quick request or a full project. 

     Would you like:
     • **Quick setup** — single task, simple brief
     • **Full project** — dedicated folder, detailed brief, task list

Staff: Full project please

Bot: Got it, setting up as a full project.
```

---

## Conversation State Management

The bot tracks conversation state per user/thread:

```
ConversationState {
  user_id: string
  user_name: string
  thread_ts: string
  channel_id: string
  status: "gathering" | "confirming" | "complete" | "cancelled"
  current_step: string
  collected_data: {
    division: string
    request_type: string
    description: string
    deliverables: string[]
    due_date: string
    due_date_parsed: Date
    urgency: "normal" | "urgent" | "low"
    details: string
    assets_mentioned: string[]
    additional_info: object  // type-specific fields
  }
  classification: "quick" | "full" | "undetermined"
  created_at: Date
  updated_at: Date
  expires_at: Date  // conversations timeout after inactivity
}
```

### State Transitions

```
[New message] → gathering
     │
     ▼
[All required info collected] → confirming
     │
     ├── [User confirms] → complete → [Execute workflows]
     │
     ├── [User requests changes] → gathering (targeted)
     │
     └── [User cancels] → cancelled
```

### Timeout Handling

If a conversation is inactive for 24 hours:

```
Bot: Hey! We started a marketing request yesterday but didn't finish.

     Want to continue where we left off, start over, or cancel?

     Here's what we had:
     • Division: HR
     • Type: Social graphic
     • [incomplete]
```

---

## Workflows

### Workflow 1: Quick Request

**Trigger:** Classified as quick request and confirmed

**Actions:**
1. Generate mini-brief via Claude API
2. Create Google Doc in "Quick Requests" folder
3. Create single task in Monday.com quick requests board
4. Post to #marketing-requests with summary
5. Respond to user with links

**Mini-brief template:**
```
# Quick Request Brief

**Requested by:** [name]
**Division:** [division]
**Date:** [today]

## Request
[1-2 sentence summary]

## Deliverable
[what's being made]

## Key Details
[any specifics: dates, names, messaging, assets]

## Due Date
[date]

## Assets/References
[any files or links mentioned]
```

---

### Workflow 2: Full Project

**Trigger:** Classified as full project and confirmed

**Actions:**
1. Generate full creative brief via Claude API
2. Create Google Drive folder structure:
   ```
   /Pearl Projects/[YYYY]/[Project Name]/
       /01 - Brief
       /02 - Assets (from client)
       /03 - Working Files
       /04 - Deliverables
       /05 - Feedback
   ```
3. Save brief as Google Doc in /01 - Brief
4. Create Monday.com project with tasks based on deliverables
5. Post to #marketing-requests with summary
6. Respond to user with links

**Full brief template:**
```
# Creative Brief: [Project Name]

**Requested by:** [name]
**Division:** [division]
**Request date:** [today]
**Due date:** [date]

---

## Project Overview
[2-3 sentence summary of the project and its purpose]

## Objectives
[What does success look like? What should this accomplish?]

## Target Audience
[Who is this for? Internal staff, external customers, specific department?]

## Deliverables
- [Deliverable 1]
- [Deliverable 2]
- [etc.]

## Key Messages
[Core messaging, talking points, or copy requirements]

## Specifications
[Sizes, formats, technical requirements]

## Timeline
| Milestone | Date |
|-----------|------|
| Brief finalized | [date] |
| First draft | [date] |
| Feedback due | [date] |
| Revisions | [date] |
| Final delivery | [date] |

## Brand/Style Notes
[Any specific brand requirements, colors, tone]

## Assets Provided
[List of files/links the requester will provide or has provided]

## References/Inspiration
[Examples, links, or inspiration mentioned]

## Additional Notes
[Anything else relevant]

---

**Project folder:** [link]
**Monday project:** [link]
```

---

### Workflow 3: Form Submission Processing

**Trigger:** Webhook from Google Form or Monday Form submission

**Actions:**
1. Parse form fields into structured data
2. Use Claude API to classify as quick or full
3. Generate appropriate brief
4. Execute quick or full workflow (folders, tasks)
5. Post to #marketing-requests
6. If Slack user ID is captured, DM user with confirmation and links

---

### Workflow 4: Status Check

**Trigger:** User asks about status ("where are we on", "status of", "update on", "how's the")

**Actions:**
1. Extract project/request identifier from message
2. Search Monday.com for matching item
3. Retrieve status, assignee, dates, recent updates
4. Respond in Slack with summary

**Example:**
```
Staff: @MarcomsBot where are we on the HR benefits flyer?

Bot: **HR Benefits Fair Flyer**
     
     **Status:** In Review
     **Assigned to:** Jamie
     **Due:** March 7
     
     Latest update (today, 2:15pm):
     "First draft sent to HR for review"
     
     📄 Brief: [link]
     📁 Folder: [link]
     ✅ Monday: [link]
```

---

### Workflow 5: Search/Retrieval

**Trigger:** User asks to find something ("find the brief for", "link to", "where's the")

**Actions:**
1. Extract search terms
2. Search Google Drive and/or Monday.com
3. Return matching results

**Example:**
```
Staff: @MarcomsBot find the brief for the Q4 sales campaign

Bot: Found it:
     
     📄 **Q4 Sales Campaign Brief**
     Created: October 12
     
     [Google Doc link]
     [Project folder link]
     [Monday project link]
```

---

### Workflow 6: Help/Options

**Trigger:** User asks for help, or sends unclear message

**Actions:**
1. Provide options and guidance

**Example:**
```
Staff: @MarcomsBot help

Bot: Here's what I can do:

     **Submit a request**
     • Chat with me — just describe what you need
     • Fill out the form — [link]
     
     **Check on a request**
     • "Status of [project name]"
     • "Where are we on [request]?"
     
     **Find something**
     • "Find the brief for [project]"
     • "Link to [project] folder"
     
     What would you like to do?
```

---

## Form Integration

### Form Fields (Google Form or Monday Form)

The form should capture:

| Field | Type | Required |
|-------|------|----------|
| Your name | Text | Yes |
| Your email | Email | Yes |
| Your Slack username | Text | Yes (for notifications) |
| Division | Dropdown | Yes |
| Request type | Dropdown/Checkbox | Yes |
| Description | Long text | Yes |
| Deliverables needed | Checkbox or text | Yes |
| Due date | Date | Yes |
| Urgency | Dropdown | No |
| Target audience | Text | No |
| Key messages/copy | Long text | No |
| Assets you'll provide | Text | No |
| References/examples | Text/URL | No |
| Additional notes | Long text | No |

### Webhook Processing

When form is submitted:
1. Webhook sends data to bot server
2. Bot maps form fields to structured data
3. Bot classifies and processes (same as conversational path)
4. Bot posts to #marketing-requests
5. Bot DMs the requester with confirmation

---

## Slack Notifications

### #marketing-requests Channel

All new requests post here:

```
📥 **New Request: HR Benefits Fair Flyer**

**From:** Jamie Smith (HR)
**Type:** Print — Flyer
**Due:** March 7

**Summary:** Flyer promoting the March 10 benefits fair. 
Include logo and QR code to registration page.

📄 Brief: [link]
📁 Folder: [link]
✅ Monday: [link]

React with 👀 to claim this request.
```

### User DM (for form submissions)

```
Hey Jamie! Your marketing request has been submitted.

📋 **HR Benefits Fair Flyer**
Due: March 7

📄 Brief: [link]
📁 Folder: [link] — upload any assets here
✅ Monday: [link]

The marketing team has been notified. 
Reply to me anytime to check on status.
```

---

## Error Handling

### Bot Can't Understand

```
Bot: I didn't quite catch that. Could you rephrase?

     Or if you'd prefer, you can fill out the form instead: [link]
```

### Missing Critical Information

```
Bot: I still need to know when you need this by. 
     What's your deadline?
```

### System Error

```
Bot: Something went wrong on my end. 

     Your request info has been saved — I'll retry in a moment.
     If this keeps happening, you can use the form as a backup: [link]
     
     Or message the marketing team directly in #marketing-team.
```

### Project Not Found

```
Bot: I couldn't find a project matching "widget campaign."

     A few options:
     • Try different keywords
     • Check #marketing-requests for recent posts
     • Ask in #marketing-team

     Want me to search for something else?
```

---

## Technical Requirements

### Integrations

**Slack**
- Slack Events API: Listen for @mentions and DMs
- Slack Web API: Post messages, DMs, reactions
- Handle threaded conversations
- Parse user info (name, ID)

**Google Drive**
- Create folders with specific structure
- Create Google Docs from generated content
- Search files by name
- Return shareable links
- Service account auth (no user OAuth needed)

**Monday.com**
- Create items (tasks) on boards
- Create groups or subitems for projects
- Update item status
- Search items
- Add links/columns (Drive folder, brief doc)
- GraphQL API

**Claude API**
- Interpret natural language
- Extract structured data from responses
- Generate briefs from collected data
- Classify request type and size
- Handle ambiguity gracefully

**Webhook Receiver**
- Accept POST requests from Google Forms or Monday Forms
- Parse form data
- Trigger processing pipeline

### Database

Store conversation state and project records:

```
conversations
├── id
├── user_id
├── user_name
├── channel_id
├── thread_ts
├── status
├── current_step
├── collected_data (JSON)
├── classification
├── created_at
├── updated_at
└── expires_at

projects
├── id
├── name
├── type (quick | full)
├── requester_name
├── requester_slack_id
├── requester_email
├── division
├── status
├── drive_folder_url
├── brief_doc_url
├── monday_item_id
├── monday_url
├── source (conversation | form)
├── created_at
└── due_date

divisions
├── id
├── name
└── slack_channel (optional, for division-specific notifications)
```

### Hosting

- Persistent server for Slack events and webhooks
- Options: Railway, Render, Fly.io, AWS, Google Cloud Run
- Handle concurrent conversations
- Environment variables for all credentials

---

## Configuration Needed

Before building, gather:

1. **Slack**
   - Bot token (xoxb-...)
   - Signing secret
   - App-level token (for socket mode, if used)
   - Channel ID for #marketing-requests

2. **Google Drive**
   - Service account JSON credentials
   - Folder ID for Pearl Projects root
   - Folder ID for Quick Requests

3. **Monday.com**
   - API token
   - Board ID for quick requests
   - Board ID for full projects (or same board with groups)
   - Column mappings (status, date, links, etc.)

4. **Claude API**
   - API key

5. **Intake Form**
   - Google Form or Monday Form URL
   - Webhook destination configured

6. **Business Logic**
   - List of divisions
   - Brief templates (confirm or customize the ones above)
   - Default task lists for different project types
   - Who gets assigned by default (or unassigned queue)

---

## Roadmap

### Phase 1: Conversational Core (Week 1-2)
- Slack bot listens for @mentions
- Conversation flow with state tracking
- Claude API interprets responses and extracts data
- Intelligent question skipping when info already provided
- Confirmation step before creation
- Basic response (no integrations yet, just confirms what would be created)

### Phase 2: Brief Generation (Week 2)
- Mini-brief and full-brief templates
- Claude generates briefs from collected data
- Classification logic (quick vs. full)

### Phase 3: Google Drive Integration (Week 3)
- Create folders (quick requests folder, full project structure)
- Create Google Docs with brief content
- Return shareable links

### Phase 4: Monday.com Integration (Week 3-4)
- Create tasks for quick requests
- Create projects with task lists for full requests
- Link Drive folder in Monday item
- Search for status checks

### Phase 5: Notifications (Week 4)
- Post new requests to #marketing-requests
- Format notifications with links and summary
- Add reaction handling for claiming requests (optional)

### Phase 6: Form Webhook Processing (Week 5)
- Webhook endpoint for form submissions
- Map form fields to structured data
- Process through same pipeline
- DM requester with confirmation

### Phase 7: Search & Status (Week 5)
- Status check workflow
- Search/retrieval workflow
- Help command

### Phase 8: Polish & Edge Cases (Week 6)
- Timeout handling for stale conversations
- Error handling and fallbacks
- Conversation corrections ("actually change the due date")
- Start over flow
- Testing with real requests

### Phase 9: Team Rollout (Week 7)
- Documentation for staff
- Announce in relevant channels
- Monitor and fix issues
- Gather feedback

---

## Example Conversations

### Example 1: Simple Graphic (Quick)

```
Staff: @MarcomsBot I need a quick social graphic for IT — we're 
       announcing new password requirements, need it by Monday

Bot: Got it! A few quick questions:

     Any specific text or messaging to include?

Staff: Just "New Password Policy Effective March 1" and maybe 
       a lock icon

Bot: Perfect. Here's what I'm setting up:

     📋 **Quick Request: IT Password Policy Graphic**
     • Social graphic for IT
     • Text: "New Password Policy Effective March 1"
     • Include lock icon
     • Due: Monday

     ✅ Does this look right?

Staff: Yes

Bot: Done! 

     📄 Brief: [link]
     📁 Folder: [link]
     ✅ Task: [link]

     Marketing team notified in #marketing-requests.
```

### Example 2: Full Campaign

```
Staff: @MarcomsBot we need help with the Q2 product launch for 
       the Widget division

Bot: Nice! Let me get some details for the project.

     What deliverables do you need?
     (e.g., landing page, emails, social posts, sales sheets, video)

Staff: Landing page, email sequence (3 emails), social graphics 
       for LinkedIn and Instagram, and a one-pager for sales

Bot: Got it — that's a solid list. When's the launch date?

Staff: April 15

Bot: What's the target audience for this campaign?

Staff: Existing customers and prospects in manufacturing

Bot: Any key messages or value props to emphasize?

Staff: Main message is "50% faster processing" — we have 
       benchmark data to back it up

Bot: Last question — any brand assets, photos, or references 
     you'll provide?

Staff: Product photos are in the shared drive, I'll send the link. 
       And look at last year's launch for reference.

Bot: Here's the full project I'm setting up:

     📋 **Q2 Widget Launch Campaign**
     
     **Division:** Widget
     **Launch date:** April 15
     **Audience:** Existing customers + manufacturing prospects
     
     **Deliverables:**
     • Landing page
     • Email sequence (3 emails)
     • Social graphics (LinkedIn + Instagram)
     • Sales one-pager
     
     **Key message:** "50% faster processing" (with benchmark data)
     
     **Assets:** Product photos (link coming), reference last year's launch
     
     ✅ Does this look right?

Staff: Yes!

Bot: All set!

     📄 **Brief:** [link]
     📁 **Project folder:** [link]
     📋 **Monday project:** [link]
     
     **I've created tasks for:**
     • Landing page
     • Email 1, 2, 3
     • LinkedIn graphics
     • Instagram graphics
     • Sales one-pager
     
     Drop the product photo link in the Assets folder when ready.
     Marketing team notified in #marketing-requests.
```

### Example 3: User Prefers Form

```
Staff: @MarcomsBot

Bot: Hey! 👋 I can help you submit a marketing request.

     You've got two options:
     1. **Chat with me** — I'll ask a few questions and set everything up
     2. **Fill out the form** — [link to intake form]

     Want to chat, or prefer the form?

Staff: I'll do the form

Bot: No problem! Here's the link: [intake form URL]

     Once you submit, I'll set everything up and send you the 
     links. Let me know if you have questions!
```

### Example 4: Status Check

```
Staff: @MarcomsBot what's the status on the Widget launch campaign?

Bot: **Q2 Widget Launch Campaign**

     **Overall status:** In Progress (3 of 7 tasks complete)
     
     ✅ Brief finalized
     ✅ Landing page — complete
     ✅ Email 1 — complete
     🔄 Email 2 — in progress (Jamie)
     ⏳ Email 3 — not started
     ⏳ Social graphics — not started
     ⏳ Sales one-pager — not started
     
     **Due:** April 15 (18 days)
     
     📁 Folder: [link]
     📋 Monday: [link]
```

### Example 5: Correction During Intake

```
Bot: Here's what I'm setting up:

     📋 **HR Wellness Program Flyer**
     • Division: HR
     • Due: Friday, March 7

     ✅ Does this look right?

Staff: Actually it's for Finance, not HR

Bot: Got it — changed to Finance. Here's the updated summary:

     📋 **Finance Wellness Program Flyer**
     • Division: Finance
     • Due: Friday, March 7

     ✅ All good now?

Staff: Yes

Bot: Done! [proceeds]
```

### Example 6: Bundled Information

```
Staff: @MarcomsBot I'm Jamie from Sales, we need a one-pager 
       for the new Enterprise plan, target audience is CTOs, 
       key message is "Scale without complexity", need it by 
       end of next week, and I'll send over the pricing table

Bot: Got everything I need! Here's the summary:

     📋 **Sales Enterprise Plan One-Pager**
     
     • Division: Sales
     • Deliverable: One-pager
     • Audience: CTOs
     • Key message: "Scale without complexity"
     • Due: [end of next week date]
     • Assets: Pricing table (you'll send)
     
     ✅ Does this look right?

Staff: Perfect

Bot: Done! [proceeds]
```

---

## Success Criteria

**For Staff (Requesters):**
- Can submit a request via conversation in under 2 minutes
- Can use form if preferred
- Gets confirmation with all links immediately
- Can check status anytime without pinging marketing team

**For Marketing Team:**
- No more manual brief writing
- No more manual folder creation
- No more manual Monday setup
- All requests flow through consistent process
- Notified immediately of new requests

**Metrics to Track:**
- Requests submitted via bot vs. form
- Average conversation length (messages)
- Time from first message to completion
- Requests requiring manual intervention
- Staff satisfaction (survey after rollout)

---

## Open Questions

1. Should the bot require confirmation before creating, or just create and allow edits?
   - *Recommendation: Require confirmation to avoid mistakes*

2. Are there different brief templates for different request types?
   - *If yes, provide templates for each*

3. Should quick requests and full projects live on the same Monday board?
   - *Recommendation: Same board, different groups*

4. Who gets assigned new requests by default?
   - *Options: Unassigned queue, rotating assignment, specific person*

5. Should the bot post in division-specific channels as well as #marketing-requests?
   - *Optional enhancement*

6. What happens if someone submits via form AND messages the bot?
   - *Recommendation: Bot checks for recent duplicate and asks*

---

*This document contains everything needed to build MarcomsBot. Hand to Claude Code to begin implementation.*
