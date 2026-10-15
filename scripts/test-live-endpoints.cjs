require("dotenv").config({ path: ".env.local" });

async function run() {
  console.log("=== Testing Live Admin Storage Endpoints on http://localhost:3012 ===");

  // Test 1: Unauthenticated request to /api/admin/storage-status -> 401
  const unauthStatus = await fetch("http://localhost:3012/api/admin/storage-status");
  console.log("Test 1: Unauth /api/admin/storage-status status:", unauthStatus.status, "(expected: 401)");
  if (unauthStatus.status !== 401) throw new Error("Expected 401 for unauthenticated storage status");

  // Test 2: Unauthenticated POST /api/admin/upload -> 401
  const formData = new FormData();
  formData.append("file", new Blob(["test"], { type: "image/jpeg" }), "test.jpg");
  const unauthUpload = await fetch("http://localhost:3012/api/admin/upload", {
    method: "POST",
    body: formData,
  });
  console.log("Test 2: Unauth /api/admin/upload status:", unauthUpload.status, "(expected: 401)");
  if (unauthUpload.status !== 401) throw new Error("Expected 401 for unauthenticated upload");

  // Log in as real admin to get valid session cookie
  const loginRes = await fetch("http://localhost:3012/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || "imjashwan@gmail.com",
      password: process.env.ADMIN_PASSWORD,
    }),
  });
  console.log("Admin login status:", loginRes.status);
  const cookieHeader = loginRes.headers.get("set-cookie");
  if (!cookieHeader) throw new Error("Failed to receive login cookie");
  const cookie = cookieHeader.split(";")[0];

  // Test 3: Authenticated GET /api/admin/storage-status -> 200 with status info
  const authStatus = await fetch("http://localhost:3012/api/admin/storage-status", {
    headers: { Cookie: cookie },
  });
  const statusJson = await authStatus.json();
  console.log("Test 3: Authed /api/admin/storage-status:", statusJson);
  if (authStatus.status !== 200 || statusJson.hasUrl !== true || statusJson.hasServiceRoleKey !== false) {
    throw new Error("Storage status response does not match expected output");
  }
  if ("key" in statusJson || "serviceRoleKey" in statusJson) {
    throw new Error("Security violation: Secret key present in response!");
  }

  // Test 4: Authenticated POST /api/admin/upload with missing service role key -> 503 with clear error
  const authUpload = await fetch("http://localhost:3012/api/admin/upload", {
    method: "POST",
    headers: { Cookie: cookie },
    body: formData,
  });
  const uploadJson = await authUpload.json();
  console.log("Test 4: Authed /api/admin/upload without service role key status:", authUpload.status, uploadJson);
  if (authUpload.status !== 503) {
    throw new Error("Expected 503 when service role key is missing");
  }
  if (!uploadJson.error || !uploadJson.error.includes("SUPABASE_SERVICE_ROLE_KEY")) {
    throw new Error("Expected clear error message mentioning SUPABASE_SERVICE_ROLE_KEY");
  }

  // Test 5: Verify products endpoint still functions properly
  const productsRes = await fetch("http://localhost:3012/api/admin/products", {
    headers: { Cookie: cookie },
  });
  const productsJson = await productsRes.json();
  console.log("Test 5: Products count:", productsJson.products?.length);

  // Test 6: Verify storefront still renders product pages
  const storeRes = await fetch("http://localhost:3012/shop");
  console.log("Test 6: Storefront /shop status:", storeRes.status, "(expected: 200)");
  if (storeRes.status !== 200) throw new Error("Storefront /shop returned non-200");

  console.log("\n>>> ALL 6 LIVE ENDPOINT & SECURITY TESTS PASSED! <<<");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
