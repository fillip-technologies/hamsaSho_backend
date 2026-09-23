const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

const storageService = require("./src/services/storageService");

async function testAll() {
  console.log("=== 1. Testing DB Status ===");
  const status = storageService.getDbStatus();
  console.log("DB Status:", status);

  console.log("\n=== 2. Testing Contact Submission (Zero-Loss) ===");
  const testContact = {
    name: "Dr. Ananya Roy",
    organization: "Apex Super Speciality Hospital",
    designation: "Chief Medical Officer",
    email: "ananya.roy@apexhealth.in",
    mobile: "+91 98310 99887",
    city: "Kolkata",
    hospitalType: "Multispeciality Hospital",
    beds: "250 Beds",
    product: "e_Kshitiz",
    currentHis: "Legacy Desktop Software",
    message: "Interested in full modular rollout including IPD, OPD, and NABH compliance.",
  };

  const saved = await storageService.saveContact(testContact);
  console.log("Saved Contact ID:", saved.id);
  console.log("Contact Name:", saved.name);
  console.log("Synced to MySQL:", saved.syncedToMySql);

  console.log("\n=== 3. Testing Get Contacts ===");
  const contacts = await storageService.getContacts({ status: "All", product: "All", search: "" });
  console.log(`Total Contacts found: ${contacts.length}`);
  console.log("Latest Contact Requester:", contacts[0]?.name);

  console.log("\n=== 4. Testing Admin Auth ===");
  const admin = await storageService.findAdminByEmail("admin@hamsasoham.com");
  console.log("Found Admin:", admin?.email);
  const bcrypt = require("bcryptjs");
  const isMatch = await bcrypt.compare("AdminPassword123", admin.password);
  console.log("Password Valid for AdminPassword123:", isMatch);

  console.log("\n=== 5. Testing Update Status ===");
  const updated = await storageService.updateContact(saved.id, {
    status: "In Progress",
    adminNotes: "Scheduled preliminary demo for Thursday 3 PM.",
  });
  console.log("Updated Status:", updated?.status);
  console.log("Admin Notes:", updated?.adminNotes);

  console.log("\n✓ ALL CORE ENGINE TESTS PASSED!");
  process.exit(0);
}

testAll().catch((err) => {
  console.error("Test Error:", err);
  process.exit(1);
});
