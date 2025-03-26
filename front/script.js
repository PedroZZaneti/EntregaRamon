document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const uploadForm = document.getElementById('uploadForm');
    const gallery = document.getElementById('gallery');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const closeModal = document.querySelector('.close');
    
    // URL base da API
    const API_URL = 'http://localhost:3000';
    
    // Carregar fotos quando a página carregar
    loadPhotos();
    
    // Evento de envio do formulário de upload
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        const fotoInput = document.getElementById('foto');
        const descricaoInput = document.getElementById('descricao');
        
        formData.append('foto', fotoInput.files[0]);
        formData.append('descricao', descricaoInput.value);
        
        try {
            const response = await fetch(`${API_URL}/foto`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Erro ao enviar foto');
            }
            
            const data = await response.json();
            alert(data.mensagem);
            uploadForm.reset();
            loadPhotos();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar foto. Por favor, tente novamente.');
        }
    });
    
    // Função para carregar todas as fotos
    async function loadPhotos() {
        try {
            const response = await fetch(`${API_URL}/foto`);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar fotos');
            }
            
            const photos = await response.json();
            renderPhotos(photos);
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar fotos. Por favor, recarregue a página.');
        }
    }
    
    // Função para renderizar as fotos na galeria
    function renderPhotos(photos) {
        gallery.innerHTML = '';
        
        if (photos.length === 0) {
            gallery.innerHTML = '<p>Nenhuma foto cadastrada ainda.</p>';
            return;
        }
        
        photos.forEach(photo => {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';
            photoCard.innerHTML = `
                <img src="${API_URL}/public/img/${photo.caminho}" alt="${photo.descricao}" class="photo-img">
                <div class="photo-desc">
                    <p>${photo.descricao}</p>
                </div>
                <div class="photo-actions">
                    <button class="btn-edit" data-id="${photo.id_fotos}">Editar</button>
                    <button class="btn-delete" data-id="${photo.id_fotos}">Deletar</button>
                </div>
            `;
            
            gallery.appendChild(photoCard);
        });
        
        // Adicionar eventos aos botões de editar e deletar
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                openEditModal(this.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                deletePhoto(this.getAttribute('data-id'));
            });
        });
    }
    
    // Função para abrir o modal de edição
    async function openEditModal(id) {
        try {
            const response = await fetch(`${API_URL}/foto/${id}`);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar foto para edição');
            }
            
            const photo = await response.json();
            
            document.getElementById('editId').value = id;
            document.getElementById('editDescricao').value = photo.descricao;
            editModal.style.display = 'block';
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar foto para edição.');
        }
    }
    
    // Evento de envio do formulário de edição
    editForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const id = document.getElementById('editId').value;
        const descricao = document.getElementById('editDescricao').value;
        
        try {
            const response = await fetch(`${API_URL}/foto/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ descricao })
            });
            
            if (!response.ok) {
                throw new Error('Erro ao atualizar foto');
            }
            
            const data = await response.json();
            alert(data.mensagem);
            editModal.style.display = 'none';
            loadPhotos();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao atualizar foto. Por favor, tente novamente.');
        }
    });
    
    // Função para deletar uma foto
    async function deletePhoto(id) {
        if (!confirm('Tem certeza que deseja deletar esta foto?')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/foto/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Erro ao deletar foto');
            }
            
            const data = await response.json();
            alert(data.mensagem);
            loadPhotos();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao deletar foto. Por favor, tente novamente.');
        }
    }
    
    // Fechar modal quando clicar no X
    closeModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });
    
    // Fechar modal quando clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });
});