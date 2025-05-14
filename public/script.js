document.getElementById('search').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const rows = document.querySelectorAll('#shipmentTable tr');

  rows.forEach(row => {
    const cells = Array.from(row.getElementsByTagName('td'));
    const match = cells.some(cell => cell.textContent.toLowerCase().includes(query));
    row.style.display = match ? '' : 'none';
  });
});
