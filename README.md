# Reddit clone

A full-stack Reddit clone built with Next.js, TypeScript, Supabase, and Tailwind CSS. It implements core features including user authentication, post creation, voting, commenting, and subreddit management. The frontend uses Headless UI for accessible components and responsive design, while Supabase handles backend logic and data storage via PostgreSQL. The project is deployed on Vercel and structured for scalability and maintainability.

## Demo

[https://reddit-clone-next-supabase.vercel.app](https://reddit-clone-next-supabase.vercel.app)

## Overview

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/)
- **Authentication**: [Supabase](https://supabase.com/)
- **Deployment**: [Vercel](https://vercel.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Headless UI](https://headlessui.dev/)

## Running Locally

Clone GitHub repository, install the dependencies, and run the development server:

```bash
$ git clone https://github.com/neilgebhard/reddit-next-supabase
$ cd reddit-next-supabase
$ npm i
$ npm run dev
```

Create a .env.local file similar to .env.example with the required environment variables.

The app will be run on [http://localhost:3000](http://localhost:3000).

### To generate types from supabase database

npm run update-types
