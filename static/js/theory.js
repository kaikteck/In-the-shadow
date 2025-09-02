// Theory page functionality with localStorage
document.addEventListener('DOMContentLoaded', function() {
    initializeTheoryPage();
});

function initializeTheoryPage() {
    loadSavedTheory();
    setupTheoryForm();
    setupAutoSave();
}

function loadSavedTheory() {
    const savedTheory = localStorage.getItem('theory_content');
    const textarea = document.getElementById('teoria_content');
    
    if (savedTheory && textarea) {
        textarea.value = savedTheory;
    }
}

function saveTheory() {
    const textarea = document.getElementById('teoria_content');
    if (textarea) {
        const content = textarea.value;
        localStorage.setItem('theory_content', content);
        showFlashMessage('Teoria salva com sucesso!', 'success');
        return true;
    }
    return false;
}

function setupTheoryForm() {
    const saveButton = document.getElementById('save-theory');
    if (saveButton) {
        saveButton.addEventListener('click', function(e) {
            e.preventDefault();
            saveTheory();
        });
    }
}

function setupAutoSave() {
    const textarea = document.getElementById('teoria_content');
    if (textarea) {
        // Auto-save every 30 seconds when typing
        let autoSaveTimer;
        
        textarea.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                const content = textarea.value.trim();
                if (content.length > 0) {
                    localStorage.setItem('theory_content', content);
                    // Subtle indication of auto-save (no flash message)
                }
            }, 30000);
        });
        
        // Save when leaving the page
        window.addEventListener('beforeunload', function() {
            const content = textarea.value.trim();
            if (content.length > 0) {
                localStorage.setItem('theory_content', content);
            }
        });
    }
}

// Auto-resize textarea
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('teoria_content');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Initial resize
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    }
});