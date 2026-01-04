# EssayPulse — Product Requirements Document

**Version:** 1.0  
**Last Updated:** January 4, 2026  
**Status:** Production

---

## 1. Executive Summary

### 1.1 Product Vision
EssayPulse is a narrative writing practice application designed to help students improve their storytelling skills through AI-powered feedback. The app provides a distraction-free writing environment with real-time evaluation across six key narrative writing traits.

### 1.2 Problem Statement
Students learning narrative writing often lack immediate, constructive feedback on their work. Traditional feedback loops are slow (waiting for teacher review) and inconsistent. Students need a tool that:
- Provides instant, actionable feedback
- Evaluates multiple dimensions of narrative writing
- Encourages iterative improvement
- Offers engaging writing prompts

### 1.3 Solution
EssayPulse delivers an AI-powered writing coach that evaluates student essays on six narrative traits, providing specific feedback on what's working and what needs improvement. The typewriter-inspired aesthetic creates a focused, authentic writing experience.

---

## 2. Target Users

### 2.1 Primary User Persona
**Student Writers (Ages 12-22)**
- Middle school, high school, and college students
- Learning narrative/personal essay writing
- Preparing for standardized tests with essay components
- Working on college application essays
- Seeking to improve creative writing skills

### 2.2 Secondary User Personas
**Writing Tutors & Teachers**
- Can recommend the tool for independent practice
- Use as supplementary homework assignment platform

**Independent Writers**
- Adults practicing personal narrative writing
- Hobbyists improving storytelling skills

---

## 3. Features & Functionality

### 3.1 Prompt Selector (Home Page)

**Description:** The landing page where users choose from 25 curated narrative writing prompts organized into 5 thematic categories.

**Categories:**
| Category | Description | Prompt Count |
|----------|-------------|--------------|
| Life Moments | Pivotal experiences that shaped who you are | 5 |
| Relationships | Stories about the people who matter most | 5 |
| Firsts & Milestones | New beginnings and significant achievements | 5 |
| Challenges | Obstacles overcome and lessons learned | 5 |
| Memories | Moments from the past worth preserving | 5 |

**Functionality:**
- Expandable/collapsible category sections
- First category expanded by default
- Click a prompt card to begin writing
- Each prompt creates a new essay document

**User Flow:**
```
Home → View Categories → Select Prompt → Navigate to Writing Page
```

---

### 3.2 Writing Page

**Description:** The main writing interface featuring a rich text editor and feedback sidebar.

#### 3.2.1 Header Navigation
- Back button (← Back to prompts)
- App branding (EssayPulse)
- Real-time statistics:
  - Word count
  - Paragraph count
  - Save status: `[ SAVED ]`, `[ SAVING... ]`, `[ UNSAVED ]`

#### 3.2.2 Prompt Display
- Shows the selected writing prompt at top of editor area
- Labeled "Your Prompt" for clarity
- Persistent reference while writing

#### 3.2.3 Rich Text Editor
**Technology:** Tiptap (headless, extensible editor framework)

**Supported Formatting:**
- **Bold** (B key button)
- *Italic* (I key button)
- <u>Underline</u> (U key button)

**Disabled Features** (intentionally simplified):
- Headings
- Bullet/ordered lists
- Blockquotes
- Code blocks
- Horizontal rules

**Behavior:**
- Placeholder text: "Begin your story here. Let your imagination flow..."
- Auto-save with 1-second debounce
- Real-time word and paragraph counting
- Full-height editing area with scroll

#### 3.2.4 Rubric Sidebar
**Purpose:** Display AI feedback and scoring for the 6 narrative traits.

**States:**
1. **Pre-check:** Shows 6 trait cards with empty stars, "Check Progress" button disabled until 150+ words OR 3+ paragraphs
2. **Checking:** Shows loading animation ("Analyzing...")
3. **On-Topic Results:** Shows star ratings (1-5) for each trait, average score, clickable cards for details
4. **Off-Topic Warning:** Shows warning banner with explanation and remediation steps

---

### 3.3 AI Feedback System

**Technology:** OpenAI GPT-4 API

#### 3.3.1 Relevance Check
Before evaluating writing quality, the AI first determines if the essay addresses the given prompt.

**Relevance Scoring (1-5):**
| Score | Meaning |
|-------|---------|
| 5 | Directly and thoroughly addresses the prompt |
| 4 | Mostly addresses the prompt with minor tangents |
| 3 | Partially addresses the prompt but misses key aspects |
| 2 | Loosely related to the prompt but mostly off-topic |
| 1 | Does not address the prompt at all |

**On-Topic:** Score ≥ 3
**Off-Topic:** Score < 3 (triggers warning UI instead of trait scores)

#### 3.3.2 Six Narrative Writing Traits

| Trait | What It Evaluates |
|-------|-------------------|
| **Hook & Opening** | Does the opening grab attention? Is there an engaging hook that draws readers in? |
| **Story Structure** | Is there a clear beginning, middle, and end? Does the narrative flow logically? |
| **Descriptive Details** | Does the writing use vivid sensory details? Are scenes painted clearly for the reader? |
| **Transitions** | Are transitions smooth between paragraphs and ideas? Does the story flow naturally? |
| **Voice & Tone** | Is there a unique, authentic voice? Is the tone consistent and appropriate? |
| **Conclusion** | Does the ending provide closure? Is there reflection or insight? |

#### 3.3.3 Feedback Structure
For each trait, the AI provides:
- **Score:** 1-5 stars
- **Working:** 2-3 specific things done well
- **Work On:** 2-3 actionable improvement suggestions

#### 3.3.4 Trait Detail Modal
Clicking a trait card opens a modal with:
- Full trait name and star rating
- "What's Working" section (bulleted list)
- "To Improve" section (bulleted list)
- Close button

---

### 3.4 Data Persistence

**Technology:** Convex (real-time database + serverless functions)

#### 3.4.1 Essay Document Schema
```typescript
essays: {
  promptId: string,
  promptText: string,
  content: string,           // HTML from Tiptap
  wordCount: number,
  paragraphCount: number,
  feedback: {
    relevance: {
      score: number,         // 1-5
      isOnTopic: boolean,    // true if score >= 3
      explanation: string,
    },
    traits: {
      hookAndOpening: { score, working[], workOn[] },
      storyStructure: { score, working[], workOn[] },
      descriptiveDetails: { score, working[], workOn[] },
      transitions: { score, working[], workOn[] },
      voiceAndTone: { score, working[], workOn[] },
      conclusion: { score, working[], workOn[] },
    },
    checkedAt: number,       // timestamp
  },
  createdAt: number,
  updatedAt: number,
}
```

#### 3.4.2 Auto-Save Behavior
- Debounced save (1 second after typing stops)
- Visual status indicator in header
- Optimistic UI updates for word/paragraph counts

---

## 4. Technical Architecture

### 4.1 Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **Editor** | Tiptap 3 |
| **Routing** | React Router 7 |
| **Backend** | Convex (serverless) |
| **AI** | OpenAI GPT-4 |
| **Deployment** | (Configurable) |

### 4.2 Project Structure
```
/src
  /components      # Reusable UI components
    - CategorySection.tsx
    - Editor.tsx
    - PromptCard.tsx
    - RubricSidebar.tsx
    - StarRating.tsx
    - TraitCard.tsx
    - TraitDetailModal.tsx
  /pages           # Route-level components
    - PromptSelector.tsx
    - WritingPage.tsx
    - StyleGuide.tsx
  /lib             # Utilities and data
    - prompts.ts   # 25 prompts across 5 categories
  /styles          # Custom CSS
/convex            # Backend functions
  - schema.ts      # Database schema
  - essays.ts      # CRUD operations
  - feedback.ts    # OpenAI integration
/planning          # Documentation
```

### 4.3 API Endpoints (Convex Functions)

| Function | Type | Purpose |
|----------|------|---------|
| `essays.createEssay` | Mutation | Create new essay document |
| `essays.updateEssay` | Mutation | Save essay content |
| `essays.getEssay` | Query | Fetch single essay |
| `essays.listEssays` | Query | Fetch all essays |
| `feedback.generateFeedback` | Action | Call OpenAI, store results |

---

## 5. Design System

### 5.1 Design Aesthetic: "Typewriter"
A nostalgic design style evoking vintage typewriters, conveying authenticity, craftsmanship, and intellectual depth.

### 5.2 Typography
| Usage | Font | Details |
|-------|------|---------|
| Body/Editor | Courier Prime | Monospace, typewriter feel |
| Headings/Titles | Special Elite | Authentic worn look |

**Characteristics:**
- Letter spacing: 0.02em
- Line height: 2.0 (double-spaced)
- Emphasis via underlines (typewriter convention)
- Headings in ALL-CAPS

### 5.3 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | #FAF6E9 | Main background (aged paper) |
| `--color-bg-secondary` | #F0E9D8 | Cards/sections |
| `--color-text-primary` | #1A1814 | Main text (deep ink) |
| `--color-text-secondary` | #5C564C | Faded/secondary text |
| `--color-accent` | #8B0000 | Red (typewriter ribbon) |
| `--color-accent-light` | #B84444 | Hover states |
| `--color-success` | #4A6741 | Positive feedback |
| `--color-warning` | #996B3D | Warnings (sepia) |
| `--color-border` | #D4CCBA | Borders |

### 5.4 Interactive Elements
- **Buttons:** Rectangular "typewriter key" style with press animation
- **Cursor:** Block cursor (█) with blink animation
- **Cards:** Hard offset shadows like stacked paper
- **Corners:** Sharp or 2px radius (no rounded corners)

### 5.5 Anti-Patterns (Avoid)
- Soft/diffuse shadows
- Large border-radius
- Sans-serif fonts
- Gradient backgrounds
- Bright/saturated colors
- Modern pill-shaped buttons

---

## 6. User Flows

### 6.1 New Essay Flow
```
1. User lands on Prompt Selector (/)
2. User browses categories (first is expanded)
3. User clicks a prompt card
4. System creates new essay document
5. User is redirected to /write/:essayId
6. Editor loads with prompt displayed
7. User begins writing
```

### 6.2 Writing & Feedback Flow
```
1. User types in editor
2. Word/paragraph counts update in real-time
3. After 1 second pause, content auto-saves
4. Once 150+ words OR 3+ paragraphs:
   - "Check Progress" button enables
5. User clicks "Check Progress"
6. System shows "Analyzing..." state
7. OpenAI evaluates the essay
8. Results displayed in sidebar:
   - If ON-TOPIC: Show 6 trait scores
   - If OFF-TOPIC: Show warning + guidance
9. User clicks trait card to view details
10. User revises and re-checks as needed
```

### 6.3 Return Visit Flow
```
1. User navigates to saved essay URL
2. Essay content loads from database
3. Previous feedback (if any) is displayed
4. User can continue writing or re-check
```

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Page load: < 2 seconds
- Auto-save: < 500ms latency
- AI feedback: < 15 seconds (acceptable for GPT-4)
- Real-time updates via Convex subscriptions

### 7.2 Accessibility
- Keyboard-navigable interface
- Screen reader compatible
- High contrast text (meets WCAG AA)
- Focus indicators on interactive elements

### 7.3 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### 7.4 Security
- API key stored as environment variable (Convex dashboard)
- No user authentication (anonymous usage)
- Content stored per-device (no cross-device sync without auth)

---

## 8. Future Roadmap (Out of Scope for v1)

### 8.1 Potential Enhancements
- **User Authentication:** Google/email login for cross-device access
- **Essay History:** Dashboard showing all past essays
- **Progress Analytics:** Charts showing improvement over time
- **Custom Prompts:** Users can create their own prompts
- **Essay Export:** Download as PDF/Word
- **Sharing:** Share essay with teacher/peer for review
- **Multiple Essay Types:** Persuasive, expository, etc.
- **Inline Annotations:** AI highlights specific text passages
- **Timer Mode:** Timed writing practice (e.g., 30 minutes)
- **Streak Tracking:** Gamification for daily practice

### 8.2 Technical Improvements
- Offline support (PWA)
- Mobile-responsive layout
- Dark mode theme
- Keyboard shortcuts for formatting
- Undo/redo history visualization

---

## 9. Success Metrics

### 9.1 Engagement Metrics
- Essays created per user
- Average words per essay
- Feedback checks per essay
- Return visit rate

### 9.2 Learning Metrics
- Score improvement across re-checks
- Time to reach "on-topic" status
- Trait score distribution

### 9.3 Technical Metrics
- Auto-save success rate
- AI feedback error rate
- Average feedback response time

---

## 10. Appendix

### A. Writing Prompts (Full List)

**Life Moments**
1. Describe a moment when you realized something important about yourself.
2. Write about a time when you had to make a difficult decision.
3. Tell the story of a day that changed your perspective on life.
4. Describe a moment when you felt truly proud of yourself.
5. Write about an unexpected event that taught you an important lesson.

**Relationships**
1. Write about a person who influenced your life in a meaningful way.
2. Describe a time when a friendship was tested.
3. Tell the story of a meaningful conversation that stayed with you.
4. Write about a moment when you truly understood someone for the first time.
5. Describe an act of kindness from a stranger that you'll never forget.

**Firsts & Milestones**
1. Write about your first day at a new school, job, or place.
2. Describe the moment you accomplished something you never thought possible.
3. Tell the story of learning a new skill that changed your life.
4. Write about the first time you stood up for yourself or someone else.
5. Describe a celebration or achievement that marked a turning point.

**Challenges**
1. Write about a time when you failed and what you learned from it.
2. Describe overcoming a fear that once held you back.
3. Tell the story of a problem you solved in a creative way.
4. Write about a time when you had to adapt to an unexpected change.
5. Describe a situation where you had to persevere despite wanting to give up.

**Memories**
1. Write about a childhood memory that still brings you joy.
2. Describe a place from your past that holds special meaning.
3. Tell the story of a family tradition or gathering you cherish.
4. Write about an object that holds precious memories for you.
5. Describe a moment of simple happiness that you often think about.

### B. AI Prompt (System Message)
The AI uses a detailed system prompt that instructs GPT-4 to:
1. First evaluate prompt relevance (1-5 scale)
2. Evaluate 6 narrative traits (1-5 each)
3. Provide specific "working" and "workOn" feedback
4. Return structured JSON response

### C. Environment Variables Required
| Variable | Location | Purpose |
|----------|----------|---------|
| `VITE_CONVEX_URL` | .env.local | Convex deployment URL |
| `OPENAI_API_KEY` | Convex Dashboard | GPT-4 API access |

---

*Document maintained by the EssayPulse team.*

