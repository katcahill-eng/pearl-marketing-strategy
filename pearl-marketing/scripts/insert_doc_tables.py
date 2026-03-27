"""Insert native Google Docs tables into the Investor Update Deck outline."""

import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PR_DASH = os.path.join(SCRIPT_DIR, "..", "pearl-pr-dashboard")
TOKEN_PATH = os.path.join(PR_DASH, "token.json")
CREDS_PATH = os.path.join(PR_DASH, "credentials.json")
DOC_ID = "12S3vGUJJhsUq2O2U6HCtcadj0inwtj5pJvj6oJF1e9g"

SCOPES = [
    "https://www.googleapis.com/auth/presentations",
    "https://www.googleapis.com/auth/drive",
]


def get_docs_service():
    creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    return build("docs", "v1", credentials=creds)


def delete_range(start, end):
    return {"deleteContentRange": {"range": {"startIndex": start, "endIndex": end}}}


def insert_table(index, rows, cols):
    return {
        "insertTable": {
            "rows": rows,
            "columns": cols,
            "location": {"index": index},
        }
    }


def insert_text(index, text):
    return {"insertText": {"location": {"index": index}, "text": text}}


def bold_range(start, end):
    return {
        "updateTextStyle": {
            "range": {"startIndex": start, "endIndex": end},
            "textStyle": {"bold": True},
            "fields": "bold",
        }
    }


def get_table_cell_indices(service, doc_id, table_index_in_body):
    """Re-fetch doc and get cell start indices for a table by its position in body."""
    doc = service.documents().get(documentId=doc_id).execute()
    tables = []
    for el in doc["body"]["content"]:
        if "table" in el:
            tables.append(el)
    if table_index_in_body >= len(tables):
        raise ValueError(f"Table index {table_index_in_body} not found, only {len(tables)} tables")
    table = tables[table_index_in_body]
    cells = []
    for row in table["table"]["tableRows"]:
        row_cells = []
        for cell in row["tableCells"]:
            # Each cell has content -> paragraph -> startIndex
            start = cell["content"][0]["startIndex"]
            row_cells.append(start)
        cells.append(row_cells)
    return cells


def populate_table(service, doc_id, table_index, data, header=None):
    """Populate a table with data. data is list of rows, each row is list of strings.
    header is optional first row."""
    rows = []
    if header:
        rows.append(header)
    rows.extend(data)

    # Work backwards through rows/cols so indices don't shift
    all_requests = []
    bold_requests = []

    cells = get_table_cell_indices(service, doc_id, table_index)

    for r_idx in range(len(rows) - 1, -1, -1):
        for c_idx in range(len(rows[r_idx]) - 1, -1, -1):
            text = rows[r_idx][c_idx]
            cell_start = cells[r_idx][c_idx]
            all_requests.append(insert_text(cell_start, text))
            if r_idx == 0 and header:
                bold_requests.append(bold_range(cell_start, cell_start + len(text)))

    service.documents().batchUpdate(
        documentId=doc_id, body={"requests": all_requests}
    ).execute()

    if bold_requests:
        # Re-fetch indices for bold since text insertion shifted everything
        cells = get_table_cell_indices(service, doc_id, table_index)
        bold_reqs = []
        for c_idx in range(len(header)):
            cell_start = cells[0][c_idx]
            text_len = len(header[c_idx])
            bold_reqs.append(bold_range(cell_start, cell_start + text_len))
        service.documents().batchUpdate(
            documentId=doc_id, body={"requests": bold_reqs}
        ).execute()


def main():
    service = get_docs_service()

    # Tables to insert (BOTTOM-UP to preserve indices):
    # 1. Source Materials: index 11766-12517 -> 3 cols: Document, Location, What It Provides
    # 2. Spokespeople: index 8416-8845 -> 3 cols: Name, Role & Location, Background
    # 3. Defensive Moat: index 7331-7785 -> 2 cols: Asset, Why It's Hard to Replicate
    # 4. Competitor Landscape: index 6964-7315 -> 3 cols: Competitor, Pillars Covered, Gap

    tables_config = [
        {
            "name": "Source Materials",
            "delete_start": 11766,
            "delete_end": 12518,
            "cols": 3,
            "header": ["Document", "Location", "What It Provides"],
            "data": [
                ["2026 Marketing Strategy", "docs/strategy/Pearl_2026_Marketing_Strategy.md", "Core narrative, stats, moat articulation"],
                ["Marketing Project Brief", "docs/strategy/PEARL_MARKETING_PROJECT_BRIEF.md", "Full Pearl context, credentials, investor targets"],
                ["PR Messaging Guide", "docs/messaging/Pearl_MKTG_PR Messaging Guide_Q12026.md", "\"From certification to data company\" language"],
                ["Competitive Landscape Deck", "assets/decks/Competitive_Landscape_Deck_Jan2026.md", "5-pillar advantage, competitor gaps"],
                ["Pearl Context", "pearl-strategy/knowledge/pearl-context.md", "Products, partnerships, GTM"],
                ["EAP Context", "pearl-strategy/knowledge/early-access-program.md", "Market pain stats, agent value prop"],
                ["90-Day Sprint Plans", "docs/strategy/ (Q1 + Q2)", "Execution timeline, milestones"],
            ],
        },
        {
            "name": "Spokespeople",
            "delete_start": 8416,
            "delete_end": 8845,
            "cols": 3,
            "header": ["Name", "Role & Location", "Background"],
            "data": [
                ["Cynthia Adams", "CEO, Denver", "Vision, industry transformation, \"why now\""],
                ["Robin LeBaron", "President, NYC", "Methodology, data infrastructure, partnerships"],
                ["Tim Stanislaus", "SVP Business Development, Seattle", "Ex-Zillow executive, industry perspective"],
                ["Casey Murphy", "SVP Quality & Standards, Annapolis/DC", "30+ years building science, owns SCORE 977 home"],
                ["Paul Bosson", "VP Channel Partnerships", "EAP, agent recruitment and enablement"],
            ],
        },
        {
            "name": "Defensive Moat",
            "delete_start": 7331,
            "delete_end": 7785,
            "cols": 2,
            "header": ["Asset", "Why It's Hard to Replicate"],
            "data": [
                ["10 years of industry relationships", "Time, trust, institutional knowledge"],
                ["DOE partnership (only national sponsor)", "Government relationships are slow to build"],
                ["Building science team (in-house)", "Rare expertise, methodology credibility"],
                ["Verified database (human verification)", "Can't be assembled from public records alone"],
                ["Contractor certification network", "Generates proprietary data streams"],
                ["B-Corp certification", "Accountability signal, mission alignment"],
            ],
        },
        {
            "name": "Competitor Landscape",
            "delete_start": 6964,
            "delete_end": 7315,
            "cols": 3,
            "header": ["Competitor", "Pillars Covered", "Gap"],
            "data": [
                ["Kukun", "Operations only", "No Safety, Comfort, Resilience, Energy. Highest threat."],
                ["Home energy auditors", "Energy only", "No Safety, Comfort, Operations, Resilience."],
                ["Inspection platforms", "Safety (partial)", "No scoring, no standardization."],
                ["Zillow / Redfin / Realtor.com", "None (transaction focus)", "Distribution partners, not competitors."],
            ],
        },
    ]

    for tbl in tables_config:
        print(f"Inserting table: {tbl['name']}...")

        # Step 1: Delete existing text content (leave final newline to avoid segment error)
        end = tbl["delete_end"]
        # Don't delete the very last char if it's the end of the doc segment
        requests = [delete_range(tbl["delete_start"], end - 1)]
        service.documents().batchUpdate(
            documentId=DOC_ID, body={"requests": requests}
        ).execute()

        # Step 2: Re-fetch doc to get current state after deletion
        doc = service.documents().get(documentId=DOC_ID).execute()

        # Find the insertion point (where we just deleted)
        insert_at = tbl["delete_start"]

        # Step 3: Insert table
        num_rows = len(tbl["data"]) + 1  # +1 for header
        requests = [insert_table(insert_at, num_rows, tbl["cols"])]
        service.documents().batchUpdate(
            documentId=DOC_ID, body={"requests": requests}
        ).execute()

        # Step 4: Count how many tables exist now and find ours
        doc = service.documents().get(documentId=DOC_ID).execute()
        tables_in_doc = []
        for el in doc["body"]["content"]:
            if "table" in el:
                tables_in_doc.append(el["startIndex"])

        # Find which table index corresponds to our insertion point
        # (it should be the one closest to insert_at)
        table_idx = 0
        for i, start in enumerate(tables_in_doc):
            if start >= insert_at - 5:  # small tolerance
                table_idx = i
                break

        # Step 5: Populate table
        populate_table(
            service,
            DOC_ID,
            table_idx,
            tbl["data"],
            tbl["header"],
        )
        print(f"  Done: {tbl['name']}")

    print("\nAll tables inserted successfully!")


if __name__ == "__main__":
    main()
