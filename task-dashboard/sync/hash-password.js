#!/usr/bin/env node

/**
 * Password Hash Utility
 *
 * Generates a SHA-256 hash of a password for use with the task dashboard.
 * Run: node sync/hash-password.js <password>
 *
 * Then set the hash as a Cloudflare secret:
 * wrangler secret put PASSWORD_HASH
 */

import crypto from "crypto";
import readline from "readline";

async function hashPassword(password) {
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  return hash;
}

async function main() {
  let password = process.argv[2];

  if (!password) {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    password = await new Promise((resolve) => {
      rl.question("Enter password to hash: ", (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  if (!password) {
    console.error("No password provided");
    process.exit(1);
  }

  const hash = await hashPassword(password);

  console.log("\n=== Password Hash ===");
  console.log(hash);
  console.log("\n=== Next Steps ===");
  console.log("1. Set this as a Cloudflare secret:");
  console.log("   wrangler secret put PASSWORD_HASH");
  console.log("   (paste the hash when prompted)\n");
  console.log("2. Also set a JWT secret:");
  console.log("   wrangler secret put JWT_SECRET");
  console.log("   (use any random string, e.g., from: openssl rand -hex 32)\n");
}

main();
