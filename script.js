// Project Tracker Data
const projectData = {
    weeks: [
        { week: 1, task: "Infrastructure Setup & Domain Configuration", completed: true },
        { week: 2, task: "Lion Cage Courier App Development", completed: true },
        { week: 3, task: "Lion Cage Security App Development", completed: true },
        { week: 4, task: "Final Testing & Marketing Launch Prep", completed: false }
    ],
    totalWeeks: 4
};

// Calculate project completion percentage
function calculateProgress() {
    const completedWeeks = projectData.weeks.filter(w => w.completed).length;
    return Math.round((completedWeeks / projectData.totalWeeks) * 100);
}

// Update status bar
function updateStatusBar() {
    const progress = calculateProgress();
    const statusValue = document.querySelector('.status-value');
    const progressBar = document.querySelector('.progress-bar');
    
    if (statusValue) {
        statusValue.textContent = `${progress}% Complete`;
    }
    
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = `${progress}%`;
        }, 300);
    }
}

// Render timeline
function renderTimeline() {
    const timelineContainer = document.querySelector('.timeline');
    if (!timelineContainer) return;
    
    timelineContainer.innerHTML = '';
    
    projectData.weeks.forEach((week, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-week">Week ${week.week}</div>
                <div class="timeline-task">${week.task}</div>
            </div>
            <div class="timeline-marker ${week.completed ? 'completed' : ''}"></div>
        `;
        timelineContainer.appendChild(item);
    });
}

// Edit Mode for Documents
let editMode = false;
const editableElements = [];

function toggleEditMode() {
    editMode = !editMode;
    const editBtn = document.querySelector('.btn-edit');
    const indicator = document.querySelector('.edit-indicator');
    const contentElements = document.querySelectorAll('.editable-content');
    
    contentElements.forEach(el => {
        el.contentEditable = editMode;
        if (editMode) {
            editableElements.push({
                element: el,
                originalContent: el.innerHTML
            });
        }
    });
    
    if (editBtn) {
        editBtn.textContent = editMode ? '💾 Save Changes' : '✎ Edit Document';
        editBtn.classList.toggle('btn-secondary');
    }
    
    if (indicator) {
        indicator.classList.toggle('active', editMode);
    }
    
    if (!editMode) {
        // Save changes (could be enhanced with localStorage)
        console.log('Changes saved!');
        editableElements.length = 0;
    }
}

// Export to PDF
function exportToPDF() {
    // Prepare content for printing
    const editableContents = document.querySelectorAll('.editable-content');
    editableContents.forEach(el => {
        el.contentEditable = false;
    });
    
    // Trigger browser print dialog
    window.print();
    
    // Restore edit mode if it was active
    if (editMode) {
        editableContents.forEach(el => {
            el.contentEditable = true;
        });
    }
}

// Add smooth scroll behavior
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update status and timeline on index page
    updateStatusBar();
    renderTimeline();
    
    // Add event listeners for edit and export buttons
    const editBtn = document.querySelector('.btn-edit');
    const exportBtn = document.querySelector('.btn-export');
    
    if (editBtn) {
        editBtn.addEventListener('click', toggleEditMode);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToPDF);
    }
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all glass cards
    document.querySelectorAll('.glass-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + E for edit mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            const editBtn = document.querySelector('.btn-edit');
            if (editBtn) {
                toggleEditMode();
            }
        }
        
        // Ctrl/Cmd + P for export (let browser handle print)
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            // Browser will handle this naturally
        }
    });
});

// Auto-save functionality (using localStorage)
let autoSaveTimer;
function autoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        const editableContents = document.querySelectorAll('.editable-content');
        const savedData = {};
        
        editableContents.forEach((el, index) => {
            savedData[`section_${index}`] = el.innerHTML;
        });
        
        localStorage.setItem('lion-cage-doc-' + window.location.pathname, JSON.stringify(savedData));
        console.log('Auto-saved!');
    }, 2000);
}

// Load saved content
function loadSavedContent() {
    const savedData = localStorage.getItem('lion-cage-doc-' + window.location.pathname);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        const editableContents = document.querySelectorAll('.editable-content');
        
        editableContents.forEach((el, index) => {
            if (data[`section_${index}`]) {
                el.innerHTML = data[`section_${index}`];
            }
        });
    }
}

// Add input listeners for auto-save
document.addEventListener('DOMContentLoaded', function() {
    loadSavedContent();
    
    const editableContents = document.querySelectorAll('.editable-content');
    editableContents.forEach(el => {
        el.addEventListener('input', autoSave);
    });
});
