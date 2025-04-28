// Example project data
const projects = [
    { name: "To-Do List App", link: "https://github.com/brookeslight/todo-app" },
    { name: "Weather App", link: "https://github.com/brookeslight/weather-app" },
    { name: "Portfolio Site", link: "https://github.com/brookeslight/portfolio" }
];

// Dynamically add projects to the page
const projectList = document.getElementById('project-list');

projects.forEach(project => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${project.link}" target="_blank">${project.name}</a>`;
    projectList.appendChild(li);
});
