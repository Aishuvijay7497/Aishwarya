const modal = document.getElementById('job-modal');
const addBtn = document.getElementById('add-job-btn');
const closeBtn = document.getElementById('close-modal');
const jobForm = document.getElementById('job-form');
const jobGrid = document.getElementById('job-grid');
const themeBtn = document.getElementById('theme-toggle');
const html = document.documentElement;

let jobs = JSON.parse(localStorage.getItem('jobs')) || [];
let currentFilter = 'All';

// Theme Toggle - matches CSS :root[data-theme="dark"]
function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeBtn.addEventListener('click', () => {
  const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// Load saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);
// Render job cards to the page
function renderJobs() {
  jobGrid.innerHTML = ''; // Clear old cards first
  
  let filteredJobs = currentFilter === 'All' 
    ? jobs 
    : jobs.filter(job => job.status === currentFilter);
  
  if (filteredJobs.length === 0) {
    jobGrid.innerHTML = `<p style="padding:2rem; text-align:center; color:var(--muted);">No jobs found</p>`;
    return;
  }
  
  filteredJobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'job-card'; // ← This makes your CSS work
    
    card.innerHTML = `
      <h3>${job.role}</h3>
      <p><strong>${job.company}</strong></p>
      <p>Status: ${job.status}</p>
      <p>Date: ${job.date}</p>
      ${job.link ? `<a href="${job.link}" target="_blank">View Job</a>` : ''}
      <button onclick="deleteJob(${job.id})">Delete</button>
    `;
    
    jobGrid.appendChild(card);
  });
}
// Delete a job
function deleteJob(id) {
  jobs = jobs.filter(job => job.id !== id);
  localStorage.setItem('jobs', JSON.stringify(jobs));
  renderJobs();
}

// Save new job from form
jobForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newJob = {
    id: Date.now(),
    company: document.getElementById('company').value,
    role: document.getElementById('role').value,
    status: document.getElementById('status').value,
    date: document.getElementById('date').value,
    link: document.getElementById('link').value
  };
  
  jobs.push(newJob);
  localStorage.setItem('jobs', JSON.stringify(jobs));
  
  jobForm.reset();
  modal.close();
  renderJobs();
});

renderJobs(); // Show cards on page load
// Load jobs when page opens
renderJobs();

// Modal controls
addBtn.addEventListener('click', () => modal.showModal());
closeBtn.addEventListener('click', () => modal.close());

// Your other job functions go here
// ... rest of your code