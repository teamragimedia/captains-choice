console.log("INDEX FILE LOADED");

try {
  require("./server");
  console.log("SERVER FILE LOADED");
} catch (err) {
  console.error("SERVER LOAD ERROR:", err);
}
