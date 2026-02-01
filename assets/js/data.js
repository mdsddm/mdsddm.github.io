/* Centralized data derived from resume for single source of truth.
   Updating here propagates to all pages. */

const PROFILE = {
    name: "Mohd Saddam",
    role: "MCA Candidate • Full-Stack Developer",
    email: "md.saddam.gtm@gmail.com",
    phone: "+91 9161596155",
    location: "Delhi, India",
    summary:
        "Motivated Computer Science student with strong problem-solving skills in Data Structures & Algorithms (DSA), Python, and Java. Skilled in full-stack web development and currently upskilling in the MERN stack. Passionate about building scalable, user-focused applications and contributing to collaborative development teams.",
    links: {
        github: "https://github.com/mdsddm",
        linkedin: "https://www.linkedin.com/in/mohd-saddam-0a9560183/"
    },
    education: [
        { program: "MCA – Jamia Millia Islamia", cgpa: "8.51", year: "Expected 2026" },
        { program: "BCA – SSDC Kanpur (CSJMU)", perc: "73.75%", year: "2020" },
        { program: "Senior Secondary (XII) – SGVP Inter College (UP Board)", perc: "84%", year: "2017" },
        { program: "Secondary (X) – SGVP Inter College (UP Board)", perc: "82%", year: "2015" }
    ],
    skills: {
        languages: ["Python", "Java", "C", "C++"],
        web: ["HTML", "CSS", "JavaScript", "Node.js", "Express.js", "React.js", "Mongoose", "Cloudinary", "Render"],
        tools: ["Git", "GitHub", "VS Code"],
        databases: ["MySQL", "MongoDB"],
        core: ["DSA", "OOP", "SDLC", "Debugging", "Teamwork"]
    },
    projects: [
        {
            title: "Valexia — Data-Driven Technical Interview Platform",
            slug: "valexia",
            category: "fullstack",
            description:
                "MERN-based SaaS platform for conducting structured technical interviews with real-time coding and analytics.",
            tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
            links: { repo: "#", live: "#" },
            thumb: "assets/img/valexia-thumb.png",
            details:
                "A comprehensive platform facilitating real-time coding interviews, video calls, collaboration tools, and anti-cheat mechanisms.",
            features: [
                "Real-time coding & video interviews",
                "Collaborative environment",
                "Interview analytics & reporting",
                "Anti-cheat mechanisms",
                "SaaS architecture"
            ]
        },
        {
            title: "StayNest — Airbnb-Style Web App",
            slug: "staynest",
            category: "fullstack",
            description:
                "Full-stack accommodation platform with authentication, listings, image uploads, and reviews.",
            tech: ["Node.js", "Express.js", "MongoDB Atlas", "Cloudinary", "Render"],
            links: { repo: "#", live: "#" },
            thumb: "assets/img/staynest-thumb.png",
            details:
                "A feature-rich booking platform allowing users to list properties, book stays, and leave reviews, deployed on Render.",
            features: [
                "User authentication & authorization",
                "Property listings with image uploads (Cloudinary)",
                "Review and rating system",
                "Responsive design",
                "Cloud database integration"
            ]
        },
        {
            title: "CyGuard — Cyber Security Management System",
            slug: "cyguard",
            category: "security",
            description:
                "Backend system for security policies, vulnerability tracking, and compliance management.",
            tech: ["Python", "MySQL"],
            links: { repo: "#", live: "#" },
            thumb: "assets/img/cyber-security-management-system-thumb.jpg",
            details:
                "A backend solution designed to manage an organization's security posture through policy enforcement and vulnerability tracking.",
            features: [
                "Security policy management",
                "Vulnerability tracking & logging",
                "Compliance monitoring",
                "Role-based access",
                "Reporting modules"
            ]
        },
        {
            title: "Portfolio Website",
            slug: "portfolio",
            category: "web",
            description:
                "Responsive personal portfolio built using HTML, CSS, and JavaScript to showcase skills and projects.",
            tech: ["HTML", "CSS", "JavaScript"],
            links: { repo: "https://github.com/mdsddm/mdsddm.github.io", live: "https://mdsddm.github.io" },
            thumb: "assets/img/profile.jpg",
            details:
                "The personal portfolio site you are currently viewing, designed for performance and accessibility.",
            features: [
                "Responsive layout",
                "Dark/Light theme toggle",
                "Project showcase",
                "Dynamic content loading",
                "SEO optimized"
            ]
        }
    ],
    certifications: [
        { title: "Python Certification – BTPS, Kanpur" },
        { title: "Web Designing Certification – HIGHPROSOFT, Kanpur" },
        { title: "Workshop on C Programming – Shri Shakti Degree College, Kanpur" }
    ]
};
