import { create } from "zustand";

interface SidebarState {
    isOpen: boolean;
    toggleSideBar: () => void;
}

export const useSidebar = create<SidebarState>((set) => ({
    isOpen: false,
    toggleSideBar: () => set((state) => ({ isOpen: !state.isOpen}))
}))