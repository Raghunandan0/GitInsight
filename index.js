// const url = "https://api.github.com/users";
// const searchInputEl = document.getElementById("searchInput");
// const searchButtonEl = document.getElementById("searchBtn");
// const profileContainerEl = document.getElementById("profileContainer");
// const loadingEl = document.getElementById("loading");

// const generateProfile = (profile) => {
//   return `
//    <div class="profile-box">
//    <div class="top-section">
//      <div class="left">
//        <div class="avatar">
//          <img alt="avatar" src="${profile.avatar_url}" />
//        </div>
//        <div class="self">
//          <h1>${profile.name}</h1>
//          <h1>@${profile.login}</h1>
//        </div>
//      </div>
//      <a href="${profile.html_url}" target="_black">
//      <button class="primary-btn">Check Profile</button>
//      </a>
//    </div>

//    <div class="about">
//      <h2>About</h2>
//      <p>
//      ${profile.bio}
//      </p>
//    </div>
//    <div class="status">
//      <div class="status-item">
//        <h3>Followers</h3>
//        <p>${profile.followers}</p>
//      </div>
//      <div class="status-item">
//        <h3>Followings</h3>
//        <p>${profile.following}</p>
//      </div>
//      <div class="status-item">
//        <h3>Repos</h3>
//        <p>${profile.public_repos}</p>
//      </div>
//    </div>
//  </div>
//    `;
// };

// const fetchProfile = async () => {
//   const username = searchInputEl.value;

//   loadingEl.innerText = "loading.....";
//   loadingEl.style.color = "black";

//   try {
//     const res = await fetch(`${url}/${username}`);
//     const data = await res.json();
//     if (data.bio) {
//       loadingEl.innerText = "";
//       profileContainerEl.innerHTML = generateProfile(data);
//     } else {
//       loadingEl.innerHTML = data.message;
//       loadingEl.style.color = "red";
//       profileContainerEl.innerText = "";
//     }

//     console.log("data", data);
//   } catch (error) {
//     console.log({ error });
//     loadingEl.innerText = "";
//   }
// };

// searchButtonEl.addEventListener("click", fetchProfile);







const API_URL = "https://api.github.com/users";
const searchInputEl = document.getElementById("searchInput");
const searchButtonEl = document.getElementById("searchBtn");
const profileContainerEl = document.getElementById("profileContainer");
const loadingEl = document.getElementById("loading");
const themeToggle = document.getElementById("themeToggle");

const generateProfile = (profile, repos, followers, events) => `
  <div class="profile-box">
    <div class="top-section">
      <div class="avatar"><img src="${profile.avatar_url}" alt="Avatar"></div>
      <h2>${profile.name || "No Name"} (@${profile.login})</h2>
      <p>${profile.bio || "No bio available"}</p>
      <a href="${profile.html_url}" target="_blank"><button class="primary-btn">View Profile</button></a>
    </div>

    <div class="status">
      <h3>Stats</h3>
      <p>Followers: ${profile.followers} | Following: ${profile.following} | Repos: ${profile.public_repos}</p>
    </div>

    <div class="repos">
      <h3>Top Repositories</h3>
      ${repos.map(r => `<div class="repo"><a href="${r.html_url}" target="_blank">${r.name}</a> ⭐${r.stargazers_count}</div>`).join("")}
    </div>

    <div class="followers">
      <h3>Followers</h3>
      ${followers.slice(0, 5).map(f => `<img src="${f.avatar_url}" title="${f.login}" width="40" />`).join("")}
    </div>

    <div class="activity">
      <h3>Recent Activity</h3>
      ${events.slice(0, 3).map(e => `<p>${e.type} at ${e.repo.name}</p>`).join("")}
    </div>

    <div class="graph">
      <h3>Contribution Graph</h3>
      <img src="https://ghchart.rshah.org/${profile.login}" alt="GitHub Graph">
    </div>
  </div>
`;

async function fetchProfile() {
  const username = searchInputEl.value.trim();
  if (!username) return (loadingEl.innerText = "Enter a username");

  loadingEl.innerText = "Loading...";

  try {
    const [profileRes, repoRes, followerRes, eventRes] = await Promise.all([
      fetch(`${API_URL}/${username}`),
      fetch(`${API_URL}/${username}/repos?sort=stars&per_page=5`),
      fetch(`${API_URL}/${username}/followers`),
      fetch(`${API_URL}/${username}/events/public`)
    ]);

    if (!profileRes.ok) throw new Error("User not found");

    const profile = await profileRes.json();
    const repos = await repoRes.json();
    const followers = await followerRes.json();
    const events = await eventRes.json();

    loadingEl.innerText = "";
    profileContainerEl.innerHTML = generateProfile(profile, repos, followers, events);

  } catch (error) {
    loadingEl.innerText = error.message;
    profileContainerEl.innerHTML = "";
  }
}

searchButtonEl.addEventListener("click", fetchProfile);
searchInputEl.addEventListener("keypress", e => e.key === "Enter" && fetchProfile());

// Dark/Light theme toggle
themeToggle.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-theme") === "light") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
});







