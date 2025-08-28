/* Centralized data derived from resume for single source of truth.
   Updating here propagates to all pages. */

const PROFILE = {
    name: "Mohd Saddam",
    role: "MCA Candidate • Full-Stack Developer",
    email: "md.saddam.gtm@gmail.com",
    phone: "+91 9161596155",
    location: "Delhi, India",
    summary:
        "Motivated CS student with strong problem-solving in DSA, Python, and Java. Skilled in full stack web development and currently upskilling in MERN.",
    links: {
        github: "https://github.com/mdsddm",
        linkedin: "https://www.linkedin.com/in/mohd-saddam-0a9560183/"
    },
    education: [
        { program: "MCA – Jamia Millia Islamia", cgpa: "8.665", year: "Expected Year" },
        { program: "BCA – SSDC Kanpur, CSJMU", perc: "73.75%", year: "2020" },
        { program: "Senior Secondary (XII) – SGVP Inter College, UP Board", perc: "84%", year: "2017" },
        { program: "Secondary (X) – SGVP Inter College, UP Board", perc: "82%", year: "2015" }
    ],
    skills: {
        languages: ["Python", "Java", "C", "C++"],
        web: ["HTML", "CSS", "JavaScript", "MERN (in progress)"],
        tools: ["Git", "GitHub", "Tkinter", "DB Connectivity"],
        databases: ["MySQL", "MongoDB"]
    },
    projects: [
        {
            title: "Cyber Security Management System",
            slug: "cyber-security-management-system",
            category: "security",
            description:
                "Manage security policies, monitor vulnerabilities, ensure compliance, with access control and reporting dashboards.",
            tech: ["Python", "MySQL", "Dashboards"],
            links: { repo: "#", live: "#" },
            thumb: "assets/img/cyber-security-management-system-thumb.jpg",
            details:
                "A role-based admin dashboard to create and assign security policies, log vulnerabilities, and generate compliance reports.",
            features: [
                "Role-based authentication & granular access control",
                "Policy lifecycle management (create, review, retire)",
                "Vulnerability registry with status tracking",
                "Automated compliance summary & exportable reports",
                "Visual KPI panels (open vulns, remediation rate, policy coverage)"
            ]
        },
        {
            title: "Tkinter Calculator",
            slug: "tkinter-calculator",
            category: "gui",
            description:
                "A simple yet stylish desktop calculator supporting basic and scientific operations, built with Python and Tkinter.",
            tech: ["Python", "Tkinter"],
            links: {
                repo: "https://github.com/mdsddm/tkinter-calculator",
                live: "#"
            },
            thumb: "assets/img/tkinter-calculator-thumb.jpg",
            details:
                "Scientific calculator supporting extended operations with a clean Tkinter UI.",
            features: [
                "Basic + scientific ops (trig, log, power)",
                "Theme toggle (light / dark variants)",
                "Expression validation & safe eval wrapper",
                "Keyboard shortcuts for faster input",
                "Modular code for easy extension"
            ]
        },
        {
            title: "Python GUI Utility (Tkinter)",
            slug: "python-gui-utility",
            category: "gui",
            description:
                "Desktop GUI tool built with Tkinter to automate routine tasks and database interactions.",
            tech: ["Python", "Tkinter", "SQLite/MySQL"],
            links: { repo: "#", live: "#" },
            thumb: "assets/img/python-gui-utility-thumb.jpg",
            details:
                "CRUD + data utilities desktop interface with clean separation of concerns.",
            features: [
                "Configurable DB layer (SQLite / MySQL)",
                "Search + multi-field filtering",
                "CSV / XLS export",
                "Form validation & error toasts",
                "MVC-ish structure for maintainability"
            ]
        }
    ],
    certifications: [
        { title: "Python Certification – BTPS, Kanpur" },
        { title: "Web Designing Certification – HIGHPROSOFT, Kanpur" },
        { title: "Workshop on C Programming – Shri Shakti Degree College, Kanpur" }
    ]
};
