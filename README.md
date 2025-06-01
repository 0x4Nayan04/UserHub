# 🧩 User Management Dashboard

A modern, responsive admin dashboard built with Next.js for managing users with a clean, minimal UI. Features multi-step form functionality, validation, theme toggling, and smooth animations.

## ✨ Features

- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🌗 **Dark/Light Mode** - Toggle between themes with persistent preference
- 🔍 **Search Functionality** - Filter users by name or city
- ➕ **Multi-step Form** - Add new users with step-by-step validation
- ✅ **Form Validation** - Real-time validation with error messages
- 🎨 **Modern UI** - Clean design using shadcn/ui components
- 📊 **User Dashboard** - View all users in a card-based layout
- 💫 **Smooth Animations** - Framer Motion powered transitions
- 🗄️ **Local Storage** - Data persistence in browser storage

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.3 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Form Management:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Theme:** next-themes
- **Icons:** Lucide React, React Icons
- **HTTP Client:** Axios

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/0x4Nayan04/UserHub.git
   cd internshala
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/          # Dashboard pages
│   │   ├── page.tsx       # Main dashboard
│   │   └── add/
│   │       └── page.tsx   # Add user form
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home (redirects to dashboard)
├── components/
│   ├── shared/            # Shared components
│   │   ├── sidebar.tsx    # Navigation sidebar
│   │   └── theme-toggle.tsx # Theme switcher
│   ├── ui/                # shadcn/ui components
│   └── theme-provider.tsx # Theme context provider
└── lib/
    ├── utils.ts           # Utility functions
    └── validation.ts      # Form validation schemas
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Usage

### Viewing Users

- Navigate to the dashboard to see all users
- Use the search bar to filter users by name or city
- Users are displayed in responsive card layout

### Adding Users

1. Click the "Add User" button on the dashboard
2. Fill out the basic information (name, email, phone)
3. Continue to address information (street, city, ZIP)
4. Submit the form to add the user

### Theme Toggle

- Use the theme toggle button to switch between light and dark modes
- Theme preference is saved and persists across sessions

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS 4 with custom configuration for dark mode and component styling.

### Form Validation

- **Basic Info:** Name (min 2 chars), valid email, phone number validation
- **Address:** Street address, city, and ZIP code (min 5 chars)
- Real-time validation with user-friendly error messages

### API Integration

The app fetches users from JSONPlaceholder API and stores new users in local storage for persistence.
