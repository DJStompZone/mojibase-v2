
onmessage = (query, grid, $) => {
  grid.isotope({filter: $(`.grid-item[data-name*='${query}']`)})
  // grid.isotope({filter: elements.filter(s=>s.name.match(`${query}`))
}