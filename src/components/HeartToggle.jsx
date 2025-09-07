import { useState, useEffect } from "react";
import axiosApi from "../api/axiosConfig";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Swal from "sweetalert2";

export default function HeartToggle({ recipeId, darkMode }) {
    const [favorited, setFavorited] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch initial favorites on mount
    useEffect(() => {
        let mounted = true;
        axiosApi
            .get("/user/favourites")
            .then(res => {
                if (mounted) {
                    const favIds = res.data.map(r => r.recipeId);
                    setFavorited(favIds.includes(recipeId));
                }
            })
            .catch(err => console.error(err));

        return () => {
            mounted = false;
        };
    }, [recipeId]);

    const toggleFavorite = async () => {
        if (loading) return;

        setFavorited(prev => !prev); // Optimistic update
        setLoading(true);

        try {
            await axiosApi.post(`/user/favourites/${recipeId}`);

            // Optional: re-fetch to sync with backend
            const favRes = await axiosApi.get("/user/favourites");
            const favIds = favRes.data.map(r => r.recipeId);
            setFavorited(favIds.includes(recipeId));
        } catch (err) {
            setFavorited(prev => !prev); // Revert on error
            Swal.fire("Error", "Failed to update favorites", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={toggleFavorite}
            style={{
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "1.5rem",
                color: favorited ? "red" : darkMode ? "white" : "grey",
                transition: "transform 0.2s",
                opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={e => !loading && (e.currentTarget.style.transform = "scale(1)")}
            title={favorited ? "Remove from favorites" : "Add to favorites"}
        >
            {favorited ? <FaHeart /> : <FaRegHeart />}
        </div>
    );
}
