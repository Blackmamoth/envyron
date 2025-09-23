import * as Go from "./go";
import * as TS from "./ts";
import * as Env from "./env";
import * as Python from "./py";
import type { EnvVariable, Service } from "@/db/schema";

export const ConfigGenerator: {
  [key: string]: (
    servicesArr: string[],
    projectItems: Service[],
    serviceVariables: Record<string, EnvVariable[]>,
    variableConfigs: Record<
      string,
      Record<string, { included: boolean; required: boolean }>
    >,
  ) => string;
} = {
  TypeScript: TS.generateConfig,
  Go: Go.generateConfig,
  Env: Env.generateConfig,
  Python: Python.generateConfig,
};
