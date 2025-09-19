# SyllabusToCalendar Converter

A modern web application that transforms course syllabi into organized calendar events. Built with Next.js, this tool automatically extracts important dates, assignments, exams, and events from PDF and DOCX syllabus files and converts them into calendar-ready formats.

![SyllabusToCalendar](https://img.shields.io/badge/SyllabusToCalendar-Convert%20Syllabi%20to%20Calendar-red)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## ✨ Features

- **📄 Multiple Format Support**: Upload PDF or DOCX syllabus files
- **🤖 AI-Powered Processing**: Intelligent date and event extraction from syllabi
- **📅 Calendar Integration**: Export to Google Calendar, Outlook, Apple Calendar, or download as ICS files
- **🎨 Modern UI**: Clean black and white design with red accents
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🔔 Smart Notifications**: Customizable reminders for important deadlines
- **⚡ Fast Processing**: Quick conversion from syllabus to calendar events

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/syllabus-to-calendar.git
   cd syllabus-to-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # CloudConvert API Key (for PDF to DOCX conversion)
   CLOUDCONVERT_API_KEY=your_cloudconvert_api_key_here

   # OpenAI API Key (optional, for advanced text processing)
   OPENAI_API_KEY=your_openai_api_key_here

   # Add any other API keys or environment variables you need
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── calendar/
│   │   ├── page.tsx          # Calendar view page
│   │   └── calendar-data.json # Sample calendar data
│   ├── features/
│   │   └── page.tsx          # Features showcase page
│   ├── how-it-works/
│   │   └── page.tsx          # How it works page
│   ├── submit/
│   │   └── page.tsx          # Syllabus upload page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── types/
│   └── json.d.ts             # TypeScript JSON declarations
└── public/                   # Static assets
```

## 🎨 Design System

The application uses a consistent black and white color scheme with red accents:

- **Primary Background**: `bg-black`
- **Primary Text**: `text-white`
- **Accent Color**: `text-red-600` / `bg-red-600`
- **Secondary Elements**: `bg-white` / `text-black`

## 🔧 Technologies Used

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Calendar**: React Big Calendar with date-fns
- **File Processing**: PDF.js, Mammoth.js (for DOCX)
- **API Integration**: CloudConvert API for PDF conversion
- **Icons**: Custom SVG icons

## 📋 API Integration

### CloudConvert API
The application uses CloudConvert API to convert PDF files to DOCX format for text extraction. You'll need to:

1. Sign up for a CloudConvert account at [cloudconvert.com](https://cloudconvert.com)
2. Obtain your API key from the dashboard
3. Add it to your environment variables

### Optional: OpenAI API
For advanced text processing and date extraction, you can integrate OpenAI's API:

1. Sign up for an OpenAI account
2. Obtain your API key
3. Add it to your environment variables

## 🚀 Deployment

### Vercel (Recommended)
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
You can also deploy to other platforms like:

- **Netlify**: `npm run build && npm run export`
- **AWS Amplify**: Configure build settings for Next.js
- **Railway**: One-click deployment with railway.app

## 📝 Usage

1. **Upload Syllabus**: Navigate to the upload page and select your PDF or DOCX syllabus file
2. **Processing**: The system will automatically extract dates and events
3. **Review**: Check the extracted events and make any necessary adjustments
4. **Export**: Choose your preferred calendar format and export your schedule

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

If you have any questions or need help with the application:

1. Check the [FAQ section](/how-it-works) on the website
2. Open an issue on GitHub
3. Contact us at support@syllabustocalendar.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [CloudConvert](https://cloudconvert.com/) for file conversion API
- [React Big Calendar](https://github.com/jquense/react-big-calendar) for the calendar component

## 📊 Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Last Commit](https://img.shields.io/github/last-commit/SujoyMondol/syllabus-to-calendar)

---

**SyllabusToCalendar** - Never miss another academic deadline! 📚➡️📅