const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BASE_URL = isLocalhost
  ? "http://localhost:5000"
  : "https://api.captainschoice.in";

export default BASE_URL;
