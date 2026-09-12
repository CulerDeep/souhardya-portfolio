from fastapi import APIRouter

router = APIRouter()

PROFILE = {
    "name": "Souhardya Chakrabarti",
    "title": "Full Stack Developer",
    "location": "Kolkata, India",
    "email": "chakrabartisouhardya007@gmail.com",
    "phone": "+91 86208 36002",
    "summary": (
        "Results-driven full stack developer with over two years in software development "
        "and consulting. I build scalable systems that turn messy data into decisions — "
        "forecasting dashboards, market-data pipelines, and client-facing tools for Fortune 50 teams."
    ),
    "seeking": "Actively seeking new opportunities on ambitious product and platform work.",
    "languages": ["English", "Bengali", "Hindi"],
    "skills": {
        "frontend": ["ReactJS", "Angular", "JavaScript", "jQuery", "HTML5", "CSS3"],
        "backend": ["Python", "Flask", "FastAPI", ".NET", "C#", "Node.js", "GraphQL"],
        "data": ["SQL Server", "PostgreSQL", "Redshift", "SQL", "Power BI"],
        "cloud": ["Azure", "AWS", "Azure Functions", "Lambda", "API Gateway", "Amplify"],
        "practice": ["Git", "Scrum", "CI/CD", "GitLab", "Azure DevOps"],
    },
    "education": [
        {
            "school": "Jadavpur University",
            "place": "Kolkata, India",
            "credential": "BE, Bachelor of Engineering",
            "when": "Jun 2022",
            "detail": "First class with honours — 8.1 CGPA",
        },
        {
            "school": "Mahesh Sree Ram Krishna Asram Vidyalaya",
            "place": "Serampore, India",
            "credential": "Higher secondary",
            "when": "2018",
            "detail": "Class 10: 91% · Class 12: 85%",
        },
    ],
    "experience": [
        {
            "org": "PwC India",
            "place": "Kolkata, India",
            "role": "Full Stack Web Developer",
            "when": "Jun 2022 — Present",
            "highlights": [
                "Led a React + Flask forecasting dashboard for a PwC US Fortune 50 client, with GitLab CI for delivery.",
                "Built employee management and bonus calculation software for a private equity firm on Angular, AWS (Lambda, API Gateway, Amplify), and PostgreSQL.",
                "Maintained a legacy market-data application (Angular, Flask, SQL Server) feeding ETL pipelines; Azure DevOps for CI.",
                "Led a climate & ESG management tool for multinational carbon accounting — jQuery, Flask, SQL Server.",
                "Delivered hedge-fund and liquid-fund analytics with Angular, Flask, SQL Server, Power BI, and Azure App Service.",
                "Modernized a .NET / jQuery / SQL Server estate hosted on AWS EC2.",
                "Shipped a React chat interface integrated with the OpenAI API for PwC US RMS.",
            ],
        },
        {
            "org": "PwC India",
            "place": "Kolkata, India",
            "role": "API and Cloud Developer",
            "when": "Nov 2023 — Present",
            "highlights": [
                "Designed .NET / C# APIs against SQL Server to automate email via SMTP.",
                "Wrote SQL migration scripts for a very large database and added indexes for hot paths.",
                "Built Azure Function apps to ingest files from financial institutions, extract market data, and feed ETL pipelines.",
            ],
        },
        {
            "org": "Novus Inc",
            "place": "Remote / US startup",
            "role": "Intern",
            "when": "Mar 2021 — Jul 2021",
            "highlights": [
                "Studied compiler-design building blocks with LEX and YACC.",
            ],
        },
    ],
}


@router.get("")
def get_profile():
    return PROFILE
