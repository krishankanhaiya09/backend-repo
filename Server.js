import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "Register success" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({ message: "Login success", user });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000, () => {
  console.log("Server running");
});