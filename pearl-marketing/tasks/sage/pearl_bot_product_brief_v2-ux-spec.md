# UX Specification: MarcomsBot (Slack Marketing Intake Agent)

> Source PRD: `pearl_bot_product_brief_v2.md`
> Interface: Slack (conversational + notifications), no standalone UI

---

## Pass 1: Mental Model

**Primary user intent (Requester):** "I need marketing to make something for me, and I want to describe it quickly and have it handled."

**Primary user intent (Marketing Team):** "I want new requests to arrive fully formed with brief, folder, and tasks already created — no manual setup."

**Likely misconceptions:**

- **"The bot IS a person on the marketing team."** Staff may believe they're chatting with a human marketer who will personally do the work, not a triage/intake system. They may ask subjective creative questions ("what do you think looks better?") or expect the bot to negotiate scope.
- **"Telling the bot means work has started."** Staff may assume that once they describe their request, someone is actively working on it. In reality, the bot creates the brief and tasks — a human still needs to pick it up.
- **"The bot remembers everything about me."** Staff may expect the bot to know their division, past requests, and preferences without being told each time.
- **"The bot can do the creative work."** Staff may ask the bot to draft copy, design assets, or make creative decisions rather than just intake.
- **"Confirming means it's done."** The confirmation step creates infrastructure (brief, folder, tasks) — not deliverables. Staff may confuse "all set!" with "your flyer is ready."

**UX principles to reinforce/correct:**

- **Transparency of role:** The bot must clearly communicate it is an intake assistant, not a creative worker. Use language like "I'll get this set up for the marketing team" not "I'll take care of this."
- **Status clarity:** After creation, explicitly state what was created (infrastructure) vs. what happens next (a human picks it up). Use phrases like "The marketing team has been notified and will begin work."
- **Progressive trust:** First-time users need more context; repeat users should get a streamlined experience.

---

## Pass 2: Information Architecture

**All user-visible concepts:**

- Bot greeting / entry point
- Chat vs. form choice
- Division (requester's team)
- Request type (deliverable category)
- Description / context
- Deliverables list
- Due date / timeline
- Urgency level
- Additional details (audience, messaging, assets)
- Confirmation summary
- Generated brief (Google Doc link)
- Project folder (Google Drive link)
- Monday.com task/project (link)
- Channel notification (#marketing-requests)
- Status check response
- Search/retrieval response
- Help menu
- Error messages
- Timeout/resume prompt

**Grouped structure:**

### Intake Flow (Requester-facing)
- Bot greeting: **Primary** — First thing every user sees
- Chat vs. form choice: **Primary** — Immediate fork in the experience
- Division: **Primary** — Required, asked early
- Request type: **Primary** — Determines workflow branch
- Description: **Primary** — Core of the request
- Deliverables list: **Primary** — What will be produced
- Due date: **Primary** — Required for scheduling
- Urgency: **Secondary** — Inferred from language when possible, asked only if ambiguous
- Type-specific questions (audience, channels, format): **Secondary** — Only asked when relevant to request type
- Assets/references: **Secondary** — Asked last, often optional
- Rationale: Core information must be collected before anything conditional

### Confirmation & Output (Requester-facing)
- Confirmation summary: **Primary** — Gate before any creation happens
- Edit/correction: **Primary** — Must be obvious how to change details
- Start over: **Secondary** — Available but not prominent
- Generated brief link: **Primary** — Main output artifact
- Project folder link: **Primary** — Where to upload assets
- Monday.com link: **Secondary** — Most requesters don't use Monday directly
- "Marketing team notified" message: **Primary** — Reassurance that the process is moving
- Rationale: Requesters care most about confirmation and the brief; Monday is for the marketing team

### Post-Submission (Requester-facing)
- Status check: **Primary** — Most common post-submission action
- Search/retrieval: **Secondary** — Less frequent but important
- Help menu: **Hidden** — Only shown when user explicitly asks or sends unclear message
- Rationale: Status checks are the #1 reason someone returns to the bot

### Notifications (Marketing team-facing)
- #marketing-requests post: **Primary** — Main intake channel for the team
- Request summary in notification: **Primary** — Team needs to triage at a glance
- Links (brief, folder, Monday): **Primary** — Team needs immediate access
- Claim reaction (eyes emoji): **Secondary** — Nice-to-have, not core flow
- Rationale: The notification IS the handoff — it must contain everything needed to start work

### System Management (Hidden)
- Conversation state tracking: **Hidden** — User never sees this
- Timeout handling: **Hidden** — Only surfaces as a message after 24h inactivity
- Error recovery: **Hidden** — Only surfaces when something fails
- Duplicate detection: **Hidden** — Only surfaces if form + bot submission overlap
- Rationale: System internals should be invisible unless something goes wrong

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|---------------------------|
| Start a request | @mention the bot or DM it — standard Slack pattern |
| Choose chat vs. form | Numbered options in bot message (1. Chat, 2. Form) |
| Answer a question | Reply in thread — standard Slack conversation |
| Provide multiple pieces of info at once | Free-text reply; bot extracts what it can |
| Confirm request summary | Reply "yes" — bot explicitly tells user to say "yes" |
| Edit a detail before confirming | Reply with correction in natural language |
| Start over | Say "start over" — bot mentions this option |
| Cancel | Say "cancel" — implicit but not prominently offered |
| Check status | @mention bot + status-related keywords |
| Search for a project | @mention bot + search-related keywords |
| Get help | @mention bot + "help" |
| Claim a request (marketing team) | React with eyes emoji on notification |
| Upload assets | Click folder link → standard Google Drive |
| View brief | Click doc link → standard Google Docs |
| View Monday task | Click Monday link → standard Monday.com |

**Affordance rules:**

- If user sees a **numbered list** from the bot, they should assume they can **reply with a number or the option name**
- If user sees **"Does this look right?"** they should assume they can **say "yes" to proceed or describe changes**
- If user sees a **link**, they should assume it **opens in the relevant app** (Drive, Docs, Monday)
- If user sees **bold text with an emoji prefix** (e.g., "**Brief:**"), they should assume it's a **key output/artifact**
- If the bot asks a **question**, the user should assume they can **answer naturally** (not fill in a form field)
- If the bot says **"Done!"** or **"All set!"**, the user should assume **infrastructure is created** (not that deliverables are complete)

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| Initial contact — "what do I say?" | Uncertainty | Bot greets proactively with clear options (chat or form). If user just says "@MarcomsBot", bot offers the choice. |
| "What division am I?" | Uncertainty | Bot accepts natural language ("I'm on the people team" → HR). Don't require exact division names. |
| "What type of request is this?" | Choice | Bot offers examples ("e.g., social graphic, flyer, email campaign, video") but accepts free-text. Don't force dropdown-style selection. |
| "When do I need it?" | Choice | Accept natural dates ("Friday", "end of month", "ASAP", "March 15"). Don't require date format. |
| "Do I need to answer every question?" | Uncertainty | Bot skips questions when info is already provided. Explicitly say "Got most of what I need! Just one question:" |
| "Is this a quick request or full project?" | Choice | Bot classifies automatically. Only asks user if genuinely ambiguous. |
| Confirmation summary — "is this right?" | Choice | Binary: yes or describe change. Don't present multiple edit options. |
| "What happens after I confirm?" | Uncertainty | Bot explicitly lists what it will create AND what happens next ("marketing team notified and will begin work"). |
| "How do I check status later?" | Uncertainty | Include a one-line hint after completion: "Reply to me anytime to check on status." |
| Waiting for bot to create everything | Waiting | Bot sends "Setting everything up..." immediately, then follows with results. Don't leave user in silence during API calls. |

**Defaults introduced:**

- **Urgency defaults to "normal":** Unless user says "ASAP", "urgent", or "rush" — don't ask about urgency
- **Classification defaults to auto-detect:** Bot classifies quick vs. full automatically; only asks if ambiguous
- **Division is inferred when possible:** If user says "I'm Jamie from Sales" — don't re-ask division
- **Template selection is automatic:** Bot picks mini-brief or full-brief based on classification; user doesn't choose
- **Due date is always asked:** This is the one field that should never be assumed (unlike urgency or division which can be inferred)

---

## Pass 5: State Design

### Conversation (Requester POV)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty (first contact) | Bot greeting with chat/form options | "I can get marketing help here" | Choose to chat or use form |
| Gathering (questions) | Bot asking a focused question with examples | "The bot needs more info from me" | Answer naturally, provide multiple details at once |
| Gathering (skipping) | "Got most of what I need! Just one question:" | "The bot is smart — it caught what I already said" | Answer the remaining question |
| Confirming | Formatted summary with all details + "Does this look right?" | "This is what will be submitted" | Say yes, request changes, or start over |
| Processing | "Setting everything up..." | "The bot is creating things for me" | Wait (typically 5-15 seconds) |
| Complete | Links to brief, folder, Monday task + "Marketing team notified" | "My request is submitted and the team knows about it" | Click links, upload assets, ask about status later |
| Partial (edit requested) | Updated summary with change applied + "All good now?" | "My correction was applied" | Confirm or make more changes |
| Error (system) | "Something went wrong... your info is saved, I'll retry" + form link | "There's a technical issue but my data isn't lost" | Wait for retry, use form as backup, contact team directly |
| Timeout (24h inactive) | "We started a request yesterday... continue, start over, or cancel?" | "The bot remembered my incomplete request" | Resume, restart, or cancel |

### Status Check (Requester POV)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Success | Project name, status, task breakdown, recent update, links | "Here's where my project stands" | Click links to see details |
| Not found | "I couldn't find a project matching..." + suggestions | "The bot couldn't match my search" | Try different keywords, check channel, ask team |
| Multiple matches | "I found a few matches:" + list | "My search was ambiguous" | Pick the right one |
| Error | "Having trouble checking Monday right now" | "Technical issue, not my fault" | Try again later or check Monday directly |

### #marketing-requests Notification (Marketing Team POV)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| New request | Formatted notification with summary + links + emoji prompt | "New request came in, here's everything I need" | Click links to start, react to claim |
| Quick request | "Quick Request:" prefix, single task link | "This is small, just one task" | Claim and complete quickly |
| Full project | "New Project:" prefix, multiple tasks listed | "This is substantial, has multiple deliverables" | Claim and plan work |

### Form Submission Processing

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Submitted | Form confirmation page (standard Google/Monday) | "My form went through" | Wait for bot DM |
| Bot DM received | Confirmation message with links | "Everything is set up from my form" | Click links, upload assets |
| Bot DM not received | Nothing (form processed but DM failed) | User may not notice | Check #marketing-requests or ask bot |
| Error | Nothing visible (webhook failed) | User doesn't know | Marketing team gets alerted, manual follow-up needed |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User doesn't know what to say first | Initial contact | Bot proactively offers options on any @mention, even without a clear request |
| User provides info out of order | Gathering phase | Bot extracts info from any message regardless of question sequence; tracks what's collected vs. missing |
| User gives vague answers ("something for an event") | Gathering phase | Bot asks targeted follow-ups: "What kind of event? And what deliverables do you need?" |
| User confirms but wants to change something after | Post-confirmation | Bot should accept corrections even after "yes" but before processing completes. After creation, tell user to edit the brief directly or message marketing team. |
| User doesn't respond to confirmation | Confirming state | 24h timeout with resume prompt. Don't auto-submit. |
| User messages bot from multiple threads | Conversation state | Track by user_id. If active conversation exists, remind user: "We have an open request in another thread — want to continue there or start fresh?" |
| User tries to have a general conversation | Any state | Bot gently redirects: "I'm best at helping with marketing requests. Want to submit one, or check on an existing request?" |
| Form and bot submission create duplicates | Dual entry points | Bot checks for recent submissions from same user. If found: "I see you submitted a form 10 minutes ago for [X]. Is this the same request or something new?" |
| Bot can't reach Google Drive or Monday | Processing state | Partial failure handling: create what you can, tell user what failed, retry automatically. Never leave user with zero output. |
| Marketing team doesn't see notification | #marketing-requests | Include @channel or @here for urgent requests. Consider a fallback: if no reaction within 4 hours, re-notify. |
| Status check returns stale data | Status check flow | Always show "Last updated: [timestamp]" so user knows data freshness |
| User asks about project that predates bot | Search/status flow | "I can only find projects created through me. For older projects, check Monday directly: [link]" |

**Visibility decisions:**

- **Must be visible:**
  - Chat vs. form choice (every first interaction)
  - Confirmation summary (every request, no exceptions)
  - "Marketing team has been notified" (after every successful creation)
  - All three links: brief, folder, Monday (after creation)
  - "Reply to me anytime to check on status" (after creation)
  - What the bot CAN'T do (when user asks for creative work)

- **Can be implied:**
  - "Cancel" option (users can say it but bot doesn't list it)
  - "Start over" (mentioned in confirmation but not in every message)
  - Help menu (only shown when asked)
  - Timeout rules (user doesn't need to know the 24h window)
  - Classification logic (user doesn't need to know how quick vs. full is decided)
  - Duplicate detection logic (only surfaces when relevant)

**UX constraints (hard rules for implementation):**

1. **Never auto-submit:** Always require explicit "yes" before creating anything
2. **Never leave user in silence:** If processing takes >2 seconds, send "Setting everything up..." first
3. **Always thread conversations:** Bot replies must be in-thread to avoid channel noise
4. **Always include all three links** in completion message (brief, folder, Monday) — even if one seems redundant
5. **Never ask a question the user already answered:** Extract info from all prior messages before asking next question
6. **Always show what was understood:** Before confirming, reflect back ALL collected information so user can verify
7. **Never use jargon:** Say "project folder" not "Google Drive directory." Say "task" not "Monday item."
8. **Error messages must include a fallback:** Every error must offer the form link or #marketing-team channel as alternatives
9. **Bot must identify itself as a bot:** Never pretend to be a human team member. Use "I'll set this up for the marketing team" not "I'll work on this."
10. **Completion message must distinguish infrastructure from work:** "Everything is set up" not "Everything is done." The work hasn't started yet.

---

## Visual Specifications

### Message Formatting (Slack Block Kit / mrkdwn)

Since MarcomsBot is conversational (Slack-native), "visual specs" means message formatting patterns:

**Greeting message:**
```
Hey! I can help you submit a marketing request.

You've got two options:
1. *Chat with me* — I'll ask a few questions and set everything up
2. *Fill out the form* — <form_url|Intake Form>

Want to chat, or prefer the form?
```

**Question message (single question):**
```
What do you need?
(e.g., social graphic, flyer, email campaign, video, event support, presentation)
```

**Smart skip message:**
```
Got most of what I need! Just one question:

When do you need the flyer by? (The event is March 10 — do you need it a few days before?)
```

**Confirmation message:**
```
Here's what I'm setting up:

:clipboard: *[Request Title]*
• *Division:* [division]
• *Type:* [request type]
• *Description:* [summary]
• *Deliverables:* [list]
• *Due:* [date]
• *Notes:* [any special details]

:white_check_mark: Does this look right?

Reply "yes" to confirm, or tell me what to change.
```

**Processing message:**
```
Setting everything up... :hourglass_flowing_sand:
```

**Completion message:**
```
All set! Here's everything:

:page_facing_up: *Brief:* <doc_url|Google Doc>
:file_folder: *Project folder:* <folder_url|Google Drive>
:white_check_mark: *Monday task:* <monday_url|Monday.com>

The marketing team has been notified in #marketing-requests.

Need to add files? Drop them in the project folder.
Have questions? Reply here and I'll help.
```

**Notification message (#marketing-requests):**
```
:inbox_tray: *New Request: [Title]*

*From:* [name] ([division])
*Type:* [request type]
*Due:* [date]

*Summary:* [1-2 sentence description]

:page_facing_up: Brief: <url|link>
:file_folder: Folder: <url|link>
:white_check_mark: Monday: <url|link>

React with :eyes: to claim this request.
```

**Error message:**
```
Something went wrong on my end. :warning:

Your request info has been saved — I'll retry in a moment.
If this keeps happening, you can use the form as a backup: <form_url|Intake Form>

Or message the marketing team directly in #marketing-team.
```

**Status response:**
```
*[Project Name]*

*Status:* [status]
*Assigned to:* [name]
*Due:* [date] ([X] days)

Latest update ([date, time]):
"[update text]"

:page_facing_up: Brief: <url|link>
:file_folder: Folder: <url|link>
:white_check_mark: Monday: <url|link>
```

### Interaction Timing

- Bot should respond within 2 seconds to any message (acknowledgment)
- Processing (creating brief + folder + tasks) may take 5-15 seconds — always show "Setting everything up..." first
- Timeout prompt after 24 hours of inactivity in an open conversation
- No rate limiting on user messages — handle rapid-fire corrections gracefully
