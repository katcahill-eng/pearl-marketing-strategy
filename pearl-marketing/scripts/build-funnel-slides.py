#!/usr/bin/env python3
"""
Build Commerce Funnel Journey Map slides in Google Slides.
Extracted from session cc8b099e — originally ran via Claude Code.

Presentation ID: 1JOZ2Tm1g1r3k4KI8St5uYItLQHOQSh25jc8gi7JOzr0

IMPORTANT: Before running, ensure tokens are fresh:
  - Check /Users/katcahill/.config/google-workspace-mcp/tokens.json
  - access_token must be valid (refresh if expired)

Layout references (Pearl brand deck):
  p2: 01_Title Slide_5050_Blue
  p3: 03_Section Title
  p4: 13_Freeform_Title Only (used for journey maps)
  g348df68b5df_0_617: 13_Freeform_Title with bullets
  g348df68b5df_0_413: 05_Content Overview_2items
  g348df68b5df_0_506: 05_Content Overview_3items
  g348df68b5df_2_1055: 15_Closing Slide_Pearl Logo
"""

import json, urllib.request

with open('/Users/katcahill/.config/google-workspace-mcp/tokens.json') as f:
    tokens = json.load(f)
access_token = tokens['access_token']

PRES_ID = "1JOZ2Tm1g1r3k4KI8St5uYItLQHOQSh25jc8gi7JOzr0"

def slides_api(requests_list):
    url = f"https://slides.googleapis.com/v1/presentations/{PRES_ID}:batchUpdate"
    data = json.dumps({"requests": requests_list}).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Authorization", f"Bearer {access_token}")
    req.add_header("Content-Type", "application/json")
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())

EMU = 914400  # 1 inch

# ═══════════════════════════════════════════════════════════════
# FUNNEL DATA structured by stage for journey maps
# ═══════════════════════════════════════════════════════════════
# Status legend: \U0001f534 = Blocked  \u26a0 = Needs Approval  \u23f3 = Post-Launch  \u2753 = TBD  \u2705 = Ready

FUNNELS = [
    {
        "slide_id": "jmap_f1",
        "title": "Agent Free Trial \u2014 Journey Map",
        "subtitle": "Audience: Real estate agents, Atlanta  |  Owner: Kat + Tim  |  April Wk 2+",
        "color": {"red": 0.96, "green": 0.62, "blue": 0.04},  # amber
        "stages": [
            {"name": "AWARENESS", "icon": "\U0001f4e3", "desc": "Agent hears about free trial",
             "items": [
                 ("Outreach Email #1", "\u26a0"),
                 ("Outreach Email #2", "\u26a0"),
                 ("Agent One-Pager", "\u26a0"),
             ]},
            {"name": "CONSIDERATION", "icon": "\U0001f50d", "desc": "Agent evaluates the offer",
             "items": [
                 ("PRO App Store Listing", "\U0001f534"),
                 ("Free Trial Value Props", "\u26a0"),
                 ("Agent Landing Page", "\u2753"),
             ]},
            {"name": "CONVERSION", "icon": "\U0001f4f2", "desc": "Agent signs up for trial",
             "items": [
                 ("In-App Signup Flow", "\U0001f534"),
                 ("HubSpot Signup Signal", "\U0001f534"),
                 ("Welcome Screen", "\u2753"),
             ]},
            {"name": "DELIVERY", "icon": "\U0001f4ca", "desc": "Agent gets Score Report",
             "items": [
                 ("Score Report in PRO", "\U0001f534"),
                 ("Access Confirm Email", "\U0001f534"),
             ]},
            {"name": "RETENTION", "icon": "\u2709\ufe0f", "desc": "Keep agents engaged",
             "items": [
                 ("Welcome Email Series", "\u23f3"),
                 ("Expiry/Upgrade Prompt", "\u23f3"),
                 ("HubSpot Automation", "\u23f3"),
             ]},
        ],
        "infra": "HubSpot \u2194 PRO Integration \U0001f534 \u00b7 Agent Segment List \U0001f534 \u00b7 UTM Tracking \u26a0"
    },
    {
        "slide_id": "jmap_f2",
        "title": "Homeowner Paid Ads \u2014 Journey Map",
        "subtitle": "Audience: Homeowners, Atlanta \u2192 broader  |  Owner: Kat + Sean  |  May 1+",
        "color": {"red": 0.89, "green": 0.16, "blue": 0.21},  # red
        "stages": [
            {"name": "AWARENESS", "icon": "\U0001f4e3", "desc": "Homeowner sees ad",
             "items": [
                 ("Static Ad Creative", "\u26a0"),
                 ("Video Ad Creative", "\u26a0"),
                 ("LinkedIn Ad", "\u26a0"),
                 ("Ad Copy Variants", "\u26a0"),
                 ("Ad Platform Setup", "\U0001f534"),
             ]},
            {"name": "CONSIDERATION", "icon": "\U0001f50d", "desc": "Homeowner learns the offer",
             "items": [
                 ("Value Prop Copy", "\u26a0 GATE"),
                 ("Landing Page", "\U0001f534"),
                 ("Product Visual", "\u26a0"),
             ]},
            {"name": "CONVERSION", "icon": "\U0001f4b3", "desc": "Homeowner pays $99",
             "items": [
                 ("Stripe Product", "\U0001f534"),
                 ("Checkout Flow", "\U0001f534"),
                 ("HubSpot Pixel", "\U0001f534"),
                 ("Thank You State", "\U0001f534"),
             ]},
            {"name": "DELIVERY", "icon": "\U0001f4ca", "desc": "Homeowner gets report",
             "items": [
                 ("Report Access", "\U0001f534"),
                 ("Stripe\u2192HubSpot", "\U0001f534"),
                 ("HubSpot Segment", "\U0001f534"),
             ]},
            {"name": "RETENTION", "icon": "\u2709\ufe0f", "desc": "Post-purchase nurture",
             "items": [
                 ("Email #1 (15m)", "\u23f3"),
                 ("Week 1 Series (3x)", "\u23f3"),
                 ("Week 2 Series (2x)", "\u23f3"),
                 ("Week 3+ (1x/wk)", "\u23f3"),
                 ("HubSpot Flow Build", "\u23f3"),
             ]},
        ],
        "infra": "UTM/Attribution \U0001f534 \u00b7 Stripe\u2194Checkout \U0001f534 \u00b7 QA Full Flow \U0001f534 \u00b7 QA Dynamic Fields \U0001f534"
    },
    {
        "slide_id": "jmap_f3",
        "title": "Registry On-Site Checkout \u2014 Journey Map",
        "subtitle": "Audience: Organic registry visitors  |  Owner: Kat + Sean  |  May 1+",
        "color": {"red": 0.02, "green": 0.71, "blue": 0.83},  # cyan
        "stages": [
            {"name": "AWARENESS", "icon": "\U0001f4e3", "desc": "Visitor finds registry",
             "items": [
                 ("SEO / Discoverability", "\u2753"),
                 ("Value Messaging", "\u26a0"),
             ]},
            {"name": "CONSIDERATION", "icon": "\U0001f50d", "desc": "Sees partial results",
             "items": [
                 ("Gated Preview", "\U0001f534"),
                 ("Unlock CTA Design", "\U0001f534"),
             ]},
            {"name": "CONVERSION", "icon": "\U0001f4b3", "desc": "Sidebar checkout",
             "items": [
                 ("Sidebar Widget", "\U0001f534"),
                 ("Stripe Listing", "\U0001f534"),
                 ("HubSpot Pixel", "\U0001f534"),
             ]},
            {"name": "DELIVERY", "icon": "\U0001f4ca", "desc": "Report reveals on page",
             "items": [
                 ("Page Refresh Reveal", "\U0001f534"),
                 ("Stripe\u2192HubSpot", "\U0001f534"),
             ]},
            {"name": "RETENTION", "icon": "\u2709\ufe0f", "desc": "Post-purchase emails",
             "items": [
                 ("Email Series (shared)", "\u23f3"),
                 ("HubSpot Auto", "\u23f3"),
             ]},
        ],
        "infra": "Pixel Support Confirm \U0001f534 \u00b7 Sidebar Build \U0001f534 \u00b7 QA Registry Flow \U0001f534"
    },
    {
        "slide_id": "jmap_f4",
        "title": "CRM Email Campaign \u2014 Journey Map",
        "subtitle": "Audience: HubSpot homeowner contacts  |  Owner: Kat + Carrie  |  May 1+",
        "color": {"red": 0.13, "green": 0.78, "blue": 0.46},  # green
        "stages": [
            {"name": "AWARENESS", "icon": "\U0001f4e3", "desc": "Email hits inbox",
             "items": [
                 ("All HO Contacts Seg", "\u26a0"),
                 ("ATL Only (optional)", "\u2753"),
                 ("Launch Email", "\u26a0"),
                 ("Email Template", "\u26a0"),
             ]},
            {"name": "CONSIDERATION", "icon": "\U0001f50d", "desc": "Click \u2192 LP or registry",
             "items": [
                 ("LP/Registry (shared)", "\U0001f534"),
             ]},
            {"name": "CONVERSION", "icon": "\U0001f4b3", "desc": "Checkout (shared)",
             "items": [
                 ("Stripe (shared)", "\U0001f534"),
             ]},
            {"name": "DELIVERY", "icon": "\U0001f4ca", "desc": "Report (shared)",
             "items": [
                 ("Delivery (shared)", "\U0001f534"),
             ]},
            {"name": "RETENTION", "icon": "\u2709\ufe0f", "desc": "Post-purchase",
             "items": [
                 ("Email Series (shared)", "\u23f3"),
                 ("HubSpot Send Setup", "\u26a0"),
             ]},
        ],
        "infra": "List Pull + Verify \u26a0 \u00b7 Compliance Check \u26a0 \u00b7 Send Timing \u26a0"
    },
    {
        "slide_id": "jmap_f5",
        "title": "Pearl App In-App Purchase \u2014 Journey Map",
        "subtitle": "Audience: Pearl app homeowners  |  Owner: TBD  |  FUTURE",
        "color": {"red": 0.64, "green": 0.36, "blue": 0.86},  # purple
        "stages": [
            {"name": "AWARENESS", "icon": "\U0001f4e3", "desc": "In-app prompt",
             "items": [
                 ("Upsell Moment", "\u2753"),
                 ("Push Notification", "\u2753"),
             ]},
            {"name": "CONSIDERATION", "icon": "\U0001f50d", "desc": "Product description",
             "items": [
                 ("In-App Description", "\u2753"),
             ]},
            {"name": "CONVERSION", "icon": "\U0001f4b3", "desc": "In-app purchase",
             "items": [
                 ("Payment Flow", "\u2753"),
                 ("HubSpot Signal", "\u2753"),
             ]},
            {"name": "DELIVERY", "icon": "\U0001f4ca", "desc": "Report in app",
             "items": [
                 ("In-App Report View", "\u2753"),
             ]},
            {"name": "RETENTION", "icon": "\u2709\ufe0f", "desc": "App-specific emails",
             "items": [
                 ("Email Series (custom)", "\u2753"),
                 ("HubSpot Auto", "\u2753"),
             ]},
        ],
        "infra": "In-App Purchase Infra \u2753 \u00b7 HubSpot\u2194App \u2753 \u00b7 Attribution \u2753"
    },
]


# ═══════════════════════════════════════════════════════════════
# SLIDE LAYOUT CONSTANTS (EMU)
# ═══════════════════════════════════════════════════════════════
SLIDE_W = 9144000
LEFT_MARGIN = int(0.4 * EMU)
STAGE_W = int(1.6 * EMU)
STAGE_GAP = int(0.15 * EMU)
HEADER_Y = int(0.95 * EMU)
HEADER_H = int(0.55 * EMU)
ITEMS_Y = HEADER_Y + HEADER_H + int(0.05 * EMU)
ITEMS_H = int(2.9 * EMU)
SUBTITLE_Y = int(0.6 * EMU)
INFRA_Y = int(4.55 * EMU)
ARROW_W = int(0.12 * EMU)

counter = 0
def uid():
    global counter
    counter += 1
    return f"jm_{counter}"


def build_journey_maps(title_ids):
    """
    Build all 5 journey map slides.
    title_ids: dict mapping slide_id -> title placeholder objectId
    """
    for funnel in FUNNELS:
        slide_id = funnel["slide_id"]
        title_el = title_ids.get(slide_id)

        requests = []

        # Set title
        if title_el:
            requests.append({"insertText": {"objectId": title_el, "text": funnel["title"], "insertionIndex": 0}})

        # Subtitle line
        sub_id = uid()
        requests.append({
            "createShape": {
                "objectId": sub_id,
                "shapeType": "TEXT_BOX",
                "elementProperties": {
                    "pageObjectId": slide_id,
                    "size": {"width": {"magnitude": SLIDE_W - 2*LEFT_MARGIN, "unit": "EMU"},
                             "height": {"magnitude": int(0.3 * EMU), "unit": "EMU"}},
                    "transform": {"scaleX": 1, "scaleY": 1, "translateX": LEFT_MARGIN, "translateY": SUBTITLE_Y, "unit": "EMU"}
                }
            }
        })
        requests.append({"insertText": {"objectId": sub_id, "text": funnel["subtitle"], "insertionIndex": 0}})
        requests.append({"updateTextStyle": {
            "objectId": sub_id,
            "style": {"fontSize": {"magnitude": 9, "unit": "PT"}, "foregroundColor": {"opaqueColor": {"rgbColor": {"red": 0.4, "green": 0.4, "blue": 0.4}}}},
            "fields": "fontSize,foregroundColor"
        }})

        # 5 stage columns
        for si, stage in enumerate(funnel["stages"]):
            x = LEFT_MARGIN + si * (STAGE_W + STAGE_GAP + ARROW_W)

            # Stage header box (rounded rectangle)
            hdr_id = uid()
            requests.append({
                "createShape": {
                    "objectId": hdr_id,
                    "shapeType": "ROUND_RECTANGLE",
                    "elementProperties": {
                        "pageObjectId": slide_id,
                        "size": {"width": {"magnitude": STAGE_W, "unit": "EMU"},
                                 "height": {"magnitude": HEADER_H, "unit": "EMU"}},
                        "transform": {"scaleX": 1, "scaleY": 1, "translateX": x, "translateY": HEADER_Y, "unit": "EMU"}
                    }
                }
            })
            requests.append({"updateShapeProperties": {
                "objectId": hdr_id,
                "shapeProperties": {
                    "shapeBackgroundFill": {"solidFill": {"color": {"rgbColor": funnel["color"]}}},
                    "outline": {"outlineFill": {"solidFill": {"color": {"rgbColor": funnel["color"]}}}, "weight": {"magnitude": 1, "unit": "PT"}}
                },
                "fields": "shapeBackgroundFill,outline"
            }})
            hdr_text = f"{stage['icon']} {stage['name']}\n{stage['desc']}"
            requests.append({"insertText": {"objectId": hdr_id, "text": hdr_text, "insertionIndex": 0}})
            requests.append({"updateTextStyle": {
                "objectId": hdr_id,
                "style": {"fontSize": {"magnitude": 9, "unit": "PT"}, "bold": True,
                           "foregroundColor": {"opaqueColor": {"rgbColor": {"red": 1, "green": 1, "blue": 1}}}},
                "textRange": {"type": "FIXED_RANGE", "startIndex": 0, "endIndex": len(stage['icon']) + 1 + len(stage['name'])},
                "fields": "fontSize,bold,foregroundColor"
            }})
            # Smaller description text
            desc_start = len(stage['icon']) + 1 + len(stage['name']) + 1
            requests.append({"updateTextStyle": {
                "objectId": hdr_id,
                "style": {"fontSize": {"magnitude": 7, "unit": "PT"}, "bold": False,
                           "foregroundColor": {"opaqueColor": {"rgbColor": {"red": 1, "green": 1, "blue": 1}}}},
                "textRange": {"type": "FIXED_RANGE", "startIndex": desc_start, "endIndex": desc_start + len(stage['desc'])},
                "fields": "fontSize,bold,foregroundColor"
            }})
            requests.append({"updateParagraphStyle": {
                "objectId": hdr_id,
                "style": {"alignment": "CENTER"},
                "textRange": {"type": "ALL"},
                "fields": "alignment"
            }})

            # Arrow between stages
            if si < 4:
                arr_id = uid()
                arr_x = x + STAGE_W + int(0.02 * EMU)
                requests.append({
                    "createShape": {
                        "objectId": arr_id,
                        "shapeType": "ARROW",
                        "elementProperties": {
                            "pageObjectId": slide_id,
                            "size": {"width": {"magnitude": ARROW_W, "unit": "EMU"},
                                     "height": {"magnitude": int(0.15 * EMU), "unit": "EMU"}},
                            "transform": {"scaleX": 1, "scaleY": 1, "translateX": arr_x, "translateY": HEADER_Y + int(0.2 * EMU), "unit": "EMU"}
                        }
                    }
                })
                requests.append({"updateShapeProperties": {
                    "objectId": arr_id,
                    "shapeProperties": {
                        "shapeBackgroundFill": {"solidFill": {"color": {"rgbColor": {"red": 0.75, "green": 0.75, "blue": 0.75}}}},
                        "outline": {"outlineFill": {"solidFill": {"color": {"rgbColor": {"red": 0.75, "green": 0.75, "blue": 0.75}}}}, "weight": {"magnitude": 0, "unit": "PT"}}
                    },
                    "fields": "shapeBackgroundFill,outline"
                }})

            # Deliverables list below the header
            items_id = uid()
            items_text = "\n".join([f"{status} {name}" for name, status in stage["items"]])
            requests.append({
                "createShape": {
                    "objectId": items_id,
                    "shapeType": "TEXT_BOX",
                    "elementProperties": {
                        "pageObjectId": slide_id,
                        "size": {"width": {"magnitude": STAGE_W, "unit": "EMU"},
                                 "height": {"magnitude": ITEMS_H, "unit": "EMU"}},
                        "transform": {"scaleX": 1, "scaleY": 1, "translateX": x, "translateY": ITEMS_Y, "unit": "EMU"}
                    }
                }
            })
            requests.append({"insertText": {"objectId": items_id, "text": items_text, "insertionIndex": 0}})
            requests.append({"updateTextStyle": {
                "objectId": items_id,
                "style": {"fontSize": {"magnitude": 8, "unit": "PT"},
                           "foregroundColor": {"opaqueColor": {"rgbColor": {"red": 0.15, "green": 0.15, "blue": 0.15}}}},
                "fields": "fontSize,foregroundColor"
            }})

        # Infrastructure bar at bottom
        infra_id = uid()
        requests.append({
            "createShape": {
                "objectId": infra_id,
                "shapeType": "ROUND_RECTANGLE",
                "elementProperties": {
                    "pageObjectId": slide_id,
                    "size": {"width": {"magnitude": SLIDE_W - 2*LEFT_MARGIN, "unit": "EMU"},
                             "height": {"magnitude": int(0.35 * EMU), "unit": "EMU"}},
                    "transform": {"scaleX": 1, "scaleY": 1, "translateX": LEFT_MARGIN, "translateY": INFRA_Y, "unit": "EMU"}
                }
            }
        })
        requests.append({"updateShapeProperties": {
            "objectId": infra_id,
            "shapeProperties": {
                "shapeBackgroundFill": {"solidFill": {"color": {"rgbColor": {"red": 0.94, "green": 0.94, "blue": 0.96}}}},
                "outline": {"outlineFill": {"solidFill": {"color": {"rgbColor": {"red": 0.8, "green": 0.8, "blue": 0.85}}}}, "weight": {"magnitude": 1, "unit": "PT"}}
            },
            "fields": "shapeBackgroundFill,outline"
        }})
        requests.append({"insertText": {"objectId": infra_id, "text": f"\u2699 INFRASTRUCTURE:  {funnel['infra']}", "insertionIndex": 0}})
        requests.append({"updateTextStyle": {
            "objectId": infra_id,
            "style": {"fontSize": {"magnitude": 8, "unit": "PT"},
                       "foregroundColor": {"opaqueColor": {"rgbColor": {"red": 0.3, "green": 0.3, "blue": 0.4}}}},
            "fields": "fontSize,foregroundColor"
        }})
        requests.append({"updateParagraphStyle": {
            "objectId": infra_id,
            "style": {"alignment": "CENTER"},
            "textRange": {"type": "ALL"},
            "fields": "alignment"
        }})

        # Legend
        legend_id = uid()
        requests.append({
            "createShape": {
                "objectId": legend_id,
                "shapeType": "TEXT_BOX",
                "elementProperties": {
                    "pageObjectId": slide_id,
                    "size": {"width": {"magnitude": SLIDE_W - 2*LEFT_MARGIN, "unit": "EMU"},
                             "height": {"magnitude": int(0.2 * EMU), "unit": "EMU"}},
                    "transform": {"scaleX": 1, "scaleY": 1, "translateX": LEFT_MARGIN, "translateY": INFRA_Y + int(0.4 * EMU), "unit": "EMU"}
                }
            }
        })
        requests.append({"insertText": {"objectId": legend_id, "text": "\U0001f534 Blocked    \u26a0 Needs Approval    \u23f3 Post-Launch OK    \u2753 TBD    \u26a0 GATE = Blocks everything downstream", "insertionIndex": 0}})
        requests.append({"updateTextStyle": {
            "objectId": legend_id,
            "style": {"fontSize": {"magnitude": 7, "unit": "PT"},
                       "foregroundColor": {"opaqueColor": {"rgbColor": {"red": 0.5, "green": 0.5, "blue": 0.5}}}},
            "fields": "fontSize,foregroundColor"
        }})

        result = slides_api(requests)
        print(f"Built journey map: {funnel['title']}")

    print("\nAll 5 journey maps built!")


if __name__ == "__main__":
    # Step 1: Create 5 slides using Title Only layout
    new_ids = ["jmap_f1", "jmap_f2", "jmap_f3", "jmap_f4", "jmap_f5"]
    requests = []
    for i, sid in enumerate(new_ids):
        requests.append({
            "createSlide": {
                "objectId": sid,
                "insertionIndex": 2 + i,  # After title + overview slides
                "slideLayoutReference": {"layoutId": "p4"}  # Title Only
            }
        })
    result = slides_api(requests)
    print("Created 5 new journey map slides")

    # Step 2: Get placeholder IDs for the new slides
    url = f"https://slides.googleapis.com/v1/presentations/{PRES_ID}?fields=slides(objectId,pageElements(objectId,shape(placeholder(type))))"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {access_token}")
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read())

    title_ids = {}
    for slide in data["slides"]:
        if slide["objectId"] in new_ids:
            for el in slide.get("pageElements", []):
                ph = el.get("shape", {}).get("placeholder", {})
                if ph.get("type") == "TITLE":
                    title_ids[slide["objectId"]] = el["objectId"]

    print(f"Title placeholders: {title_ids}")

    # Step 3: Build journey maps
    build_journey_maps(title_ids)
