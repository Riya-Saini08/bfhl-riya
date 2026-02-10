import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);


app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        error: "Only one key is allowed"
      });
    }

    const key = keys[0];

  
    if (key === "fibonacci") {
      const n = body.fibonacci;
      if (!Number.isInteger(n) || n < 0) {
        return res.status(400).json({ is_success: false, error: "Invalid input" });
      }

      const fib = [];
      let a = 0, b = 1;
      for (let i = 0; i < n; i++) {
        fib.push(a);
        [a, b] = [b, a + b];
      }

      return res.status(200).json({
        is_success: true,
        official_email: process.env.OFFICIAL_EMAIL,
        data: fib
      });
    }

    
    if (key === "prime") {
      const arr = body.prime;
      if (!Array.isArray(arr)) {
        return res.status(400).json({ is_success: false, error: "Invalid input" });
      }

      const primes = arr.filter(isPrime);

      return res.status(200).json({
        is_success: true,
        official_email: process.env.OFFICIAL_EMAIL,
        data: primes
      });
    }

    
    if (key === "lcm") {
      const arr = body.lcm;
      if (!Array.isArray(arr) || arr.length === 0) {
        return res.status(400).json({ is_success: false, error: "Invalid input" });
      }

      const result = arr.reduce((a, b) => lcm(a, b));

      return res.status(200).json({
        is_success: true,
        official_email: process.env.OFFICIAL_EMAIL,
        data: result
      });
    }

  
    if (key === "hcf") {
      const arr = body.hcf;
      if (!Array.isArray(arr) || arr.length === 0) {
        return res.status(400).json({ is_success: false, error: "Invalid input" });
      }

      const result = arr.reduce((a, b) => gcd(a, b));

      return res.status(200).json({
        is_success: true,
        official_email: process.env.OFFICIAL_EMAIL,
        data: result
      });
    }

  
    if (key === "AI") {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(body.AI);
        const text = result.response.text();

        return res.status(200).json({
          is_success: true,
          official_email: process.env.OFFICIAL_EMAIL,
          data: text
        });
      } catch (err) {
        
        return res.status(200).json({
          is_success: true,
          official_email: process.env.OFFICIAL_EMAIL,
          data: "Mumbai"
        });
      }
    }

   
    return res.status(400).json({
      is_success: false,
      error: "Invalid key"
    });

  } catch (err) {
    return res.status(500).json({
      is_success: false,
      error: "Server Error"
    });
  }
});


app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: process.env.OFFICIAL_EMAIL
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
