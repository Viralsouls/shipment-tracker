// This script will handle some basic interactivity on the page.

// Wait for the DOM to fully load before running any scripts
document.addEventListener("DOMContentLoaded", () => {
  const loadTableBody = document.getElementById("loadTableBody");

  // Check if we have a table to populate
  if (loadTableBody) {
    console.log("Table body found, ready to populate loads.");
  }

  // You can implement more dynamic actions here, like sorting the table or filtering the loads.
});
