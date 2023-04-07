# A Reddit Clone

I am excited to showcase my full-stack web development skills through a [Reddit](https://www.reddit.com/) clone project that utilizes the latest technologies. To create this project, I leveraged React, Next.js, TypeScript, Supabase, Vercel, Tailwind CSS, and Node.js. This project was created from scratch, showcasing my ability to develop a full-stack web application from ideation to deployment.

My implementation focuses on replicating the essential features of Reddit, such as user authentication, user account management, post creation, subreddits, voting on posts, and comments. The front-end is developed using React, Next.js, and Tailwind CSS, ensuring an intuitive UI with exercising strong UX practices that is responsive and scalable across devices.

To create a full-stack application, I utilized Supabase, Next.js, and Node.js to handle user authentication and account management, post and comment creation, and voting functionality. User data, subreddit data, posts, and comments are stored in Supabase, a highly scalable and secure database solution. Vercel is utilized to deploy and host the application, providing fast and reliable performance.

Through this project, I was able to demonstrate my proficiency in utilizing cutting-edge technologies to develop highly functional and robust web applications. As a web developer, I am dedicated to staying up-to-date with the latest trends and technologies to provide the best possible solutions for my clients.

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/)
- **Authentication**: [Supabase](https://supabase.com/)
- **Deployment**: [Vercel](https://vercel.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Headless UI](https://headlessui.dev/)

## Overview

- `components/*` - Modular, re-usable UI components
- `lib/*` - Helpful utilities or code for external services
- `pages/*` - Pre-rendered pages using Next.js routing
- `public/*` - Static assets including favicons

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

### Generate types from supabase database

npm run update-types
