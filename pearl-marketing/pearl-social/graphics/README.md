# Social Media Graphics

Export Canva slides here for pearl-social to match with blog posts.

## Naming Convention

Use the blog title slug + type suffix:

```
home-energy-initial.png          → Initial post graphic
home-energy-repost.png           → Follow-up/repost graphic
home-energy-quote-jane-doe.png   → VIP quote graphic (by attribution)
```

The matcher also works with keyword-based filenames — as long as 2+ significant words from the blog title appear in the filename, it will match.

## Canva Export Steps

1. Open the quarterly design deck (e.g., "Social Media_B2C Blog Announcement_Template_Q12026")
2. Select the slide for this blog post
3. Share → Download → PNG → Select page → Download
4. Rename using the convention above
5. Drop into this directory

## How It Works

When you run `pearl-social`, the graphic matcher scans this directory and classifies files:
- Filenames containing "initial" or "read-now" → initial graphic
- Filenames containing "repost", "visit", or "followup" → follow-up graphic
- Filenames containing "quote" + an attribution name → VIP quote graphic
