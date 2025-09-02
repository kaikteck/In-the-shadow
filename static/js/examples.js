// Examples page functionality with localStorage
document.addEventListener('DOMContentLoaded', function() {
    initializeExamplesPage();
});

function initializeExamplesPage() {
    loadExamples();
    setupExampleForm();
}

function loadExamples() {
    const examples = getStoredExamples();
    displayExamples(examples);
}

function getStoredExamples() {
    const stored = localStorage.getItem('chess_examples');
    return stored ? JSON.parse(stored) : [];
}

function saveExamples(examples) {
    localStorage.setItem('chess_examples', JSON.stringify(examples));
}

function addExample(exemplo) {
    const examples = getStoredExamples();
    
    // Add timestamp and ID
    exemplo.id = Date.now().toString();
    exemplo.created_at = new Date().toISOString();
    
    examples.unshift(exemplo); // Add to beginning
    saveExamples(examples);
    
    displayExamples(examples);
    showFlashMessage('Exemplo adicionado com sucesso!', 'success');
}

function deleteExample(id) {
    if (confirm('Tem certeza que deseja remover este exemplo?')) {
        const examples = getStoredExamples();
        const filteredExamples = examples.filter(ex => ex.id !== id);
        saveExamples(filteredExamples);
        displayExamples(filteredExamples);
        showFlashMessage('Exemplo removido com sucesso!', 'info');
    }
}

function displayExamples(examples) {
    const emptyState = document.getElementById('empty-state');
    const examplesGrid = document.getElementById('examples-grid');
    
    if (examples.length === 0) {
        emptyState.style.display = 'block';
        examplesGrid.style.display = 'none';
        examplesGrid.innerHTML = '';
    } else {
        emptyState.style.display = 'none';
        examplesGrid.style.display = 'grid';
        examplesGrid.innerHTML = examples.map(createExampleCard).join('');
        
        // Add delete event listeners
        examples.forEach(exemplo => {
            const deleteBtn = document.querySelector(`[data-delete-id="${exemplo.id}"]`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    deleteExample(exemplo.id);
                });
            }
        });
    }
}

function createExampleCard(exemplo) {
    const date = new Date(exemplo.created_at);
    const formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
    
    return `
        <div class="example-card">
            <div class="example-header">
                <h3>${escapeHtml(exemplo.nome)}</h3>
                <a href="#" class="delete-btn" data-delete-id="${exemplo.id}">
                    <i class="fas fa-trash"></i>
                </a>
            </div>
            
            <div class="example-content">
                <div class="example-field">
                    <strong><i class="fas fa-chess-board"></i> Situação:</strong>
                    <p>${escapeHtml(exemplo.situacao)}</p>
                </div>
                
                <div class="example-field">
                    <strong><i class="fas fa-eye-slash"></i> Peça nas Sombras:</strong>
                    <p>${escapeHtml(exemplo.peca_sombra)}</p>
                </div>
                
                <div class="example-field">
                    <strong><i class="fas fa-crown"></i> Resultado:</strong>
                    <p>${escapeHtml(exemplo.resultado)}</p>
                </div>
            </div>
            
            <div class="example-footer">
                <small><i class="fas fa-calendar"></i> ${formattedDate}</small>
            </div>
        </div>
    `;
}

function setupExampleForm() {
    const form = document.getElementById('example-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const exemplo = {
                nome: formData.get('nome').trim(),
                situacao: formData.get('situacao').trim(),
                peca_sombra: formData.get('peca_sombra').trim(),
                resultado: formData.get('resultado').trim()
            };
            
            // Validate
            if (!exemplo.nome || !exemplo.situacao || !exemplo.peca_sombra || !exemplo.resultado) {
                showFlashMessage('Por favor, preencha todos os campos.', 'danger');
                return;
            }
            
            addExample(exemplo);
            form.reset();
            
            // Auto-resize textareas after reset
            const textareas = form.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                textarea.style.height = 'auto';
            });
        });
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Auto-resize textareas
document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
});