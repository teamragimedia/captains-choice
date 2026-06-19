module.exports = (orderId) => {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  return `CC${yyyy}${mm}${dd}${String(orderId).padStart(4, "0")}`;
};
