# 🍅 PomoStats

**PomoStats** is a beautiful, offline-first dashboard for visualizing your Pomofocus data. It fetches your time-tracking history directly from Pomofocus and generates rich, interactive charts to help you analyze your productivity patterns, longest streaks, and most focused hours—so you can *ketchup* on where your time actually went!

<img src="images/image1.png" width="100%" alt="Dashboard Overview">

<p align="center">
  <img src="images/image2.png" width="49%" alt="Activity Trends">
  <img src="images/image3.png" width="49%" alt="Activity Heatmap">
</p>

## 🚀 Features
- **Key Metrics Matrix**: Quickly view your longest streaks, total active days, and personal bests in a sleek 3x3 grid.
- **Advanced Time Analysis**: Interactive daily, weekly, monthly, and yearly chart breakdowns.
- **All-Time Heatmap**: A GitHub-style historical heatmap to visualize your daily focus.
- **Turbo Fetching**: Fetches your data using 10 concurrent threads for maximum speed.
- **Import / Export**: Easily backup your history to JSON or CSV and load it back anytime without an internet connection.

## 🛠️ Setup & Run
To run this visualizer locally, it's easy peasy tomato squeezy:

```bash
npm install
npm run dev
```

Then, open the provided localhost URL in your browser. From the dashboard, simply click the **Fetch Data** button and provide your Pomofocus authorization token to load your stats!
