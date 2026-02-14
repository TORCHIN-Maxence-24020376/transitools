const navItems = [
    {
        name: 'Accueil',
        url: 'index.html',
        icon: '<svg viewBox="0 0 24 24"><path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/></svg>'
    },
    {
        name: 'Couple Moteur',
        url: 'couple-moteur.html',
        icon: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.95s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>'
    },
    {
        name: 'Rapport Inter.',
        url: 'rapport-intervention.html',
        icon: '<svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>'
    },
];

function initNav() {
    const placeholder = document.getElementById('sidebar-placeholder');
    if (!placeholder) return;

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const sidebar = document.createElement('nav');
    sidebar.className = 'sidebar';

    const brand = document.createElement('a');
    brand.href = 'index.html';
    brand.className = 'brand';
    brand.innerHTML = `
        <img src="assets/img/logo-tim.svg" alt="Transitube">
    `;

    const links = document.createElement('div');
    links.className = 'nav-links';

    navItems.forEach(item => {
        const a = document.createElement('a');
        a.href = item.url;
        a.className = 'nav-item';
        if (currentPath === item.url) {
            a.classList.add('active');
        }
        a.innerHTML = `<span class="nav-icon">${item.icon}</span> ${item.name}`;
        links.appendChild(a);
    });

    // Theme Toggle
    const themeBtn = document.createElement('div');
    themeBtn.className = 'theme-toggle';
    themeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
        <span>Thème</span>
    `;
    themeBtn.onclick = toggleTheme;

    // Mobile menu toggle
    const mobileBtn = document.createElement('button');
    mobileBtn.className = 'mobile-menu-btn toggle-nav';
    mobileBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>';
    mobileBtn.onclick = () => {
        links.classList.toggle('open');
    };

    sidebar.appendChild(brand);
    sidebar.appendChild(mobileBtn);
    sidebar.appendChild(links);
    sidebar.appendChild(themeBtn);

    placeholder.replaceWith(sidebar);

    // Init theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

document.addEventListener('DOMContentLoaded', initNav);
