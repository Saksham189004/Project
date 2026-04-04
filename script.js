const API_KEY = "FBNMht39wlZcXHQiAHqD4febhzQiWfRd9ZzpzZPNJeow4KaV12Y";
let matchesData = [];

const container = document.getElementById("matches");
const loader = document.getElementById("loader");

async function getMatches() {
  try {
    const res = await fetch(`https://api.pandascore.co/matches?token=${API_KEY}`);
    const data = await res.json();
    console.log(data);
    matchesData = data;
    loader.style.display = "none";
    displayMatches(matchesData);
  } catch (err) {
    loader.innerText = "Error loading data";
  }
}

function displayMatches(matches) {
  container.innerHTML = "";

  matches.map(match => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${match.name || "Match"}</h3>
      <p>${match.videogame.name}</p>
      <p>Status: ${match.status}</p>
      <p>${new Date(match.begin_at).toLocaleString()}</p>
      <button onclick='saveFavorite(${JSON.stringify(match)})'>❤️ Favorite</button>
    `;

    container.appendChild(div);
  });
}

// SEARCH
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = matchesData.filter(match =>
    (match.name || "").toLowerCase().includes(value)
  );

  displayMatches(filtered);
});

// FILTER
document.getElementById("filter").addEventListener("change", (e) => {
  const game = e.target.value;

  if (!game) return displayMatches(matchesData);

  const filtered = matchesData.filter(match =>
    match.videogame.slug.includes(game)
  );

  displayMatches(filtered);
});

// SORT
function sortByDate() {
  const sorted = [...matchesData].sort((a, b) =>
    new Date(a.begin_at) - new Date(b.begin_at)
  );

  displayMatches(sorted);
}

// FAVORITE
function saveFavorite(match) {
  let favs = JSON.parse(localStorage.getItem("favs")) || [];
  favs.push(match);
  localStorage.setItem("favs", JSON.stringify(favs));
  alert("Saved!");
}

getMatches();
