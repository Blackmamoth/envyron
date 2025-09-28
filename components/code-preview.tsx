"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const codeSnippets = [
  {
    title: ".env",
    language: "bash",
    code: `# POSTGRES CONFIGURATION
POSTGRES_USER = 
POSTGRES_PASSWORD = 
POSTGRES_HOST = 127.0.0.1
POSTGRES_PORT = 5432
POSTGRES_SSLMODE = 

# GOOGLE_AUTH CONFIGURATION
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET = 
GOOGLE_REDIRECT_URI = 

# LOGGING CONFIGURATION
LOG_LEVEL = 
LOG_PATH = 
LOG_FILE =`,
  },
  {
    title: "TypeScript",
    language: "typescript",
    code: `import 'dotenv/config';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {

		// POSTGRES Config
		POSTGRES_USER: z.string(),
		POSTGRES_PASSWORD: z.string(),
		POSTGRES_HOST: z.string().optional().default('127.0.0.1'),
		POSTGRES_PORT: z.string().optional().default('5432'),
		POSTGRES_SSLMODE: z.string().optional(),

		// GOOGLE_AUTH Config
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
		GOOGLE_REDIRECT_URI: z.url(),

		// LOGGING Config
		LOG_LEVEL: z.string().optional(),
		LOG_PATH: z.string().optional(),
		LOG_FILE: z.string().optional(),
	},
	runtimeEnv: process.env,
});`,
  },
  {
    title: "Go",
    language: "go",
    code: `package config

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type PostgresConfiguration struct {
	POSTGRES_USER string \`envconfig:"POSTGRES_USER" required:"true"\`
	POSTGRES_PASSWORD string \`envconfig:"POSTGRES_PASSWORD" required:"true"\`
	POSTGRES_HOST string \`envconfig:"POSTGRES_HOST" default:"127.0.0.1"\`
	POSTGRES_PORT string \`envconfig:"POSTGRES_PORT" default:"5432"\`
	POSTGRES_SSLMODE string \`envconfig:"POSTGRES_SSLMODE"\`
}

type GoogleAuthConfiguration struct {
	GOOGLE_CLIENT_ID string \`envconfig:"GOOGLE_CLIENT_ID" required:"true"\`
	GOOGLE_CLIENT_SECRET string \`envconfig:"GOOGLE_CLIENT_SECRET" required:"true"\`
	GOOGLE_REDIRECT_URI string \`envconfig:"GOOGLE_REDIRECT_URI" required:"true"\`
}

var (
	PostgresConfig PostgresConfiguration
	GoogleAuthConfig GoogleAuthConfiguration
)

func init() {
	loadEnv()
}

func loadEnv() {
	godotenv.Load()

	if err := envconfig.Process("", &PostgresConfig); err != nil {
		log.Fatalf("An error occured hile loading environment variables: %v", err)
	}

	if err := envconfig.Process("", &GoogleAuthConfig); err != nil {
		log.Fatalf("An error occured hile loading environment variables: %v", err)
	}
}`,
  },
  {
    title: "Python",
    language: "python",
    code: `from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, HttpUrl, EmailStr

class PostgresConfig(BaseSettings):
	model_config = SettingsConfigDict(env_file='.env',case_sensitive=True,extra='ignore')

	POSTGRES_USER: str
	POSTGRES_PASSWORD: str
	POSTGRES_HOST: Optional[str] = '127.0.0.1'
	POSTGRES_PORT: Optional[str] = '5432'
	POSTGRES_SSLMODE: Optional[str] = None

class GoogleAuthConfig(BaseSettings):
	model_config = SettingsConfigDict(env_file='.env',case_sensitive=True,extra='ignore')

	GOOGLE_CLIENT_ID: str
	GOOGLE_CLIENT_SECRET: str
	GOOGLE_REDIRECT_URI: HttpUrl

class LoggingConfig(BaseSettings):
	model_config = SettingsConfigDict(env_file='.env',case_sensitive=True,extra='ignore')

	LOG_LEVEL: Optional[str] = None
	LOG_PATH: Optional[str] = None
	LOG_FILE: Optional[str] = None

postgres_config = PostgresConfig()
google_auth_config = GoogleAuthConfig()
logging_config = LoggingConfig()`,
  },
];
export function CodePreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % codeSnippets.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentSnippet = codeSnippets[currentIndex];

  return (
    <Card className="bg-[var(--envyron-navy)]/80 border-[var(--envyron-teal)]/30 backdrop-blur-sm hover:border-[var(--envyron-light-teal)]/50 transition-all duration-500">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-[var(--envyron-light-teal)] text-sm font-mono">
            {currentSnippet.title}
          </span>
        </div>

        <div className="relative min-h-[300px]">
          <pre
            className={`text-sm font-mono text-white overflow-x-auto transition-all duration-300 ${
              isAnimating ? "fade-out-slide" : "fade-in-slide"
            }`}
          >
            <code className="whitespace-pre-wrap break-words">
              {currentSnippet.code}
            </code>
          </pre>

          {/* Fade transition overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--envyron-navy)]/20 pointer-events-none" />
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 mt-4">
          {codeSnippets.map((value, index) => (
            <div
              key={value.title}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[var(--envyron-light-teal)] pulse-animate"
                  : "bg-[var(--envyron-teal)]/50 hover:bg-[var(--envyron-teal)]"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
