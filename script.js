const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav nav');
if (menu) menu.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const repoGrid = document.getElementById('repo-grid');
const repoStatus = document.getElementById('repo-status');
const username = 'dhilleswar07';
const featured = new Set([
  'AI-Based-Fraud-Detection-System-for-Online-Transactions-with-Real-Time-Alerts',
  'Resume_Analyzer_app'
]);

function escapeHtml(value='') {
  return value.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function repoCard(repo, index) {
  const desc = repo.description || 'GitHub project by Dhilleswar Jogi.';
  const lang = repo.language || 'Project';
  const updated = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString(undefined,{year:'numeric',month:'short'}) : '';
  return `<article class="repo-card ${featured.has(repo.name) ? 'repo-featured' : ''}">
    <div class="repo-top"><span class="repo-index">${String(index+1).padStart(2,'0')}</span><span class="repo-lang">${escapeHtml(lang)}</span></div>
    <h3>${escapeHtml(repo.name.replaceAll('_',' '))}</h3>
    <p>${escapeHtml(desc)}</p>
    <div class="repo-meta"><span>★ ${repo.stargazers_count}</span><span>⑂ ${repo.forks_count}</span><span>${escapeHtml(updated)}</span></div>
    <a class="project-link" href="${repo.html_url}" target="_blank" rel="noopener">View on GitHub ↗</a>
  </article>`;
}
async function loadRepositories() {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (!response.ok) throw new Error('GitHub API unavailable');
    const allRepos = await response.json();
    const repos = allRepos.filter(repo => {
      const normalized = repo.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normalized === 'dhilleswar07') return false;
      if (normalized.includes('resumeanalyzer')) return false;
      return true;
    });
    repoGrid.innerHTML = repos.map(repoCard).join('');
    repoStatus.textContent = `${repos.length} selected repositories`;
  } catch (error) {
    repoStatus.textContent = 'GitHub projects available on profile';
    repoGrid.innerHTML = `<article class="repo-error"><h3>Couldn’t load the live repository list.</h3><p>Open GitHub to see all current projects.</p><a class="project-link" href="https://github.com/${username}?tab=repositories" target="_blank" rel="noopener">View all repositories ↗</a></article>`;
  }
}
loadRepositories();
