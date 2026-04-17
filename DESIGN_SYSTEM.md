# Modern Chat App - Design System

## Overview

This document outlines the design system for the Modern Chat App redesign, which follows a **Warm Minimalist** aesthetic with coral accents.

## Color Palette

### Primary Colors
- **Coral Accent**: `#FF6B4A` - Primary action color, used for buttons, highlights, and active states
- **Coral Gradient**: `#FF6B4A` to `#E55A3A` - Used for message bubbles and primary CTAs
- **Sage Green**: `#6B9E7F` - Secondary accent, used for online status and success states

### Neutral Colors
- **Background**: `#FAFAF8` - Warm white, primary background
- **Card**: `#FFFFFF` - Pure white for cards and containers
- **Secondary**: `#F5F3F0` - Light warm gray for hover states and secondary backgrounds
- **Muted**: `#EBE8E5` - Lighter gray for disabled states
- **Border**: `#E5E2DF` - Subtle borders and dividers
- **Foreground**: `#1A1A18` - Deep charcoal for text
- **Muted Foreground**: `#6B6B68` - Gray for secondary text

### Semantic Colors
- **Destructive**: `#DC2626` - Red for delete/error actions
- **Success**: `#6B9E7F` - Green for success states

## Typography

### Font Families
- **Headers**: Plus Jakarta Sans (Bold, 700)
- **Body**: Inter (Regular, 400)
- **UI Labels**: Inter (Medium, 500)

### Type Scale
- **Display**: 28px, Bold, Plus Jakarta Sans
- **Heading**: 20px, Semi-bold, Plus Jakarta Sans
- **Body**: 14px, Regular, Inter
- **Label**: 12px, Medium, Inter (uppercase, 0.05em letter-spacing)

## Components

### Message Bubbles
- **Own Messages**: Coral gradient background with white text, rounded-3xl, rounded-br-none
- **Other Messages**: Light gray background with dark text, rounded-3xl, rounded-bl-none
- **Shadows**: Subtle shadow on hover, smooth transition
- **Status Icons**: Check marks for sent/delivered/read states

### Sidebar
- **Active Item**: Light gray background with coral left border
- **Hover State**: Light gray background with smooth transition
- **Unread Badge**: Coral background with white text, rounded-full
- **Online Indicator**: Sage green dot with border

### Input Area
- **Background**: Secondary gray with rounded corners
- **Focus**: Coral ring (2px) on focus
- **Send Button**: Coral gradient, rounded-full, white text
- **Disabled State**: Reduced opacity, not-allowed cursor

### Modals
- **Background**: Card background with subtle border
- **Shadow**: Medium shadow for elevation
- **Rounded**: 12px radius on corners
- **Overlay**: Black with 50% opacity

## Spacing System

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px

## Border Radius

- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **full**: 9999px (for pills and rounded buttons)

## Shadows

- **sm**: `0 1px 2px rgba(0, 0, 0, 0.05)`
- **md**: `0 4px 6px rgba(0, 0, 0, 0.1)`
- **lg**: `0 10px 15px rgba(0, 0, 0, 0.1)`

## Animations

- **Transition Duration**: 200-300ms for most interactions
- **Easing**: ease-out for entrance animations, ease-in-out for state changes
- **Message Bubbles**: Fade in with slight upward motion (200ms)
- **Hover States**: Smooth color and shadow transitions
- **Typing Indicator**: Pulsing dots with staggered animation

## Responsive Design

- **Mobile**: Full width, stacked layout, hamburger menu for sidebar
- **Tablet**: Sidebar visible, main content area responsive
- **Desktop**: Full layout with all elements visible

## Key Design Principles

1. **Warmth**: Warm color palette creates approachable, human-centered feel
2. **Minimalism**: Clean layouts with generous whitespace
3. **Clarity**: Clear hierarchy and visual feedback
4. **Consistency**: Unified design language across all components
5. **Accessibility**: Sufficient color contrast, keyboard navigation support
6. **Polish**: Smooth transitions and micro-interactions

## Component Library

### Core Components
- `ChatApp` - Main application layout
- `ChatSidebar` - Chat list and navigation
- `ChatWindow` - Direct message interface
- `GroupChatWindow` - Group message interface
- `MessageBubble` - Individual message display
- `TypingIndicator` - Animated typing indicator
- `CreateChatModal` - Modal for starting new chats
- `GroupInfo` - Group details sidebar
- `UserProfile` - User information display

### Utility Components
- `EmptyState` - Empty state messaging
- `NotificationBadge` - Unread count badge
- `StatusIndicator` - Online/offline status

### Pages
- `ChatApp` - Main chat interface
- `Login` - Authentication page
- `Settings` - User settings page

## Implementation Notes

- All colors use CSS variables for easy theming
- Components use Tailwind CSS for styling
- Lucide React icons for consistent iconography
- Responsive design implemented with Tailwind breakpoints
- Dark mode support available through CSS variables
