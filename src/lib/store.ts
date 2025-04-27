import { create } from "zustand";

export type EnvVariable = {
  id: string;
  key: string;
  required: boolean;
  serviceId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Service = {
  id: string;
  name: string;
  userId: string;
  variables: EnvVariable[];
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type ServiceStore = {
  services: Service[];
  getServices: () => Promise<void>;
};

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  getServices: async () => {
    try {
      const request = await fetch("/api/service");
      const response = await request.json();
      set({ services: response.services });
    } catch (error) {
      console.error(error);
    }
  },
}));
