# Modern Chat App - Redesigned Frontend

A beautifully redesigned chat application frontend featuring a warm minimalist design with coral accents, smooth animations, and an intuitive user interface.

## Features

### Core Messaging
- **Direct Messaging**: One-on-one conversations with real-time updates
- **Group Chats**: Create and manage group conversations
- **Message Status**: Visual indicators for sent, delivered, and read states
- **Typing Indicators**: See when others are typing
- **Message Actions**: Edit, delete, reply, and forward messages

### User Experience
- **Modern UI**: Warm minimalist design with coral accents (#FF6B4A)
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Polished transitions and micro-interactions
- **Search Functionality**: Find chats and messages quickly
- **Unread Badges**: Track unread messages at a glance

### User Management
- **Online Status**: See who's online with status indicators
- **User Profiles**: View and edit user information
- **Settings**: Customize notifications, privacy, and preferences
- **Authentication**: Secure login and registration

## Design System

The app follows a **Warm Minimalist** design philosophy:

- **Color Palette**: Warm whites, soft grays, and coral accents
- **Typography**: Plus Jakarta Sans for headers, Inter for body text
- **Spacing**: Generous whitespace for clarity and focus
- **Animations**: Smooth 200-300ms transitions for all interactions
- **Components**: Reusable, consistent UI components

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for detailed design documentation.

## Project Structure

```
client/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ChatApp.tsx
│   │   ├── ChatSidebar.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── GroupChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── CreateChatModal.tsx
│   │   ├── GroupInfo.tsx
│   │   ├── UserProfile.tsx
│   │   ├── EmptyState.tsx
│   │   ├── NotificationBadge.tsx
│   │   └── StatusIndicator.tsx
│   ├── pages/             # Page-level components
│   │   ├── ChatApp.tsx
│   │   ├── Login.tsx
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles and design tokens
├── public/                # Static assets
└── index.html             # HTML template
```

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development

The app uses:
- **React 19** for UI components
- **Tailwind CSS 4** for styling
- **Wouter** for client-side routing
- **Lucide React** for icons
- **shadcn/ui** for pre-built components

### Key Technologies

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Icons**: Lucide React
- **Routing**: Wouter (lightweight alternative to React Router)
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Build Tool**: Vite

## Component Overview

### ChatApp
Main application layout with sidebar and chat window. Manages chat selection and displays appropriate content.

### ChatSidebar
Left sidebar showing chat list with search, filtering by direct/group, and unread badges. Includes create chat button.

### ChatWindow
Direct message interface with message list, typing indicators, and input area. Supports sending text and media.

### GroupChatWindow
Group message interface with group info sidebar, member list, and group-specific actions.

### MessageBubble
Individual message display with status icons, timestamps, and action menu. Supports media attachments.

### TypingIndicator
Animated indicator showing when others are typing. Uses pulsing coral dots.

### CreateChatModal
Modal for starting new chats or creating groups. Includes user search and selection.

### GroupInfo
Right sidebar showing group details, member list with online status, and group actions.

## Design Highlights

### Color System
- **Primary Accent**: Coral (#FF6B4A) for actions and highlights
- **Secondary Accent**: Sage Green (#6B9E7F) for status indicators
- **Neutral Base**: Warm whites and grays for backgrounds
- **Text**: Deep charcoal (#1A1A18) for readability

### Typography
- **Display**: Plus Jakarta Sans, Bold, 28px
- **Heading**: Plus Jakarta Sans, Semi-bold, 20px
- **Body**: Inter, Regular, 14px
- **Label**: Inter, Medium, 12px

### Spacing & Radius
- **Border Radius**: 12px for most elements, 20px+ for soft UI
- **Spacing Scale**: 4px, 8px, 16px, 24px, 32px
- **Shadows**: Subtle shadows for depth without heaviness

### Animations
- **Message Bubbles**: Fade in with upward motion (200ms)
- **Hover States**: Smooth color and shadow transitions
- **Transitions**: 200-300ms ease-out for most interactions
- **Typing Indicator**: Pulsing dots with staggered timing

## Responsive Design

The app is fully responsive:

- **Mobile**: Full-width layout with collapsible sidebar
- **Tablet**: Sidebar visible with responsive main content
- **Desktop**: Full layout with all elements visible

## Future Enhancements

- Voice and video calling integration
- File sharing and media gallery
- Message reactions and emoji support
- Read receipts and delivery confirmations
- Message search with filters
- User presence and activity status
- Push notifications
- Dark mode theme
- Accessibility improvements (WCAG 2.1 AA)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized component rendering with React hooks
- Lazy loading for images and media
- Efficient state management
- CSS-in-JS with Tailwind for minimal bundle size

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Focus indicators for keyboard users

## Contributing

When adding new components or features:

1. Follow the existing design system
2. Use the established color palette and typography
3. Maintain consistent spacing and radius
4. Add smooth animations where appropriate
5. Ensure responsive design
6. Test accessibility

## License

MIT

## Contact

For questions or feedback about the design, please refer to [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).
