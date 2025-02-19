import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loader() {
  const filePath = path.join(__dirname, "..", "chatflow-loader.js");

  try {
    let script = fs.readFileSync(filePath, "utf8");
    const DOMAIN_REPLACE = process.env.DOMAIN
      ? process.env.DOMAIN
      : "http://localhost:5173";
    script = script.replace("DOMAIN_REPLACE", DOMAIN_REPLACE);
    return new Response(script, {
      headers: {
        "Content-Type": "application/javascript",
      },
    });
  } catch (error) {
    console.error("Erro ao carregar o script:", error);
    return new Response("Erro ao carregar o chatbot", {
      headers: { "Content-Type": "application/javascript" },
      status: 500,
    });
  }
}
