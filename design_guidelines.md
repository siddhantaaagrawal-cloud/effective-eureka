# Design Guidelines: Wellness Focus Tracker

## Design Approach

**Reference-Based Approach: Opal iOS App**
This wellness app draws inspiration from Opal's iOS interface while extending functionality to include fitness tracking. The design follows Apple's Human Interface Guidelines with Opal's signature aesthetic of frosted glass, gradient glows, and clean data visualization.

**Design Principles:**
- iOS-native feel with smooth animations and gestures
- Data visualization that's beautiful yet functional
- Social motivation through friendly competition
- Holistic wellness narrative connecting digital wellbeing with physical health

---

## Core Design Elements

### Typography
- **Primary Font:** SF Pro Display (iOS system font) or Inter as web alternative
- **Heading Scale:** 
  - Hero stats: 48px Bold (focus score, wellness score)
  - Section headers: 24px Semibold
  - Card titles: 18px Semibold
  - Body text: 15px Regular
  - Caption/metadata: 13px Regular
- **Number Display:** Tabular figures for all statistics and timers

### Layout System
**Spacing:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Card padding: p-6
- Section spacing: mb-8 between major sections
- Component gaps: gap-4 for grids, gap-2 for tight groups
- Container max-width: max-w-md for mobile-optimized experience

---

## Component Library

### Navigation
**Bottom Tab Bar (iOS-style)**
- 5 tabs: Home, Focus, Friends, Health, Profile
- Icon-only with labels below
- Active state with accent blur effect
- Height: h-20 with safe area padding

### Cards & Containers
**Frosted Glass Cards:**
- Backdrop blur effect (backdrop-blur-xl)
- Semi-transparent background
- Subtle border (border border-white/20)
- Rounded corners: rounded-2xl
- Drop shadow for depth

**Gradient Glow Backgrounds:**
- Position absolute, behind content
- Large blur radius for soft glow effect
- Use strategically: blue for focus elements, green for wellness, orange for achievements

### Progress Indicators

**Ring Progress (Focus & Wellness Scores):**
- Large circular progress rings (200px diameter on mobile)
- Stroke width: 12px
- Score displayed in center with large typography
- Animated on load with subtle pulse
- Color transitions based on score ranges

**Linear Progress Bars:**
- Height: h-2
- Rounded ends: rounded-full
- Smooth animated transitions
- Used for streaks, daily goals

### Data Visualization

**Charts:**
- **Hourly Breakdown:** Vertical bar chart showing screen time by hour (24 bars)
- **Weekly Trends:** Line chart with gradient fill below
- **App Categories:** Horizontal stacked bars with category labels
- All charts use minimal grid lines, rounded bar corners, subtle animations

**Stats Cards:**
- Grid layout: 2 columns on mobile
- Each card shows: Icon, large number, descriptor text
- Metrics: Time Saved Today, Current Streak, Leaderboard Rank, Steps Today

### Focus Mode Timer

**Timer Display:**
- Large centered countdown (96px font size)
- Format: MM:SS or HH:MM:SS
- Breathing animation during active session
- Start/Pause/Complete buttons below
- Session type selector above (Deep Focus, Light Focus, Break)

### Friends & Leaderboard

**Friend Cards:**
- Horizontal scrolling list
- Profile picture (rounded-full, 48px)
- Name + focus score
- Tap to view full profile

**Leaderboard:**
- Ranked list with position numbers (1st, 2nd, 3rd with medal icons)
- Each entry: Rank, Avatar, Name, Score, Trend indicator (↑↓)
- Current user highlighted with accent background
- Top 3 have larger cards with special styling

### Health Integration Display

**Wellness Score Breakdown:**
- Large ring showing combined score
- Four sub-scores in 2x2 grid:
  - Screen Time Balance (from app tracking)
  - Activity Level (from Google Fit/Apple Health)
  - Sleep Quality (from health APIs)
  - Movement (steps/distance)
- Each with mini ring indicator and percentage

---

## Screen Layouts

### Home Dashboard
**Hero Section:**
- Large focus score ring at top center
- "Today" date with day streak indicator
- Gradient glow background (blue)

**Content Sections (vertical scroll):**
1. Quick Stats Grid (2x2)
2. Hourly Screen Time Chart
3. Top Apps List (5 apps with usage time)
4. Friends Preview (horizontal scroll of 3-5 friends)
5. Achievements/Milestones Card

### Focus Mode Screen
- Fullscreen timer interface
- Mountain/nature background image (blurred)
- Timer controls on frosted glass card overlay
- Session type tabs at top
- "End Session" button at bottom (subtle, non-intrusive)

### Friends/Leaderboard Screen
**Two Tabs:**
- "Friends" tab: Add friends button + scrolling friend cards
- "Leaderboard" tab: Ranked list of all connections

### Health Screen
- Large wellness score ring
- Four sub-score breakdown
- "Sync with Health Apps" prominent button if not connected
- Historical trend chart (7-day or 30-day view)
- Tips section based on scores

---

## Images

**Hero Image:** None - use gradient glows instead for abstract, clean aesthetic

**Background Images:**
- Focus Mode: Soft blurred nature/mountain scene (similar to Opal's mountain imagery)
- Achievement unlocks: Abstract gradient backgrounds

**Icons:** Use Heroicons (outline style for inactive states, solid for active)

**Profile Pictures:** Circular avatars for user and friends

**Illustrations:** Optional 3D minimal illustrations for empty states and onboarding

---

## Interactions & Animations

**Micro-interactions:**
- Button press: Scale down slightly (scale-95 active state)
- Score updates: Count-up animation
- Streak milestones: Confetti/celebration animation
- Chart bars: Stagger load animation
- Tab switching: Subtle slide transition

**Gestures:**
- Pull to refresh on dashboard
- Swipe between tabs in charts
- Long press on friend card for quick actions

---

## Responsive Behavior

**Mobile-First (320px - 768px):**
- Single column layouts
- Bottom navigation
- Full-width cards with horizontal padding

**Tablet/Desktop (768px+):**
- Side navigation instead of bottom tabs
- Two-column layouts where appropriate
- Maximum content width constrained to maintain focus
- Larger chart visualizations