# Cyberdata - Cyberpunk Learning Platform

A cutting-edge data analytics learning platform with a cyberpunk aesthetic. Built with Next.js 14, TypeScript, PostgreSQL, and NextAuth.js.

## Features

- 🔐 **Authentication System** - User registration and login with role-based access (Admin, Instructor, Student)
- 📚 **Course Management** - Create, edit, and manage courses with rich content
- 📸 **File Upload** - Upload images for courses and profile pictures, video support
- 👤 **User Profiles** - Customizable user profiles with bio and avatar
- 🎨 **Cyberpunk UI** - Neon effects, animations, and futuristic design
- 🔒 **Role-Based Access Control** - Different permissions for admins, instructors, and students
- 🗂️ **Course Catalog** - Browse and filter courses by level and topic

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form + Zod
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Neon account)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aabrayev99/Cyberdata.git
cd Cyberdata
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
DATABASE_URL="your_postgresql_connection_string"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course pages
│   ├── profile/           # User profile
│   └── settings/          # User settings
├── components/            # React components
│   ├── ui/               # UI components
│   └── providers/        # Context providers
├── lib/                   # Utility functions
│   ├── auth.ts           # Auth utilities
│   ├── db-simple.ts      # Database helpers
│   └── utils.ts          # General utilities
└── types/                 # TypeScript types
```

## Database Schema

- **Users:** Store user information with roles
- **Courses:** Course details, descriptions, and metadata
- **Lessons:** Individual lessons within courses
- **Enrollments:** Track student course enrollments
- **Lesson_Progress:** Monitor student progress

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

---

Built with ⚡ by the Cyberpunk Learning Platform team
