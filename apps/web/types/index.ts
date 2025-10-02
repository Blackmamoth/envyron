export type PreviewType = ".env" | "TypeScript" | "Go" | "Python";

export type Item = {
  name: string;
  description?: string;
};

export * from "./db";
export * from "./validation";
