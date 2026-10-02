/**
 * Security and Authorization Automated Test Suite for Ayu Ceylon
 * Verifies that:
 * 1. Normal visitors cannot access /admin or call /api/admin/* (returns 403 Forbidden)
 * 2. Next.js middleware and server-side route guards reject unauthenticated requests
 * 3. Public storefront APIs and order placement work without login
 * 4. Admin authentication with bcrypt and httpOnly cookies succeeds and unlocks admin APIs
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function record(name: string, passed: boolean, details: string) {
  results.push({ name, passed, details });
  const icon = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${icon} | ${name}: ${details}`);
}

async function runSecurityTests() {
  console.log("=================================================");
  console.log("🛡️  Ayu Ceylon Security & Access Verification Test");
  console.log(`🌐  Target: ${BASE_URL}`);
  console.log("=================================================\n");

  // TEST 1: Unauthenticated request to GET /api/admin/medicines
  try {
    const res = await fetch(`${BASE_URL}/api/admin/medicines`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const status = res.status;
    const body = await res.json().catch(() => ({}));
    if (status === 403) {
      record(
        "Unauthorized API Access: GET /api/admin/medicines",
        true,
        `Returned HTTP 403 Forbidden as expected. Code: ${body.code || "FORBIDDEN"}`
      );
    } else {
      record(
        "Unauthorized API Access: GET /api/admin/medicines",
        false,
        `Expected 403, received ${status}`
      );
    }
  } catch (err: any) {
    record("Unauthorized API Access: GET /api/admin/medicines", false, err.message);
  }

  // TEST 2: Unauthenticated request to GET /api/admin/orders
  try {
    const res = await fetch(`${BASE_URL}/api/admin/orders`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const status = res.status;
    if (status === 403) {
      record(
        "Unauthorized API Access: GET /api/admin/orders",
        true,
        "Returned HTTP 403 Forbidden as expected."
      );
    } else {
      record(
        "Unauthorized API Access: GET /api/admin/orders",
        false,
        `Expected 403, received ${status}`
      );
    }
  } catch (err: any) {
    record("Unauthorized API Access: GET /api/admin/orders", false, err.message);
  }

  // TEST 3: Unauthenticated request to POST /api/admin/upload
  try {
    const res = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    const status = res.status;
    if (status === 403) {
      record(
        "Unauthorized Upload: POST /api/admin/upload",
        true,
        "Returned HTTP 403 Forbidden as expected."
      );
    } else {
      record(
        "Unauthorized Upload: POST /api/admin/upload",
        false,
        `Expected 403, received ${status}`
      );
    }
  } catch (err: any) {
    record("Unauthorized Upload: POST /api/admin/upload", false, err.message);
  }

  // TEST 4: Unauthenticated request to /admin UI page (should redirect to /login)
  try {
    const res = await fetch(`${BASE_URL}/admin`, {
      redirect: "manual",
    });
    const status = res.status;
    const location = res.headers.get("location");
    if (status === 307 || status === 302 || (location && location.includes("/login"))) {
      record(
        "Unauthorized UI Access: GET /admin",
        true,
        `Intercepted and redirected with status ${status} to: ${location}`
      );
    } else {
      record(
        "Unauthorized UI Access: GET /admin",
        false,
        `Expected redirect to /login, got status ${status}`
      );
    }
  } catch (err: any) {
    record("Unauthorized UI Access: GET /admin", false, err.message);
  }

  // TEST 5: Public Storefront API: GET /api/medicines (should succeed without login)
  let sampleMedicineId = "";
  try {
    const res = await fetch(`${BASE_URL}/api/medicines`);
    const data = await res.json();
    if (res.status === 200 && data.success && Array.isArray(data.medicines)) {
      sampleMedicineId = data.medicines[0]?.id || "";
      record(
        "Public API Access: GET /api/medicines",
        true,
        `Returned 200 OK with ${data.medicines.length} medicines.`
      );
    } else {
      record(
        "Public API Access: GET /api/medicines",
        false,
        `Unexpected response status: ${res.status}`
      );
    }
  } catch (err: any) {
    record("Public API Access: GET /api/medicines", false, err.message);
  }

  // TEST 6: Public Order Placement: POST /api/orders (should succeed without login)
  if (sampleMedicineId) {
    try {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "ටෙස්ට් පාරිභෝගිකයා (Test Customer)",
          customerPhone: "0771239999",
          address: "නො. 10, පන්සල පාර, නුගේගොඩ",
          city: "Nugegoda",
          notes: "Automated test order",
          paymentMethod: "COD",
          items: [{ medicineId: sampleMedicineId, quantity: 1 }],
        }),
      });
      const data = await res.json();
      if (res.status === 201 && data.success && data.orderNumber) {
        record(
          "Public Order Placement: POST /api/orders",
          true,
          `Order created successfully with reference: ${data.orderNumber}`
        );
      } else {
        record(
          "Public Order Placement: POST /api/orders",
          false,
          `Failed with status ${res.status}: ${JSON.stringify(data)}`
        );
      }
    } catch (err: any) {
      record("Public Order Placement: POST /api/orders", false, err.message);
    }
  }

  // TEST 7: Invalid Login Attempt (checks rate limiting / invalid credentials)
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "hacker@evil.com",
        password: "wrongpassword123",
      }),
    });
    const data = await res.json();
    if (res.status === 401 && data.code === "INVALID_CREDENTIALS") {
      record(
        "Brute Force / Invalid Login Rejection",
        true,
        `Rejected with 401 Unauthorized. Remaining attempts: ${data.remainingAttempts}`
      );
    } else {
      record(
        "Brute Force / Invalid Login Rejection",
        false,
        `Expected 401, got ${res.status}`
      );
    }
  } catch (err: any) {
    record("Brute Force / Invalid Login Rejection", false, err.message);
  }

  // TEST 8: Valid Owner Admin Login & Cookie Extraction
  let sessionCookie = "";
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@ayuceylon.lk",
        password: "AyuCeylon@Admin2026",
      }),
    });
    const data = await res.json();
    const setCookie = res.headers.get("set-cookie");
    if (res.status === 200 && data.success && setCookie) {
      sessionCookie = setCookie.split(";")[0];
      record(
        "Owner Admin Login: POST /api/auth/login",
        true,
        `Authenticated successfully! Received httpOnly session cookie: ${sessionCookie.slice(0, 30)}...`
      );
    } else {
      record(
        "Owner Admin Login: POST /api/auth/login",
        false,
        `Login failed: ${JSON.stringify(data)}`
      );
    }
  } catch (err: any) {
    record("Owner Admin Login: POST /api/auth/login", false, err.message);
  }

  // TEST 9: Authenticated Admin Request to GET /api/admin/medicines
  if (sessionCookie) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/medicines`, {
        method: "GET",
        headers: {
          Cookie: sessionCookie,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        record(
          "Authenticated Admin Access: GET /api/admin/medicines",
          true,
          `Successfully authorized! Retrieved ${data.medicines.length} medicines with admin privileges.`
        );
      } else {
        record(
          "Authenticated Admin Access: GET /api/admin/medicines",
          false,
          `Failed with status ${res.status}: ${JSON.stringify(data)}`
        );
      }
    } catch (err: any) {
      record("Authenticated Admin Access: GET /api/admin/medicines", false, err.message);
    }
  }

  console.log("\n=================================================");
  const allPassed = results.every((r) => r.passed);
  if (allPassed) {
    console.log("🎉 ALL SECURITY & ACCESS TESTS PASSED PERFECTLY! (9/9)");
  } else {
    console.log("⚠️ SOME TESTS FAILED. Check details above.");
  }
  console.log("=================================================");
}

runSecurityTests();
