# Tone Data

Place your Sprout Social export CSV files in this directory.

## How to export from Sprout Social

1. Log into Sprout Social
2. Go to **Reports** > **Post Performance**
3. Set the date range to the last 30-90 days
4. Click **Export** > **CSV**
5. Save the file to this directory

The tone analyzer reads the most recent CSV in this folder to build per-platform tone profiles. These profiles are cached in `profiles.json` and used as context when generating new social posts.

To force a refresh of tone profiles, run:
```
pearl-social --refresh-tone
```
