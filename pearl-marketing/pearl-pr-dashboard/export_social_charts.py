"""
Export social media charts as PNGs for board deck slide 6.
Generates: Platform impressions comparison, engagement rate comparison.
Data source: Sprout Social Profile Performance Report, Jan 1 - Mar 2, 2026.
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(SCRIPT_DIR, "output", "seo_charts")
os.makedirs(OUT_DIR, exist_ok=True)

# Register Lato fonts
LATO_REGULAR = os.path.join(SCRIPT_DIR, "fonts", "Lato-Regular.ttf")
LATO_BOLD = os.path.join(SCRIPT_DIR, "fonts", "Lato-Bold.ttf")
fm.fontManager.addfont(LATO_REGULAR)
fm.fontManager.addfont(LATO_BOLD)
lato_regular = fm.FontProperties(fname=LATO_REGULAR)
lato_bold = fm.FontProperties(fname=LATO_BOLD)

# Brand colors
TEAL = "#00897B"
LINKEDIN_BLUE = "#0077B5"
FB_BLUE = "#1877F2"
INSTA_PINK = "#E4405F"
X_BLACK = "#14171A"
DARK_TEXT = "#263238"
SUBTITLE_GRAY = "#78909C"
WHITE = "#FFFFFF"

# PR Dashboard matching palette
PR_TEAL = "#04b290"
PR_NAVY = "#0c3860"
PR_SLATE = "#5c7b96"
PR_LIGHT = "#e5eaf4"
BLUESKY_BLUE = "#0085FF"

from matplotlib.patches import FancyBboxPatch, Wedge


def _card_border(fig):
    """Add rounded card border matching PR dashboard style (edge only)."""
    border = FancyBboxPatch(
        (0.005, 0.005), 0.99, 0.99,
        boxstyle="round,pad=0.015",
        facecolor="none", edgecolor=PR_LIGHT,
        linewidth=2, transform=fig.transFigure)
    fig.patches.append(border)


def _draw_ring(ax, cx, cy, radius, pct, actual_text, target_text, label_text):
    """Draw a progress ring at (cx, cy) on the given axes."""
    # Background ring
    bg = Wedge((cx, cy), radius, 0, 360, width=radius * 0.3,
               facecolor=PR_LIGHT, edgecolor="none", zorder=2)
    ax.add_patch(bg)
    # Progress arc (clockwise from 12 o'clock)
    if pct > 0:
        theta1 = 90 - pct * 360
        theta2 = 90
        fg = Wedge((cx, cy), radius, theta1, theta2, width=radius * 0.3,
                   facecolor=PR_TEAL, edgecolor="none", zorder=3)
        ax.add_patch(fg)
    # Actual number centered
    ax.text(cx, cy, actual_text, fontproperties=lato_bold, fontsize=22,
            color=PR_NAVY, ha="center", va="center", zorder=4)
    # Target above ring
    ax.text(cx, cy + radius + 0.08, f"/ {target_text}", fontproperties=lato_regular,
            fontsize=10, color=PR_SLATE, ha="center", va="bottom", zorder=4)
    # Label below ring
    ax.text(cx, cy - radius - 0.08, label_text, fontproperties=lato_regular,
            fontsize=10, color=PR_SLATE, ha="center", va="top", zorder=4)


def make_impressions_chart():
    """Platform impressions horizontal bar chart — shows LinkedIn dominance."""
    platforms = ["X", "Instagram", "Facebook", "LinkedIn"]
    impressions = [212, 583, 2081, 10388]
    colors = [X_BLACK, INSTA_PINK, FB_BLUE, LINKEDIN_BLUE]
    pct_of_total = [f"{v/sum(impressions)*100:.0f}%" for v in impressions]

    fig, ax = plt.subplots(figsize=(10, 4))
    fig.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    bars = ax.barh(range(len(platforms)), impressions, height=0.55,
                   color=colors, edgecolor="none", zorder=3)

    # Value labels
    for i, (bar, val, pct) in enumerate(zip(bars, impressions, pct_of_total)):
        x_pos = bar.get_width() + 120
        label = f"{val:,}  ({pct})"
        ax.text(x_pos, bar.get_y() + bar.get_height() / 2, label,
                va="center", ha="left", fontproperties=lato_bold,
                fontsize=12, color=DARK_TEXT)

    ax.set_yticks(range(len(platforms)))
    ax.set_yticklabels(platforms, fontproperties=lato_bold, fontsize=13, color=DARK_TEXT)

    ax.set_xlim(0, 14000)
    ax.xaxis.set_visible(False)
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.tick_params(left=False)
    ax.grid(axis="x", color="#ECEFF1", linewidth=0.6, zorder=0)

    fig.text(0.04, 0.95, "Social Media Impressions by Platform",
             fontproperties=lato_bold, fontsize=16, color=DARK_TEXT, ha="left")
    fig.text(0.04, 0.88, "LinkedIn drives 78% of all impressions — Q1 2026 (Jan 1 – Mar 2)",
             fontproperties=lato_regular, fontsize=10, color=SUBTITLE_GRAY, ha="left")
    fig.text(0.04, 0.02, "Source: Sprout Social Profile Performance Report, Jan 1 – Mar 2, 2026",
             fontproperties=lato_regular, fontsize=9, color=SUBTITLE_GRAY, ha="left")

    plt.tight_layout(rect=[0.0, 0.06, 1.0, 0.85])

    out_path = os.path.join(OUT_DIR, "social_impressions.png")
    fig.savefig(out_path, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print(f"  Social impressions chart -> {out_path}")


def make_engagement_rate_chart():
    """Engagement rate by platform — shows quality of engagement."""
    platforms = ["Facebook\n3.9%", "X\n5.2%", "Instagram\n5.5%", "LinkedIn\n7.6%"]
    rates = [3.9, 5.2, 5.5, 7.6]
    colors = [FB_BLUE, X_BLACK, INSTA_PINK, LINKEDIN_BLUE]

    fig, ax = plt.subplots(figsize=(10, 3.5))
    fig.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    bars = ax.bar(range(len(platforms)), rates, width=0.6,
                  color=colors, edgecolor="none", zorder=3)

    # Rate labels on top of bars
    for bar, rate in zip(bars, rates):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.15,
                f"{rate}%", ha="center", va="bottom",
                fontproperties=lato_bold, fontsize=14, color=DARK_TEXT)

    ax.set_xticks(range(len(platforms)))
    ax.set_xticklabels(
        ["Facebook", "X", "Instagram", "LinkedIn"],
        fontproperties=lato_bold, fontsize=12, color=DARK_TEXT
    )
    ax.set_ylim(0, 10)
    ax.yaxis.set_visible(False)
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.tick_params(bottom=False)

    # Industry benchmark line
    ax.axhline(y=2.0, color="#B0BEC5", linestyle="--", linewidth=1, zorder=1)
    ax.text(3.4, 2.15, "Industry avg ~2%", fontproperties=lato_regular,
            fontsize=9, color=SUBTITLE_GRAY, ha="right")

    fig.text(0.04, 0.95, "Engagement Rate by Platform",
             fontproperties=lato_bold, fontsize=16, color=DARK_TEXT, ha="left")
    fig.text(0.04, 0.87, "All platforms above industry average — LinkedIn leads at 7.6%",
             fontproperties=lato_regular, fontsize=10, color=SUBTITLE_GRAY, ha="left")
    fig.text(0.04, 0.02, "Source: Sprout Social Profile Performance Report, Jan 1 – Mar 2, 2026",
             fontproperties=lato_regular, fontsize=9, color=SUBTITLE_GRAY, ha="left")

    plt.tight_layout(rect=[0.0, 0.06, 1.0, 0.84])

    out_path = os.path.join(OUT_DIR, "social_engagement_rate.png")
    fig.savefig(out_path, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print(f"  Engagement rate chart -> {out_path}")


def make_platform_matrix_chart():
    """Combined horizontal bar chart: impressions + engagements per platform with audience labels."""
    platforms = ["BlueSky", "X", "Instagram", "Facebook", "LinkedIn"]
    impressions = [0, 212, 583, 2081, 10388]
    engagements = [1, 11, 32, 81, 793]
    posts = [8, 9, 4, 9, 15]
    audiences = ["B2B (Emerging)", "B2B", "Culture", "B2C + B2B", "B2B"]
    bar_colors = ["#0085FF", X_BLACK, INSTA_PINK, FB_BLUE, LINKEDIN_BLUE]

    fig, ax = plt.subplots(figsize=(10, 5.5))
    fig.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    y = np.arange(len(platforms))
    bar_h = 0.32

    # Impressions bars
    bars_imp = ax.barh(y + bar_h / 2, impressions, height=bar_h,
                       color=bar_colors, edgecolor="none", zorder=3, label="Impressions")

    # Engagement bars (lighter / hatched)
    eng_colors = [c + "99" for c in bar_colors]  # won't work for named; use alpha
    bars_eng = ax.barh(y - bar_h / 2, engagements, height=bar_h,
                       color=bar_colors, edgecolor="none", zorder=3, alpha=0.45,
                       label="Engagements")

    # Labels on right side of impression bars
    max_imp = max(impressions) if max(impressions) > 0 else 1
    for i, (imp, eng, post_ct, aud) in enumerate(zip(impressions, engagements, posts, audiences)):
        if imp > 0:
            ax.text(imp + 180, y[i] + bar_h / 2, f"{imp:,}",
                    va="center", ha="left", fontproperties=lato_bold,
                    fontsize=10, color=DARK_TEXT)
            ax.text(eng + 30, y[i] - bar_h / 2, f"{eng:,}",
                    va="center", ha="left", fontproperties=lato_regular,
                    fontsize=9, color=SUBTITLE_GRAY)
        else:
            ax.text(80, y[i], "No impression data",
                    va="center", ha="left", fontproperties=lato_regular,
                    fontsize=9, color=SUBTITLE_GRAY, fontstyle="italic")
        # Audience tag and post count on far right
        ax.text(max_imp * 1.35, y[i] + 0.12, aud,
                va="center", ha="left", fontproperties=lato_bold,
                fontsize=9, color=TEAL)
        ax.text(max_imp * 1.35, y[i] - 0.18, f"{post_ct} posts",
                va="center", ha="left", fontproperties=lato_regular,
                fontsize=9, color=SUBTITLE_GRAY)

    ax.set_yticks(y)
    ax.set_yticklabels(platforms, fontproperties=lato_bold, fontsize=12, color=DARK_TEXT)
    ax.set_xlim(0, max_imp * 1.75)
    ax.xaxis.set_visible(False)
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.tick_params(left=False)
    ax.grid(axis="x", color="#ECEFF1", linewidth=0.6, zorder=0)

    # Legend
    from matplotlib.patches import Patch
    legend_elements = [Patch(facecolor=LINKEDIN_BLUE, label="Impressions"),
                       Patch(facecolor=LINKEDIN_BLUE, alpha=0.45, label="Engagements")]
    ax.legend(handles=legend_elements, loc="lower right", frameon=False,
              prop=lato_regular, fontsize=10)

    fig.text(0.04, 0.96, "Platform Performance Matrix",
             fontproperties=lato_bold, fontsize=16, color=DARK_TEXT, ha="left")
    fig.text(0.04, 0.90, "Impressions + engagements by platform — Q1 2026 (Jan 1 – Mar 2)",
             fontproperties=lato_regular, fontsize=10, color=SUBTITLE_GRAY, ha="left")
    fig.text(0.04, 0.02, "Source: Sprout Social Profile Performance Report, Jan 1 – Mar 2, 2026",
             fontproperties=lato_regular, fontsize=9, color=SUBTITLE_GRAY, ha="left")

    plt.tight_layout(rect=[0.0, 0.06, 1.0, 0.87])

    out_path = os.path.join(OUT_DIR, "platform_matrix.png")
    fig.savefig(out_path, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print(f"  Platform matrix chart -> {out_path}")


def make_content_pipeline_chart():
    """Pearl-published content only — pillar series, B2B blog, social output. 2 months in."""
    fig, ax = plt.subplots(figsize=(12, 6))
    fig.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis("off")

    # Title
    ax.text(0.2, 9.6, "Content Published by Pearl — 2 Months Into Q1",
            fontproperties=lato_bold, fontsize=16, color=DARK_TEXT, va="top")
    ax.text(0.2, 9.05, "Jan 1 – Mar 2, 2026  |  What the Pearl marketing team shipped",
            fontproperties=lato_regular, fontsize=10, color=SUBTITLE_GRAY, va="top")

    # =========================================================
    # LEFT COLUMN (0 - 5.5): Content pieces
    # =========================================================

    # --- B2C Pillar Series ---
    ax.text(0.2, 8.2, 'B2C Blog — "What Every Buyer Needs to Know"',
            fontproperties=lato_bold, fontsize=12, color=DARK_TEXT, va="top")

    topics = ["Safety", "Comfort", "Operating\nCosts", "Resilience", "Avg Utility\nBill", "Energy"]
    statuses = ["done", "done", "done", "done", "review", "planned"]
    seg_w = 1.65
    seg_h = 0.52
    x_start = 0.2
    y_bar = 7.1

    for i, (topic, status) in enumerate(zip(topics, statuses)):
        x = x_start + i * (seg_w + 0.15)
        if status == "done":
            color = TEAL
            label_color = WHITE
            symbol = "+"
        elif status == "review":
            color = "#FFC107"
            label_color = DARK_TEXT
            symbol = "~"
        else:
            color = "#ECEFF1"
            label_color = SUBTITLE_GRAY
            symbol = ""

        rect = plt.Rectangle((x, y_bar), seg_w, seg_h, facecolor=color,
                              edgecolor="none", zorder=3)
        ax.add_patch(rect)
        ax.text(x + seg_w / 2, y_bar + seg_h / 2 + 0.03, f"{symbol} {topic}",
                ha="center", va="center", fontproperties=lato_bold,
                fontsize=8.5, color=label_color)

    ax.text(11.3, 7.35, "5/6", fontproperties=lato_bold, fontsize=16,
            color=TEAL, va="center", ha="center")

    # Legend
    ax.text(0.2, 6.7, "+ Published", fontproperties=lato_regular, fontsize=8, color=TEAL)
    ax.text(1.8, 6.7, "~ In Review", fontproperties=lato_regular, fontsize=8, color="#FFC107")
    ax.text(3.4, 6.7, "Planned", fontproperties=lato_regular, fontsize=8, color=SUBTITLE_GRAY)

    # Divider
    ax.plot([0.2, 11.8], [6.4, 6.4], color="#ECEFF1", linewidth=1, zorder=1)

    # --- B2B Blog ---
    ax.text(0.2, 6.1, "B2B Blog — Thought Leadership",
            fontproperties=lato_bold, fontsize=12, color=DARK_TEXT, va="top")
    ax.text(6.0, 6.1, "3 articles in 2 months",
            fontproperties=lato_bold, fontsize=10, color=TEAL, va="top")

    b2b_posts = [
        ("America's 40-Year-Old Problem", "Feb 6, 2026"),
        ("Five Things Your Clients Can't See", "Jan 1, 2026"),
        ("Buyer Priorities Are Shifting", "Dec 9, 2025"),
    ]
    y_pos = 5.5
    for title, date in b2b_posts:
        ax.text(0.5, y_pos, "-", fontproperties=lato_bold, fontsize=11, color=TEAL, va="top")
        ax.text(0.85, y_pos, title, fontproperties=lato_regular, fontsize=10.5,
                color=DARK_TEXT, va="top")
        ax.text(8.5, y_pos, date, fontproperties=lato_regular, fontsize=9,
                color=SUBTITLE_GRAY, va="top", ha="right")
        y_pos -= 0.45

    # Divider
    ax.plot([0.2, 11.8], [4.15, 4.15], color="#ECEFF1", linewidth=1, zorder=1)

    # --- Social Posts by Platform ---
    ax.text(0.2, 3.85, "Social Posts by Platform",
            fontproperties=lato_bold, fontsize=12, color=DARK_TEXT, va="top")
    ax.text(6.0, 3.85, "45 posts across 5 channels in 2 months",
            fontproperties=lato_bold, fontsize=10, color=TEAL, va="top")

    social_data = [
        ("LinkedIn", LINKEDIN_BLUE, 15, "B2B Primary"),
        ("Facebook", FB_BLUE, 9, "B2C + B2B"),
        ("X", X_BLACK, 9, "B2B"),
        ("BlueSky", "#0085FF", 8, "B2B Emerging"),
        ("Instagram", INSTA_PINK, 4, "Culture"),
    ]
    bar_y = 2.85
    bar_max_w = 7.0
    max_posts = 15
    bar_h = 0.32
    for i, (name, color, posts, aud) in enumerate(social_data):
        by = bar_y - i * 0.52
        w = (posts / max_posts) * bar_max_w
        rect = plt.Rectangle((2.2, by), w, bar_h, facecolor=color,
                              edgecolor="none", zorder=3)
        ax.add_patch(rect)
        ax.text(0.3, by + bar_h / 2, name, fontproperties=lato_bold, fontsize=9.5,
                color=DARK_TEXT, va="center")
        ax.text(2.2 + w + 0.15, by + bar_h / 2, str(posts),
                fontproperties=lato_bold, fontsize=10, color=DARK_TEXT, va="center")
        ax.text(2.2 + w + 0.6, by + bar_h / 2, aud,
                fontproperties=lato_regular, fontsize=8, color=SUBTITLE_GRAY, va="center")

    # =========================================================
    # BOTTOM: Q1 progress + pipeline status
    # =========================================================
    status_y = 0.25

    # Pipeline status badge
    badge_w, badge_h = 3.2, 0.5
    badge_rect = plt.Rectangle((0.2, status_y), badge_w, badge_h,
                                facecolor="#FFF3E0", edgecolor="#FFC107",
                                linewidth=1.5, zorder=3)
    ax.add_patch(badge_rect)
    ax.text(0.2 + badge_w / 2, status_y + badge_h / 2,
            "Pipeline Status: In Development",
            ha="center", va="center", fontproperties=lato_bold,
            fontsize=10, color="#E65100")

    # Q1 progress bar
    prog_x = 4.0
    prog_w = 5.5
    prog_h = 0.35
    prog_bg = plt.Rectangle((prog_x, status_y + 0.08), prog_w, prog_h,
                              facecolor="#ECEFF1", edgecolor="none", zorder=2)
    ax.add_patch(prog_bg)
    prog_fill = plt.Rectangle((prog_x, status_y + 0.08), prog_w * 0.67, prog_h,
                                facecolor=TEAL, edgecolor="none", zorder=3)
    ax.add_patch(prog_fill)
    ax.text(prog_x + prog_w * 0.67, status_y + 0.08 + prog_h + 0.12,
            "2 of 3 months complete",
            fontproperties=lato_bold, fontsize=9, color=TEAL, ha="center", va="bottom")
    for frac, label in [(0, "Jan"), (0.33, "Feb"), (0.67, "Mar")]:
        mx = prog_x + prog_w * frac
        ax.plot([mx, mx], [status_y - 0.05, status_y + 0.08], color=DARK_TEXT,
                linewidth=0.8, zorder=4)
        ax.text(mx, status_y - 0.12, label, fontproperties=lato_regular,
                fontsize=8, color=SUBTITLE_GRAY, ha="center", va="top")

    # Source
    fig.text(0.04, 0.02, "Source: Craft CMS, Sprout Social  |  Pearl marketing team output only",
             fontproperties=lato_regular, fontsize=9, color=SUBTITLE_GRAY, ha="left")

    plt.tight_layout(rect=[0.0, 0.05, 1.0, 0.97])

    out_path = os.path.join(OUT_DIR, "content_pipeline.png")
    fig.savefig(out_path, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print(f"  Content pipeline chart -> {out_path}")


def make_social_growth_chart():
    """Channel expansion + data growth chart: before/after with real numbers."""

    # Platform data with before AND after numbers
    # (name, audience, color,
    #  before_imp, before_eng, before_posts,
    #  q1_imp, q1_eng, q1_posts, growth_label)
    platforms = [
        ("LinkedIn",  "B2B Primary",       LINKEDIN_BLUE,
         859, 9, 0,       10388, 793, 15,  "+1,109%"),
        ("Facebook",  "B2C + B2B Dual",    FB_BLUE,
         0, 0, 0,         2106, 81, 9,     "Activated"),
        ("X",         "B2B",               X_BLACK,
         90, 3, 0,        212, 11, 9,      "+136%"),
        ("Instagram", "Culture/Recruit",   INSTA_PINK,
         0, 0, 0,         587, 32, 4,      "Activated"),
        ("BlueSky",   "B2B Emerging",      "#0085FF",
         None, None, 0,   None, 1, 8,      "NEW"),
    ]

    fig, ax = plt.subplots(figsize=(12, 6.5))
    fig.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis("off")

    # === Column positions ===
    col_aud = 2.0
    col_b_imp = 3.8
    col_b_eng = 4.75
    col_b_post = 5.55
    col_arrow = 6.15
    col_a_imp = 7.05
    col_a_eng = 8.15
    col_a_post = 9.05
    col_growth = 10.7
    header_y = 9.3

    # === Header row ===
    ax.text(0.15, header_y, "Platform", fontproperties=lato_bold, fontsize=13,
            color=DARK_TEXT, va="center")
    ax.text(col_aud, header_y, "Audience", fontproperties=lato_bold, fontsize=13,
            color=DARK_TEXT, va="center", ha="center")

    # "Before" group header
    before_mid = (col_b_imp + col_b_post) / 2
    ax.text(before_mid, header_y + 0.4, "SEP 2025 (BEFORE)",
            fontproperties=lato_bold, fontsize=11, color=SUBTITLE_GRAY,
            va="center", ha="center")
    ax.text(col_b_imp, header_y, "Imp", fontproperties=lato_bold, fontsize=12,
            color=SUBTITLE_GRAY, va="center", ha="center")
    ax.text(col_b_eng, header_y, "Eng", fontproperties=lato_bold, fontsize=12,
            color=SUBTITLE_GRAY, va="center", ha="center")
    ax.text(col_b_post, header_y, "Posts", fontproperties=lato_bold, fontsize=12,
            color=SUBTITLE_GRAY, va="center", ha="center")

    # "After" group header
    after_mid = (col_a_imp + col_a_post) / 2
    ax.text(after_mid, header_y + 0.4, "Q1 2026 (AFTER)",
            fontproperties=lato_bold, fontsize=11, color=TEAL,
            va="center", ha="center")
    ax.text(col_a_imp, header_y, "Imp", fontproperties=lato_bold, fontsize=12,
            color=TEAL, va="center", ha="center")
    ax.text(col_a_eng, header_y, "Eng", fontproperties=lato_bold, fontsize=12,
            color=TEAL, va="center", ha="center")
    ax.text(col_a_post, header_y, "Posts", fontproperties=lato_bold, fontsize=12,
            color=TEAL, va="center", ha="center")

    ax.text(col_growth, header_y, "Growth", fontproperties=lato_bold, fontsize=13,
            color=DARK_TEXT, va="center", ha="center")

    # Header underline
    ax.plot([0.1, 11.9], [header_y - 0.3, header_y - 0.3], color="#ECEFF1",
            linewidth=1.5, zorder=1)

    # === Platform rows ===
    row_h = 1.2
    start_y = 8.4
    for i, (name, audience, color, b_imp, b_eng, b_post,
            a_imp, a_eng, a_post, growth) in enumerate(platforms):
        y = start_y - i * row_h

        # Row background (alternating)
        if i % 2 == 0:
            rect = plt.Rectangle((0.1, y - 0.42), 11.8, row_h - 0.1,
                                  facecolor="#F5F5F5", edgecolor="none", zorder=0)
            ax.add_patch(rect)

        # Platform name with color dot
        ax.plot(0.22, y, "o", color=color, markersize=10, zorder=3)
        ax.text(0.42, y, name, fontproperties=lato_bold, fontsize=14,
                color=DARK_TEXT, va="center")

        # Audience badge
        badge_w = 1.35
        badge_rect = plt.Rectangle((col_aud - badge_w / 2, y - 0.2), badge_w, 0.4,
                                    facecolor=color, edgecolor="none", alpha=0.12, zorder=2)
        ax.add_patch(badge_rect)
        ax.text(col_aud, y, audience, fontproperties=lato_bold, fontsize=10,
                color=color, va="center", ha="center")

        # Before columns
        def fmt_val(v):
            if v is None:
                return "--"
            if v == 0:
                return "0"
            if v >= 1000:
                return f"{v:,.0f}"
            return str(v)

        ax.text(col_b_imp, y, fmt_val(b_imp), fontproperties=lato_regular, fontsize=13,
                color=SUBTITLE_GRAY, va="center", ha="center")
        ax.text(col_b_eng, y, fmt_val(b_eng), fontproperties=lato_regular, fontsize=13,
                color=SUBTITLE_GRAY, va="center", ha="center")
        ax.text(col_b_post, y, str(b_post), fontproperties=lato_regular, fontsize=13,
                color=SUBTITLE_GRAY, va="center", ha="center")

        # Arrow
        ax.annotate("", xy=(col_arrow + 0.12, y), xytext=(col_arrow - 0.12, y),
                    arrowprops=dict(arrowstyle="->", color=TEAL, linewidth=1.8), zorder=3)

        # After columns
        a_imp_str = fmt_val(a_imp) if a_imp else "--"
        ax.text(col_a_imp, y, a_imp_str, fontproperties=lato_bold, fontsize=13,
                color=DARK_TEXT, va="center", ha="center")
        ax.text(col_a_eng, y, fmt_val(a_eng), fontproperties=lato_bold, fontsize=13,
                color=DARK_TEXT, va="center", ha="center")
        ax.text(col_a_post, y, str(a_post), fontproperties=lato_bold, fontsize=13,
                color=DARK_TEXT, va="center", ha="center")

        # Growth badge
        if growth == "NEW":
            g_color = "#0085FF"
            g_bg = "#E3F2FD"
        elif growth == "Activated":
            g_color = TEAL
            g_bg = "#E0F2F1"
        else:
            g_color = TEAL
            g_bg = "#E0F2F1"
        g_w = 1.1
        g_rect = plt.Rectangle((col_growth - g_w / 2, y - 0.2), g_w, 0.4,
                                facecolor=g_bg, edgecolor="none", zorder=2)
        ax.add_patch(g_rect)
        ax.text(col_growth, y, growth, fontproperties=lato_bold, fontsize=12,
                color=g_color, va="center", ha="center")

    # === Summary row ===
    summary_y = start_y - len(platforms) * row_h + 0.1
    ax.plot([0.1, 11.9], [summary_y, summary_y], color=TEAL, linewidth=2, zorder=1)

    sy = summary_y - 0.5
    ax.text(0.15, sy, "TOTAL", fontproperties=lato_bold, fontsize=14,
            color=DARK_TEXT, va="center")
    ax.text(col_aud, sy, "1 channel", fontproperties=lato_bold, fontsize=13,
            color=SUBTITLE_GRAY, va="center", ha="center")

    ax.text(col_b_imp, sy, "949", fontproperties=lato_bold, fontsize=13,
            color=SUBTITLE_GRAY, va="center", ha="center")
    ax.text(col_b_eng, sy, "12", fontproperties=lato_bold, fontsize=13,
            color=SUBTITLE_GRAY, va="center", ha="center")
    ax.text(col_b_post, sy, "0", fontproperties=lato_bold, fontsize=13,
            color=SUBTITLE_GRAY, va="center", ha="center")

    ax.annotate("", xy=(col_arrow + 0.12, sy), xytext=(col_arrow - 0.12, sy),
                arrowprops=dict(arrowstyle="->", color=TEAL, linewidth=2.5), zorder=3)

    ax.text(col_a_imp, sy, "13.3K", fontproperties=lato_bold, fontsize=14,
            color=DARK_TEXT, va="center", ha="center")
    ax.text(col_a_eng, sy, "917", fontproperties=lato_bold, fontsize=14,
            color=DARK_TEXT, va="center", ha="center")
    ax.text(col_a_post, sy, "45", fontproperties=lato_bold, fontsize=14,
            color=DARK_TEXT, va="center", ha="center")

    # Total growth badge
    g_w = 1.1
    g_rect = plt.Rectangle((col_growth - g_w / 2, sy - 0.22), g_w, 0.44,
                            facecolor=TEAL, edgecolor="none", zorder=2)
    ax.add_patch(g_rect)
    ax.text(col_growth, sy, "5 channels", fontproperties=lato_bold, fontsize=12,
            color=WHITE, va="center", ha="center")

    # === Title ===
    fig.text(0.04, 0.97, "Social Channel Expansion — Before & After",
             fontproperties=lato_bold, fontsize=20, color=DARK_TEXT, ha="left")
    fig.text(0.04, 0.91, "From 1 barely-active channel to 5 platforms with segmented audiences  |  All above 2% industry avg",
             fontproperties=lato_regular, fontsize=13, color=SUBTITLE_GRAY, ha="left")
    fig.text(0.04, 0.02, "Sources: LinkedIn Page Analytics, Sprout Social, Meta Business Suite, X Analytics  |  Sep 2025 = monthly avg before strategy revamp",
             fontproperties=lato_regular, fontsize=11, color=SUBTITLE_GRAY, ha="left")

    plt.tight_layout(rect=[0.0, 0.05, 1.0, 0.88])

    out_path = os.path.join(OUT_DIR, "social_growth_trend.png")
    fig.savefig(out_path, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print(f"  Social growth trend chart -> {out_path}")


def make_content_dashboard():
    """Content Marketing Dashboard — targets vs actuals, matching PR dashboard style."""
    fig, ax = plt.subplots(figsize=(12, 6.5))
    fig.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis("off")

    # Title
    ax.text(0.2, 9.65, "Content Marketing Dashboard",
            fontproperties=lato_bold, fontsize=18, color=DARK_TEXT, va="top")
    ax.text(0.2, 9.05, "Q1 2026 Sprint  |  2 of 3 months complete  |  Targets from 90-Day Sprint Plan",
            fontproperties=lato_regular, fontsize=10, color=SUBTITLE_GRAY, va="top")

    # =========================================================
    # TOP ROW: Big KPI cards
    # =========================================================
    kpi_y = 7.7
    kpi_h = 1.3
    kpi_w = 2.6
    kpis = [
        ("5", "Active Channels", "Target: 5", TEAL, 1.0),
        ("45", "Social Posts", "Target: 96-132", "#FFC107", 0.34),
        ("5/6", "B2C Pillar Series", "Target: 6", TEAL, 0.83),
        ("2", "B2B Blog Articles", "Target: 3", "#FFC107", 0.67),
    ]
    for i, (num, label, target, accent, pct) in enumerate(kpis):
        kx = 0.2 + i * (kpi_w + 0.4)
        # Card background
        card = plt.Rectangle((kx, kpi_y), kpi_w, kpi_h,
                              facecolor=WHITE, edgecolor="#ECEFF1",
                              linewidth=1.5, zorder=2)
        ax.add_patch(card)
        # Progress bar at bottom of card
        prog = plt.Rectangle((kx, kpi_y), kpi_w * pct, 0.08,
                               facecolor=accent, edgecolor="none", zorder=3)
        ax.add_patch(prog)
        prog_bg = plt.Rectangle((kx + kpi_w * pct, kpi_y), kpi_w * (1 - pct), 0.08,
                                  facecolor="#ECEFF1", edgecolor="none", zorder=3)
        ax.add_patch(prog_bg)

        # Number
        ax.text(kx + kpi_w / 2, kpi_y + kpi_h - 0.25, num,
                fontproperties=lato_bold, fontsize=26, color=accent,
                va="top", ha="center")
        # Label
        ax.text(kx + kpi_w / 2, kpi_y + 0.45, label,
                fontproperties=lato_bold, fontsize=10, color=DARK_TEXT,
                va="center", ha="center")
        # Target
        ax.text(kx + kpi_w / 2, kpi_y + 0.15, target,
                fontproperties=lato_regular, fontsize=8, color=SUBTITLE_GRAY,
                va="center", ha="center")

    # =========================================================
    # MIDDLE: Social posting cadence — target vs actual bars
    # =========================================================
    ax.text(0.2, 7.15, "Social Posting Cadence — Target vs Actual (4 sprint blocks)",
            fontproperties=lato_bold, fontsize=11, color=DARK_TEXT, va="top")

    platforms = [
        ("LinkedIn",  LINKEDIN_BLUE, 15, 24, "B2B"),
        ("Facebook",  FB_BLUE,        9, 20, "B2C+B2B"),
        ("X",         X_BLACK,        9, 32, "B2B"),
        ("BlueSky",   "#0085FF",      8, 20, "B2B"),
        ("Instagram", INSTA_PINK,     4, 20, "Culture"),
    ]

    bar_start_x = 2.2
    max_target = 32
    bar_max_w = 7.5
    bar_h = 0.25
    row_h = 0.55
    start_bar_y = 6.3

    for i, (name, color, actual, target, aud) in enumerate(platforms):
        by = start_bar_y - i * row_h

        # Platform label
        ax.text(0.3, by + 0.05, name, fontproperties=lato_bold, fontsize=9.5,
                color=DARK_TEXT, va="center")

        # Target bar (background)
        tw = (target / max_target) * bar_max_w
        target_rect = plt.Rectangle((bar_start_x, by - 0.05), tw, bar_h,
                                     facecolor="#ECEFF1", edgecolor="none", zorder=2)
        ax.add_patch(target_rect)

        # Actual bar (foreground)
        aw = (actual / max_target) * bar_max_w
        actual_rect = plt.Rectangle((bar_start_x, by - 0.05), aw, bar_h,
                                     facecolor=color, edgecolor="none", zorder=3)
        ax.add_patch(actual_rect)

        # Labels
        ax.text(bar_start_x + aw + 0.12, by + 0.05,
                f"{actual}/{target}",
                fontproperties=lato_bold, fontsize=9, color=DARK_TEXT, va="center")

        # Pct
        pct = actual / target * 100
        pct_color = TEAL if pct >= 60 else "#FFC107" if pct >= 40 else "#EF5350"
        ax.text(bar_start_x + tw + 0.6, by + 0.05,
                f"{pct:.0f}%", fontproperties=lato_bold, fontsize=9,
                color=pct_color, va="center")

        # Audience tag
        ax.text(11.5, by + 0.05, aud, fontproperties=lato_regular, fontsize=8,
                color=SUBTITLE_GRAY, va="center", ha="center")

    # Legend
    from matplotlib.patches import Patch
    legend_elements = [
        Patch(facecolor=LINKEDIN_BLUE, label="Actual"),
        Patch(facecolor="#ECEFF1", label="Sprint Target"),
    ]
    ax.legend(handles=legend_elements, loc="upper right",
              bbox_to_anchor=(0.95, 0.73), frameon=False,
              prop=lato_regular, fontsize=8)

    # =========================================================
    # BOTTOM: Key wins + engagement context
    # =========================================================
    ax.plot([0.2, 11.8], [3.35, 3.35], color="#ECEFF1", linewidth=1, zorder=1)

    ax.text(0.2, 3.05, "Key Wins — 2 Months In",
            fontproperties=lato_bold, fontsize=11, color=DARK_TEXT, va="top")

    wins = [
        ("6.9% avg engagement rate", "vs 2% industry benchmark — 3.5x above average"),
        ("LinkedIn: 12x impression growth", "859/mo (Sep) to 8,076/mo (Feb) — best month ever"),
        ("5 platforms activated from 1", "Each with defined audience strategy"),
        ("B2C pillar series 83% complete", "5 of 6 articles published, 1 in review"),
    ]
    wy = 2.45
    for i, (title, detail) in enumerate(wins):
        col_x = 0.3 if i % 2 == 0 else 6.2
        row_y = wy if i < 2 else wy - 0.65

        # Teal dot
        ax.plot(col_x, row_y, "o", color=TEAL, markersize=7, zorder=3)
        ax.text(col_x + 0.25, row_y + 0.05, title,
                fontproperties=lato_bold, fontsize=9, color=DARK_TEXT, va="center")
        ax.text(col_x + 0.25, row_y - 0.25, detail,
                fontproperties=lato_regular, fontsize=8, color=SUBTITLE_GRAY, va="center")

    # =========================================================
    # Q1 Progress bar at very bottom
    # =========================================================
    prog_y = 0.85
    prog_x = 3.5
    prog_w = 5.5
    prog_h = 0.3
    prog_bg = plt.Rectangle((prog_x, prog_y), prog_w, prog_h,
                              facecolor="#ECEFF1", edgecolor="none", zorder=2)
    ax.add_patch(prog_bg)
    prog_fill = plt.Rectangle((prog_x, prog_y), prog_w * 0.67, prog_h,
                                facecolor=TEAL, edgecolor="none", zorder=3)
    ax.add_patch(prog_fill)
    ax.text(prog_x - 0.15, prog_y + prog_h / 2, "Q1 Progress:",
            fontproperties=lato_bold, fontsize=9, color=DARK_TEXT,
            va="center", ha="right")
    ax.text(prog_x + prog_w * 0.67, prog_y + prog_h + 0.1,
            "2 of 3 months", fontproperties=lato_bold, fontsize=9,
            color=TEAL, ha="center", va="bottom")
    for frac, label in [(0, "Jan"), (0.33, "Feb"), (0.67, "Mar")]:
        mx = prog_x + prog_w * frac
        ax.plot([mx, mx], [prog_y - 0.05, prog_y], color=DARK_TEXT,
                linewidth=0.8, zorder=4)
        ax.text(mx, prog_y - 0.12, label, fontproperties=lato_regular,
                fontsize=8, color=SUBTITLE_GRAY, ha="center", va="top")

    # Source
    fig.text(0.04, 0.02, "Sources: Sprout Social, LinkedIn Analytics, Meta Business Suite, X Analytics, Craft CMS  |  Targets: 90-Day Sprint Plan",
             fontproperties=lato_regular, fontsize=8, color=SUBTITLE_GRAY, ha="left")

    plt.tight_layout(rect=[0.0, 0.04, 1.0, 0.97])

    out_path = os.path.join(OUT_DIR, "content_dashboard.png")
    fig.savefig(out_path, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print(f"  Content dashboard chart -> {out_path}")


def _make_ring_inset(fig, left, bottom, size, pct, actual_text, target_text):
    """Create a circular progress ring in an inset axes with equal aspect."""
    ring_ax = fig.add_axes([left, bottom, size, size])
    ring_ax.set_xlim(-1.3, 1.3)
    ring_ax.set_ylim(-1.3, 1.3)
    ring_ax.set_aspect("equal")
    ring_ax.axis("off")
    r = 1.0
    bg = Wedge((0, 0), r, 0, 360, width=r * 0.28,
               facecolor=PR_LIGHT, edgecolor="none")
    ring_ax.add_patch(bg)
    if pct > 0:
        fg = Wedge((0, 0), r, 90 - pct * 360, 90, width=r * 0.28,
                   facecolor=PR_TEAL, edgecolor="none")
        ring_ax.add_patch(fg)
    ring_ax.text(0, -0.05, actual_text, fontproperties=lato_bold, fontsize=22,
                 color=PR_NAVY, ha="center", va="center")
    ring_ax.text(0, r + 0.2, f"/ {target_text}", fontproperties=lato_regular,
                 fontsize=9, color=PR_SLATE, ha="center", va="bottom")
    return ring_ax


def make_sec_social_cadence():
    """Section card: Social media posting ramp-up bar chart."""
    fig = plt.figure(figsize=(5, 6))
    fig.set_facecolor(WHITE)
    _card_border(fig)

    # Title block
    fig.text(0.08, 0.96, "Social Media", fontproperties=lato_bold,
             fontsize=28, color=PR_NAVY, ha="left", va="top")
    fig.text(0.08, 0.85, "Channel Ramp-Up",
             fontproperties=lato_bold, fontsize=17, color=PR_NAVY, ha="left")
    fig.text(0.08, 0.79, "Posts to date vs quarterly target",
             fontproperties=lato_regular, fontsize=14, color=PR_SLATE, ha="left")

    # Bar chart — wider axes to reduce blank space on right
    ax = fig.add_axes([0.28, 0.18, 0.62, 0.55])
    ax.set_facecolor(WHITE)

    platforms = [
        ("Instagram", 4, INSTA_PINK, "Culture"),
        ("BlueSky", 8, BLUESKY_BLUE, "B2B"),
        ("X", 9, X_BLACK, "B2B"),
        ("Facebook", 9, FB_BLUE, "B2C"),
        ("LinkedIn", 15, LINKEDIN_BLUE, "B2B"),
    ]
    target = 24
    y_positions = range(len(platforms))

    # Target bars (background)
    ax.barh(y_positions, [target] * len(platforms), height=0.55,
            color=PR_LIGHT, edgecolor="none", zorder=1)
    # Actual bars
    for i, (name, actual, color, aud) in enumerate(platforms):
        ax.barh(i, actual, height=0.55, color=color, edgecolor="none", zorder=2)
        pct = actual / target
        ax.text(target + 0.5, i + 0.08, f"{actual}/{target} ({pct:.0%})",
                fontproperties=lato_bold, fontsize=14, color=PR_NAVY,
                va="center", ha="left")
        ax.text(target + 0.5, i - 0.22, aud,
                fontproperties=lato_regular, fontsize=13, color=PR_SLATE,
                va="center", ha="left")

    ax.set_yticks(y_positions)
    ax.set_yticklabels([p[0] for p in platforms], fontproperties=lato_bold,
                       fontsize=15, color=PR_NAVY)
    ax.set_xlim(0, 33)
    ax.xaxis.set_visible(False)
    ax.tick_params(left=False)
    for spine in ax.spines.values():
        spine.set_visible(False)

    # Summary badge — blue for in-progress
    badge = FancyBboxPatch((0.04, 0.04), 0.92, 0.10,
                           boxstyle="round,pad=0.012", facecolor="#E3F2FD",
                           edgecolor=PR_BLUE, linewidth=1,
                           transform=fig.transFigure)
    fig.patches.append(badge)
    fig.text(0.5, 0.09, "5 channels launched  |  Scaling cadence",
             fontproperties=lato_bold, fontsize=14, color="#1565C0", ha="center")

    out_path = os.path.join(OUT_DIR, "sec_social_cadence.png")
    fig.savefig(out_path, dpi=300, pad_inches=0.08, facecolor=WHITE)
    plt.close(fig)
    print(f"  Social cadence section -> {out_path}")


def make_sec_blog_strategy():
    """Section card: Blog content strategy overview."""
    fig = plt.figure(figsize=(5, 6))
    fig.set_facecolor(WHITE)
    _card_border(fig)

    # Title
    fig.text(0.08, 0.96, "Blog Content", fontproperties=lato_bold,
             fontsize=28, color=PR_NAVY, ha="left", va="top")
    fig.text(0.08, 0.85, "Content Development Pipeline",
             fontproperties=lato_bold, fontsize=17, color=PR_NAVY, ha="left")
    fig.text(0.08, 0.79, "Owned content fuels social cadence + SEO",
             fontproperties=lato_regular, fontsize=14, color=PR_SLATE, ha="left")

    # Strategy pipeline items
    items = [
        ("B2C homeowner education", "Complete", "complete",
         "Pillar series for Pearl SCORE buyers"),
        ("B2B thought leadership", "In Progress", "in_progress",
         "Industry authority positioning"),
        ("Derivative content for social", "In Progress", "in_progress",
         "Blog \u2192 social posts across channels"),
        ("Sustainable publishing cadence", "In Progress", "in_progress",
         "Building repeatable content engine"),
    ]

    y_start = 0.68
    spacing = 0.13
    for i, (title, label, status, desc) in enumerate(items):
        y = y_start - i * spacing
        _status_icon(fig, 0.06, y, status)
        fig.text(0.13, y + 0.025, title, fontproperties=lato_bold, fontsize=14,
                 color=PR_NAVY, ha="left", va="center")
        fig.text(0.13, y - 0.025, desc, fontproperties=lato_regular, fontsize=12,
                 color=PR_SLATE, ha="left", va="center")
        _status_badge(fig, 0.96, y, label, status)

    # Goal connection line
    fig.text(0.08, 0.19, "Goal:", fontproperties=lato_bold, fontsize=14,
             color=PR_NAVY, ha="left")
    fig.text(0.20, 0.19, "Blog \u2192 derivatives \u2192 cadence \u2192 SEO",
             fontproperties=lato_regular, fontsize=13, color=PR_SLATE, ha="left")

    # Summary badge — blue for in-progress
    badge = FancyBboxPatch((0.06, 0.04), 0.88, 0.10,
                           boxstyle="round,pad=0.012", facecolor="#E3F2FD",
                           edgecolor=PR_BLUE, linewidth=1,
                           transform=fig.transFigure)
    fig.patches.append(badge)
    fig.text(0.5, 0.09, "Pipeline in development  |  Scaling up",
             fontproperties=lato_bold, fontsize=14, color="#1565C0", ha="center")

    out_path = os.path.join(OUT_DIR, "sec_blog_strategy.png")
    fig.savefig(out_path, dpi=300, pad_inches=0.08, facecolor=WHITE)
    plt.close(fig)
    print(f"  Blog strategy section -> {out_path}")


PR_BLUE = "#2597ec"  # in_progress blue from PR dashboard
PR_GOLD = "#fcaf1f"


def _status_icon(fig, x, y, status, sz=0.025):
    """Draw a pipeline status icon using drawing primitives (not Unicode).
    Matches PR dashboard sicon(): teal+check, blue+dot, white+outline.
    Uses a tiny inset axes for proper circular aspect ratio.
    """
    from matplotlib.patches import Circle as MplCircle
    # Create a small square axes for the icon
    ax = fig.add_axes([x - sz, y - sz, sz * 2, sz * 2])
    ax.set_xlim(-1, 1)
    ax.set_ylim(-1, 1)
    ax.set_aspect("equal")
    ax.axis("off")

    if status == "complete":
        # Filled teal circle
        bg = MplCircle((0, 0), 0.85, facecolor=PR_TEAL, edgecolor="none", zorder=2)
        ax.add_patch(bg)
        # White checkmark — two line segments matching PR dashboard sicon()
        ax.plot([-0.35, -0.05], [0.0, -0.30],
                color=WHITE, linewidth=2.8, solid_capstyle="round", zorder=3)
        ax.plot([-0.05, 0.40], [-0.30, 0.30],
                color=WHITE, linewidth=2.8, solid_capstyle="round", zorder=3)
    elif status == "in_progress":
        # Filled blue circle
        bg = MplCircle((0, 0), 0.85, facecolor=PR_BLUE, edgecolor="none", zorder=2)
        ax.add_patch(bg)
        # Small white dot inside (38% radius, matching PR dashboard)
        inner = MplCircle((0, 0), 0.32, facecolor=WHITE, edgecolor="none", zorder=3)
        ax.add_patch(inner)
    else:  # on_deck
        # White circle with slate outline stroke
        bg = MplCircle((0, 0), 0.85, facecolor=WHITE, edgecolor=PR_SLATE,
                       linewidth=2.0, zorder=2)
        ax.add_patch(bg)


def _status_badge(fig, x, y, label, status):
    """Draw a status badge label matching PR dashboard colors."""
    colors = {
        "complete": PR_TEAL, "in_progress": PR_BLUE,
        "on_deck": PR_SLATE,
    }
    color = colors.get(status, PR_SLATE)
    fig.text(x, y, label, fontproperties=lato_bold, fontsize=15,
             color=color, ha="right", va="center")


def make_sec_b2c_blog():
    """Section card: B2C pillar content pipeline (PR dashboard style)."""
    fig = plt.figure(figsize=(5, 6))
    fig.set_facecolor(WHITE)
    _card_border(fig)

    # Title
    fig.text(0.08, 0.96, "B2C", fontproperties=lato_bold,
             fontsize=28, color=PR_NAVY, ha="left", va="top")
    fig.text(0.08, 0.85, "Homeowner Education Pipeline",
             fontproperties=lato_bold, fontsize=17, color=PR_NAVY, ha="left")
    fig.text(0.08, 0.79, "Homeowner blog  |  5-article pillar series",
             fontproperties=lato_regular, fontsize=14, color=PR_SLATE, ha="left")

    # Pipeline items — "What Every Buyer Needs to Know" series
    items = [
        ("Safety", "Complete", "complete", "Jan"),
        ("Comfort", "Complete", "complete", "Jan"),
        ("Operating Costs", "Complete", "complete", "Feb"),
        ("Resilience", "Complete", "complete", "Feb"),
        ("Energy", "Scheduled", "in_progress", "Mar"),
    ]

    y_start = 0.70
    spacing = 0.10
    for i, (title, label, status, date) in enumerate(items):
        y = y_start - i * spacing
        _status_icon(fig, 0.06, y, status)
        text_color = PR_NAVY if status == "complete" else PR_SLATE
        fig.text(0.13, y, title, fontproperties=lato_regular, fontsize=15,
                 color=text_color, ha="left", va="center")
        fig.text(0.75, y, date, fontproperties=lato_regular, fontsize=13,
                 color=PR_SLATE, ha="right", va="center")
        _status_badge(fig, 0.96, y, label, status)

    # Summary badge
    badge = FancyBboxPatch((0.04, 0.04), 0.92, 0.10,
                           boxstyle="round,pad=0.012", facecolor="#E8F5E9",
                           edgecolor=PR_TEAL, linewidth=1,
                           transform=fig.transFigure)
    fig.patches.append(badge)
    fig.text(0.5, 0.09, "80% Complete — 4 of 5  |  1 remaining",
             fontproperties=lato_bold, fontsize=14, color="#2E7D32", ha="center")

    out_path = os.path.join(OUT_DIR, "sec_b2c_blog.png")
    fig.savefig(out_path, dpi=300, pad_inches=0.08, facecolor=WHITE)
    plt.close(fig)
    print(f"  B2C blog section -> {out_path}")


def make_sec_b2b_blog():
    """Section card: B2B thought leadership pipeline (PR dashboard style)."""
    fig = plt.figure(figsize=(5, 6))
    fig.set_facecolor(WHITE)
    _card_border(fig)

    # Title
    fig.text(0.08, 0.96, "B2B", fontproperties=lato_bold,
             fontsize=28, color=PR_NAVY, ha="left", va="top")
    fig.text(0.08, 0.85, "Thought Leadership Pipeline",
             fontproperties=lato_bold, fontsize=17, color=PR_NAVY, ha="left")
    fig.text(0.08, 0.79, "Industry blog  |  Target: 1 article/month",
             fontproperties=lato_regular, fontsize=14, color=PR_SLATE, ha="left")

    # Pipeline items (chronological, matching B2C)
    items = [
        ("Five Things Your Clients\nCan't See in Listing Photos", "Complete", "complete", "Jan"),
        ("America's 40-Year-Old Problem", "Complete", "complete", "Feb"),
        ("Q1 Article #3", "On Deck", "on_deck", "Mar"),
    ]

    y_start = 0.67
    spacing = 0.16
    for i, (title, label, status, date) in enumerate(items):
        y = y_start - i * spacing
        _status_icon(fig, 0.06, y, status)
        text_color = PR_NAVY if status == "complete" else PR_SLATE
        fig.text(0.12, y, title, fontproperties=lato_regular, fontsize=14,
                 color=text_color, ha="left", va="center", linespacing=1.15)
        fig.text(0.70, y, date, fontproperties=lato_regular, fontsize=14,
                 color=PR_SLATE, ha="left", va="center")
        _status_badge(fig, 0.96, y, label, status)

    # Summary badge
    badge = FancyBboxPatch((0.04, 0.04), 0.92, 0.10,
                           boxstyle="round,pad=0.012", facecolor="#E8F5E9",
                           edgecolor=PR_TEAL, linewidth=1,
                           transform=fig.transFigure)
    fig.patches.append(badge)
    fig.text(0.5, 0.09, "67% Complete — 2 of 3  |  1 remaining for Q1",
             fontproperties=lato_bold, fontsize=14, color="#2E7D32", ha="center")

    out_path = os.path.join(OUT_DIR, "sec_b2b_blog.png")
    fig.savefig(out_path, dpi=300, pad_inches=0.08, facecolor=WHITE)
    plt.close(fig)
    print(f"  B2B blog section -> {out_path}")


def make_sec_accomplishments():
    """Section card: Key results pipeline style."""
    fig = plt.figure(figsize=(5, 4.5))
    fig.set_facecolor(WHITE)
    _card_border(fig)

    # Title
    fig.text(0.08, 0.95, "Key Results", fontproperties=lato_bold,
             fontsize=18, color=PR_NAVY, ha="left", va="top")
    fig.text(0.08, 0.88, "Q1 Progress",
             fontproperties=lato_bold, fontsize=9, color=PR_NAVY, ha="left")
    fig.text(0.08, 0.83, "Q1 2026 (Jan 1 \u2013 Mar 2)  |  Source: Sprout Social",
             fontproperties=lato_regular, fontsize=9, color=PR_SLATE, ha="left")

    # Pipeline-style metric rows with teal checkmarks
    metrics = [
        ("6.9% Avg Engagement Rate", "vs 2% industry avg (3.5\u00d7)"),
        ("+68% Link Click Growth", "vs Q4 2025"),
        ("5 Active Channels", "from 1 barely-active in Sep \u201925"),
        ("13.3K Total Impressions", "across all platforms"),
        ("37 Posts Published", "across 5 channels in 2 months"),
    ]

    y_start = 0.74
    spacing = 0.11
    for i, (metric, context) in enumerate(metrics):
        y = y_start - i * spacing
        _status_icon(fig, 0.08, y, "complete")
        fig.text(0.14, y + 0.015, metric, fontproperties=lato_bold, fontsize=9,
                 color=PR_NAVY, ha="left", va="center")
        fig.text(0.14, y - 0.025, context, fontproperties=lato_regular, fontsize=9,
                 color=PR_SLATE, ha="left", va="center")

    # Summary badge
    badge = FancyBboxPatch((0.06, 0.06), 0.88, 0.09,
                           boxstyle="round,pad=0.012", facecolor="#E8F5E9",
                           edgecolor=PR_TEAL, linewidth=1,
                           transform=fig.transFigure)
    fig.patches.append(badge)
    fig.text(0.5, 0.105, "All platforms outperforming industry benchmarks",
             fontproperties=lato_bold, fontsize=9, color="#2E7D32", ha="center")

    out_path = os.path.join(OUT_DIR, "sec_accomplishments.png")
    fig.savefig(out_path, dpi=300, pad_inches=0.08, facecolor=WHITE)
    plt.close(fig)
    print(f"  Accomplishments section -> {out_path}")


def make_sec_research():
    """Section card: Research & whitepapers pipeline."""
    fig = plt.figure(figsize=(5, 6))
    fig.set_facecolor(WHITE)
    _card_border(fig)

    # Title — no subtitle line
    fig.text(0.08, 0.96, "Research &", fontproperties=lato_bold,
             fontsize=26, color=PR_NAVY, ha="left", va="top")
    fig.text(0.08, 0.85, "Whitepapers",
             fontproperties=lato_bold, fontsize=26, color=PR_NAVY, ha="left")

    # Two active items
    items = [
        ("Consumer Performance Survey", "In Progress", "in_progress",
         "Research completed, entering analysis phase"),
        ("Whitepaper Cadence", "In Progress", "in_progress",
         "Finalizing schedule \u2014 determining which\npapers make the content calendar"),
    ]

    y_start = 0.68
    spacing = 0.20
    for i, (title, label, status, detail) in enumerate(items):
        y = y_start - i * spacing
        _status_icon(fig, 0.06, y + 0.01, status)
        fig.text(0.12, y + 0.025, title, fontproperties=lato_bold, fontsize=14,
                 color=PR_NAVY, ha="left", va="center")
        fig.text(0.12, y - 0.03, detail,
                 fontproperties=lato_regular, fontsize=11,
                 color=PR_SLATE, ha="left", va="center",
                 linespacing=1.4)
        _status_badge(fig, 0.96, y, label, status)

    # Summary badge — blue/in-progress style
    badge = FancyBboxPatch((0.04, 0.04), 0.92, 0.10,
                           boxstyle="round,pad=0.012", facecolor="#E3F2FD",
                           edgecolor=PR_BLUE, linewidth=1,
                           transform=fig.transFigure)
    fig.patches.append(badge)
    fig.text(0.5, 0.09, "2 workstreams active  |  Analysis & planning underway",
             fontproperties=lato_bold, fontsize=13, color="#1565C0", ha="center")

    out_path = os.path.join(OUT_DIR, "sec_research.png")
    fig.savefig(out_path, dpi=300, pad_inches=0.08, facecolor=WHITE)
    plt.close(fig)
    print(f"  Research section -> {out_path}")


def make_sec_fps_strategy():
    """FPS 12-month SEO/GEO strategy roadmap — wide card with 3 phases."""
    fig = plt.figure(figsize=(12, 6.5))
    fig.set_facecolor(WHITE)
    _card_border(fig)

    # Title block
    fig.text(0.04, 0.97, "SEO & AI Visibility Strategy",
             fontproperties=lato_bold, fontsize=22, color=PR_NAVY,
             ha="left", va="top")
    fig.text(0.04, 0.91, "Front Page Sage \u2014 12-Month Plan",
             fontproperties=lato_regular, fontsize=14, color=PR_SLATE,
             ha="left")

    # Three phase cards — from FPS Editorial Calendar 2026
    phases = [
        {
            "label": "Phase 1", "months": "Mo 1\u20135",
            "title": "Foundation & Authority Building",
            "status": "in_progress",
            "deliverables": [
                "Metrics articles (energy, costs, stats)",
                "How-to guides (buyers & sellers)",
                "Comparison blogs & Q+A interviews",
                "Research Center landing page",
            ],
            "positioning": "Build search authority across\nenergy, safety & home performance",
            "callout": "First performance data expected\naround Month 3",
        },
        {
            "label": "Phase 2", "months": "Mo 6\u20138",
            "title": "Product Launch & Scale",
            "status": "on_deck",
            "deliverables": [
                "Pearl Score awareness content",
                "Product pages (Score, Improvement Plan)",
                "First-time buyer guide series",
                "Property assessment comparisons",
            ],
            "positioning": "Connect search traffic to\nPearl Score awareness & conversions",
        },
        {
            "label": "Phase 3", "months": "Mo 9\u201312",
            "title": "Research Center Dominance",
            "status": "on_deck",
            "deliverables": [
                "Quarterly Home Performance Index",
                "Agent tools & platform comparisons",
                "Year-end performance report",
                "AI exchange placements (ongoing)",
            ],
            "positioning": "Establish Pearl Research Center\nas the industry benchmark source",
        },
    ]

    card_w = 0.28
    card_h = 0.62
    gap = 0.035
    x_start = 0.04
    y_top = 0.84

    for i, p in enumerate(phases):
        x = x_start + i * (card_w + gap)
        # Card background
        is_active = p["status"] == "in_progress"
        border_color = PR_BLUE if is_active else PR_LIGHT
        bg_color = "#F5F9FF" if is_active else WHITE
        card = FancyBboxPatch(
            (x, y_top - card_h), card_w, card_h,
            boxstyle="round,pad=0.012", facecolor=bg_color,
            edgecolor=border_color, linewidth=2,
            transform=fig.transFigure)
        fig.patches.append(card)

        # Phase label + months
        fig.text(x + 0.015, y_top - 0.03, p["label"],
                 fontproperties=lato_bold, fontsize=12, color=PR_SLATE)
        fig.text(x + card_w - 0.015, y_top - 0.03, p["months"],
                 fontproperties=lato_regular, fontsize=11, color=PR_SLATE,
                 ha="right")

        # Title
        fig.text(x + 0.015, y_top - 0.09, p["title"],
                 fontproperties=lato_bold, fontsize=14, color=PR_NAVY)

        # Goal label + statement (prominent, right under title)
        fig.text(x + 0.015, y_top - 0.14, "Goal:",
                 fontproperties=lato_bold, fontsize=11, color=PR_TEAL)
        fig.text(x + 0.015, y_top - 0.19, p["positioning"],
                 fontproperties=lato_regular, fontsize=11, color=DARK_TEXT,
                 linespacing=1.3)

        # Status label
        status_color = PR_BLUE if is_active else PR_SLATE
        status_label = "Active" if is_active else "On Deck"
        fig.text(x + card_w - 0.015, y_top - 0.14, status_label,
                 fontproperties=lato_bold, fontsize=11, color=status_color,
                 ha="right")

        # Divider line
        fig.add_artist(plt.Line2D(
            [x + 0.015, x + card_w - 0.015],
            [y_top - 0.27, y_top - 0.27],
            color=PR_LIGHT, linewidth=1, transform=fig.transFigure))

        # Deliverables
        for j, d in enumerate(p["deliverables"]):
            dy = y_top - 0.31 - j * 0.065
            fig.text(x + 0.025, dy, "\u2022", fontproperties=lato_regular,
                     fontsize=11, color=PR_SLATE)
            fig.text(x + 0.04, dy, d, fontproperties=lato_regular,
                     fontsize=11, color=DARK_TEXT)

        # Optional callout box below deliverables
        if "callout" in p:
            cy = y_top - 0.31 - len(p["deliverables"]) * 0.065 - 0.02
            callout_bg = FancyBboxPatch(
                (x + 0.012, cy - 0.06), card_w - 0.024, 0.07,
                boxstyle="round,pad=0.008", facecolor="#E8F5E9",
                edgecolor=PR_TEAL, linewidth=1,
                transform=fig.transFigure)
            fig.patches.append(callout_bg)
            fig.text(x + card_w / 2, cy - 0.025, p["callout"],
                     fontproperties=lato_bold, fontsize=9, color="#2E7D32",
                     ha="center", va="center", linespacing=1.3)

        # Connector arrows between cards
        if i < 2:
            arrow_x = x + card_w + gap * 0.15
            arrow_y = y_top - card_h / 2
            fig.text(arrow_x, arrow_y, "\u25B6", fontsize=16,
                     color=PR_SLATE, ha="center", va="center",
                     transform=fig.transFigure)

    # Summary badge
    badge = FancyBboxPatch((0.04, 0.04), 0.92, 0.09,
                           boxstyle="round,pad=0.012", facecolor="#E3F2FD",
                           edgecolor=PR_BLUE, linewidth=1,
                           transform=fig.transFigure)
    fig.patches.append(badge)
    fig.text(0.5, 0.085, "Phase 1 active  |  Foundation & Authority underway",
             fontproperties=lato_bold, fontsize=14, color="#1565C0",
             ha="center")

    out_path = os.path.join(OUT_DIR, "sec_fps_strategy.png")
    fig.savefig(out_path, dpi=300, pad_inches=0.08, facecolor=WHITE)
    plt.close(fig)
    print(f"  FPS strategy section -> {out_path}")


def make_sec_fps_pipeline():
    """FPS Phase 1 content pipeline — single-column list matching TL style."""
    fig = plt.figure(figsize=(10, 7.5))
    fig.set_facecolor(WHITE)
    _card_border(fig)

    # Title
    fig.text(0.05, 0.96, "FPS Phase 1 Content Pipeline",
             fontproperties=lato_bold, fontsize=22, color=PR_NAVY,
             ha="left", va="top")

    # Items — single column: icon | title | status label | month
    items = [
        ("Home Energy Audit Cost: 2026 Stats", "Published", "complete", "Jan"),
        ("Avg Home Energy Use Per Day: 2026", "Published", "complete", "Jan"),
        ("Home Maintenance Cost: Annual", "Published", "complete", "Jan"),
        ("Best Home Energy Assessments", "In Progress", "in_progress", "Feb"),
        ("RE Buying Guide: Evaluate a Home", "In Progress", "in_progress", "Feb"),
        ("Avg Utility Bill Per Month: 2026", "In Progress", "in_progress", "Feb"),
        ("Why Is My Electric Bill So High", "In Progress", "in_progress", "Feb"),
        ("Skaggs Walsh (AI Exchange)", "Scheduled", "complete", "Mar"),
        ("The Springs Resort & Spa (AI Exch)", "In Progress", "in_progress", "Mar"),
        ("First Time Home Buyer Stats 2026", "In Progress", "in_progress", "Mar"),
        ("% of Homeowners by Age 2026", "In Progress", "in_progress", "Mar"),
        ("+ 21 more in Months 3\u20135", "", "on_deck", ""),
    ]

    badge_colors = {
        "complete": PR_TEAL, "in_progress": PR_BLUE, "on_deck": PR_SLATE
    }

    y_start = 0.88
    spacing = 0.052
    icon_x = 0.05
    title_x = 0.09
    status_x = 0.85
    date_x = 0.95

    for i, (title, label, status, month) in enumerate(items):
        y = y_start - i * spacing
        _status_icon(fig, icon_x, y, status, sz=0.020)
        text_color = PR_NAVY if status in ("complete", "in_progress") else PR_SLATE
        fig.text(title_x, y, title, fontproperties=lato_regular, fontsize=13,
                 color=text_color, ha="left", va="center")
        if label:
            fig.text(status_x, y, label, fontproperties=lato_regular, fontsize=11,
                     color=badge_colors.get(status, PR_SLATE),
                     ha="right", va="center")
        if month:
            fig.text(date_x, y, month, fontproperties=lato_regular, fontsize=11,
                     color=PR_SLATE, ha="right", va="center")

    # Summary badge
    badge = FancyBboxPatch((0.05, 0.04), 0.90, 0.08,
                           boxstyle="round,pad=0.012", facecolor="#E3F2FD",
                           edgecolor=PR_BLUE, linewidth=1,
                           transform=fig.transFigure)
    fig.patches.append(badge)
    fig.text(0.5, 0.08, "4 published  |  7 in progress  |  22 planned",
             fontproperties=lato_bold, fontsize=13, color="#1565C0",
             ha="center")

    out_path = os.path.join(OUT_DIR, "sec_fps_pipeline.png")
    fig.savefig(out_path, dpi=300, pad_inches=0.08, facecolor=WHITE)
    plt.close(fig)
    print(f"  FPS pipeline section -> {out_path}")


def make_sec_fps_results():
    """FPS Phase 1 content mix and measurement timeline."""
    fig = plt.figure(figsize=(5, 6))
    fig.set_facecolor(WHITE)
    _card_border(fig)

    # Title
    fig.text(0.08, 0.96, "Phase 1", fontproperties=lato_bold,
             fontsize=28, color=PR_NAVY, ha="left", va="top")
    fig.text(0.08, 0.87, "Content Mix",
             fontproperties=lato_bold, fontsize=20, color=PR_NAVY, ha="left")
    fig.text(0.08, 0.82, "34 deliverables across 5 months",
             fontproperties=lato_regular, fontsize=13, color=PR_SLATE, ha="left")

    # Content type breakdown from editorial calendar
    content_types = [
        ("Metrics Articles", "18", "Data-driven stats & rankings"),
        ("How-to Guides", "5", "Buyer & seller education"),
        ("Comparison Blogs", "4", "Assessment & service reviews"),
        ("Q+A / Interviews", "4", "Industry thought leadership"),
        ("Landing Pages", "3", "Research Center, About, etc."),
    ]

    y_start = 0.72
    spacing = 0.095
    for i, (label, count, desc) in enumerate(content_types):
        y = y_start - i * spacing
        # Count badge
        count_bg = FancyBboxPatch(
            (0.06, y - 0.025), 0.10, 0.05,
            boxstyle="round,pad=0.008", facecolor=PR_NAVY,
            edgecolor="none", transform=fig.transFigure)
        fig.patches.append(count_bg)
        fig.text(0.11, y, count, fontproperties=lato_bold,
                 fontsize=14, color=WHITE, ha="center", va="center")
        fig.text(0.20, y + 0.012, label, fontproperties=lato_bold,
                 fontsize=12, color=PR_NAVY, ha="left", va="center")
        fig.text(0.20, y - 0.025, desc, fontproperties=lato_regular,
                 fontsize=10, color=PR_SLATE, ha="left", va="center")

    # Summary badge
    badge = FancyBboxPatch((0.04, 0.04), 0.92, 0.08,
                           boxstyle="round,pad=0.012", facecolor="#E3F2FD",
                           edgecolor=PR_BLUE, linewidth=1,
                           transform=fig.transFigure)
    fig.patches.append(badge)
    fig.text(0.5, 0.08, "84 total deliverables planned across 12 months",
             fontproperties=lato_bold, fontsize=11, color="#1565C0",
             ha="center")

    out_path = os.path.join(OUT_DIR, "sec_fps_results.png")
    fig.savefig(out_path, dpi=300, pad_inches=0.08, facecolor=WHITE)
    plt.close(fig)
    print(f"  FPS results section -> {out_path}")


def make_sec_programmatic_seo():
    """Programmatic SEO proposal overview — board-level framing."""
    fig = plt.figure(figsize=(7, 7))
    fig.set_facecolor(WHITE)
    _card_border(fig)

    # Title
    fig.text(0.05, 0.96, "Programmatic SEO",
             fontproperties=lato_bold, fontsize=24, color=PR_NAVY,
             ha="left", va="top")
    fig.text(0.05, 0.90, "Proposed expansion to FPS engagement",
             fontproperties=lato_regular, fontsize=13, color=PR_SLATE,
             ha="left")

    # Section: Impact
    fig.text(0.05, 0.83, "Impact",
             fontproperties=lato_bold, fontsize=16, color=PR_TEAL)

    impact_items = [
        "Pearl appears in Google results for any U.S. home address",
        "Compete directly with Zillow, Redfin, and Realtor.com",
        "92M indexed pages \u2014 one for every home in the registry",
        "Organic lead generation at scale, starting with Atlanta",
        "Address search is still Google-dominated \u2014 not disrupted by AI",
    ]
    for i, item in enumerate(impact_items):
        y = 0.77 - i * 0.050
        fig.text(0.07, y, "\u2022", fontproperties=lato_regular, fontsize=12,
                 color=PR_SLATE)
        fig.text(0.09, y, item, fontproperties=lato_regular, fontsize=12,
                 color=DARK_TEXT)

    # Divider
    fig.add_artist(plt.Line2D(
        [0.05, 0.95], [0.51, 0.51],
        color=PR_LIGHT, linewidth=1.5, transform=fig.transFigure))

    # Bottom section: three key questions in card format
    questions = [
        {
            "q": "Investment",
            "a1": "$15K",
            "a2": "Strategy & architecture\ndelivered to Pearl team",
            "note": "Planning only \u2014\ndoes not include build",
        },
        {
            "q": "Deliverable",
            "a1": "Roadmap",
            "a2": "Site audit, page design,\nrollout plan for engineering",
            "note": "6\u20138 week engagement\nwith FPS consultants",
        },
        {
            "q": "To Build",
            "a1": "Eng Team",
            "a2": "Implementation requires\nCTO + engineering capacity",
            "note": "Capacity TBD \u2014\nnot yet scoped internally",
        },
    ]

    card_w = 0.28
    card_h = 0.34
    gap = 0.03
    x_start = 0.05
    y_top = 0.48

    for i, q in enumerate(questions):
        x = x_start + i * (card_w + gap)
        card = FancyBboxPatch(
            (x, y_top - card_h), card_w, card_h,
            boxstyle="round,pad=0.012", facecolor="#F5F9FF",
            edgecolor=PR_LIGHT, linewidth=1.5,
            transform=fig.transFigure)
        fig.patches.append(card)

        # Question label
        fig.text(x + card_w / 2, y_top - 0.03, q["q"],
                 fontproperties=lato_bold, fontsize=12, color=PR_SLATE,
                 ha="center")
        # Big answer
        fig.text(x + card_w / 2, y_top - 0.10, q["a1"],
                 fontproperties=lato_bold, fontsize=24, color=PR_NAVY,
                 ha="center")
        # Description
        fig.text(x + card_w / 2, y_top - 0.18, q["a2"],
                 fontproperties=lato_regular, fontsize=11, color=DARK_TEXT,
                 ha="center", linespacing=1.3)
        # Note
        fig.text(x + card_w / 2, y_top - 0.28, q["note"],
                 fontproperties=lato_regular, fontsize=10, color=PR_SLATE,
                 ha="center", linespacing=1.3)

    # Summary badge
    badge = FancyBboxPatch((0.05, 0.02), 0.90, 0.08,
                           boxstyle="round,pad=0.012", facecolor="#FFF8E1",
                           edgecolor=PR_GOLD, linewidth=1,
                           transform=fig.transFigure)
    fig.patches.append(badge)
    fig.text(0.5, 0.06, "Decision: Approve $15K planning engagement  |  Implementation scoped separately",
             fontproperties=lato_bold, fontsize=12, color="#E65100",
             ha="center")

    out_path = os.path.join(OUT_DIR, "sec_programmatic_seo.png")
    fig.savefig(out_path, dpi=300, pad_inches=0.08, facecolor=WHITE)
    plt.close(fig)
    print(f"  Programmatic SEO section -> {out_path}")


if __name__ == "__main__":
    print("Generating social media charts...")
    make_impressions_chart()
    make_engagement_rate_chart()
    make_platform_matrix_chart()
    make_content_pipeline_chart()
    make_social_growth_chart()
    make_content_dashboard()
    # Dashboard section cards
    make_sec_social_cadence()
    make_sec_blog_strategy()
    make_sec_research()
    make_sec_b2c_blog()
    make_sec_b2b_blog()
    make_sec_accomplishments()
    # FPS strategy cards
    make_sec_fps_strategy()
    make_sec_fps_pipeline()
    make_sec_fps_results()
    make_sec_programmatic_seo()
    print(f"\nAll social charts saved to {OUT_DIR}/")
