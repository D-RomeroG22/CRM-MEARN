const mongoose = require("mongoose");
const User = require("./models/User");
const Admin = require("./models/Admin");
const readline = require("readline");

const cors = require('cors');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

mongoose.connect(
  process.env.NODE_ENV === "production"
    ? keys.mongoURI
    : "mongodb://mongodb:27017/crm-coffee", { useUnifiedTopology: true, useNewUrlParser: true, serverSelectionTimeoutMS: 5000, dbName: 'crm-coffee' }
);

const toggleAdminStatus = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return;
    }

    let admin = await Admin.findOne({ user: user._id });

    if (admin) {
      await Admin.findByIdAndDelete(admin._id);
      await User.updateOne({ _id: user._id }, { $set: { admin: false } });
    } else {
      admin = new Admin({ user: user._id });
      await admin.save();
      await User.updateOne({ _id: user._id }, { $set: { admin: true } });
    }
  } catch (error) { } finally {
    mongoose.disconnect();
  }
};

rl.question("Ingrese el correo electrónico del usuario: ", (email) => {
  toggleAdminStatus(email).then(() => rl.close());
});
