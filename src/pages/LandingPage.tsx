import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { useState } from 'react';
import { API_BASE_URL } from '../config';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (riotId: string, tagline: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // We verify the user exists before navigating
            // This prevents navigating to a 404 page, although we could also just navigate and let ProfilePage handle it
            // For now, let's keep the verification to show error on Landing Page
            console.log(`Looking up player: ${riotId}#${tagline}`);
            const response = await fetch(`${API_BASE_URL}/api/v1/players/${encodeURIComponent(riotId)}/${encodeURIComponent(tagline)}`);

            if (!response.ok) {
                throw new Error('Player not found. Please check your Riot ID and Tagline.');
            }

            // If found, just navigate. ProfilePage will re-fetch data (or we could pass state, but URL source of truth is better for bookmarks)
            // URL encoding is important for names with spaces
            navigate(`/profile/${encodeURIComponent(riotId)}-${encodeURIComponent(tagline)}`);

        } catch (err) {
            console.error('Failed to verify player:', err);
            setError(err instanceof Error ? err.message : 'Failed to find player');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <HeroSection
            onSearch={handleSearch}
            isLoading={isLoading}
            error={error}
        />
    );
};

export default LandingPage;
