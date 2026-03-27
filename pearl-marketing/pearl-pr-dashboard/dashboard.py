from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import math
import os

# Use fonts relative to this script's location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
pdfmetrics.registerFont(TTFont('Lato', os.path.join(SCRIPT_DIR, 'fonts', 'Lato-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Lato-Bold', os.path.join(SCRIPT_DIR, 'fonts', 'Lato-Bold.ttf')))

W, H = letter
OUT = os.path.join(SCRIPT_DIR, "output", "Pearl_PR_Dashboard.pdf")

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

M = 24

def rr(c, x, y, w, h, r, fc, sc=None):
    c.saveState(); c.setFillColor(fc); c.setStrokeColor(sc if sc else fc)
    if sc: c.setLineWidth(0.5)
    p = c.beginPath(); p.roundRect(x, y, w, h, r); p.close()
    c.drawPath(p, fill=1, stroke=1 if sc else 0); c.restoreState()

def dot(c, x, y, r, col):
    c.setFillColor(col); c.circle(x, y, r, fill=1, stroke=0)

def sicon(c, x, y, st, sz=3.5):
    if st == "complete":
        dot(c, x, y, sz, TEAL); c.setStrokeColor(WH); c.setLineWidth(sz*0.28)
        s = sz/4; c.line(x-1.8*s,y,x-0.3*s,y-1.5*s); c.line(x-0.3*s,y-1.5*s,x+2*s,y+1.5*s)
    elif st == "approval":
        # Exclamation mark icon
        dot(c, x, y, sz, GOLD); c.setStrokeColor(WH); c.setLineWidth(sz*0.26)
        c.line(x, y+sz*0.45, x, y-sz*0.1)
        dot(c, x, y-sz*0.35, sz*0.13, WH)
    elif st == "in_progress":
        dot(c, x, y, sz, BLUE); dot(c, x, y, sz*0.38, WH)
    elif st == "drafted":
        dot(c, x, y, sz, HexColor("#7b61ff"))  # purple for drafted
        c.setStrokeColor(WH); c.setLineWidth(sz*0.22)
        s = sz*0.35; c.line(x-s, y+s, x+s, y-s)  # pen stroke
    elif st == "on_hold":
        dot(c, x, y, sz, HexColor("#ff8c42"))  # orange for on hold
        c.setStrokeColor(WH); c.setLineWidth(sz*0.22)
        s = sz/4; c.line(x-s,y-1.5*s,x-s,y+1.5*s); c.line(x+s,y-1.5*s,x+s,y+1.5*s)
    else:  # on_deck / not_started
        dot(c, x, y, sz, WH); c.setStrokeColor(SL); c.setLineWidth(sz*0.22)
        c.circle(x, y, sz-0.5, fill=0, stroke=1)

def scol(st):
    return {"complete": TEAL, "approval": GOLD, "in_progress": BLUE,
            "on_deck": SL, "not_started": SL, "drafted": HexColor("#7b61ff"),
            "on_hold": HexColor("#ff8c42")}[st]

c = canvas.Canvas(OUT, pagesize=letter)
c.setFillColor(BG); c.rect(0, 0, W, H, fill=1, stroke=0)

# ── HEADER ──
hh = 44
rr(c, 0, H-hh, W, hh, 0, DN)
c.setFont("Lato-Bold", 14); c.setFillColor(WH)
c.drawString(M, H-28, "Pearl PR KPIs  |  90-Day Sprint Dashboard")
c.setFont("Lato", 7); c.setFillColor(SL)
c.drawString(M, H-39, "Jan 1 – Apr 1, 2026  |  Updated Mar 2, 2026")
rr(c, W-90, H-34, 66, 16, 8, TEAL)
c.setFont("Lato-Bold", 7); c.setFillColor(WH); c.drawCentredString(W-57, H-34 + 16/2 - 7*0.35, "ON TRACK")

# Status key
ky = H-hh-11; kx = W-M-340
c.setFont("Lato-Bold", 6); c.setFillColor(DN); c.drawString(kx, ky, "Status:")
for lb, st, off in [("Complete","complete",34),("In Approval","approval",82),("In Progress","in_progress",136),
                     ("Drafted","drafted",190),("On Hold","on_hold",230),("On Deck","on_deck",278)]:
    sicon(c, kx+off, ky+2.5, st, 2.5); c.setFont("Lato", 5.5); c.setFillColor(SL); c.drawString(kx+off+5, ky, lb)

# ══════════════════════════════════════════════════════════════
# ZOOMED TIMELINE — 73% for past (days 0-57), 27% for future
# ══════════════════════════════════════════════════════════════
ty = H - hh - 24
c.setFont("Lato-Bold", 8.5); c.setFillColor(DN); c.drawString(M, ty, "Sprint Timeline")

tl_top = ty - 8; tl_h = 96; tl_w = W - 2*M
rr(c, M, tl_top-tl_h, tl_w, tl_h, 5, WH, LS)

# TWO LINES: main expanded line (past) and a compressed mini-line (future)
main_line_y = tl_top - 28  # main expanded timeline
mini_line_y = tl_top - tl_h + 16  # compressed future strip

lx1 = M + 18; lx2 = M + tl_w - 18; ll = lx2 - lx1

# Sprint: Jan 1 (day 0) to Apr 1 (day 90). Today = Feb 27 = day 57.
TODAY_DAY = 60  # Mar 2
SPRINT_DAYS = 90

def past_x(day):
    return lx1 + ll * (day / TODAY_DAY)

def future_x(day):
    return lx1 + ll * ((day - TODAY_DAY) / (SPRINT_DAYS - TODAY_DAY))

# ── MAIN EXPANDED LINE (past: Jan 1 - Feb 27) ──
c.setStrokeColor(TEAL); c.setLineWidth(3); c.line(lx1, main_line_y, lx2, main_line_y)

# Month markers
for lb, dn in [("Jan 1", 0), ("Jan 15", 14), ("Feb 1", 31), ("Feb 18", 48), ("Mar 1", 59)]:
    mx = past_x(dn)
    c.setStrokeColor(HexColor("#04b290")); c.setLineWidth(0.3)
    c.line(mx, main_line_y+3, mx, main_line_y-3)
    c.setFont("Lato", 4); c.setFillColor(SL); c.drawCentredString(mx, main_line_y-9, lb)

# Today marker at end
c.setFillColor(TEAL)
p = c.beginPath(); p.moveTo(lx2-4, main_line_y+9); p.lineTo(lx2+4, main_line_y+9); p.lineTo(lx2, main_line_y+3.5); p.close()
c.drawPath(p, fill=1, stroke=0)
c.setFont("Lato-Bold", 5); c.setFillColor(TEAL); c.drawRightString(lx2, main_line_y+24, "TODAY Mar 2")

# Start label
c.setFont("Lato", 4.5); c.setFillColor(SL); c.drawCentredString(lx1, main_line_y+6, "Jan 1")

# Past events — alternate above/below to avoid label overlap
past_evts_above = [
    (6, "Chicago Agent Op-Ed (Jan 7)", "complete", "coverage"),
    (48, "Casey Murphy Interview (Feb 18)", "complete", "milestone"),
    (57, "Robin LeBaron Interview (Feb 27)", "complete", "milestone"),
]
past_evts_below = [
    (34, "Inman Award PR Released (Feb 4)", "complete", "milestone"),
    (54, "Citybiz Q&A Published (Feb 24)", "complete", "coverage"),
]

for dn, label, st, etype in past_evts_above:
    ex = past_x(dn)
    use_cl = NAVY if etype == "coverage" else scol(st)
    if etype == "coverage":
        dot(c, ex, main_line_y, 4, NAVY)
        c.setFont("Lato-Bold", 5); c.setFillColor(WH); c.drawCentredString(ex, main_line_y-1.8, "\u2605")
    else:
        sicon(c, ex, main_line_y, st, 3.5)
    c.setStrokeColor(use_cl); c.setLineWidth(0.25); c.line(ex, main_line_y+4, ex, main_line_y+14)
    c.setFont("Lato-Bold", 5); c.setFillColor(use_cl)
    if dn >= 48:
        c.drawRightString(ex+2, main_line_y+16, label)
    else:
        c.drawCentredString(ex, main_line_y+16, label)

for dn, label, st, etype in past_evts_below:
    ex = past_x(dn)
    use_cl = NAVY if etype == "coverage" else scol(st)
    if etype == "coverage":
        dot(c, ex, main_line_y, 4, NAVY)
        c.setFont("Lato-Bold", 5); c.setFillColor(WH); c.drawCentredString(ex, main_line_y-1.8, "\u2605")
    else:
        sicon(c, ex, main_line_y, st, 3.5)
    c.setStrokeColor(use_cl); c.setLineWidth(0.25); c.line(ex, main_line_y-4, ex, main_line_y-12)
    c.setFont("Lato-Bold", 5); c.setFillColor(use_cl)
    c.drawCentredString(ex, main_line_y-19, label)

# ── MINI COMPRESSED LINE (future: Feb 27 - Apr 1) ──
c.setStrokeColor(LS); c.setLineWidth(2); c.line(lx1, mini_line_y, lx2, mini_line_y)

# Month markers
for lb, dn in [("Mar 2", 60), ("Mar 15", 73), ("Apr 1", 90)]:
    mx = future_x(dn)
    c.setStrokeColor(SL); c.setLineWidth(0.3)
    c.line(mx, mini_line_y+3, mx, mini_line_y-3)
    c.setFont("Lato", 4); c.setFillColor(SL); c.drawCentredString(mx, mini_line_y+5, lb)

c.setFont("Lato", 4); c.setFillColor(SL)
c.drawString(lx1, mini_line_y+11, "Upcoming")

# PR ramp-up span bar (last week of Mar through Apr 1)
ramp_x1 = future_x(83); ramp_x2 = future_x(90)
rr(c, ramp_x1, mini_line_y-5, ramp_x2-ramp_x1, 10, 3, HexColor("#e0f5ef"), TEAL)
c.setFont("Lato-Bold", 4); c.setFillColor(TEAL)
c.drawCentredString((ramp_x1+ramp_x2)/2, mini_line_y-13, "Atlanta PR Ramp-Up")

# Robin done, Early Access ~late Mar = day 78, Sprint Ends = day 90
future_evts = [
    (78, "Early Access (On Hold)", "on_hold"),
    (90, "Sprint Ends", "on_deck"),
]

for dn, label, st in future_evts:
    ex = future_x(dn)
    sicon(c, ex, mini_line_y, st, 2.5)
    c.setFont("Lato", 4.5); c.setFillColor(SL)
    c.drawCentredString(ex, mini_line_y-9, label)

cursor = tl_top - tl_h - 14

# ══════════════════════════════════════════════════════════════
# ROW 2: GlobeNewswire Charts (left) | Q1 Progress Rings (right)
# ══════════════════════════════════════════════════════════════
r2 = cursor
chart_w = W * 0.48 - M
ring_x = W * 0.48 + 12
ring_w = W - ring_x - M

# ── LEFT: GlobeNewswire Comparison Bar Charts ──
c.setFont("Lato-Bold", 8.5); c.setFillColor(DN); c.drawString(M, r2, "Press Release Performance")

chart_top = r2 - 14
chart_h = 130
rr(c, M, chart_top - chart_h, chart_w, chart_h, 5, WH, LS)

bar_data = [
    ("Total Views", 5811, 9809),
    ("Unique Readers", 888, 3663),
    ("Link Clicks", 249, 3076),
    ("Avg CTR", 9.35, 16.79),
]

# Center the bars within the card
n_groups = len(bar_data)
bar_w = 20
total_bar_groups_w = n_groups * (bar_w * 2 + 2) + (n_groups - 1) * 20
bar_area_x = M + (chart_w - total_bar_groups_w) / 2
bar_area_w = total_bar_groups_w
bar_area_top = chart_top - 10
bar_area_h = chart_h - 28
group_w = bar_area_w / n_groups

for i, (metric, nov, feb) in enumerate(bar_data):
    gx = bar_area_x + i * group_w + group_w/2
    mx = max(nov, feb) * 1.15
    nov_h = (nov / mx) * bar_area_h
    feb_h = (feb / mx) * bar_area_h
    bar_bottom = chart_top - chart_h + 16

    # Nov bar (slate)
    rr(c, gx - bar_w - 1, bar_bottom, bar_w, nov_h, 2, SL)
    # Feb bar (teal)
    rr(c, gx + 1, bar_bottom, bar_w, feb_h, 2, TEAL)

    # Values on top of bars
    c.setFont("Lato-Bold", 4.5); c.setFillColor(SL)
    if metric == "Avg CTR":
        c.drawCentredString(gx - bar_w/2 - 1, bar_bottom + nov_h + 2, f"{nov}%")
        c.setFillColor(DN)
        c.drawCentredString(gx + bar_w/2 + 1, bar_bottom + feb_h + 2, f"{feb}%")
    else:
        c.drawCentredString(gx - bar_w/2 - 1, bar_bottom + nov_h + 2, f"{nov:,.0f}")
        c.setFillColor(DN)
        c.drawCentredString(gx + bar_w/2 + 1, bar_bottom + feb_h + 2, f"{feb:,.0f}")

    # Growth % inside the Feb bar (white text, vertically centered)
    if feb > nov:
        pct_change = ((feb - nov) / nov) * 100
        pct_label = f"+{pct_change:.0f}%"
        # Place inside feb bar, near top but inside
        pct_y = bar_bottom + feb_h * 0.5 - 2
        c.saveState()
        c.setFont("Lato-Bold", 5); c.setFillColor(WH)
        c.drawCentredString(gx + bar_w/2 + 1, pct_y, pct_label)
        c.restoreState()

    # Metric label (single line)
    c.setFont("Lato", 5); c.setFillColor(DN)
    c.drawCentredString(gx, bar_bottom - 8, metric)

# Legend
lg_y = chart_top - 7
rr(c, M + 6, lg_y - 2, 6, 6, 1, SL)
c.setFont("Lato", 4); c.setFillColor(SL)
lbl1 = "Pearl SCORE\u2122 Release (Nov '25)"
c.drawString(M + 14, lg_y - 1, lbl1)
lbl1_w = c.stringWidth(lbl1, "Lato", 4)
x2 = M + 14 + lbl1_w + 10
rr(c, x2, lg_y - 2, 6, 6, 1, TEAL)
c.setFont("Lato", 4); c.setFillColor(TEAL); c.drawString(x2 + 8, lg_y - 1, "Inman Best of Proptech Award (Feb '26)")

left_bot_r2 = chart_top - chart_h

# ── RIGHT: Q1 Progress Rings (ORIGINAL SCOPE ONLY) ──
c.setFont("Lato-Bold", 8.5); c.setFillColor(DN); c.drawString(ring_x, r2, "Q1 Progress at a Glance")

ring_top = r2 - 14
ring_card_h = 130
rr(c, ring_x, ring_top - ring_card_h, ring_w, ring_card_h, 5, WH, LS)

# Stats from tracker
# type: "ring" = progress toward target, "count" = simple total
stats = [
    ("Media\nPitching", "42", "60", 42/60, TEAL, "ring"),
    ("Story\nConcepts", "10", "15", 10/15, TEAL, "ring"),
    ("Press\nReleases", "1", "4", 1/4, TEAL, "ring"),
    ("Pearl SME\nInterviews", "3", "4", 3/4, TEAL, "ring"),
    ("Stories\nPublished", "2", None, None, TEAL, "count"),
    ("Reporter\nContacts", "38", None, None, TEAL, "count"),
]

n_stats = len(stats)
ring_area_x = ring_x + 8
ring_area_w = ring_w - 16
cols_per_row = 3
rows = 2
cell_w = ring_area_w / cols_per_row
cell_h = (ring_card_h - 12) / rows

for idx, (label, actual, target, pct, color, stype) in enumerate(stats):
    col = idx % cols_per_row
    row = idx // cols_per_row
    cx = ring_area_x + col * cell_w + cell_w/2
    cy = ring_top - 8 - row * cell_h - cell_h/2 + 4

    if stype == "status_ring":
        # Multi-segment status ring — color is a list of (status, count)
        radius = 14
        c.setStrokeColor(LS); c.setLineWidth(3.5)
        c.circle(cx, cy, radius, fill=0, stroke=1)
        segments = color  # [(status, count), ...]
        total = sum(cnt for _, cnt in segments)
        start_angle = 90  # 12 o'clock
        for seg_st, seg_cnt in segments:
            seg_extent = -(seg_cnt / total) * 360
            c.setStrokeColor(scol(seg_st)); c.setLineWidth(3.5)
            c.arc(cx-radius, cy-radius, cx+radius, cy+radius, start_angle, seg_extent)
            start_angle += seg_extent
        c.setFont("Lato-Bold", 8); c.setFillColor(DN)
        c.drawCentredString(cx, cy - 3, actual)
        if target:
            c.setFont("Lato", 4); c.setFillColor(SL)
            c.drawCentredString(cx, cy + radius + 5, f"/ {target}")
    elif stype == "ring":
        # Progress ring
        radius = 14
        c.setStrokeColor(LS); c.setLineWidth(3.5)
        c.circle(cx, cy, radius, fill=0, stroke=1)
        if pct and pct > 0:
            c.setStrokeColor(color); c.setLineWidth(3.5)
            extent = -min(pct, 1.0) * 360
            c.arc(cx-radius, cy-radius, cx+radius, cy+radius, 90, extent)
        c.setFont("Lato-Bold", 8); c.setFillColor(DN)
        c.drawCentredString(cx, cy - 3, actual)
        # Target above ring
        if target:
            c.setFont("Lato", 4); c.setFillColor(SL)
            c.drawCentredString(cx, cy + radius + 5, f"/ {target}")
    else:
        # Simple count — just a big number, no ring
        c.setFont("Lato-Bold", 14); c.setFillColor(TEAL)
        c.drawCentredString(cx, cy - 4, actual)

    # Label below
    label_start_y = cy - 20 if stype == "ring" else cy - 18
    lines = label.split("\n")
    for j, ln in enumerate(lines):
        c.setFont("Lato", 4); c.setFillColor(SL)
        c.drawCentredString(cx, label_start_y - j*5.5, ln)

right_bot_r2 = ring_top - ring_card_h

cursor = min(left_bot_r2, right_bot_r2) - 16

# ══════════════════════════════════════════════════════════════
# ROW 3: Press Releases + Coverage (left) | Thought Leadership + Opps (right)
# ══════════════════════════════════════════════════════════════
r3 = cursor
col_split = W * 0.48
cl_w = col_split - M - 6
cr_x = col_split + 6
cr_w = W - cr_x - M

# ── LEFT: Press Release Pipeline ──
c.setFont("Lato-Bold", 8.5); c.setFillColor(DN); c.drawString(M, r3, "Press Release Pipeline")

rels = [
    ("Inman Award + Registry/Score","Feb 4","Complete","complete",
     "https://www.globenewswire.com/news-release/2026/02/03/3231003/0/en/Pearl-Named-Winner-of-Inman-s-Best-of-Proptech-Award-for-Sustainability-Climate-Resilience.html"),
    ("Early Access Program Launch","Feb 28 → On Hold (Tim)","On Hold","on_hold", None),
    ("Pearl Score Data Analysis","TBD","On Deck","on_deck", None),
    ("SCORE Report Launch","May","On Deck","on_deck", None),
]
ry = r3 - 16
for i, (ti, dt, sl, st, url) in enumerate(rels):
    y = ry - i*14
    sicon(c, M+5, y+3, st, 2.5)
    c.setFont("Lato", 6.5); c.setFillColor(DN); c.drawString(M+14, y, ti)
    if url:
        tw = c.stringWidth(ti, "Lato", 6.5)
        c.linkURL(url, (M+14, y-2, M+14+tw, y+7), relative=0)
    # For on_hold, show the date with strikethrough effect then the hold note
    if st == "on_hold":
        c.setFont("Lato", 5.5); c.setFillColor(SL)
        # Strikethrough "Feb 28"
        c.drawString(M+14, y-7, "Feb 28")
        sw_date = c.stringWidth("Feb 28", "Lato", 5.5)
        c.setStrokeColor(SL); c.setLineWidth(0.4)
        c.line(M+14, y-5, M+14+sw_date, y-5)
        # "Drafted" badge
        badge_h = 11; badge_y = y - 2
        drafted_lbl = "Drafted"
        sw2 = c.stringWidth(drafted_lbl, "Lato-Bold", 5.5)+8
        rr(c, M + cl_w - sw2 - 4, badge_y, sw2, badge_h, 5.5, HexColor("#7b61ff"))
        c.setFont("Lato-Bold", 5.5); c.setFillColor(WH)
        c.drawCentredString(M + cl_w - sw2/2 - 4, badge_y + badge_h/2 - 5.5*0.35, drafted_lbl)
        # "On Hold" note to the left of the badge
        oh_lbl = "On Hold — Tim"
        c.setFont("Lato", 5); c.setFillColor(HexColor("#ff8c42"))
        c.drawRightString(M + cl_w - sw2 - 8, y - 1, oh_lbl)
    else:
        c.setFont("Lato", 5.5); c.setFillColor(SL); c.drawString(M+14, y-7, dt)
        # Status badge
        badge_h = 11; badge_y = y - 2
        sw = c.stringWidth(sl, "Lato-Bold", 5.5)+8
        rr(c, M + cl_w - sw - 4, badge_y, sw, badge_h, 5.5, scol(st))
        c.setFont("Lato-Bold", 5.5); c.setFillColor(WH)
        c.drawCentredString(M + cl_w - sw/2 - 4, badge_y + badge_h/2 - 5.5*0.35, sl)

left_after_rels = ry - len(rels)*14

# ── LEFT: Media Coverage Log ──
cov_hdr = left_after_rels - 12
c.setFont("Lato-Bold", 8.5); c.setFillColor(DN); c.drawString(M, cov_hdr, "Earned Media Coverage")

covs_2026 = [
    ("Feb 24","Citybiz","Cynthia Adams, CEO: What is a Home Performance Score?", None),
    ("Jan 7","Chicago Agent Magazine","Pearl SCORE Op-Ed Published",
     "https://chicagoagentmagazine.com/2026/01/07/pearl-score-2/"),
]
covs_2025 = [
    ("Dec 29","Green Builder Magazine","Streamlined Home Performance Tool",
     "https://www.greenbuildermedia.com/blog/streamlined-home-performance-tool-for-every-home"),
    ("Nov 21","KeyCrew Media","Home Performance Data Is Changing RE",
     "https://keycrew.co/journal/the-overlooked-metric-how-home-performance-data-is-changing-real-estate/"),
    ("Nov 14","Retrofit Home Magazine","Pearl Registry Has Launched",
     "https://retrofithomemagazine.com/2025/11/pearl-home-performance-registry-has-launched/"),
]

cy2 = cov_hdr - 14

# 2026 subheader
c.setFont("Lato-Bold", 5); c.setFillColor(TEAL); c.drawString(M+5, cy2, "2026")
cy2 -= 10

for i, (dt, out, ti, url) in enumerate(covs_2026):
    y = cy2 - i*12
    dot(c, M+5, y+3, 2.5, NAVY)
    c.setFont("Lato-Bold", 5.5); c.setFillColor(DN); c.drawString(M+12, y, dt)
    c.setFont("Lato-Bold", 5.5); c.setFillColor(TEAL); c.drawString(M+38, y, out)
    ow = c.stringWidth(out, "Lato-Bold", 5.5)
    if url:
        c.linkURL(url, (M+38, y-2, M+38+ow, y+7), relative=0)
    c.setFont("Lato", 5); c.setFillColor(SL)
    disp = ti; mw = cl_w - 44 - ow
    while c.stringWidth(disp, "Lato", 5) > mw and len(disp) > 10: disp = disp[:-4]+"..."
    c.drawString(M+42+ow, y, disp)

cy2 = cy2 - len(covs_2026)*12 - 4

# 2025 subheader
c.setFont("Lato-Bold", 5); c.setFillColor(HexColor("#b0bec5")); c.drawString(M+5, cy2, "2025")
cy2 -= 10

for i, (dt, out, ti, url) in enumerate(covs_2025):
    y = cy2 - i*12
    dot(c, M+5, y+3, 2.5, HexColor("#d0d5dd"))
    c.setFont("Lato-Bold", 5.5); c.setFillColor(HexColor("#c0c7cf")); c.drawString(M+12, y, dt)
    c.setFont("Lato-Bold", 5.5); c.setFillColor(HexColor("#c0c7cf")); c.drawString(M+38, y, out)
    ow = c.stringWidth(out, "Lato-Bold", 5.5)
    c.linkURL(url, (M+38, y-2, M+38+ow, y+7), relative=0)
    c.setFont("Lato", 5); c.setFillColor(HexColor("#d0d5dd"))
    disp = ti; mw = cl_w - 44 - ow
    while c.stringWidth(disp, "Lato", 5) > mw and len(disp) > 10: disp = disp[:-4]+"..."
    c.drawString(M+42+ow, y, disp)

left_bot_r3 = cy2 - len(covs_2025)*12

# ── RIGHT: Thought Leadership Pipeline ──
c.setFont("Lato-Bold", 8.5); c.setFillColor(DN); c.drawString(cr_x, r3, "Thought Leadership & Commentary Pipeline")

arts = [
    # Feb — complete
    ("Citybiz Q&A Feature (Cynthia)","Complete","complete","Feb"),
    # Mar — 2 articles (in progress)
    ("Hidden Reality of U.S. Housing Stock (Cynthia)","In Progress","in_progress","Mar"),
    ("5 Steps to Improving Home Performance (Casey)","In Progress","in_progress","Mar"),
    # May
    ("Habitat for Humanity: Home Performance Partnership","In Progress","in_progress","May"),
    ("92M Homes Scored: What the Data Reveals (Robin)","In Progress","in_progress","May"),
    ("The Blind Spot in Every Home Purchase","On Deck","on_deck","May"),
    ("What Buyers Ask That Listings Don't Show","On Deck","on_deck","Jun"),
    ("Why Energy Performance Is the Next Square Footage","On Deck","on_deck","Jun"),
    ("Inside the First-Ever Home Performance Registry","On Deck","on_deck","Jul"),
]

ay = r3 - 16
for i, (ti, sl, st, dt) in enumerate(arts):
    y = ay - i*13
    sicon(c, cr_x+4, y+3, st, 2.5)
    c.setFont("Lato", 6); c.setFillColor(DN)
    disp = ti; mw = cr_w - 80
    while c.stringWidth(disp, "Lato", 6) > mw and len(disp) > 10: disp = disp[:-4]+"..."
    c.drawString(cr_x+13, y, disp)
    # Status label
    c.setFont("Lato", 5); c.setFillColor(scol(st)); c.drawRightString(cr_x+cr_w-22, y+1, sl)
    # Date column
    c.setFont("Lato", 5); c.setFillColor(SL); c.drawRightString(cr_x+cr_w, y+1, dt)

right_after_arts = ay - len(arts)*13

# ── RIGHT: Opportunities + Publications ──
opp_hdr = right_after_arts - 12
c.setFont("Lato-Bold", 8.5); c.setFillColor(DN); c.drawString(cr_x, opp_hdr, "Active Pitches & Media Engagement")

opps2 = [
    ("KeyCrew Media Partnership — Cynthia profile, data stories","In Progress","in_progress","Mar"),
    ("WSJ — 3 reporters opened (Ebling, Clarke, Brandt)","Following Up","in_progress","Mar"),
    ("Axios / Sami Sparber — opened both pitches","Following Up","in_progress","Mar"),
    ("RealtyTimes / Terri Murphy — opened, podcast pitch","Following Up","in_progress","Mar"),
    ("Green Home Builder / Hanna Heiss — opened, following up","Following Up","in_progress","Mar"),
]
oy2 = opp_hdr - 12
for i, (ti, sl, st, dt) in enumerate(opps2):
    y = oy2 - i*10
    sicon(c, cr_x+4, y+3, st, 2.5)
    c.setFont("Lato", 6); c.setFillColor(DN)
    disp = ti; mw = cr_w - 80
    while c.stringWidth(disp, "Lato", 6) > mw and len(disp) > 10: disp = disp[:-4]+"..."
    c.drawString(cr_x+13, y, disp)
    c.setFont("Lato", 5); c.setFillColor(scol(st)); c.drawRightString(cr_x+cr_w-22, y+1, sl)
    c.setFont("Lato", 5); c.setFillColor(SL); c.drawRightString(cr_x+cr_w, y+1, dt)

pub_hdr = oy2 - len(opps2)*10 - 6
c.setFont("Lato-Bold", 6.5); c.setFillColor(TEAL); c.drawString(cr_x, pub_hdr, "Pitching:")
pubs_text = "NPR, NYT, WSJ, Washington Post, AP, Axios, Canary Media, Consumer Reports, Housing Wire, Realtor Magazine, Inman, RealtyTimes, Green Home Builder, BUILT, AARP, Citybiz, KeyCrew, Business Journals"
c.setFont("Lato", 5.5); c.setFillColor(SL)
words = pubs_text.split(", ")
line = ""; py2 = pub_hdr - 9; mw2 = cr_w - 4
for w in words:
    test = line + (", " if line else "") + w
    if c.stringWidth(test, "Lato", 5.5) > mw2:
        c.drawString(cr_x, py2, line); py2 -= 8; line = w
    else:
        line = test
if line:
    c.drawString(cr_x, py2, line)

# ── FOOTER ──
fy = 14
c.setStrokeColor(TEAL); c.setLineWidth(0.4); c.line(M, fy+10, W-M, fy+10)
c.setFont("Lato", 6); c.setFillColor(SL)
c.drawString(M, fy, "Pearl  |  90-Day Sprint Plan  |  Q1 2026  |  DRAFT")
c.drawRightString(W-M, fy, "PR: Atkinson Strategic Communications")
fw = c.stringWidth("Atkinson Strategic Communications", "Lato", 6)
c.linkURL("https://atkinsonprbaltimore.com/", (W-M-fw, fy-2, W-M, fy+7), relative=0)

c.save()
print(f"Dashboard saved to {OUT}")
