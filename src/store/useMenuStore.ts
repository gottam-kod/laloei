import { useAuthStore } from "./useAuthStore";

export const useMenu = (name?: string) => {

     const profile = useAuthStore((s) => s.profile);
    if (name){
        return profile?.menus?.filter((m)=> m.parent_key == name);
    }

    return profile?.menus?.filter((m)=> m.parent_key == null);

}