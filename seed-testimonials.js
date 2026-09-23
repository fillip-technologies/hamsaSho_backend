const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mysql = require("mysql2/promise");

const testimonials = [
  {
    name: "Aastha Super Speciality Hospital & Diagnostics",
    position: null,
    hospital: "Siliguri, West Bengal",
    quote: "This feedback is given to Hamsa Soham as we have been using your software from past 1 year, the services are satisfying and user friendly but some issues are there as in registration head and bed allotment for the given patient, sometimes the software fails to display bed occupancy. So, it's my humble request to look into the matter.",
    logo_url: "/clients/aastha.png",
    backdrop_color: "#1E74B7",
    backdrop_rotate: "-rotate-6",
    avatar_bg: "bg-white",
    is_active: 1,
    sort_order: 1,
  },
  {
    name: "Nilesh Kumar",
    position: null,
    hospital: "Vivantes Hospital and Research Institute Pvt. Ltd.",
    quote: "Your support team is great. All our modules are live and working fine with the help of your support team. And because of this I am getting MIS report properly. I hope you will continue like this.",
    logo_url: "/clients/vhri.png",
    backdrop_color: "#43A047",
    backdrop_rotate: "rotate-6",
    avatar_bg: "bg-white",
    is_active: 1,
    sort_order: 2,
  },
  {
    name: "Ashish Sehgal",
    position: "General Manager",
    hospital: "Sharda Imaging, Panipat",
    quote: "This is to bring in your kind notice that we are getting proper services from your side. There is no such problem in our software & hope for the same in future. Mr. Rajender is very supportive throughout the time. Looking for the same support in future.",
    logo_url: "/clients/sharda.png",
    backdrop_color: "#00897B",
    backdrop_rotate: "-rotate-6",
    avatar_bg: "bg-white",
    is_active: 1,
    sort_order: 3,
  },
  {
    name: "Deepankar Chanda",
    position: "IT Head",
    hospital: "Akhandjyoti Eye Hospital",
    quote: "This is to acknowledge that we have been using e-Dristi Hospital Management Information System, developed by Hamsa Soham Healthcare Pvt. Ltd., for the last 2 years. The software has all the modules to run the Hospital operations efficiently. Their support services are good since the commissioning of the HMIS.",
    logo_url: "/clients/ajeh.png",
    backdrop_color: "#FF4D27",
    backdrop_rotate: "rotate-6",
    avatar_bg: "bg-[#0F172A]",
    is_active: 1,
    sort_order: 4,
  },
  {
    name: "Sri Sai Lions Netralaya",
    position: null,
    hospital: "Patna, Bihar",
    quote: "We are impressed; the best thing about Hamsa Soham is their support team. This is good software. We are using Hamsa Soham software in all the centres. It is the most affordable and has features unique to the eye care hospital module. We are happy with the performance of the software and we are also implementing Hamsa Soham in other branches and can be recommended to any other hospital.",
    logo_url: "/clients/ssln.png",
    backdrop_color: "#6D28D9",
    backdrop_rotate: "-rotate-6",
    avatar_bg: "bg-white",
    is_active: 1,
    sort_order: 5,
  },
];

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
  });

  console.log("Connected. Seeding testimonials...");

  // Clear existing so we don't duplicate on re-run
  await conn.query("DELETE FROM testimonials");
  console.log("Cleared existing testimonials.");

  for (const t of testimonials) {
    await conn.query(
      `INSERT INTO testimonials (name, position, hospital, quote, logo_url, backdrop_color, backdrop_rotate, avatar_bg, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.name, t.position, t.hospital, t.quote, t.logo_url, t.backdrop_color, t.backdrop_rotate, t.avatar_bg, t.is_active, t.sort_order]
    );
    console.log(`  ✓ ${t.name}`);
  }

  console.log("\nDone — 5 testimonials seeded.");
  await conn.end();
})();
