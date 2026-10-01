// Promote a registered user to admin.
// Usage: npm run make-admin -- someone@company.com
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");

(async () => {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npm run make-admin -- <email>");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { returnDocument: 'after' });
  console.log(user ? `✅ ${user.email} is now an admin` : `❌ No user found with email ${email}`);
  await mongoose.disconnect();
  process.exit(user ? 0 : 1);
})();
