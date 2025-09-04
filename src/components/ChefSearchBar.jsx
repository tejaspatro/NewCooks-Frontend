import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axiosApi from "../api/axiosConfig";

export default function ChefSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      axiosApi
        .get(`/chef/recipes/search?keyword=${encodeURIComponent(query)}`)
        .then((res) => {
          setResults(res.data);
          setShowResults(res.data.length > 0);
        })
        .catch(() => {
          setResults([]);
          setShowResults(false);
        });
    }, 300); // debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Hide dropdown if user clicks outside search container
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "250px" }}>
      <input
        type="search"
        className="form-control"
        placeholder="Search your recipes..."
        aria-label="Search your recipes"
        value={query}
        autoComplete="off"
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowResults(true)}
        spellCheck="false"
      />

      {showResults && results.length > 0 && (
        <ul
          className="list-group"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 1050,
            borderRadius: "0 0 0.25rem 0.25rem",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            backgroundColor: "white",
          }}
          role="listbox"
          aria-label="Search results"
        >
          {results.map((recipe) => (
            <li
              key={recipe.recipeId}
              className="list-group-item list-group-item-action"
              role="option"
              onMouseDown={(e) => e.preventDefault()} // Prevent input blur before click
            >
              <Link
                to={`/chef/recipes/${recipe.recipeId}`}
                className="text-decoration-none text-dark"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setShowResults(false);
                }}
                tabIndex={-1} // Prevent double tab stops in input and links
              >
                <strong>{recipe.title}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
