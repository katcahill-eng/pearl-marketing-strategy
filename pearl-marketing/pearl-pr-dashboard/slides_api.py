"""
slides_api.py — Direct Google Slides API helper for board deck updates.

Provides delete_elements, update_text, insert_image, and batch operations
so Claude can make deck changes directly without GAS scripts.

First run: opens browser for OAuth. Subsequent runs: uses stored token.
"""

import json
import os
import sys

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_PATH = os.path.join(SCRIPT_DIR, "token.json")
CREDS_PATH = os.path.join(SCRIPT_DIR, "credentials.json")

PRESENTATION_ID = "1IfMilLCp41cjlwixDZ_tXI1paqcdNJziV2HTGINQp-8"
SCOPES = [
    "https://www.googleapis.com/auth/presentations",
    "https://www.googleapis.com/auth/drive",
]


def get_service():
    """Authenticate and return a Slides API service."""
    creds = None
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PATH, "w") as f:
            f.write(creds.to_json())
    return build("slides", "v1", credentials=creds)


def delete_elements(object_ids):
    """Delete elements by their object IDs."""
    service = get_service()
    requests = [{"deleteObject": {"objectId": oid}} for oid in object_ids]
    body = {"requests": requests}
    resp = service.presentations().batchUpdate(
        presentationId=PRESENTATION_ID, body=body
    ).execute()
    print(f"Deleted {len(object_ids)} elements.")
    return resp


def update_text(object_id, new_text):
    """Replace all text in an element with new text."""
    service = get_service()
    requests = [
        {
            "deleteText": {
                "objectId": object_id,
                "textRange": {"type": "ALL"},
            }
        },
        {
            "insertText": {
                "objectId": object_id,
                "insertionIndex": 0,
                "text": new_text,
            }
        },
    ]
    body = {"requests": requests}
    resp = service.presentations().batchUpdate(
        presentationId=PRESENTATION_ID, body=body
    ).execute()
    print(f"Updated text in {object_id}.")
    return resp


def batch_update(requests_list):
    """Run arbitrary Slides API batch update requests."""
    service = get_service()
    body = {"requests": requests_list}
    resp = service.presentations().batchUpdate(
        presentationId=PRESENTATION_ID, body=body
    ).execute()
    print(f"Executed {len(requests_list)} requests.")
    return resp


def list_elements(slide_index):
    """List all elements on a slide with their IDs and types."""
    service = get_service()
    pres = service.presentations().get(
        presentationId=PRESENTATION_ID
    ).execute()
    slides = pres.get("slides", [])
    if slide_index >= len(slides):
        print(f"Slide index {slide_index} out of range (0-{len(slides)-1})")
        return
    slide = slides[slide_index]
    print(f"Slide {slide_index + 1} (objectId: {slide['objectId']}):")
    for elem in slide.get("pageElements", []):
        oid = elem["objectId"]
        etype = "unknown"
        text_preview = ""
        if "shape" in elem:
            etype = "shape"
            tf = elem["shape"].get("text", {})
            runs = []
            for te in tf.get("textElements", []):
                if "textRun" in te:
                    runs.append(te["textRun"]["content"].strip())
            text_preview = " ".join(runs)[:80]
        elif "image" in elem:
            etype = "image"
        elif "table" in elem:
            etype = "table"

        size = elem.get("size", {})
        transform = elem.get("transform", {})
        w = size.get("width", {}).get("magnitude", 0)
        h = size.get("height", {}).get("magnitude", 0)
        tx = transform.get("translateX", 0)
        ty = transform.get("translateY", 0)

        line = f"  {oid} [{etype}] pos=({tx:.0f},{ty:.0f}) size=({w:.0f}x{h:.0f})"
        if text_preview:
            line += f' "{text_preview}"'
        print(line)


# CLI interface
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 slides_api.py delete <id1> <id2> ...")
        print("  python3 slides_api.py update <objectId> <text>")
        print("  python3 slides_api.py list <slideIndex>")
        print("  python3 slides_api.py batch <json_file>")
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "delete":
        ids = sys.argv[2:]
        if not ids:
            print("Provide at least one object ID to delete.")
            sys.exit(1)
        delete_elements(ids)

    elif cmd == "update":
        if len(sys.argv) < 4:
            print("Usage: python3 slides_api.py update <objectId> <text>")
            sys.exit(1)
        oid = sys.argv[2]
        text = " ".join(sys.argv[3:])
        update_text(oid, text)

    elif cmd == "list":
        idx = int(sys.argv[2]) if len(sys.argv) > 2 else 0
        list_elements(idx)

    elif cmd == "batch":
        json_file = sys.argv[2]
        with open(json_file) as f:
            reqs = json.load(f)
        batch_update(reqs)

    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
