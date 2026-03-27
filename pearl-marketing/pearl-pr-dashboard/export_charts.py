"""
Export individual PR dashboard visualizations as transparent PNGs.
Generates: bar chart, progress rings, timeline, pipeline, thought leadership.
Each is a separate PDF → converted to PNG via sips (macOS).
"""
import os
import subprocess
import math
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white, transparent, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(SCRIPT_DIR, "output", "charts")
os.makedirs(OUT_DIR, exist_ok=True)

pdfmetrics.registerFont(TTFont('Lato', os.path.join(SCRIPT_DIR, 'fonts', 'Lato-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Lato-Bold', os.path.join(SCRIPT_DIR, 'fonts', 'Lato-Bold.ttf')))

# Scale factor for high-res output
S = 3

# Pearl Brand Colors
TEAL = HexColor("#04b290")
NAVY = HexColor("#1c4c75")
RED = HexColor("#c92c25")
GOLD = HexColor("#fcaf1f")
BLUE = HexColor("#2597ec")
WH = white
DN = HexColor("#0c3860")
SL = HexColor("#5c7b96")
LS = HexColor("#e5eaf4")
BG = HexColor("#f5f6f8")

def rr(c, x, y, w, h, r, fc, sc=None):
    c.saveState(); c.setFillColor(fc); c.setStrokeColor(sc if sc else fc)
    if sc: c.setLineWidth(0.5 * S)
    p = c.beginPath(); p.roundRect(x, y, w, h, r); p.close()
    c.drawPath(p, fill=1, stroke=1 if sc else 0); c.restoreState()

def dot(c, x, y, r, col):
    c.setFillColor(col); c.circle(x, y, r, fill=1, stroke=0)

def sicon(c, x, y, st, sz=3.5*3):
    sz2 = sz
    if st == "complete":
        dot(c, x, y, sz2, TEAL); c.setStrokeColor(WH); c.setLineWidth(sz2*0.28)
        s = sz2/4; c.line(x-1.8*s,y,x-0.3*s,y-1.5*s); c.line(x-0.3*s,y-1.5*s,x+2*s,y+1.5*s)
    elif st == "approval":
        dot(c, x, y, sz2, GOLD); c.setStrokeColor(WH); c.setLineWidth(sz2*0.26)
        c.line(x, y+sz2*0.45, x, y-sz2*0.1)
        dot(c, x, y-sz2*0.35, sz2*0.13, WH)
    elif st == "in_progress":
        dot(c, x, y, sz2, BLUE); dot(c, x, y, sz2*0.38, WH)
    elif st == "drafted":
        dot(c, x, y, sz2, HexColor("#7b61ff"))
        c.setStrokeColor(WH); c.setLineWidth(sz2*0.22)
        s = sz2*0.35; c.line(x-s, y+s, x+s, y-s)
    elif st == "on_hold":
        dot(c, x, y, sz2, HexColor("#ff8c42"))
        c.setStrokeColor(WH); c.setLineWidth(sz2*0.22)
        s = sz2/4; c.line(x-s,y-1.5*s,x-s,y+1.5*s); c.line(x+s,y-1.5*s,x+s,y+1.5*s)
    else:
        dot(c, x, y, sz2, WH); c.setStrokeColor(SL); c.setLineWidth(sz2*0.22)
        c.circle(x, y, sz2-0.5*S, fill=0, stroke=1)

def scol(st):
    return {"complete": TEAL, "approval": GOLD, "in_progress": BLUE,
            "on_deck": SL, "not_started": SL, "drafted": HexColor("#7b61ff"),
            "on_hold": HexColor("#ff8c42")}[st]

def pdf_to_png(pdf_path, png_path):
    subprocess.run(["sips", "-s", "format", "png", pdf_path, "--out", png_path],
                   capture_output=True)

# ══════════════════════════════════════════════════════════════
# 1. BAR CHART — Press Release Performance
# ══════════════════════════════════════════════════════════════
def make_bar_chart():
    W = 340 * S
    H = 170 * S
    M = 12 * S
    pdf = os.path.join(OUT_DIR, "bar_chart.pdf")
    c = canvas.Canvas(pdf, pagesize=(W, H))

    # Card background
    rr(c, 0, 0, W, H, 5*S, WH, LS)

    # Title
    c.setFont("Lato-Bold", 9*S); c.setFillColor(DN)
    c.drawString(M, H - 14*S, "Press Release Performance")

    # Legend
    lg_y = H - 26*S
    rr(c, M, lg_y - 2*S, 6*S, 6*S, 1*S, SL)
    c.setFont("Lato", 4.5*S); c.setFillColor(SL)
    lbl1 = "SCORE™ Release (Nov '25)"
    c.drawString(M + 9*S, lg_y - 1*S, lbl1)
    lbl1_w = c.stringWidth(lbl1, "Lato", 4.5*S)
    x2 = M + 9*S + lbl1_w + 8*S
    rr(c, x2, lg_y - 2*S, 6*S, 6*S, 1*S, TEAL)
    c.setFont("Lato", 4.5*S); c.setFillColor(TEAL)
    c.drawString(x2 + 9*S, lg_y - 1*S, "Inman Award (Feb '26)")

    bar_data = [
        ("Total Views", 5811, 9809),
        ("Unique Readers", 888, 3663),
        ("Link Clicks", 249, 3076),
        ("Avg CTR", 9.35, 16.79),
    ]

    n = len(bar_data)
    bar_w = 22 * S
    bar_area_x = M + 10*S
    bar_area_w = W - 2*M - 20*S
    group_w = bar_area_w / n
    bar_area_h = H - 60*S
    bar_bottom = 18*S

    for i, (metric, nov, feb) in enumerate(bar_data):
        gx = bar_area_x + i * group_w + group_w/2
        mx = max(nov, feb) * 1.15
        nov_h = (nov / mx) * bar_area_h
        feb_h = (feb / mx) * bar_area_h

        rr(c, gx - bar_w - 1*S, bar_bottom, bar_w, nov_h, 2*S, SL)
        rr(c, gx + 1*S, bar_bottom, bar_w, feb_h, 2*S, TEAL)

        c.setFont("Lato-Bold", 5*S); c.setFillColor(SL)
        if metric == "Avg CTR":
            c.drawCentredString(gx - bar_w/2 - 1*S, bar_bottom + nov_h + 2*S, f"{nov}%")
            c.setFillColor(DN)
            c.drawCentredString(gx + bar_w/2 + 1*S, bar_bottom + feb_h + 2*S, f"{feb}%")
        else:
            c.drawCentredString(gx - bar_w/2 - 1*S, bar_bottom + nov_h + 2*S, f"{nov:,.0f}")
            c.setFillColor(DN)
            c.drawCentredString(gx + bar_w/2 + 1*S, bar_bottom + feb_h + 2*S, f"{feb:,.0f}")

        if feb > nov:
            pct = ((feb - nov) / nov) * 100
            pct_y = bar_bottom + feb_h * 0.5 - 2*S
            c.saveState()
            c.setFont("Lato-Bold", 5.5*S); c.setFillColor(WH)
            c.drawCentredString(gx + bar_w/2 + 1*S, pct_y, f"+{pct:.0f}%")
            c.restoreState()

        c.setFont("Lato", 5*S); c.setFillColor(DN)
        c.drawCentredString(gx, bar_bottom - 9*S, metric)

    c.save()
    png = os.path.join(OUT_DIR, "bar_chart.png")
    pdf_to_png(pdf, png)
    print(f"  Bar chart → {png}")

# ══════════════════════════════════════════════════════════════
# 2. PROGRESS RINGS — Q1 Progress at a Glance
# ══════════════════════════════════════════════════════════════
def make_progress_rings():
    W = 320 * S
    H = 165 * S
    M = 10 * S
    pdf = os.path.join(OUT_DIR, "progress_rings.pdf")
    c = canvas.Canvas(pdf, pagesize=(W, H))

    rr(c, 0, 0, W, H, 5*S, WH, LS)

    c.setFont("Lato-Bold", 9*S); c.setFillColor(DN)
    c.drawString(M, H - 14*S, "Q1 Progress at a Glance")

    stats = [
        ("Media\nPitching", "49", "60", 49/60, TEAL, "ring"),
        ("Story\nConcepts", "10", "15", 10/15, TEAL, "ring"),
        ("Press\nReleases", "1", "3", 1/3, TEAL, "ring"),
        ("Pearl SME\nInterviews", "1", "4", 1/4, TEAL, "ring"),
        ("Stories\nPublished", "1", None, None, TEAL, "count"),
        ("Reporter\nContacts", "29", None, None, TEAL, "count"),
    ]

    cols = 3; rows = 2
    cell_w = (W - 2*M) / cols
    cell_h = (H - 28*S) / rows

    for idx, (label, actual, target, pct, color, stype) in enumerate(stats):
        col = idx % cols
        row = idx // cols
        cx = M + col * cell_w + cell_w/2
        cy = H - 24*S - row * cell_h - cell_h/2 + 4*S

        if stype == "ring":
            radius = 16 * S
            c.setStrokeColor(LS); c.setLineWidth(4*S)
            c.circle(cx, cy, radius, fill=0, stroke=1)
            if pct and pct > 0:
                c.setStrokeColor(color); c.setLineWidth(4*S)
                extent = -min(pct, 1.0) * 360
                c.arc(cx-radius, cy-radius, cx+radius, cy+radius, 90, extent)
            c.setFont("Lato-Bold", 10*S); c.setFillColor(DN)
            c.drawCentredString(cx, cy - 3.5*S, actual)
            if target:
                c.setFont("Lato", 5*S); c.setFillColor(SL)
                c.drawCentredString(cx, cy + radius + 5*S, f"/ {target}")
        else:
            c.setFont("Lato-Bold", 16*S); c.setFillColor(TEAL)
            c.drawCentredString(cx, cy - 5*S, actual)

        label_y = cy - 23*S if stype == "ring" else cy - 20*S
        for j, ln in enumerate(label.split("\n")):
            c.setFont("Lato", 4.5*S); c.setFillColor(SL)
            c.drawCentredString(cx, label_y - j*6*S, ln)

    c.save()
    png = os.path.join(OUT_DIR, "progress_rings.png")
    pdf_to_png(pdf, png)
    print(f"  Progress rings → {png}")

# ══════════════════════════════════════════════════════════════
# 3. TIMELINE — Sprint Timeline
# ══════════════════════════════════════════════════════════════
def make_timeline():
    W = 580 * S
    H = 105 * S
    M = 18 * S
    pdf = os.path.join(OUT_DIR, "timeline.pdf")
    c = canvas.Canvas(pdf, pagesize=(W, H))

    rr(c, 0, 0, W, H, 5*S, WH, LS)

    c.setFont("Lato-Bold", 9*S); c.setFillColor(DN)
    c.drawString(M, H - 14*S, "Sprint Timeline")

    main_line_y = H - 38*S
    mini_line_y = 18*S
    lx1 = M; lx2 = W - M; ll = lx2 - lx1

    TODAY_DAY = 57; SPRINT_DAYS = 90

    def past_x(day): return lx1 + ll * (day / TODAY_DAY)
    def future_x(day): return lx1 + ll * ((day - TODAY_DAY) / (SPRINT_DAYS - TODAY_DAY))

    # Main expanded line (past)
    c.setStrokeColor(TEAL); c.setLineWidth(3*S); c.line(lx1, main_line_y, lx2, main_line_y)

    for lb, dn in [("Jan 1", 0), ("Jan 15", 14), ("Feb 1", 31), ("Feb 18", 48), ("Feb 27", 57)]:
        mx = past_x(dn)
        c.setStrokeColor(TEAL); c.setLineWidth(0.3*S)
        c.line(mx, main_line_y+3*S, mx, main_line_y-3*S)
        c.setFont("Lato", 4*S); c.setFillColor(SL); c.drawCentredString(mx, main_line_y-10*S, lb)

    # TODAY marker
    c.setFillColor(TEAL)
    p = c.beginPath(); p.moveTo(lx2-4*S, main_line_y+10*S); p.lineTo(lx2+4*S, main_line_y+10*S); p.lineTo(lx2, main_line_y+4*S); p.close()
    c.drawPath(p, fill=1, stroke=0)
    c.setFont("Lato-Bold", 5*S); c.setFillColor(TEAL); c.drawRightString(lx2, main_line_y+26*S, "TODAY Feb 27")

    # Past events
    for dn, label, st, etype in [
        (6, "Chicago Agent Op-Ed (Jan 7)", "complete", "coverage"),
        (34, "Inman Award PR Released (Feb 4)", "complete", "milestone"),
        (48, "Casey Murphy Interview (Feb 18)", "complete", "milestone"),
    ]:
        ex = past_x(dn)
        use_cl = NAVY if etype == "coverage" else scol(st)
        if etype == "coverage":
            dot(c, ex, main_line_y, 4*S, NAVY)
            c.setFont("Lato-Bold", 5*S); c.setFillColor(WH)
            c.drawCentredString(ex, main_line_y-1.8*S, "★")
        else:
            sicon(c, ex, main_line_y, st, 3.5*S)
        c.setStrokeColor(use_cl); c.setLineWidth(0.25*S)
        c.line(ex, main_line_y+4*S, ex, main_line_y+15*S)
        c.setFont("Lato-Bold", 5*S); c.setFillColor(use_cl)
        if dn == 48:
            c.drawRightString(ex, main_line_y+17*S, label)
        else:
            c.drawCentredString(ex, main_line_y+17*S, label)

    # Mini compressed line (future)
    c.setStrokeColor(LS); c.setLineWidth(2*S); c.line(lx1, mini_line_y, lx2, mini_line_y)
    for lb, dn in [("Feb 27", 57), ("Mar 1", 59), ("Mar 15", 73), ("Apr 1", 90)]:
        mx = future_x(dn)
        c.setStrokeColor(SL); c.setLineWidth(0.3*S)
        c.line(mx, mini_line_y+3*S, mx, mini_line_y-3*S)
        c.setFont("Lato", 4*S); c.setFillColor(SL); c.drawCentredString(mx, mini_line_y+5*S, lb)

    c.setFont("Lato", 4*S); c.setFillColor(SL); c.drawString(lx1, mini_line_y+12*S, "Upcoming")

    for dn, label, st in [
        (61, "Robin LeBaron Interview", "on_deck"),
        (78, "Early Access (On Hold)", "on_hold"),
        (90, "Sprint Ends", "on_deck"),
    ]:
        ex = future_x(dn)
        sicon(c, ex, mini_line_y, st, 2.5*S)
        c.setFont("Lato", 4.5*S); c.setFillColor(SL)
        c.drawCentredString(ex, mini_line_y-10*S, label)

    c.save()
    png = os.path.join(OUT_DIR, "timeline.png")
    pdf_to_png(pdf, png)
    print(f"  Timeline → {png}")

# ══════════════════════════════════════════════════════════════
# 4. PIPELINE — Press Release Pipeline + Earned Media
# ══════════════════════════════════════════════════════════════
def make_pipeline():
    W = 310 * S
    H = 230 * S
    M = 10 * S
    pdf = os.path.join(OUT_DIR, "pipeline.pdf")
    c = canvas.Canvas(pdf, pagesize=(W, H))

    rr(c, 0, 0, W, H, 5*S, WH, LS)

    # Press Release Pipeline
    y = H - 14*S
    c.setFont("Lato-Bold", 9*S); c.setFillColor(DN)
    c.drawString(M, y, "Press Release Pipeline")

    rels = [
        ("Inman Award + Registry/Score", "Feb 4", "Complete", "complete"),
        ("Early Access Program Launch", "On Hold", "On Hold", "on_hold"),
        ("Pearl Score Data Analysis", "TBD", "On Deck", "on_deck"),
    ]
    ry = y - 18*S
    for i, (ti, dt, sl, st) in enumerate(rels):
        yy = ry - i*16*S
        sicon(c, M+5*S, yy+3*S, st, 2.8*S)
        c.setFont("Lato", 7*S); c.setFillColor(DN); c.drawString(M+16*S, yy, ti)
        c.setFont("Lato", 5.5*S); c.setFillColor(SL); c.drawString(M+16*S, yy-8*S, dt)
        badge_h = 12*S
        sw = c.stringWidth(sl, "Lato-Bold", 5.5*S) + 8*S
        rr(c, W - M - sw - 4*S, yy - 3*S, sw, badge_h, 6*S, scol(st))
        c.setFont("Lato-Bold", 5.5*S); c.setFillColor(WH)
        c.drawCentredString(W - M - sw/2 - 4*S, yy - 3*S + badge_h/2 - 2*S, sl)

    # Earned Media Coverage
    cov_y = ry - len(rels)*16*S - 14*S
    c.setFont("Lato-Bold", 9*S); c.setFillColor(DN)
    c.drawString(M, cov_y, "Earned Media Coverage")

    cy = cov_y - 14*S
    c.setFont("Lato-Bold", 5*S); c.setFillColor(TEAL); c.drawString(M+5*S, cy, "2026")
    cy -= 12*S
    for dt, out, ti in [("Jan 7", "Chicago Agent Magazine", "Pearl SCORE Op-Ed")]:
        dot(c, M+5*S, cy+3*S, 3*S, NAVY)
        c.setFont("Lato-Bold", 6*S); c.setFillColor(DN); c.drawString(M+14*S, cy, dt)
        c.setFont("Lato-Bold", 6*S); c.setFillColor(TEAL); c.drawString(M+40*S, cy, out)
        cy -= 12*S

    cy -= 4*S
    c.setFont("Lato-Bold", 5*S); c.setFillColor(HexColor("#b0bec5")); c.drawString(M+5*S, cy, "2025")
    cy -= 12*S
    for dt, out in [("Dec 29", "Green Builder"), ("Nov 21", "KeyCrew Media"), ("Nov 14", "Retrofit Home")]:
        dot(c, M+5*S, cy+3*S, 3*S, HexColor("#d0d5dd"))
        c.setFont("Lato-Bold", 6*S); c.setFillColor(HexColor("#c0c7cf")); c.drawString(M+14*S, cy, dt)
        c.setFont("Lato-Bold", 6*S); c.setFillColor(HexColor("#c0c7cf")); c.drawString(M+40*S, cy, out)
        cy -= 12*S

    c.save()
    png = os.path.join(OUT_DIR, "pipeline.png")
    pdf_to_png(pdf, png)
    print(f"  Pipeline → {png}")

# ══════════════════════════════════════════════════════════════
# 5. THOUGHT LEADERSHIP — Pipeline + Active Conversations
# ══════════════════════════════════════════════════════════════
def make_thought_leadership():
    W = 330 * S
    H = 250 * S
    M = 10 * S
    pdf = os.path.join(OUT_DIR, "thought_leadership.pdf")
    c = canvas.Canvas(pdf, pagesize=(W, H))

    rr(c, 0, 0, W, H, 5*S, WH, LS)

    y = H - 14*S
    c.setFont("Lato-Bold", 9*S); c.setFillColor(DN)
    c.drawString(M, y, "Thought Leadership Pipeline")

    arts = [
        ("Citybiz Q&A Feature (Cynthia)", "In Approval", "approval", "Feb"),
        ("Hidden Reality: Aging Housing Stock", "In Progress", "in_progress", "Feb"),
        ("92M Homes Scored: What Data Reveals", "Pending", "on_deck", "Mar"),
        ("5 Steps to Home Performance (Casey)", "In Progress", "in_progress", "Mar"),
        ("The Blind Spot in Every Home Purchase", "On Deck", "on_deck", "Mar"),
        ("What Buyers Ask That Listings Don't Show", "On Deck", "on_deck", "Mar"),
        ("Missing Piece in Home Buying Decision", "On Deck", "on_deck", "Apr"),
        ("Energy Performance: Next Sq Footage", "On Deck", "on_deck", "Apr"),
        ("Inside the First Home Perf Registry", "On Deck", "on_deck", "Apr"),
        ("Robin LeBaron Q&A", "On Deck", "on_deck", "Apr"),
    ]

    ay = y - 18*S
    for i, (ti, sl, st, dt) in enumerate(arts):
        yy = ay - i*14*S
        sicon(c, M+5*S, yy+3*S, st, 2.8*S)
        c.setFont("Lato", 6.5*S); c.setFillColor(DN)
        disp = ti; mw = W - 90*S
        while c.stringWidth(disp, "Lato", 6.5*S) > mw and len(disp) > 10:
            disp = disp[:-4] + "..."
        c.drawString(M+15*S, yy, disp)
        c.setFont("Lato", 5*S); c.setFillColor(scol(st))
        c.drawRightString(W - M - 20*S, yy+1*S, sl)
        c.setFont("Lato", 5*S); c.setFillColor(SL)
        c.drawRightString(W - M, yy+1*S, dt)

    # Active Media Conversations
    opp_y = ay - len(arts)*14*S - 14*S
    c.setFont("Lato-Bold", 9*S); c.setFillColor(DN)
    c.drawString(M, opp_y, "Active Media Conversations")

    oy = opp_y - 14*S
    sicon(c, M+5*S, oy+3*S, "in_progress", 2.8*S)
    c.setFont("Lato", 6.5*S); c.setFillColor(DN)
    c.drawString(M+15*S, oy, "KeyCrew — Cynthia, data stories")

    # Pitching targets
    py = oy - 16*S
    c.setFont("Lato-Bold", 7*S); c.setFillColor(TEAL)
    c.drawString(M, py, "Pitching:")
    c.setFont("Lato", 5.5*S); c.setFillColor(SL)
    pubs = "NYT, WSJ, WaPo, NPR, Wired, CNET,"
    pubs2 = "HousingWire, Kiplinger, Bloomberg"
    c.drawString(M, py - 10*S, pubs)
    c.drawString(M, py - 19*S, pubs2)

    c.save()
    png = os.path.join(OUT_DIR, "thought_leadership.png")
    pdf_to_png(pdf, png)
    print(f"  Thought leadership → {png}")

# ══════════════════════════════════════════════════════════════
# 6. STATUS KEY — Legend
# ══════════════════════════════════════════════════════════════
def make_status_key():
    W = 400 * S
    H = 20 * S
    M = 5 * S
    pdf = os.path.join(OUT_DIR, "status_key.pdf")
    c = canvas.Canvas(pdf, pagesize=(W, H))

    kx = M; ky = 6*S
    c.setFont("Lato-Bold", 6*S); c.setFillColor(DN); c.drawString(kx, ky, "Status:")
    for lb, st, off in [("Complete","complete",34),("In Approval","approval",90),
                         ("In Progress","in_progress",155),("Drafted","drafted",220),
                         ("On Hold","on_hold",270),("On Deck","on_deck",325)]:
        sicon(c, kx+off*S, ky+2.5*S, st, 2.8*S)
        c.setFont("Lato", 5.5*S); c.setFillColor(SL)
        c.drawString(kx+off*S+6*S, ky, lb)

    c.save()
    png = os.path.join(OUT_DIR, "status_key.png")
    pdf_to_png(pdf, png)
    print(f"  Status key → {png}")

# ══════════════════════════════════════════════════════════════
# RUN ALL
# ══════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("Generating chart PNGs (3x resolution, transparent background)...")
    make_bar_chart()
    make_progress_rings()
    make_timeline()
    make_pipeline()
    make_thought_leadership()
    make_status_key()
    print(f"\nAll charts saved to {OUT_DIR}/")
