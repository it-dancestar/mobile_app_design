# DanceStar mobile mockup

All app pages are in pages/:
- index.html: Home
- schedule.html: Schedule
- news.html: News
- live.html: Live
- profile.html: Account

The root index.html redirects to pages/index.html for GitHub Pages hosting.
Open pages/index.html locally to preview. Each page shares styles.css and assets/.
The centered 9:16 screen has a header and bottom navigation, with scrollable content.

The reusable event template is preserved in pages/profile.html.
Copy entries from exampleEvents into events in events.js to display event buttons.
Image paths and destination URLs are relative to the page in pages/.
Buttons without href dispatch an event-select event for custom interactions.

To host on GitHub Pages, push this repository to GitHub, then open Settings > Pages.
Select Deploy from a branch, choose your branch and / (root), and save.
