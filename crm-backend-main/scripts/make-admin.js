// Promote a registered user to admin, or create a new admin account.
// Usage:
//   npm run make-admin -- someone@company.com                       (promote existing user)
//   npm run make-admin -- someone@company.com Password123 First Last (create if missing)
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

(async () => {
  const [email, password, firstName = "Admin", lastName = "User"] = process.argv.slice(2);
  if (!email) {
    console.error("Usage: npm run make-admin -- <email> [password] [firstName] [lastName]");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  let user = await User.findOneAndUpdate({ email }, { role: "admin" }, { returnDocument: "after" });
  if (user) {
    console.log(`✅ ${user.email} is now an admin`);
  } else if (password) {
    if (password.length < 6) {
      console.error("❌ Password must be at least 6 characters");
      process.exit(1);
    }
    user = await User.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 12),
      role: "admin",
    });
    console.log(`✅ Created admin account ${user.email}`);
  } else {
    console.log(`❌ No user found with email ${email} (pass a password to create one)`);
  }

  await mongoose.disconnect();
  process.exit(user ? 0 : 1);
})();
