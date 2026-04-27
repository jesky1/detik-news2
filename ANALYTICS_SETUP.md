# Analytics Setup Guide

## ✅ Analytics System Successfully Implemented

Your news application now has a complete custom analytics tracking system. Here's what was added:

### 1. **Database Schema** 
- New `AnalyticsEvent` model added to `prisma/schema.prisma`
- Tracks: event type, article ID, search queries, scroll depth, user info

### 2. **API Endpoints**
- **POST** `/api/analytics/track` - Logs analytics events
- **GET** `/api/analytics/stats` - Retrieves analytics data with filters

### 3. **Frontend Components**
- `hooks/use-analytics.ts` - React hook for easy tracking
- `components/AnalyticsTracker.tsx` - Page view & scroll tracking
- Updated `ArticleCard.tsx` - Article click tracking
- Updated `SearchOverlay.tsx` - Search and result click tracking
- **NEW** `app/analytics/page.tsx` - Analytics dashboard

### 4. **Events Tracked**
- 📰 **article_view** - Page loads and views
- 🖱️ **article_click** - Article link clicks
- 🔍 **search** - Search queries and result counts
- 📜 **scroll** - Scroll depth (25%, 50%, 75%, 100%)
- ⚡ **interaction** - User interactions

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies
```bash
npm ci  # or npm install
```

### Step 2: Run Prisma Migration
```bash
npm run db:push
# or manually:
npx prisma db push --accept-data-loss
```

### Step 3: Verify Database
```bash
npx prisma studio
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: View Analytics Dashboard
Navigate to: `http://localhost:3000/analytics`

---

## 📊 How Analytics Work

### Automatic Tracking
- Page views are tracked when users load the home page
- Scroll depth is tracked at 25%, 50%, 75%, and 100%

### User Actions
- **Article clicks** → tracked automatically when clicking article cards
- **Search queries** → tracked when user searches
- **Search result clicks** → tracked with search query context

### Dashboard Features
- Real-time event counts by type
- Recent events list (last 10 events)
- Filters: time range (days), event type, article ID
- Auto-refreshes every 30 seconds

---

## 🔍 Query Analytics Data

### Get Last 7 Days Summary
```bash
curl "http://localhost:3000/api/analytics/stats?days=7"
```

### Get Specific Event Type
```bash
curl "http://localhost:3000/api/analytics/stats?eventType=article_click&days=30"
```

### Get Events for Specific Article
```bash
curl "http://localhost:3000/api/analytics/stats?articleId=YOUR_ARTICLE_ID"
```

---

## 📁 Files Created/Modified

### New Files Created:
- `/src/hooks/use-analytics.ts`
- `/src/app/api/analytics/track/route.ts`
- `/src/app/api/analytics/stats/route.ts`
- `/src/components/AnalyticsTracker.tsx`
- `/src/app/analytics/page.tsx`

### Modified Files:
- `prisma/schema.prisma` - Added AnalyticsEvent model
- `src/app/page.tsx` - Added AnalyticsTracker component
- `src/components/news/ArticleCard.tsx` - Added click tracking
- `src/components/news/SearchOverlay.tsx` - Added search & result tracking

---

## 🛠️ Customization

### Add Custom Event Tracking
In any component:
```tsx
import { useAnalytics } from '@/hooks/use-analytics';

export function MyComponent() {
  const { trackEvent } = useAnalytics();

  const handleCustomAction = () => {
    trackEvent({
      eventType: 'interaction',
      metadata: {
        action: 'custom_action_name',
        value: 'some_value'
      }
    });
  };

  return <button onClick={handleCustomAction}>Click Me</button>;
}
```

### Filter Analytics Query
```tsx
// Get article clicks from last 30 days, page 1
const res = await fetch(
  '/api/analytics/stats?eventType=article_click&days=30&page=1&limit=50'
);
```

---

## 📈 Next Steps (Optional)

1. **Export Data**: Add CSV export endpoint for reports
2. **Chart Visualization**: Use chart.js for visual analytics
3. **Email Reports**: Schedule daily/weekly analytics emails
4. **User Sessions**: Track user sessions instead of individual events
5. **Bot Detection**: Filter bot traffic from analytics

---

## ⚠️ Troubleshooting

### Prisma Migration Fails
```bash
# Delete old database and start fresh
rm prisma/*.db
npx prisma db push
```

### Analytics Not Recording
1. Check browser console for errors
2. Verify API endpoint: `curl http://localhost:3000/api/analytics/track`
3. Check database file exists: `prisma/` folder

### Dashboard Shows No Data
- Make sure database migration ran successfully
- Wait a few seconds after page load before checking
- Click an article or search to generate events

---

## 🎯 Events Reference

| Event Type | When It Fires | Data Captured |
|-----------|--------------|---------------|
| article_view | Page load | URL, page name |
| article_click | User clicks article card | Article ID, title, category, source |
| search | User performs search | Query term, results count |
| scroll | User scrolls to 25%, 50%, 75%, 100% | Scroll depth percentage |
| interaction | Custom interactions | Custom metadata |

---

**Analytics system is ready to use!** Just run the migration and start your dev server.
