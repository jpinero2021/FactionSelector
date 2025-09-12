# Gaming Leaderboard Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern gaming interfaces like League of Legends, Discord, and Twitch leaderboards. The design emphasizes competitive gaming aesthetics with clear hierarchy and dark theming.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary**:
- Background: 240 15% 8% (deep charcoal)
- Surface: 240 10% 12% (elevated dark panels)
- Border: 240 8% 20% (subtle borders)

**Accent Colors**:
- Primary: 45 100% 60% (vibrant gold for rankings)
- Secondary: 200 80% 50% (cyan blue for highlights)
- Success: 120 60% 45% (energy green)

**Text Colors**:
- Primary: 0 0% 95% (high contrast white)
- Secondary: 0 0% 70% (muted text)
- Muted: 0 0% 50% (subtle labels)

### B. Typography
**Font Stack**: Inter or Roboto from Google Fonts
- Headers: 600 weight, 18-24px
- Body: 400 weight, 14-16px
- Numbers: 500 weight (energy points, rankings)
- Small text: 12-13px for labels

### C. Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 to p-6
- Element spacing: gap-4 standard, gap-2 for tight layouts
- Section margins: mb-6 to mb-8

### D. Component Library

**Toggle Buttons**:
- Pill-shaped toggle with active state highlighting
- Background blur effect when overlaid on content
- Clear active/inactive states with color differentiation

**Leaderboard Table**:
- Four-column layout: Rank, Player, Team/Guild, Energy
- Alternating row backgrounds for readability
- Medal icons for top 3 positions (gold, silver, bronze)
- Hover states for interactive feedback

**Ranking Medals**:
- Use Font Awesome or Heroicons for medal/trophy icons
- Gold (1st), Silver (2nd), Bronze (3rd) color treatments
- Numerical rankings for positions 4+

**Data Display**:
- Right-aligned energy points with consistent formatting
- Team/guild names in muted secondary color
- Player names prominent with good contrast

### E. Visual Hierarchy
- Medal icons draw attention to top performers
- Energy points emphasized through typography weight
- Clear visual separation between toggle and table content
- Consistent spacing creates natural reading flow

## Layout Structure
**Single-section design** focused on the leaderboard functionality:
- Header with toggle switches
- Main leaderboard table
- Minimal additional UI elements to maintain focus

## Interactive Elements
- Smooth toggle transitions between Efémeros/Rosetta
- Subtle hover effects on table rows
- Clear active states for the toggle buttons
- Responsive behavior maintaining readability on all devices