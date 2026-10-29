/* Data read from the GitHub API on 2026-10-29. Regenerate with scripts/refresh.sh */
window.DATA = {
  heatmap: {
    start: "2025-10-26",          // Sunday of the first column
    total: 9254,
    thresholds: [5, 15, 44],      // quartiles over non-zero days
    // 53 columns (weeks) x 7 rows (Sun..Sat). null = outside the window.
    cols: [[2,11,0,3,4,1,3],[0,0,0,3,26,20,3],[1,20,0,6,11,6,3],[4,1,0,7,7,8,11],[3,3,0,0,0,29,24],[3,1,1,0,0,0,0],[1,0,10,8,9,8,0],[15,4,0,2,0,0,12],[0,0,0,0,22,0,1],[0,0,0,1,0,0,0],[0,0,0,0,0,0,6],[1,1,4,1,3,11,1],[1,0,5,33,8,11,9],[1,1,0,15,8,0,18],[3,0,4,1,0,17,0],[0,3,4,8,2,3,1],[0,1,1,4,0,1,11],[4,1,27,0,11,0,1],[2,1,4,12,4,13,1],[3,1,2,18,18,18,0],[12,0,32,7,8,29,44],[15,11,6,9,1,4,18],[3,6,10,32,6,5,13],[7,7,1,5,12,8,2],[11,26,6,9,15,6,6],[12,5,1,3,6,6,4],[0,5,15,13,8,1,25],[6,1,5,2,0,2,5],[2,15,4,5,23,54,53],[36,18,14,35,9,8,9],[0,16,50,10,5,67,18],[0,2,11,8,11,0,0],[1,0,18,21,40,14,20],[18,46,60,1,101,28,71],[23,25,11,53,48,44,46],[73,56,25,71,72,60,39],[11,25,117,59,69,35,17],[10,49,202,65,111,179,82],[18,76,18,131,79,199,64],[83,115,22,165,183,114,102],[16,71,131,37,48,23,9],[1,30,96,44,71,64,61],[4,116,76,117,152,111,61],[1,21,31,55,49,44,87],[2,57,46,47,135,27,103],[5,99,21,94,57,15,7],[1,35,74,65,82,91,4],[0,60,57,49,93,47,10],[0,24,22,16,25,21,4],[0,6,44,15,49,35,23],[10,32,22,62,55,24,33],[18,49,37,24,64,49,168],[31,6,22,74,34,null,null]]
  },

  /* Everything here is something I have shipped with. */
  stack: [
    ["TypeScript","#3178C6","#fff"], ["JavaScript","#F7DF1E","#111"],
    ["Python","#3776AB","#fff"],     ["Django","#0C4B33","#fff"],
    ["React","#0B7FA8","#fff"],      ["Next.js","#111113","#fff"],
    ["Node.js","#5FA04E","#fff"],    ["NestJS","#E0234E","#fff"],
    ["Express","#1b1b1f","#fff"],    ["PostgreSQL","#4169E1","#fff"],
    ["MongoDB","#13AA52","#fff"],    ["MySQL","#00618A","#fff"],
    ["Redis","#D82C20","#fff"],      ["Celery","#37814A","#fff"],
    ["Docker","#2496ED","#fff"],     ["AWS","#FF9900","#111"],
    ["ECS Fargate","#E7157B","#fff"],["S3","#3F8624","#fff"],
    ["Vercel","#111113","#fff"],     ["Netlify","#00C7B7","#06231f"],
    ["Tailwind CSS","#06B6D4","#fff"],["React Native","#0B7FA8","#fff"],
    ["Expo","#1b1b1f","#fff"],       ["Git","#F05032","#fff"],
    ["GitHub Actions","#2088FF","#fff"],["Firebase","#FFA000","#111"],
    ["GCP","#4285F4","#fff"],        ["Sequelize","#2379BD","#fff"],
    ["Ant Design","#0170FE","#fff"], ["Judge0","#2b3440","#fff"],
    ["OpenAI","#10A37F","#fff"],     ["Razorpay","#0C2451","#fff"],
    ["C++","#00599C","#fff"],        ["k6","#7D64FF","#fff"],
    ["Postman","#FF6C37","#fff"]
  ],

  /* Command palette targets */
  commands: [
    ["Work",          "#work",       "section"],
    ["Experience",    "#experience", "section"],
    ["Merged PRs",    "#merged",     "section"],
    ["Stack",         "#stack",      "section"],
    ["Writing",       "#writing",    "section"],
    ["Get in touch",  "#contact",    "section"],
    ["GitHub",        "https://github.com/utkarshsingx",            "link"],
    ["LinkedIn",      "https://www.linkedin.com/in/utkarshsingx/",  "link"],
    ["Email",         "mailto:hauntedutkarsh@gmail.com",            "link"],
    ["utkarshreads",  "https://www.utkarshreads.me/",               "link"],
    ["Field report (other site)", "https://utkarshsingx.github.io/", "link"],
    ["picks.",        "https://picksbet.vercel.app",                "project"],
    ["GICCI",         "https://gicci.vercel.app",                   "project"],
    ["DSA Lab",       "https://utkarshsingx-dsa.netlify.app/",      "project"],
    ["AI Surveyor",   "https://ai-surveyor-alpha.vercel.app",       "project"],
    ["starrytv",      "https://starrytv.vercel.app",                "project"],
    ["Toggle theme",  "theme",                                      "action"]
  ]
};
