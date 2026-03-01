# Kai Placement Copilot - UI/UX Requirements

## Design Philosophy
- **Modern & Clean**: Gradient backgrounds, card-based layouts, smooth animations
- **Student-Friendly**: Approachable, motivating, not corporate
- **Mobile-First**: Responsive design that works on all devices
- **Action-Oriented**: Clear CTAs, progress indicators, gamification elements

---

## Color Palette

### Primary Colors
- **Primary Purple**: `#667eea` (main brand color)
- **Secondary Purple**: `#764ba2` (gradient end)
- **Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

### Accent Colors
- **Success Green**: `#10b981` (completed tasks, positive actions)
- **Warning Yellow**: `#f59e0b` (pending items, alerts)
- **Error Red**: `#ef4444` (errors, critical items)
- **Info Blue**: `#3b82f6` (informational elements)

### Neutral Colors
- **White**: `#ffffff` (cards, backgrounds)
- **Light Gray**: `#f9fafb` (secondary backgrounds)
- **Medium Gray**: `#6b7280` (text secondary)
- **Dark Gray**: `#1f2937` (text primary)

### Special Colors
- **WhatsApp Green**: `#25D366` (WhatsApp share button)
- **Gold**: `#fbbf24` (rank 1 - 🥇)
- **Silver**: `#9ca3af` (rank 2 - 🥈)
- **Bronze**: `#d97706` (rank 3 - 🥉)

---

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Font Sizes
- **Hero/Display**: 48px - 72px (bold)
- **H1**: 32px - 40px (bold)
- **H2**: 24px - 28px (semibold)
- **H3**: 20px - 24px (semibold)
- **Body**: 16px (regular)
- **Small**: 14px (regular)
- **Tiny**: 12px (regular)

---

## Page Layouts

### 1. Authentication Pages (Login/Signup)
**Layout:**
- Centered card on gradient background
- Logo/emoji at top (🎯)
- Form fields with clear labels
- Primary CTA button
- Link to alternate action (signup/login)

**Key Elements:**
- Email input (type="email")
- Password input (type="password", show/hide toggle)
- Name input (signup only)
- College input (signup only)
- Submit button (full width, primary color)
- Error messages (red background, centered)
- Success messages (green background, centered)

**User Flow:**
1. User lands on login page
2. Can switch to signup
3. After signup → redirect to profile page
4. After login → redirect to dashboard

---

### 2. Dashboard
**Layout:**
- Top navbar with logo, user name, logout button
- Stats grid (4 cards): Readiness Score, Profile %, Mock Interviews, Action Plan status
- Action cards grid (5 cards): Profile, Action Plan, Mock Interview, Readiness Card, Leaderboard

**Stats Cards:**
- Large number/score in center
- Label above
- Icon/emoji
- Hover effect (slight lift)

**Action Cards:**
- Icon/emoji + title
- Short description
- Clickable (entire card)
- Hover effect (lift + shadow)

---

### 3. Profile Page
**Layout:**
- Form with clear sections
- Dropdown for year (1st, 2nd, 3rd, 4th)
- Text inputs for branch, target role
- Text input for skills (comma-separated, with hint)
- Number input for hours per week
- Save button at bottom

**Validation:**
- All fields required
- Skills must be comma-separated
- Hours must be 1-168

**Success State:**
- Show success message
- Redirect to dashboard after 1.5 seconds

---

### 4. Action Plan Page
**States:**

**A. No Plan Yet:**
- Hero section with explanation
- Large "Generate Action Plan" button
- Loading state: "Generating... (this may take 10-15 seconds)"

**B. Plan Exists:**
- Progress bar at top (0-100%)
- 7 day cards, each with:
  - Day number + title
  - Task list with checkboxes
  - Resource links (open in new tab)
- Resume tips section at bottom
- "Regenerate Plan" button

**Interactions:**
- Click checkbox → mark task done/undone
- Progress bar updates in real-time
- Smooth animations on task completion

---

### 5. Mock Interview Page
**Layout:**
- "New Mock Interview" button at top
- Current interview section (if exists):
  - Role name
  - Progress bar
  - Questions list with:
    - Question number + text
    - Textarea for answer
    - "Save Answer" button
- Previous interviews list (collapsible)

**States:**
- Loading: "Generating questions... (10-15 seconds)"
- Empty state: "No interviews yet"
- Active interview: Show all questions
- Completed interview: Show score + all Q&A

---

### 6. Readiness Card Page
**States:**

**A. No Card:**
- Explanation of readiness card
- "Generate Card" button

**B. Card Exists:**
- Beautiful card display:
  - Gradient background (purple)
  - Large score circle (center)
  - User name + college
  - Target role
  - Score breakdown (4 items)
  - View/click stats
- Share buttons:
  - WhatsApp (green button with icon)
  - Generic share (copy link)
  - Update card button
- Share link input (read-only, click to select)

**Card Design:**
- Circular score display (200px diameter)
- White text on gradient
- Breakdown items in grid
- Glassmorphism effect (optional)

---

### 7. Leaderboard Page
**Layout:**
- Title + description
- College filter dropdown
- Table with columns:
  - Rank (with emoji for top 3)
  - Name
  - College
  - Target Role
  - Score (highlighted)
  - Days Active
- Pagination (if needed)

**Styling:**
- Sticky header
- Alternating row colors
- Highlight top 3 rows
- Responsive (stack on mobile)

---

### 8. Public Card Page
**Layout:**
- Centered readiness card (same design as user's card)
- CTA section below:
  - Headline: "Want to improve your placement readiness?"
  - Description
  - Large "Try Kai Placement Copilot" button
  - Tracks click when button pressed

**Purpose:**
- Viral growth
- No auth required
- Tracks views automatically on load

---

## Component Patterns

### Buttons
```css
/* Primary Button */
background: #667eea;
color: white;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
transition: all 0.3s;
hover: transform: translateY(-2px), background: #5568d3;

/* Secondary Button */
background: #f0f0f0;
color: #333;
/* same other styles */

/* WhatsApp Button */
background: #25D366;
color: white;
/* same other styles */
```

### Cards
```css
background: white;
padding: 30px;
border-radius: 16px;
box-shadow: 0 4px 20px rgba(0,0,0,0.1);
transition: all 0.3s;
hover: transform: translateY(-5px), box-shadow: 0 8px 30px rgba(0,0,0,0.15);
```

### Progress Bar
```css
background: #f0f0f0;
height: 40px;
border-radius: 20px;
overflow: hidden;

/* Fill */
background: linear-gradient(90deg, #667eea, #764ba2);
height: 100%;
transition: width 0.3s;
```

### Input Fields
```css
padding: 12px;
border: 2px solid #e0e0e0;
border-radius: 8px;
font-size: 16px;
transition: border-color 0.3s;
focus: border-color: #667eea;
```

---

## Animations

### Page Transitions
- Fade in on mount
- Slide up for modals

### Button Interactions
- Hover: lift (-2px) + shadow increase
- Click: scale(0.98)
- Loading: spinner or pulse

### Task Completion
- Checkbox: scale + checkmark animation
- Strikethrough text
- Fade opacity to 0.6

### Card Generation
- Loading spinner
- Success: confetti or celebration animation (optional)

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  - Stack all grids to single column
  - Reduce padding
  - Smaller font sizes
  - Full-width buttons
}

/* Tablet */
@media (max-width: 1024px) {
  - 2-column grids
  - Adjust navbar to stack
}

/* Desktop */
@media (min-width: 1025px) {
  - Full multi-column layouts
  - Larger cards
  - More whitespace
}
```

---

## Icons & Emojis

Use emojis for quick visual cues:
- 🎯 - Logo, readiness, goals
- 📝 - Profile, forms
- 📅 - Action plan, calendar
- 💼 - Mock interview, professional
- 🏆 - Leaderboard, achievement
- 📱 - Share, mobile
- ✅ - Success, completed
- ❌ - Error, failed
- ⏳ - Loading, waiting
- 🔗 - Links, sharing
- 👁️ - Views
- 🥇🥈🥉 - Ranks 1, 2, 3

---

## Loading States

### Skeleton Screens
Use for:
- Dashboard stats loading
- Leaderboard loading
- Profile loading

### Spinners
Use for:
- Button actions (inline)
- Page-level loading (centered)

### Progress Indicators
Use for:
- AI generation (with time estimate)
- File uploads (if added)

---

## Error Handling

### Error Messages
- Red background (#fee)
- Red text (#c33)
- Centered in form
- Clear, actionable message
- Auto-dismiss after 5 seconds (optional)

### Success Messages
- Green background (#efe)
- Green text (#3c3)
- Same styling as errors
- Auto-dismiss after 3 seconds

### Empty States
- Icon/emoji
- Friendly message
- Clear CTA to resolve

---

## Accessibility

### Requirements
- All buttons have clear labels
- Form inputs have labels
- Color contrast ratio > 4.5:1
- Keyboard navigation works
- Focus states visible
- Alt text for images (if any)
- ARIA labels where needed

---

## Performance

### Optimization
- Lazy load images
- Code splitting by route
- Minimize bundle size
- Cache API responses (where appropriate)
- Debounce search/filter inputs

---

## Special Features

### Readiness Card Sharing
- Generate unique share link
- WhatsApp share with pre-filled text:
  ```
  Check out my Placement Readiness Score: 85/100! 🎯
  Generate yours at Kai Placement Copilot
  [link]
  ```
- Track views and clicks
- Show analytics to user

### Leaderboard Competition
- Real-time ranking
- Filter by college
- Show user's rank prominently
- Highlight top 3 with special styling

### Gamification
- Progress bars everywhere
- Score breakdowns
- Achievement feel
- Competitive elements

---

## User Flows

### First-Time User
1. Land on login page
2. Click "Sign up"
3. Fill form → Submit
4. Redirect to profile page
5. Complete profile → Submit
6. Redirect to dashboard
7. See empty states with CTAs
8. Click "Generate Action Plan"
9. Wait 10-15 seconds
10. See plan, start checking off tasks
11. Generate mock interview
12. Answer questions
13. Generate readiness card
14. Share on WhatsApp
15. Check leaderboard

### Returning User
1. Login
2. See dashboard with stats
3. Continue action plan
4. Check leaderboard rank
5. Update readiness card
6. Share progress

---

## Technical Considerations

### State Management
- Use React Context for auth
- Local state for forms
- API calls with axios/fetch
- Loading states for async operations

### Routing
- React Router
- Protected routes (require auth)
- Public routes (leaderboard, public card)
- Redirect after auth

### Data Fetching
- Fetch on component mount
- Show loading states
- Handle errors gracefully
- Refresh data after mutations

### Form Handling
- Controlled components
- Validation before submit
- Clear error messages
- Disable submit while loading

---

## Priority Features

### Must Have (MVP)
1. ✅ Authentication (login/signup)
2. ✅ Profile management
3. ✅ Action plan generation
4. ✅ Mock interview generation
5. ✅ Readiness card
6. ✅ Leaderboard
7. ✅ Share functionality

### Nice to Have (Future)
- Email verification
- Password reset
- Profile pictures
- Dark mode
- Notifications
- Analytics dashboard
- Export action plan as PDF
- Calendar integration
- Reminder system

---

## Testing Checklist

- [ ] All forms validate correctly
- [ ] Auth flow works (signup → login → logout)
- [ ] Protected routes redirect to login
- [ ] Public routes accessible without auth
- [ ] AI generation shows loading state
- [ ] Task completion updates progress
- [ ] Share links work
- [ ] Leaderboard filters work
- [ ] Mobile responsive
- [ ] Error handling works
- [ ] Success messages show
- [ ] All buttons clickable
- [ ] All links work

---

## Design Inspiration

Look at:
- Duolingo (gamification, progress)
- Notion (clean cards, modern UI)
- Linear (smooth animations, gradients)
- Stripe (clear CTAs, professional)
- Superhuman (keyboard shortcuts, speed)

---

## Final Notes

- Keep it simple and clean
- Focus on user journey
- Make CTAs obvious
- Show progress everywhere
- Celebrate achievements
- Make sharing easy
- Competitive but friendly
- Fast and responsive
- Beautiful but functional
