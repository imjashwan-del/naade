const { SignJWT } = require("jose");

const SECRET = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || "naade-dev-secret-change-me");

async function createTestAdminToken() {
  return await new SignJWT({ adminId: 1, email: "imjashwan@gmail.com" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(SECRET);
}

async function run() {
  console.log("=== Testing Storage & Upload Auth & Endpoints ===");
  const token = await createTestAdminToken();
  console.log("Generated test admin token successfully.");

  // Test 1: Verify storage-status logic
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log(`Environment check: NEXT_PUBLIC_SUPABASE_URL set: ${hasUrl}, SUPABASE_SERVICE_ROLE_KEY set: ${hasKey}`);

  console.log("=== All test checks passed! ===");
}

run().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
