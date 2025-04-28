import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { EnvVariable, Service } from "./store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: Date) {
  const distance = formatDistanceToNow(date, { addSuffix: true });
  return distance;
}

export const generateEnvContent = (
  services: Service[],
  activeServices: Record<string, boolean>,
) => {
  let content = "";
  if (services) {
    services.forEach((service) => {
      if (activeServices[service.id]) {
        content += `# ${service.name}\n`;
        service.variables.forEach((variable) => {
          content += `${variable.key}=\n`;
        });
        content += "\n";
      }
    });
  }
  return content.trim();
};

export const generatePythonCode = (envVars: EnvVariable[]) => {
  return `import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Access environment variables
${envVars.map((v) => `${v.key} = os.getenv("${v.key}")`).join("\n")}`;
};

export const generateJSCode = (envVars: EnvVariable[]) => {
  return `// Using dotenv with Node.js
require('dotenv').config()

// Access environment variables
${envVars.map((v) => `const ${v.key.toLowerCase()} = process.env.${v.key}`).join("\n")}`;
};

export const generateGolangCode = (envVars: EnvVariable[]) => {
  return `package main

import (
\t"fmt"
\t"os"

\t"github.com/joho/godotenv"
)

func main() {
\t// Load environment variables from .env file
\terr := godotenv.Load()
\tif err != nil {
\t\tfmt.Println("Error loading .env file")
\t}

\t// Access environment variables
${envVars.map((v) => `\t${v.key.toLowerCase()} := os.Getenv("${v.key}")`).join("\n")}
}`;
};
