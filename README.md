# WellBeing - Mental Health Platform

A comprehensive mental health web application built with React, TypeScript, and Tailwind CSS that helps users track their mood, maintain a journal, access wellness tips, and connect with mental health resources.

## Features

- **Mood Tracking**: Log daily moods with notes and visualize trends
- **Personal Dashboard**: View mood analytics, streaks, and progress charts
- **Digital Journal**: Write and search through personal journal entries
- **Wellness Tips**: Get personalized recommendations based on your mood
- **Mental Health Resources**: Browse therapist profiles and book appointments
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-github-repo-url>
   cd wellbeing-mental-health-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   The application will be running at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## Usage

### Getting Started with the App

1. **Sign Up/Login**: Create a new account or login with existing credentials
   - For demo purposes, any email/password combination will work

2. **Track Your Mood**: 
   - Navigate to the Mood page
   - Select your current mood from the emoji scale
   - Add optional notes about what's influencing your mood
   - Submit to save your entry

3. **View Your Progress**:
   - Check the Dashboard to see mood trends and analytics
   - View your current streak and weekly averages
   - Analyze patterns in your mood data

4. **Keep a Journal**:
   - Use the Journal page to write about your thoughts and feelings
   - Search through past entries
   - Reflect on your mental health journey

5. **Get Wellness Tips**:
   - Visit the Tips page for personalized recommendations
   - Read daily inspirational quotes
   - Try suggested wellness activities

6. **Access Resources**:
   - Browse therapist profiles on the Resources page
   - Book appointments with mental health professionals
   - Access crisis support resources when needed

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.tsx      # Navigation component
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── DataContext.tsx # Application data management
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Registration page
│   ├── MoodTracking.tsx # Mood logging interface
│   ├── Dashboard.tsx   # Analytics and charts
│   ├── Tips.tsx        # Wellness recommendations
│   ├── Journal.tsx     # Personal journaling
│   └── Resources.tsx   # Therapist directory
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Features in Detail

### Authentication System
- Secure signup and login functionality
- Session persistence using localStorage
- Protected routes for authenticated users only

### Mood Tracking
- 5-point emoji-based mood scale
- Optional notes for context
- Historical mood entries display
- Date and time tracking

### Analytics Dashboard
- 7-day mood trend visualization
- Mood distribution charts
- Streak tracking and statistics
- Weekly and overall averages

### Personal Journal
- Rich text entry creation
- Search functionality across entries
- Expandable entry previews
- Chronological organization

### Wellness Tips
- Mood-based personalized recommendations
- Daily inspirational quotes
- Wellness activity suggestions
- Categorized tips by mood type

### Mental Health Resources
- Therapist profile directory
- Appointment booking system
- Crisis support resources
- Emergency contact information

## Data Storage

Currently, the application uses localStorage for data persistence, making it a client-side only application. This includes:
- User authentication data
- Mood entries and history
- Journal entries
- Appointment bookings

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you're experiencing a mental health crisis, please reach out for help:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- SAMHSA National Helpline: 1-800-662-4357

## Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Stock photos from [Pexels](https://www.pexels.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)