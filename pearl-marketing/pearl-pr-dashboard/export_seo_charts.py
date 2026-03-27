"""
Export SEO competitive analysis charts as PNGs for board deck presentation.
Generates: AI Visibility comparison, AI Audience comparison, Branded vs Non-Branded breakdown.
Uses matplotlib with Lato fonts to match the PR dashboard style.
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import matplotlib.ticker as mticker
from matplotlib.patches import Wedge, FancyBboxPatch
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

# Brand colors (Pearl Master Theme 2025)
TEAL = "#04b290"
GRAY_BAR = "#B0BEC5"
AMBER = "#fcaf1f"
DARK_TEXT = "#0c3860"
SUBTITLE_GRAY = "#5c7a96"
WHITE = "#ffffff"


def make_ai_visibility_chart():
    """Chart 1: AI Visibility Score horizontal bar chart."""
    labels = [
        "KelleyBlueBookHomes.com",
        "RealReports.com",
        "ShipShape.ai",
        "PearlScore.com",
        "HouseCanary.com",
    ]
    values = [0, 0, 16, 23, 29]
    colors = [GRAY_BAR, GRAY_BAR, GRAY_BAR, TEAL, GRAY_BAR]

    fig, ax = plt.subplots(figsize=(10, 5))
    fig.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    bars = ax.barh(range(len(labels)), values, height=0.55, color=colors,
                   edgecolor="none", zorder=3)

    # Value labels at end of each bar
    for i, (bar, val) in enumerate(zip(bars, values)):
        x_pos = bar.get_width() + 0.5
        if val == 0:
            x_pos = 0.5
        weight_prop = lato_bold if labels[i] == "PearlScore.com" else lato_regular
        color = TEAL if labels[i] == "PearlScore.com" else DARK_TEXT
        ax.text(x_pos, bar.get_y() + bar.get_height() / 2, str(val),
                va="center", ha="left", fontproperties=weight_prop,
                fontsize=13, color=color)

    # Y-axis labels
    ax.set_yticks(range(len(labels)))
    ax.set_yticklabels(labels, fontproperties=lato_regular, fontsize=12, color=DARK_TEXT)
    # Bold the Pearl label
    for tick_label in ax.get_yticklabels():
        if "PearlScore" in tick_label.get_text():
            tick_label.set_fontproperties(lato_bold)
            tick_label.set_color(TEAL)

    # Grid and spines
    ax.set_xlim(0, 35)
    ax.xaxis.set_visible(False)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["bottom"].set_visible(False)
    ax.spines["left"].set_visible(False)
    ax.tick_params(left=False)
    ax.grid(axis="x", color="#ECEFF1", linewidth=0.6, zorder=0)

    # Title and subtitle
    fig.text(0.04, 0.94, "AI Visibility Score \u2014 U.S. Competitive Landscape",
             fontproperties=lato_bold, fontsize=16, color=DARK_TEXT, ha="left")
    fig.text(0.04, 0.88, "Source: SEMrush Competitor Research, March 2, 2026",
             fontproperties=lato_regular, fontsize=10, color=SUBTITLE_GRAY, ha="left")

    plt.tight_layout(rect=[0.0, 0.02, 1.0, 0.86])

    out_path = os.path.join(OUT_DIR, "ai_visibility_comparison.png")
    fig.savefig(out_path, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print(f"  AI Visibility chart -> {out_path}")


def make_ai_audience_chart():
    """Chart 2: Monthly AI Audience horizontal bar chart."""
    labels = [
        "KelleyBlueBookHomes.com",
        "RealReports.com",
        "PearlScore.com",
        "ShipShape.ai",
        "HouseCanary.com",
    ]
    values = [0, 0, 225970, 399310, 1870000]
    display_labels = ["0", "0", "226.0K", "399.3K", "1.87M"]
    colors = [GRAY_BAR, GRAY_BAR, TEAL, GRAY_BAR, GRAY_BAR]

    fig, ax = plt.subplots(figsize=(10, 5))
    fig.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    bars = ax.barh(range(len(labels)), values, height=0.55, color=colors,
                   edgecolor="none", zorder=3)

    # Value labels at end of each bar
    for i, (bar, val, dlabel) in enumerate(zip(bars, values, display_labels)):
        x_pos = bar.get_width() + 20000
        if val == 0:
            x_pos = 20000
        weight_prop = lato_bold if labels[i] == "PearlScore.com" else lato_regular
        color = TEAL if labels[i] == "PearlScore.com" else DARK_TEXT
        ax.text(x_pos, bar.get_y() + bar.get_height() / 2, dlabel,
                va="center", ha="left", fontproperties=weight_prop,
                fontsize=13, color=color)

    # Y-axis labels
    ax.set_yticks(range(len(labels)))
    ax.set_yticklabels(labels, fontproperties=lato_regular, fontsize=12, color=DARK_TEXT)
    for tick_label in ax.get_yticklabels():
        if "PearlScore" in tick_label.get_text():
            tick_label.set_fontproperties(lato_bold)
            tick_label.set_color(TEAL)

    # Grid and spines
    ax.set_xlim(0, 2200000)
    ax.xaxis.set_visible(False)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["bottom"].set_visible(False)
    ax.spines["left"].set_visible(False)
    ax.tick_params(left=False)
    ax.grid(axis="x", color="#ECEFF1", linewidth=0.6, zorder=0)

    # Title and subtitle
    fig.text(0.04, 0.94, "Monthly AI Audience \u2014 U.S.",
             fontproperties=lato_bold, fontsize=16, color=DARK_TEXT, ha="left")
    fig.text(0.04, 0.88, "Source: SEMrush Competitor Research, March 2, 2026",
             fontproperties=lato_regular, fontsize=10, color=SUBTITLE_GRAY, ha="left")

    plt.tight_layout(rect=[0.0, 0.02, 1.0, 0.86])

    out_path = os.path.join(OUT_DIR, "ai_audience_comparison.png")
    fig.savefig(out_path, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print(f"  AI Audience chart -> {out_path}")


def make_branded_vs_nonbranded_chart():
    """Chart 3: Branded vs Non-Branded donut chart."""
    branded = 91.4
    non_branded = 8.6

    fig, ax = plt.subplots(figsize=(10, 5))
    fig.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    # Donut chart
    sizes = [branded, non_branded]
    colors_donut = [DARK_TEXT, AMBER]
    explode = (0.02, 0.02)

    wedges, _ = ax.pie(
        sizes,
        colors=colors_donut,
        startangle=90,
        explode=explode,
        wedgeprops=dict(width=0.35, edgecolor=WHITE, linewidth=2),
        pctdistance=0.82,
    )

    # Center text
    ax.text(0, 0.06, "91.4%", ha="center", va="center",
            fontproperties=lato_bold, fontsize=32, color=DARK_TEXT)
    ax.text(0, -0.16, "Branded", ha="center", va="center",
            fontproperties=lato_regular, fontsize=14, color=SUBTITLE_GRAY)

    # Legend entries positioned to the right
    legend_x = 1.35
    legend_y_top = 0.15

    # Branded legend
    ax.add_patch(FancyBboxPatch((legend_x - 0.05, legend_y_top - 0.04), 0.08, 0.08,
                                boxstyle="round,pad=0.01", facecolor=DARK_TEXT,
                                edgecolor="none", transform=ax.transData, clip_on=False))
    ax.text(legend_x + 0.08, legend_y_top, f"Branded: {branded}%",
            ha="left", va="center", fontproperties=lato_bold, fontsize=13,
            color=DARK_TEXT, transform=ax.transData, clip_on=False)

    # Non-Branded legend
    nb_y = legend_y_top - 0.18
    ax.add_patch(FancyBboxPatch((legend_x - 0.05, nb_y - 0.04), 0.08, 0.08,
                                boxstyle="round,pad=0.01", facecolor=AMBER,
                                edgecolor="none", transform=ax.transData, clip_on=False))
    ax.text(legend_x + 0.08, nb_y, f"Non-Branded: {non_branded}%",
            ha="left", va="center", fontproperties=lato_bold, fontsize=13,
            color=DARK_TEXT, transform=ax.transData, clip_on=False)

    ax.set_xlim(-1.5, 2.2)
    ax.set_ylim(-1.2, 1.2)
    ax.set_aspect("equal")
    ax.axis("off")

    # Title
    fig.text(0.04, 0.93, "Organic Search Traffic Breakdown",
             fontproperties=lato_bold, fontsize=16, color=DARK_TEXT, ha="left")
    # Subtitle - the insight callout
    fig.text(0.04, 0.87, "91% branded traffic = massive non-branded growth opportunity",
             fontproperties=lato_regular, fontsize=11, color=SUBTITLE_GRAY,
             ha="left", style="italic")
    # Footnote
    fig.text(0.04, 0.04, "Source: SEMrush Domain Overview (US), March 2, 2026",
             fontproperties=lato_regular, fontsize=9, color=SUBTITLE_GRAY, ha="left")

    plt.tight_layout(rect=[0.0, 0.08, 1.0, 0.84])

    out_path = os.path.join(OUT_DIR, "branded_vs_nonbranded.png")
    fig.savefig(out_path, dpi=200, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print(f"  Branded vs Non-Branded chart -> {out_path}")


if __name__ == "__main__":
    print("Generating SEO competitive analysis charts...")
    make_ai_visibility_chart()
    make_ai_audience_chart()
    make_branded_vs_nonbranded_chart()
    print(f"\nAll SEO charts saved to {OUT_DIR}/")
