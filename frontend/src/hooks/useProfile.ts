import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface UserProfile {
    id?: string;
    name: string;
    nameAr?: string;
    headline: string;
    headlineAr?: string;
    bio: string;
    bioAr?: string;
    heroBio?: string;    // Hero section description paragraph (EN)
    heroBioAr?: string;  // Hero section description paragraph (AR)
    heroBioCyan?: string;    // Word(s) to highlight in cyan
    heroBioViolet?: string;  // Word(s) to highlight in violet
    heroRoles?: string[];    // Typing animation roles list
    location: string;
    locationAr?: string;
    availability: string;
    availabilityAr?: string;
    email: string;
    phone?: string;
    // Hero stats
    yearsExp?: number;
    projectsCount?: number;
    technologiesCount?: number;
    countriesCount?: number;
    social: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
        telegram?: string;
        facebook?: string;
        instagram?: string;
        whatsapp?: string;
    };
}

/**
 * Shared hook — fetches the single site profile.
 * All components use this so a single admin save (which invalidates ["profile"])
 * instantly updates Hero, Navbar, Footer, Contact simultaneously.
 */
export function useProfile() {
    const { data, isLoading } = useQuery<UserProfile | null>({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await api.get("/portfolio/profile");
            const arr = Array.isArray(res.data) ? res.data : [res.data];
            return arr[0] ?? null;
        },
        staleTime: 5 * 60 * 1000,
    });
    return { profile: data ?? null, isLoading };
}
