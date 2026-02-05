import { create } from 'zustand';
import { createWorkshop, updateWorkshop } from '@/api/workshops.api';

interface WorkshopState {
  isLoading: boolean;
  error: string | null;
  create: (
    workshop: Omit<Workshop, 'id' | 'host' | 'participants'>,
  ) => Promise<Workshop>;
  update: (id: string, workshop: Partial<Workshop>) => Promise<Workshop>;
}

export const useWorkshopStore = create<WorkshopState>((set) => ({
  isLoading: false,
  error: null,

  create: async (workshop) => {
    set({ isLoading: true, error: null });
    try {
      const newWorkshop = await createWorkshop(workshop);
      set({ isLoading: false });
      return newWorkshop;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  update: async (id, workshop) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await updateWorkshop(id, workshop);
      set({ isLoading: false });
      return updated;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
