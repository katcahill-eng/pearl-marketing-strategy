// ═══════════════════════════════════════════════════════════════════════════════
// PEARL COMMERCE FUNNEL DATA — Complete Data Structure
// Extracted from session cc8b099e — originally /tmp/funnel-planning/pearl-all-funnels.jsx
// ═══════════════════════════════════════════════════════════════════════════════

// ─── STATUS DEFINITIONS ──────────────────────────────────────────────────────
const STATUS = {
  READY:    { label: "Ready to build", color: "#22c55e", bg: "#052e16", border: "#166534" },
  APPROVAL: { label: "Needs approval first", color: "#f59e0b", bg: "#1c1400", border: "#92400e" },
  BLOCKED:  { label: "Blocked / unknown", color: "#ef4444", bg: "#1c0505", border: "#991b1b" },
  FUTURE:   { label: "Post-launch OK", color: "#64748b", bg: "#0f172a", border: "#334155" },
  TBD:      { label: "TBD / placeholder", color: "#818cf8", bg: "#0f0c2e", border: "#3730a3" },
};

const TYPE_COLORS = {
  "Copy":         "#0ea5e9",
  "Design":       "#a855f7",
  "Tech":         "#f97316",
  "Integration":  "#ec4899",
  "Product":      "#ef4444",
  "Sales":        "#10b981",
  "Strategy":     "#f59e0b",
};

// ─── SEGMENT DEFINITIONS ─────────────────────────────────────────────────────
const SEGMENTS = {
  HOMEOWNER:    { label: "Homeowner",    icon: "\u{1F3E0}", color: "#34d399", bg: "#052e1a", border: "#065f46" },
  PROFESSIONAL: { label: "Professional", icon: "\u{1F454}", color: "#60a5fa", bg: "#0c1a2e", border: "#1e3a5f" },
};

// ─── FUNNEL DATA ──────────────────────────────────────────────────────────────
const FUNNELS = [
  // ═══════════════════════════════════════════════════════════════
  // FUNNEL 1: AGENT FREE TRIAL
  // ═══════════════════════════════════════════════════════════════
  {
    id: "agent",
    label: "Agent Free Trial",
    sublabel: "APRIL WK 2+",
    color: "#f59e0b",
    segment: "PROFESSIONAL",
    audience: "Real estate agents — Atlanta",
    owner: "Kat (copy + build) + Tim (Sales)",
    goal: "Get Atlanta agents into Pearl PRO app on free trial",
    keyDep: "Donovan — confirm in-app free trial UX and delivery mechanism",
    stages: [
      {
        id: "awareness", label: "AWARENESS", icon: "\u{1F4E3}",
        desc: "How agents first hear about the free trial",
        deliverables: [
          { name: "Outreach Email #1", type: "Copy", owner: "Kat + Tim", status: "APPROVAL", note: "Tim begins sales outreach to Atlanta agents. Kat leads copy.", gate: "Tim's strategy doc needed — confirm messaging angle" },
          { name: "Outreach Email #2 (Follow-up)", type: "Copy", owner: "Kat + Tim", status: "APPROVAL", note: "Follow-up cadence. How many touches? Tim to confirm.", gate: null },
          { name: "Agent One-Pager / Leave-Behind", type: "Design + Copy", owner: "Kat", status: "APPROVAL", note: "Supporting material for sales outreach. What does the free trial include?", gate: "Value props must be approved first" },
        ],
      },
      {
        id: "consideration", label: "CONSIDERATION", icon: "\u{1F50D}",
        desc: "Where agents learn what they're signing up for",
        deliverables: [
          { name: "Pearl PRO App Store Listing", type: "Product", owner: "Donovan / Product", status: "BLOCKED", note: "Agents need to find and download the app. Is the listing live and accurate?", gate: "Product dependency — confirm with Donovan" },
          { name: "Free Trial Value Props", type: "Copy", owner: "Kat", status: "APPROVAL", note: "What is included in the free trial? How long? What does an agent get?", gate: "Sean approval required" },
          { name: "Agent Landing Page (optional)", type: "Design + Copy", owner: "Kat", status: "TBD", note: "May not be needed if outreach links directly to app. Decision pending.", gate: "Confirm with Tim whether a standalone page is needed" },
        ],
      },
      {
        id: "conversion", label: "CONVERSION", icon: "\u{1F4F2}",
        desc: "Agent signs up for the free trial",
        deliverables: [
          { name: "In-App Free Trial Signup Flow", type: "Product", owner: "Donovan / Product", status: "BLOCKED", note: "Does the app support a free trial state? What does the signup look like inside PRO?", gate: "BLOCKED: Donovan must confirm this exists in the April 2 build" },
          { name: "HubSpot Signup Signal", type: "Integration", owner: "Kat + Carrie (CX)", status: "BLOCKED", note: "App must send a signal to HubSpot when an agent signs up for trial. Enables follow-up automation.", gate: "Depends on in-app flow being confirmed" },
          { name: "Confirmation / Welcome Screen (in-app)", type: "Product", owner: "Donovan / Product", status: "TBD", note: "What does the agent see immediately after signing up?", gate: null },
        ],
      },
      {
        id: "delivery", label: "DELIVERY", icon: "\u{1F4CA}",
        desc: "Agent accesses their free Pearl Score Report",
        deliverables: [
          { name: "Score Report in PRO App", type: "Product", owner: "Donovan / Product", status: "BLOCKED", note: "LINCHPIN: Can agents generate/view a Pearl Score Report inside Pearl PRO? Is this in the April 2 build?", gate: "CRITICAL: If this isn't in the April 2 build, the free trial has no deliverable" },
          { name: "Report Access Confirmation Email", type: "Copy", owner: "Kat", status: "BLOCKED", note: "Transactional email: 'Your free trial is active. Here's how to access your first report.'", gate: "Depends on HubSpot signal being set up" },
        ],
      },
      {
        id: "retention", label: "RETENTION", icon: "\u{2709}\u{FE0F}",
        desc: "Keep agents engaged during and after trial",
        deliverables: [
          { name: "Trial Welcome Email Series", type: "Copy", owner: "Kat", status: "FUTURE", note: "Onboarding sequence for new trial users. How to get value from the app.", gate: null },
          { name: "Trial Expiry / Upgrade Prompt", type: "Copy", owner: "Kat", status: "FUTURE", note: "When does the free trial end? What happens? Must coordinate with product on timing.", gate: "Trial end date / logic TBD with product" },
          { name: "HubSpot Email Automation", type: "Tech", owner: "Carrie (CX)", status: "FUTURE", note: "Automation flow for trial sequence. Same pattern as webinar flows.", gate: null },
        ],
      },
    ],
    infra: [
      { name: "HubSpot <> Pearl PRO App Integration", type: "Integration", owner: "Kat + Carrie", status: "BLOCKED", note: "App must be able to send signup/usage signals to HubSpot. Without this, no automation is possible." },
      { name: "Agent Segmentation List (HubSpot)", type: "Tech", owner: "Carrie (CX)", status: "BLOCKED", note: "Auto-populates when agent signs up for trial. Required for email automation targeting." },
      { name: "UTM Tracking on Outreach Links", type: "Tech", owner: "Kat", status: "APPROVAL", note: "Tag Tim's outreach emails so we know which emails drove signups." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // FUNNEL 2: HOMEOWNER PAID ADS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "homeowner-ads",
    label: "Homeowner Paid Ads",
    sublabel: "MAY 1+",
    color: "#ef4444",
    segment: "HOMEOWNER",
    audience: "Homeowners — initially Atlanta, then broader",
    owner: "Kat (lead) + Sean (approvals)",
    goal: "Drive homeowners via Meta/LinkedIn ads -> standalone landing page -> checkout -> $99 Pearl Score Report",
    keyDep: "Donovan — confirm standalone LP checkout can fire HubSpot conversion signal and report delivery mechanism",
    stages: [
      {
        id: "awareness", label: "AWARENESS", icon: "\u{1F4E3}",
        desc: "Paid ads drive homeowners to the offer",
        deliverables: [
          { name: "Ad Creative — Static Image", type: "Design", owner: "Kat", status: "APPROVAL", note: "Built in Canva. Multiple sizes for Meta/IG. Messaging must be approved before building.", gate: "Value props must be approved first" },
          { name: "Ad Creative — Video", type: "Design", owner: "Kat", status: "APPROVAL", note: "Meta/IG video format. Desktop + mobile versions.", gate: "Value props must be approved first" },
          { name: "LinkedIn Ad (small budget)", type: "Design", owner: "Kat", status: "APPROVAL", note: "Smaller spend. Same approval flow as Meta creatives.", gate: null },
          { name: "Ad Copy (headlines + body)", type: "Copy", owner: "Kat", status: "APPROVAL", note: "Multiple variants for A/B testing.", gate: "Value props must be approved first" },
        ],
      },
      {
        id: "consideration", label: "CONSIDERATION", icon: "\u{1F50D}",
        desc: "Homeowner learns what they're buying",
        deliverables: [
          { name: "Value Prop Copy", type: "Copy", owner: "Kat", status: "APPROVAL", note: "What's included, how to talk about it, which angle to lead with. Everything downstream is blocked until this is approved.", gate: "GATE: Sean approval required. Nothing else can be built until this is done." },
          { name: "Landing Page", type: "Design + Copy", owner: "Kat", status: "BLOCKED", note: "1 page. May not be needed if checkout lives inside registry (Kat's preference for UX).", gate: "BLOCKED: Registry vs. external LP decision needed from Donovan" },
          { name: "Product Image / Score Report Visual", type: "Design", owner: "Kat", status: "APPROVAL", note: "Required for Stripe product listing. What does the score report look like?", gate: null },
        ],
      },
      {
        id: "conversion", label: "CONVERSION", icon: "\u{1F4B3}",
        desc: "Homeowner pays $99 for their report",
        deliverables: [
          { name: "Stripe Product Listing", type: "Tech", owner: "Kat", status: "BLOCKED", note: "Build product in Stripe: name, description, $99 price, billing logic.", gate: "BLOCKED: Payment gateway timing (May). Also: LP vs. registry decision." },
          { name: "Checkout Page / Flow", type: "Tech", owner: "Kat", status: "BLOCKED", note: "Option A: External LP with embedded Stripe. Option B: Amazon-style sidebar inside registry (Kat's preference). Major structural decision.", gate: "BLOCKED: Donovan must confirm registry can support inline checkout" },
          { name: "HubSpot Tracking Pixel", type: "Tech", owner: "Kat", status: "BLOCKED", note: "On LP or registry. Listens for traffic source for attribution. Essential for campaign reporting.", gate: "Depends on LP vs. registry decision" },
          { name: "Thank You / Confirmation State", type: "Design + Copy", owner: "Kat", status: "BLOCKED", note: "Post-purchase state. 'Check your email' or redirect to report. Depends on delivery method.", gate: "Depends on how report is delivered" },
        ],
      },
      {
        id: "delivery", label: "DELIVERY", icon: "\u{1F4CA}",
        desc: "Homeowner receives their Pearl Score Report",
        deliverables: [
          { name: "Report Access Mechanism", type: "Product", owner: "Donovan / Product", status: "BLOCKED", note: "HTML report loads on page refresh (MVP). No PDF in v1. Must fire a signal that HubSpot can listen to.", gate: "CRITICAL BLOCKER: If delivery can't trigger HubSpot, the entire follow-up funnel breaks ('dead in the water')" },
          { name: "Stripe -> HubSpot Signal", type: "Integration", owner: "Kat + Carrie (CX)", status: "BLOCKED", note: "HubSpot listens for Stripe purchase event. Required for email automation to trigger.", gate: "Depends on product delivery being finalized" },
          { name: "HubSpot Segmentation List", type: "Tech", owner: "Carrie (CX)", status: "BLOCKED", note: "Auto-creates purchaser list. Triggers email series. Same pattern as webinar automation — Carrie knows how to build this.", gate: null },
        ],
      },
      {
        id: "retention", label: "RETENTION", icon: "\u{2709}\u{FE0F}",
        desc: "Post-purchase experience — reduce churn, drive engagement",
        deliverables: [
          { name: "Post-Purchase Email #1", type: "Copy", owner: "Kat", status: "FUTURE", note: "~15 min delay. Emotional connection. Confirm report access. Reduce chargebacks.", gate: "Post-launch OK — not required on day 1" },
          { name: "Email Series — Week 1 (3x)", type: "Copy", owner: "Kat", status: "FUTURE", note: "Onboarding, value reinforcement, what to do with your score.", gate: null },
          { name: "Email Series — Week 2 (2x)", type: "Copy", owner: "Kat", status: "FUTURE", note: "Deeper engagement. Feature education.", gate: null },
          { name: "Email Series — Week 3+ (1x/wk)", type: "Copy", owner: "Kat", status: "FUTURE", note: "Ongoing. 6-8 weeks total program.", gate: null },
          { name: "HubSpot Email Flow Build", type: "Tech", owner: "Carrie (CX)", status: "FUTURE", note: "Automation enters series on day of purchase signal. Ongoing cadence.", gate: null },
        ],
      },
    ],
    infra: [
      { name: "Ad Platform Setup (Meta + LinkedIn)", type: "Tech", owner: "Kat", status: "BLOCKED", note: "Campaign Manager accounts configured. Budget split confirmed." },
      { name: "UTM / Attribution Tracking", type: "Tech", owner: "Kat", status: "BLOCKED", note: "Every ad tagged. HubSpot knows which campaign drove each conversion." },
      { name: "Stripe <> Checkout Connection", type: "Integration", owner: "Kat", status: "BLOCKED", note: "Stripe listing connected to checkout. Tested so right product is purchased at right price." },
      { name: "QA — Full Purchase Flow", type: "Tech", owner: "Kat", status: "BLOCKED", note: "End-to-end test: ad click -> checkout -> payment -> report access -> email received. 2-3 days minimum." },
      { name: "QA — Dynamic Fields in Emails", type: "Tech", owner: "Kat + Carrie", status: "BLOCKED", note: "First name, purchase date, etc. render correctly in HubSpot. Not hashtag-first-name." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // FUNNEL 3: REGISTRY ON-SITE CHECKOUT
  // ═══════════════════════════════════════════════════════════════
  {
    id: "registry",
    label: "Registry On-Site Checkout",
    sublabel: "MAY 1+",
    color: "#06b6d4",
    segment: "HOMEOWNER",
    audience: "Homeowners / anyone searching Pearl registry",
    owner: "Kat (lead) + Sean (approvals)",
    goal: "Convert organic registry visitors into $99 Pearl Score Report purchases via Amazon-style sidebar checkout — no ad required",
    keyDep: "Donovan — can the registry support (1) an Amazon-style sidebar checkout and (2) HubSpot tracking pixels for attribution?",
    stages: [
      {
        id: "awareness", label: "AWARENESS", icon: "\u{1F4E3}",
        desc: "Homeowner finds Pearl via organic search or direct visit to registry",
        deliverables: [
          { name: "SEO / Registry Discoverability", type: "Product", owner: "Donovan / Product", status: "TBD", note: "Is the registry indexed and findable via Google? Does searching an address surface the registry page? Organic entry point — no paid media needed.", gate: "Product / SEO question — confirm registry is publicly crawlable" },
          { name: "Registry Page Value Messaging", type: "Copy", owner: "Kat", status: "APPROVAL", note: "Copy on the registry page that entices a visitor to want the full report. Teaser content strategy.", gate: "Value props must be approved by Sean first" },
        ],
      },
      {
        id: "consideration", label: "CONSIDERATION", icon: "\u{1F50D}",
        desc: "Visitor sees partial results, prompted to unlock full report",
        deliverables: [
          { name: "Partial Results / Gated Preview", type: "Product", owner: "Donovan / Product", status: "BLOCKED", note: "The 'See Full Results' moment. What does the homeowner see before paying? Must be compelling enough to convert.", gate: "BLOCKED: Product must define what is shown vs. gated in registry" },
          { name: "'Unlock Full Report' CTA Design", type: "Design + Copy", owner: "Kat", status: "BLOCKED", note: "Button, banner, or sidebar prompt that drives to checkout. On-brand, high-converting.", gate: "Depends on product defining the gated preview experience" },
        ],
      },
      {
        id: "conversion", label: "CONVERSION", icon: "\u{1F4B3}",
        desc: "Amazon-style sidebar checkout — no page redirect",
        deliverables: [
          { name: "Sidebar Checkout Widget", type: "Product", owner: "Donovan / Product", status: "BLOCKED", note: "LINCHPIN: Can the registry render an inline/sidebar Stripe checkout without leaving the page? This is the defining technical question for this entire funnel.", gate: "CRITICAL BLOCKER: Donovan must confirm registry can support inline checkout" },
          { name: "Stripe Product Listing (registry)", type: "Tech", owner: "Kat", status: "BLOCKED", note: "Same $99 product as paid ads funnel — but may need a separate Stripe entry point if registry checkout is a different surface.", gate: "Depends on sidebar checkout confirmation" },
          { name: "HubSpot Tracking Pixel (registry)", type: "Tech", owner: "Kat", status: "BLOCKED", note: "Pixel on registry page to capture traffic source. Essential if any paid traffic is ever sent to registry directly.", gate: "BLOCKED: Donovan must confirm registry supports third-party pixels" },
        ],
      },
      {
        id: "delivery", label: "DELIVERY", icon: "\u{1F4CA}",
        desc: "Report unlocks on the same page post-purchase",
        deliverables: [
          { name: "Post-Purchase Page Refresh / Report Reveal", type: "Product", owner: "Donovan / Product", status: "BLOCKED", note: "After payment, page refreshes to show full report — no redirect. This is Kat's preferred UX. Must fire HubSpot signal.", gate: "CRITICAL: Must trigger HubSpot conversion signal or email automation cannot fire" },
          { name: "Stripe -> HubSpot Signal (registry)", type: "Integration", owner: "Kat + Carrie (CX)", status: "BLOCKED", note: "Same signal as paid ads funnel, but triggered from registry surface. May be same integration or separate — confirm with Donovan.", gate: "Depends on checkout mechanism" },
        ],
      },
      {
        id: "retention", label: "RETENTION", icon: "\u{2709}\u{FE0F}",
        desc: "Post-purchase emails — can share series with paid ads funnel",
        deliverables: [
          { name: "Post-Purchase Email Series (shared)", type: "Copy", owner: "Kat", status: "FUTURE", note: "Same series as paid ads funnel if HubSpot signal is identical. If registry is a different trigger source, a new automation is needed.", gate: null },
          { name: "HubSpot Automation (registry)", type: "Tech", owner: "Carrie (CX)", status: "FUTURE", note: "If registry fires a different signal than Stripe/LP, this needs its own automation. Carrie to confirm.", gate: null },
        ],
      },
    ],
    infra: [
      { name: "Registry Pixel Support Confirmation", type: "Tech", owner: "Donovan / Product", status: "BLOCKED", note: "Can the registry accept third-party JS pixels (Meta, LinkedIn, HubSpot)? This is a product architecture question." },
      { name: "Sidebar Checkout Technical Build", type: "Product", owner: "Donovan / Product", status: "BLOCKED", note: "Building an inline checkout inside the registry is a significant product engineering task. Not a marketing build." },
      { name: "QA — Registry Purchase Flow", type: "Tech", owner: "Kat", status: "BLOCKED", note: "Separate QA from the LP/ads funnel. Must test: registry visit -> gated preview -> sidebar checkout -> payment -> report reveal -> email received." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // FUNNEL 4: CRM EMAIL CAMPAIGN
  // ═══════════════════════════════════════════════════════════════
  {
    id: "crm",
    label: "CRM Email Campaign",
    sublabel: "MAY 1+ (parallel)",
    color: "#22c55e",
    segment: "HOMEOWNER",
    audience: "Existing homeowners in HubSpot CRM",
    owner: "Kat (lead) + Carrie (HubSpot) + Sean (approvals)",
    goal: "Use existing database as free lead-gen lever to drive Score Report purchases",
    keyDep: "Segment decision: Atlanta only (~100 contacts) vs. all homeowner marketing contacts (tens of thousands)",
    stages: [
      {
        id: "awareness", label: "AWARENESS", icon: "\u{1F4E3}",
        desc: "Email blast to existing homeowners",
        deliverables: [
          { name: "Segment: All Homeowner Marketing Contacts", type: "Tech", owner: "Carrie (CX)", status: "APPROVAL", note: "All homeowners marked as marketing contacts. Kat estimates tens of thousands. Low cost, high reach.", gate: "Decision needed: broad list vs. Atlanta-only" },
          { name: "Segment: Atlanta Homeowners Only (optional)", type: "Tech", owner: "Carrie (CX)", status: "TBD", note: "Atlanta-only filter likely yields ~100 contacts. Probably not worth the effort for segmented send.", gate: "Confirm decision with Sean — likely skip this, go broad" },
          { name: "Launch Announcement Email", type: "Copy", owner: "Kat", status: "APPROVAL", note: "Subject line, body, CTA. Drives to LP or registry. Needs approval before send.", gate: "Value props must be approved first" },
          { name: "Email Design / Template", type: "Design", owner: "Kat", status: "APPROVAL", note: "HubSpot template. On-brand. Responsive.", gate: null },
        ],
      },
      {
        id: "consideration", label: "CONSIDERATION", icon: "\u{1F50D}",
        desc: "Homeowner clicks and evaluates the offer",
        deliverables: [
          { name: "Landing Page or Registry Destination", type: "Design + Copy", owner: "Kat", status: "BLOCKED", note: "Same LP/registry used by paid ads funnel. Shared asset — no rebuild needed if paid ads funnel is decided.", gate: "Depends on LP vs. registry decision (same blocker as paid ads funnel)" },
        ],
      },
      {
        id: "conversion", label: "CONVERSION", icon: "\u{1F4B3}",
        desc: "Homeowner purchases their report",
        deliverables: [
          { name: "Stripe Checkout (shared with paid ads funnel)", type: "Tech", owner: "Kat", status: "BLOCKED", note: "Same Stripe product and checkout as paid ads funnel. No separate build needed once paid ads funnel is set up.", gate: "Shared dependency — blocked by same Stripe/delivery questions" },
        ],
      },
      {
        id: "delivery", label: "DELIVERY", icon: "\u{1F4CA}",
        desc: "Report delivered (same as paid ads funnel)",
        deliverables: [
          { name: "Report Delivery (shared with paid ads)", type: "Product", owner: "Donovan / Product", status: "BLOCKED", note: "Same delivery mechanism as paid ads funnel. Not a separate build.", gate: "Blocked by same product delivery question" },
        ],
      },
      {
        id: "retention", label: "RETENTION", icon: "\u{2709}\u{FE0F}",
        desc: "Post-purchase follow-up (shared series)",
        deliverables: [
          { name: "Post-Purchase Email Series (shared)", type: "Copy", owner: "Kat", status: "FUTURE", note: "Same series as paid ads funnel. HubSpot automation triggers identically regardless of traffic source.", gate: null },
          { name: "HubSpot Send Setup", type: "Tech", owner: "Carrie (CX)", status: "APPROVAL", note: "Configure the CRM send: list, schedule, send window. Ensure no overlap with paid ads retargeting.", gate: null },
        ],
      },
    ],
    infra: [
      { name: "HubSpot List Pull + Verification", type: "Tech", owner: "Carrie (CX)", status: "APPROVAL", note: "Confirm list count, marketing contact status, no suppression issues before send." },
      { name: "Unsubscribe / Compliance Check", type: "Tech", owner: "Carrie (CX)", status: "APPROVAL", note: "HubSpot handles this automatically but needs verification before any large send." },
      { name: "Send Timing Decision", type: "Strategy", owner: "Kat", status: "APPROVAL", note: "Coordinate CRM send with paid ads launch. Don't compete with your own campaigns." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // FUNNEL 5: PEARL APP IN-APP PURCHASE
  // ═══════════════════════════════════════════════════════════════
  {
    id: "pearl-app",
    label: "Pearl App In-App Purchase",
    sublabel: "FUTURE — TBD",
    color: "#818cf8",
    segment: "HOMEOWNER",
    audience: "Homeowners inside Pearl app",
    owner: "TBD — needs product roadmap confirmation",
    goal: "Allow homeowners to purchase Pearl Score Report directly inside the Pearl app",
    keyDep: "Nothing can be planned until product confirms this is on the roadmap and defines the in-app purchase UX",
    stages: [
      {
        id: "awareness", label: "AWARENESS", icon: "\u{1F4E3}",
        desc: "Homeowner is prompted to purchase inside the app",
        deliverables: [
          { name: "In-App Prompt / Upsell Moment", type: "Product", owner: "TBD", status: "TBD", note: "Where in the app does the purchase CTA appear? After viewing partial score? After claiming home?", gate: "Product must define the UX entry point" },
          { name: "Push Notification (optional)", type: "Product", owner: "TBD", status: "TBD", note: "Could drive re-engagement. Separate trigger source.", gate: "Product capability TBD" },
        ],
      },
      {
        id: "consideration", label: "CONSIDERATION", icon: "\u{1F50D}",
        desc: "In-app screen explaining what they're buying",
        deliverables: [
          { name: "In-App Product Description Screen", type: "Product + Copy", owner: "Kat + Product", status: "TBD", note: "Marketing copy that lives inside the app. Must coordinate with product team on placement.", gate: "Product screen design must be defined first" },
        ],
      },
      {
        id: "conversion", label: "CONVERSION", icon: "\u{1F4B3}",
        desc: "In-app purchase",
        deliverables: [
          { name: "In-App Payment Flow", type: "Product", owner: "Donovan / Product", status: "TBD", note: "Is this Apple Pay / Google Pay / Stripe inside app? Completely different from web checkout. Major product build.", gate: "Open question: does this go through the same Stripe or a different processor?" },
          { name: "HubSpot Purchase Signal (in-app)", type: "Integration", owner: "TBD", status: "TBD", note: "Different signal source than web Stripe. Requires separate HubSpot integration. New automation setup.", gate: "Can't be built until in-app payment method is decided" },
        ],
      },
      {
        id: "delivery", label: "DELIVERY", icon: "\u{1F4CA}",
        desc: "Report delivered inside the app",
        deliverables: [
          { name: "In-App Report View", type: "Product", owner: "Donovan / Product", status: "TBD", note: "Does the app unlock the full report inline? Or redirect to web? Completely different UX from web funnel.", gate: "Product roadmap question — not defined" },
        ],
      },
      {
        id: "retention", label: "RETENTION", icon: "\u{2709}\u{FE0F}",
        desc: "Post-purchase follow-up — different from web funnel",
        deliverables: [
          { name: "Post-Purchase Email Series (app-specific)", type: "Copy", owner: "Kat", status: "TBD", note: "The emails could be the same but for better engagement they should be hyper-customized. New copy needed.", gate: null },
          { name: "HubSpot Automation (app-specific)", type: "Tech", owner: "Carrie (CX)", status: "TBD", note: "Separate automation from web funnel. Different trigger, different segmentation list.", gate: null },
        ],
      },
    ],
    infra: [
      { name: "In-App Purchase Infrastructure", type: "Product", owner: "Donovan / Product", status: "TBD", note: "Major unknown. App store purchase flows have specific requirements and fees (Apple 30% cut, etc.)." },
      { name: "HubSpot <> Pearl App Integration", type: "Integration", owner: "TBD", status: "TBD", note: "A separate connection from HubSpot <> Stripe. Every new purchase channel = new integration." },
      { name: "Attribution Tracking (in-app)", type: "Tech", owner: "TBD", status: "TBD", note: "How do we know which marketing activity drove in-app purchases? Separate tracking setup needed." },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SUMMARY STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════
//
// Funnel 1: Agent Free Trial     — 14 deliverables + 3 infra = 17 total | 5 BLOCKED, 4 APPROVAL, 2 TBD, 3 FUTURE
// Funnel 2: Homeowner Paid Ads   — 19 deliverables + 5 infra = 24 total | 14 BLOCKED, 5 APPROVAL, 0 TBD, 5 FUTURE
// Funnel 3: Registry Checkout    — 11 deliverables + 3 infra = 14 total | 10 BLOCKED, 1 APPROVAL, 1 TBD, 2 FUTURE
// Funnel 4: CRM Email Campaign   — 9 deliverables + 3 infra  = 12 total | 3 BLOCKED, 6 APPROVAL, 1 TBD, 2 FUTURE
// Funnel 5: Pearl App In-App     — 8 deliverables + 3 infra  = 11 total | 0 BLOCKED, 0 APPROVAL, 11 TBD, 0 FUTURE
//
// TOTAL: 78 deliverables across 5 funnels
//
// Google Slides presentation ID: 1JOZ2Tm1g1r3k4KI8St5uYItLQHOQSh25jc8gi7JOzr0
// ═══════════════════════════════════════════════════════════════════════════════
