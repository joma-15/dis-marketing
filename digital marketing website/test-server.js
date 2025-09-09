// Simple test script to verify server functionality
import fetch from "node-fetch";

async function testServer() {
  try {
    console.log("Testing server connection...");

    // Test if server is running
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test: "data" }),
    });

    console.log("Server response status:", response.status);
    const result = await response.text();
    console.log("Server response:", result);
  } catch (error) {
    console.log("Server test failed:", error.message);
    console.log("Make sure to start the server first with: npm start");
  }
}

testServer();
