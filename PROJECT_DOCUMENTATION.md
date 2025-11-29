# 🐾 MindPal - Gamified Mental Wellness Pet Application

## Project Overview

**MindPal** is an innovative mental wellness application that combines gamification with pet companionship to support emotional tracking and therapeutic intervention. Users select their favorite animal companion (Cat, Dog, Penguin, or Rabbit) and engage in journaling, quests, games, and professional therapy sessions to improve their mental health while earning rewards through an engaging gamified system.

---

## 🎯 Key Features

### 1. **Pet Selection & Customization**
- Choose from 4 animals: 🐱 Cat, 🐶 Dog, 🐧 Penguin, 🐰 Rabbit
- Customize pet with hats, accessories, outfits, and backgrounds
- Pet reflects user's mood through animations and expressions
- Pet mood updates based on user's emotional entries

### 2. **Tracking Section** (Journaling & Quests)
- **Journal Entry**: 
  - Type or voice input about daily feelings
  - AI sentiment analysis with confidence scores
  - Pet mood reflects detected emotional state
  - Automatic mood detection from text
- **Daily/Weekly/Monthly Quests**:
  - Mindful Moments (5-min reflection)
  - Gratitude Practice (write 3 things grateful for)
  - Other wellness tasks
  - Earn coins upon completion

### 3. **Pet Care System**
- **Customization**: Purchase items (hats, accessories, outfits, backgrounds) with coins
- **Play Section**: 
  - Stress-busting games: Candy Crush, Trainer Duel, Race, Dodge obstacles
  - Earn coins from gameplay
  - Premium feature (requires subscription)
- **Feed Section**: 
  - Buy and feed pet food items
  - Monitor pet health
  - Premium feature

### 4. **Explore Section**
- **Leaderboard**: Compete by XP/streaks with other users
- **Therapy Integration**: Connect with professional therapists
  - Browse therapist profiles with specialization/description
  - Send chat requests to therapists
  - Real-time chat with accepted requests
- **Premium Subscription**: Unlock advanced features
  - Play, Feed, Therapy features
  - Advanced AI insights
  - Guided meditation & breathing exercises
- **Mood Analytics**: 
  - Complete journal history
  - Mood visualizations
  - Wellness insights & tips
  - Trend analysis (improving/declining/stable)

### 5. **Authentication**
- User login (email/password)
- Guest mode option
- Therapist login/signup with separate dashboard
- Profile management
- Data persistence with Supabase

---

## 📁 Project Structure

```
MindPal-therapist_assistance/
├── src/
│   ├── components/          # React components
│   │   ├── AnalyticsScreen.tsx       # Mood history & visualization
│   │   ├── AuthScreen.tsx            # User authentication
│   │   ├── CustomizationScreen.tsx   # Pet customization shop
│   │   ├── FeedScreen.tsx            # Pet feeding system
│   │   ├── GuestModeReminder.tsx     # Guest mode banner
│   │   ├── HomeDashboard.tsx         # Main dashboard layout
│   │   ├── JournalScreen.tsx         # Journal entry interface
│   │   ├── LoginPage.tsx             # User login
│   │   ├── PetAnimation.tsx          # Pet animation component
│   │   ├── PetCompanion.tsx          # Pet display & interaction
│   │   ├── PetSelection.tsx          # Pet choice screen
│   │   ├── PlayScreen.tsx            # Game selection & play
│   │   ├── QuestScreen.tsx           # Individual quest details
│   │   ├── QuestsAndCoins.tsx        # Quest list & rewards
│   │   ├── TherapistChat.tsx         # Direct messaging with therapist
│   │   ├── TherapistDashboard.tsx    # Therapist main view
│   │   ├── TherapistList.tsx         # Browse therapists
│   │   ├── TherapistLoginPage.tsx    # Therapist authentication
│   │   ├── TherapistScreen.tsx       # Therapist selection screen
│   │   ├── TherapistSignup.tsx       # Therapist registration
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx # Image utility component
│   │   ├── games/                    # Game implementations
│   │   │   ├── BreathingBuddyGame.tsx
│   │   │   ├── CandyCrushGame.tsx
│   │   │   ├── DogWalkGame.tsx
│   │   │   ├── PetTrainerDuel.tsx
│   │   │   ├── RiveDog.tsx
│   │   │   ├── StarGazingGame.tsx
│   │   │   ├── WordscapeGame.tsx
│   │   │   └── words.json            # Game word list
│   │   ├── ui/                       # Shadcn UI components
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── ... (other UI components)
│   │   └── mindpal_leaderboard.tsx   # Leaderboard component
│   ├── assets/
│   │   └── animations/              # Lottie animations for pets
│   │       ├── cat/
│   │       │   ├── angry.json
│   │       │   ├── calm.json
│   │       │   ├── happy.json
│   │       │   ├── dancing.json
│   │       │   ├── hungry.json
│   │       │   └── sad.json
│   │       ├── dog/                 # Similar animation structure
│   │       ├── penguin/
│   │       └── rabbit/
│   ├── styles/
│   │   └── globals.css              # Global Tailwind CSS
│   ├── utils/
│   │   ├── api.ts                   # API utility functions
│   │   ├── moodAnalytics.ts         # Mood analysis & rewards logic
│   │   ├── sentimentAnalysis.ts     # Sentiment detection algorithm
│   │   ├── therapistApi.ts          # Therapist API calls
│   │   └── supabase/
│   │       └── client.ts            # Supabase initialization
│   ├── guidelines/
│   │   └── Guidelines.md            # Development guidelines
│   ├── App.tsx                      # Main app component with routing
│   ├── types.tsx                    # TypeScript interfaces
│   ├── main.tsx                     # React entry point
│   ├── index.css                    # Base CSS
│   └── Attributions.md              # Lottie & asset credits
├── build/                           # Production build output
├── public/                          # Static assets
├── .env.local                       # Environment variables (Supabase)
├── package.json                     # Dependencies
├── vite.config.ts                   # Vite build config
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js               # Tailwind CSS config
├── postcss.config.js                # PostCSS config
├── deno.json                        # Deno config (optional)
└── README.md                        # Project info
```

---

## 🔑 Important Files Explained

### **Core Application**

#### `App.tsx` - Main Application Component
- **Purpose**: Application entry point with routing logic
- **Key Responsibilities**:
  - Router setup (React Router with BrowserRouter)
  - User authentication state management
  - Screen/page navigation logic
  - Supabase session handling & user data fetching
  - Journal entry submission to database
  - Data persistence (coins, pet, moods, journal entries)
  - Premium subscription handling
  - Mood reward system
- **Routes**:
  - `/` → HomeDashboard (main user interface)
  - `/therapist/signup` → TherapistSignup
  - `/therapist/login` → TherapistLoginPage
  - `/therapist/dashboard` → TherapistDashboard
  - `/therapists` → TherapistScreen (browse therapists)
- **Key States**: 
  - User authentication state
  - Selected pet
  - Coins balance
  - Journal entries
  - Pet mood
  - Premium status
  - Various UI modal states

---

#### `types.tsx` - TypeScript Type Definitions
```typescript
- Pet: Name, emoji, color
- User: id, email, username, type (user/therapist)
- Profile: Database schema with coins, pet info
- TherapistProfile: Name, specialization, rating, languages
- TherapistRequest: Chat request management
- ChatMessage: Messaging data structure
- JournalEntry: Mood, content, date, confidence score
```

---

### **Main Dashboard & Screens**

#### `HomeDashboard.tsx`
- **Purpose**: Main user dashboard after pet selection
- **Components**:
  - Pet companion display with mood-based animations
  - Header with username, streak count, coins, premium status
  - Three expandable sections: **Tracking**, **Pet**, **Explore**
  - Recent journal entries display
  - Mood analytics button
  - Premium/Guest mode reminders
- **Expandable Groups**:
  - **Tracking**: Journal Write button, Daily Quests button
  - **Pet**: Customize, Play (PRO), Feed (PRO) buttons
  - **Explore**: Leaderboard, Therapy, Premium subscription button, Analytics

#### `JournalScreen.tsx`
- **Purpose**: Text input for emotional journaling with AI sentiment analysis
- **Features**:
  - Textarea for journal entries
  - Real-time mood detection via `sentimentAnalysis.ts`
  - Display detected mood emoji and confidence score
  - Voice input option (mentioned but needs implementation)
  - Submit button with coin reward (25 coins per entry)
  - Pet mood update based on entry sentiment

#### `PetCompanion.tsx` & `PetAnimation.tsx`
- **Purpose**: Display pet with mood-based animations
- **Integration**: 
  - Uses Lottie animations from `/assets/animations/[pet]/[mood].json`
  - Shows different expressions: happy, sad, calm, angry, hungry
  - Responsive pet size & positioning

#### `QuestsAndCoins.tsx` / `QuestScreen.tsx`
- **Purpose**: Daily/Weekly/Monthly tasks management
- **Features**:
  - Quest listings with descriptions
  - Completion tracking
  - Coin rewards for completed quests
  - Track streaks

#### `CustomizationScreen.tsx`
- **Purpose**: Pet customization shop
- **Features**:
  - Buy hats, accessories, outfits, backgrounds
  - Coin-based purchasing system
  - Visual preview of customizations
  - Inventory management

#### `PlayScreen.tsx`
- **Purpose**: Mini-games portal (Premium feature)
- **Games Available**:
  - Candy Crush
  - Pet Trainer Duel
  - Race games
  - Breathing Buddy
  - Star Gazing
  - Wordscape
- **Rewards**: Coins earned from gameplay

#### `FeedScreen.tsx`
- **Purpose**: Pet feeding system (Premium feature)
- **Features**:
  - Purchase food items with coins
  - Feed pet to maintain health
  - Pet happiness/health tracking

#### `AnalyticsScreen.tsx`
- **Purpose**: Mood history & wellness insights
- **Features**:
  - Journal entry history with filters
  - Mood distribution charts
  - Trend analysis (improving/declining/stable)
  - AI-generated wellness suggestions
  - Visualization of emotional patterns
  - Export/download capability (optional)

#### `TherapistScreen.tsx`
- **Purpose**: Browse and connect with professional therapists
- **Features**:
  - Therapist profiles display
  - Filter by specialization/language
  - Send connection requests
  - View therapist ratings & experience
  - Chat interface for accepted requests

---

### **Authentication & User Management**

#### `AuthScreen.tsx`
- **Purpose**: User login/signup interface
- **Features**:
  - Email/password authentication
  - Guest mode option
  - Social login (optional)
  - Form validation
  - Error handling

#### `TherapistSignup.tsx` & `TherapistLoginPage.tsx`
- **Purpose**: Separate authentication for therapists
- **Features**:
  - Professional registration form
  - Credential verification
  - Profile completion
  - License/certification verification

#### `TherapistDashboard.tsx`
- **Purpose**: Therapist main interface
- **Features**:
  - Connection requests management
  - Active chat sessions
  - Patient list
  - Schedule/availability management

---

### **Utility Functions**

#### `moodAnalytics.ts` - Core Analytics Engine
**Key Functions**:
```typescript
analyzeMoods(entries): MoodAnalytics
  - Total entries count
  - Positive/negative/neutral breakdown
  - Mood distribution chart data
  - Trend analysis (improving/declining/stable)
  - Generated wellness suggestions based on patterns
  - Reward system for consistency & positive moods

categorizeMood(mood): 'positive' | 'negative' | 'neutral'
  - Positive: happy, excited, energetic, content
  - Negative: sad, anxious, angry, irritated, frustrated
  - Neutral: calm

generateRewards(entries, percentage, moodCounts): MoodReward[]
  - Positive Streak Reward (3+ consecutive positive entries)
  - Emotional Wellness Master (70%+ positive)
  - Journey Milestone (30+ entries with 60%+ positive)
  - Daily Journaling Champion (journaled every day of week)

generateSuggestions(moodCounts, positivePerc, negativePerc): string[]
  - AI-generated wellness tips based on mood patterns
  - Specific recommendations for prevalent mood states
  - Encouragement for positive trends
```

#### `sentimentAnalysis.ts` - Mood Detection Algorithm
- Analyzes journal text for emotional sentiment
- Returns detected mood with confidence score
- Mood types: happy, sad, calm, anxious, excited, angry, content, energetic, irritated, frustrated
- Uses keyword matching, text patterns, and emotional language detection
- Generates AI explanations for detected moods

#### `therapistApi.ts`
- API calls for therapist operations:
  - Fetch therapist list
  - Create connection requests
  - Send/receive messages
  - Update therapist profile
  - Get chat history

#### `supabase/client.ts`
- Supabase client initialization
- Database connection management
- Real-time subscription setup (for chat)

---

## 🗄️ Database Schema (Supabase)

### Tables:

**users**
```
- id (primary key, auth.uid)
- email
- username
- is_anonymous
- pet_id (foreign key)
- coins
- is_premium
- selected_pet
- pet_mood
- streak_count
- created_at
```

**journal_entries**
```
- id (primary key)
- user_id (foreign key)
- entry_text
- mood
- sentiment_score (confidence)
- created_at
```

**therapists**
```
- id (primary key, auth.uid)
- name
- specialization
- experience
- description
- avatar
- rating
- languages (array)
- response_time
- price (optional)
```

**therapist_requests**
```
- id (primary key)
- user_id (foreign key)
- therapist_id (foreign key)
- status (pending/accepted/rejected)
- message
- created_at
```

**chat_messages**
```
- id (primary key)
- chat_id
- sender_id (foreign key)
- receiver_id (foreign key)
- message
- created_at
```

**quests**
```
- id (primary key)
- user_id (foreign key)
- title
- description
- frequency (daily/weekly/monthly)
- reward_coins
- completed
- completed_at
```

**customizations**
```
- id (primary key)
- user_id (foreign key)
- pet_id
- item_type (hat/accessory/outfit/background)
- item_name
- cost_coins
- equipped
```

---

## 🎨 UI Component Library

The project uses **Shadcn UI** components built on Radix UI:
- **Layout**: Card, Sidebar, Separator
- **Forms**: Button, Input, Textarea, Select, Checkbox, Radio Group
- **Feedback**: Toast (Sonner), Dialog, Alert Dialog, Popover
- **Navigation**: Tabs, Breadcrumb, Pagination, Navigation Menu
- **Data Display**: Badge, Progress, Chart (Recharts)
- **Interactive**: Accordion, Collapsible, Dropdown Menu, Context Menu

**Styling**: Tailwind CSS v4 with dark mode support via next-themes

---

## 🎮 Game Components

Located in `/components/games/`:

1. **CandyCrushGame.tsx** - Match-3 puzzle game
2. **PetTrainerDuel.tsx** - Pet battle/trainer competition
3. **DogWalkGame.tsx** - Interactive dog walking game
4. **StarGazingGame.tsx** - Relaxing meditation game
5. **WordscapeGame.tsx** - Word puzzle game with words.json
6. **BreathingBuddyGame.tsx** - Guided breathing exercise
7. **RiveDog.tsx** - Alternative dog interaction game

---

## 📊 Key Features Deep Dive

### **Mood Detection Flow**
```
User writes journal entry
  ↓
sentimentAnalysis.ts analyzes text
  ↓
Detected mood + confidence score
  ↓
Pet mood updated based on mapping:
  - happy/excited/energetic → pet happy
  - calm/content → pet calm
  - sad/anxious → pet sad
  - angry/irritated/frustrated → pet angry
  ↓
Journal entry saved to Supabase
  ↓
Coins awarded (+25)
  ↓
moodAnalytics.ts checks for rewards
  ↓
Display reward modal if earned
```

### **Premium Feature Gating**
- Play games require Premium
- Feed system requires Premium
- Advanced therapy features require Premium
- Premium button shows "Get Premium" for free users
- Mock payment dialog for demo (real app integrates Stripe/PayPal)
- Free users see "PRO" badge on locked features

### **Streak & Reward System**
- Daily journaling streak counter
- Streak displayed in header
- Streaks reset after missing a day
- Rewards based on:
  - Consecutive positive entries
  - Consistent journaling pattern
  - Emotional wellness achievements
  - Milestone journaling counts

---

## 🔧 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend Framework** | React 18.3 + TypeScript |
| **Build Tool** | Vite 6.3 |
| **Routing** | React Router 7.9 |
| **UI Components** | Shadcn UI (Radix UI) |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion + Lottie |
| **Backend/Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT) |
| **Forms** | React Hook Form |
| **Data Visualization** | Recharts |
| **Notifications** | Sonner Toast |
| **Icons** | Lucide React |

---

## 🚀 Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Environment Variables** (.env.local):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📋 Feature Implementation Status

### ✅ Implemented
- Pet selection & display
- Journal entry with sentiment analysis
- Quest system
- Customization shop
- Games framework
- Leaderboard
- Therapist browsing
- Authentication (Supabase)
- Analytics & mood tracking
- Premium modal
- Streak counter
- Mood rewards
- Recent entries display

### 🔄 In Progress / Needs Enhancement
- Real-time chat with therapists
- Voice journal input
- Payment integration for Premium
- Push notifications
- Export mood data
- Advanced reporting
- Therapist availability calendar
- Prescription/treatment plans

### 📝 Future Enhancements
- Mobile app (React Native)
- Offline functionality
- Social features (friend adding, shared streaks)
- Guided meditation library
- Integration with wearables (fitness trackers)
- Video therapy sessions
- Mood triggers analysis
- Family/caregiver dashboard

---

## 🛡️ Security Considerations

1. **Supabase RLS (Row Level Security)**: Ensures users only access their own data
2. **Auth Tokens**: JWT-based authentication
3. **Therapist Verification**: License/credential verification needed
4. **Data Privacy**: Journal entries are encrypted at rest
5. **Chat Encryption**: End-to-end encryption for therapist messages (recommended)

---

## 📞 API Integration Points

### Therapist API Endpoints (therapistApi.ts)
- `GET /therapists` - List all therapists
- `GET /therapists/:id` - Get therapist profile
- `POST /therapist-requests` - Send connection request
- `POST /chat-messages` - Send message
- `GET /chat/:therapistId` - Get chat history

### Analytics Endpoints (utils/api.ts)
- Calculate mood trends
- Generate suggestions
- Award rewards
- Track streaks

---

## 🎯 Project Vision

MindPal aims to democratize mental wellness by:
1. **Gamifying** emotional tracking to increase engagement
2. **Leveraging AI** for sentiment analysis and personalized insights
3. **Connecting users** with professional therapists seamlessly
4. **Creating a supportive community** through leaderboards and shared progress
5. **Making therapy accessible** through affordable, flexible consultations

---

## 📝 Notes

- Project uses **Figma as source** for UI designs (referenced in files)
- Animations are **Lottie JSON** format for optimized performance
- **Responsive design** for mobile, tablet, and desktop
- **Dark mode support** available via next-themes
- Build size optimized with Vite
- Dev server uses Hot Module Replacement (HMR)

---

This comprehensive documentation should give you a complete understanding of the MindPal application architecture, components, and workflow! 🚀
