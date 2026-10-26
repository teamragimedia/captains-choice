const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BASE_URL = isLocalhost
  ? import.meta.env.VITE_SERVER_URL_LOCAL
  : import.meta.env.VITE_SERVER_URL;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder.png";

  // Preserve external image URLs
  if (/^https?:\/\//i.test(imagePath)) {
    // Replace the API hostname with the correct environment's hostname
    if (imagePath.includes("api.captainschoice.in")) {
      return imagePath.replace(
        /^https?:\/\/api\.captainschoice\.in/i,
        BASE_URL,
      );
    }

    return imagePath;
  }

  return `${BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};
