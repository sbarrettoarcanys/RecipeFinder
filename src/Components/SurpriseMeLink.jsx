import { memo } from "react";
import { NavLink } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { getRandomRecipeQueryOption } from "../Hooks/ApiCalls.js";
import { logError } from "../Utils/ErrorLogger.js";

// Renders a normal SPA NavLink to /random, but prefetches a fresh random
// recipe on hover/focus/click so the fetch races ahead of the lazy-loaded
// Random page instead of starting after it lands.
export const SurpriseMeLink = memo(function SurpriseMeLink({
  className = "nav-btn",
  children,
}) {
  const queryClient = useQueryClient();

  function prefetch() {
    queryClient.query({ ...getRandomRecipeQueryOption() }).catch((error) => {
      logError(error, {
        route: "SurpriseMeLink",
        Action: "getRandomRecipeQueryOption",
      });
    });
  }

  return (
    <NavLink
      className={className}
      to="/random"
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onClick={prefetch}
    >
      {children}
    </NavLink>
  );
});
