Prompt

Context and Role
i want  only the full codebase no explanation or anything else

As a full stack Web Developer specializing in modern web experiences you are responsible for both designing and implementing a high performance Learning Management System website.The website must use Framer Motion to create immersive, scroll- based storytelling animations while maintaining responsiveness,accessibility, and production-level quality.

The LMS website should be a role based website described as an educator and a student.An educator must be able to create a course and also be able to upload video lectures inside the particular course and also set the price for each course created for students to buy.Each student should be able to purchase the course through a payment gateway like razorpay.

Objective

Develop a complete full stack Learning Management System website that:

Implements scroll based storytelling animations using Framer Motion
Provides a modern, responsive UI with smooth transitions.
Each Course should have a description and the contact number of that particular educator of that particular course.
There should be an Home Page of the website including nice pictures and the domain of courses which are offered on this website.The domain offered are Cyber Security,Data Science,Full Stack Web Development,Devops,Agentic AI
There will be a Sign up page and a login page through JWT
There should be my Profile page for both the educator and the student.
The profile page of an educator must have the courses they created and number of students enrolled in each courses and the total earnings only shown to the educator profile page.
The My Profile page of a student should have all the courses they enrolled in and the progress of each course tracked by the website from how many lectures the student has watched.
Use vidstack for video player needed to watch a lecture.
The name of the website should be Ethara Learn.
There should be Cart section for all the courses which are added to cart
Each course should have the option to add to cart and then buy all the courses
There should be a forgot password on login page which will handle the edit password through email.
There should be customer support section which would open a form which includes the students details section and the student's issue and the particular unique id of course he has issue with and then generate a unique token number for that specific issue after submitting the form

UI and Animation Requirements
Scroll-Based Storytelling
Implement scroll-triggered animations using Framer Motion.
Use parallax effects, fade-ins, and staggered transitions.
Animate sections sequentially to create a narrative flow.
Include smooth transitions between:
Hero Section
About Section
courses Section
Cart Section
Contact Section
Ensure animations:
Are performant (avoid layout thrashing)
Use GPU-friendly properties (transform, opacity)
Do not block scroll performance


Layout Requirements

The website must include:
Hero section with animated introduction
About section with animated text reveal
Coarses section with animated progress indicators
Cart section with hover interactions and motion transitions
The layout must be:
Fully responsive (mobile, tablet, desktop)
Accessible (ARIA labels, semantic HTML)
Optimized for performance

Validation
Client-side validation with proper error messages.
Prevent submission if required fields are invalid.

Backend Requirements
Implement an api endpoint to handle customer support
Backend should handle all the features through creating api

Data Processing Requirements
Sanitize all inputs to prevent:
XSS attacks
Injection attacks
Validate email format properly.
Ensure API returns structured JSON responses:
Success message
Error message (if applicable)

Technology Stack
Use the following:
Frontend:
React 
Framer Motion
Tailwind CSS (or equivalent styling solution)

Backend:
Node.js + Express
Nodemailer 
dotenv for environment configuration
Mongo Db for database for storing all the information.

Error Handling and Documentation
Handle frontend form errors gracefully.
Handle backend validation errors.
Provide structured error responses.
Log backend failures appropriately

Document:
Folder structure
Setup instructions
Environment variable configuration
Deployment steps
