document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Generate random key
    const generateKeyBtn = document.getElementById('generate-key');
    const encryptKeyInput = document.getElementById('encrypt-key');
    
    generateKeyBtn.addEventListener('click', () => {
        // Generate 8 random characters (a-z, A-Z, 0-9)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < 8; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        encryptKeyInput.value = key;
    });
    
    // Encrypt button
    const encryptBtn = document.getElementById('encrypt-btn');
    const encryptText = document.getElementById('encrypt-text');
    const encryptResult = document.getElementById('encrypt-result');
    
    encryptBtn.addEventListener('click', () => {
        const plaintext = encryptText.value.trim();
        let key = encryptKeyInput.value.trim();
        
        if (!plaintext) {
            alert('Por favor ingresa un texto para cifrar');
            return;
        }
        
        // If key is provided but not 8 chars, pad or truncate it
        if (key && key.length !== 8) {
            alert('La clave debe tener exactamente 8 caracteres. Se ajustará automáticamente.');
        }
        
        fetch('cifrado_des/encrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plaintext: plaintext,
                key: key
            })
        })
        .then(response => response.json())
        .then(data => {
            encryptResult.textContent = data.ciphertext;
            encryptKeyInput.value = data.key; // Update key in case it was generated
        })
        .catch(error => {
            console.error('Error:', error);
            encryptResult.textContent = 'Error al cifrar el texto: ' + error.message;
        });
    });
    
    // Decrypt button
    const decryptBtn = document.getElementById('decrypt-btn');
    const decryptText = document.getElementById('decrypt-text');
    const decryptKey = document.getElementById('decrypt-key');
    const decryptResult = document.getElementById('decrypt-result');
    
    decryptBtn.addEventListener('click', () => {
        const ciphertext = decryptText.value.trim();
        const key = decryptKey.value.trim();
        
        if (!ciphertext) {
            alert('Por favor ingresa un texto cifrado');
            return;
        }
        
        if (!key) {
            alert('Por favor ingresa la clave de cifrado');
            return;
        }
        
        if (key.length !== 8) {
            alert('La clave debe tener exactamente 8 caracteres');
            return;
        }
        
        fetch('cifrado_des/decrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ciphertext: ciphertext,
                key: key
            })
        })
        .then(response => response.json())
        .then(data => {
            decryptResult.textContent = data.plaintext;
        })
        .catch(error => {
            console.error('Error:', error);
            decryptResult.textContent = 'Error al descifrar el texto. Verifica la clave.';
        });
    });
    
    // Copy buttons
    const copyEncryptBtn = document.getElementById('copy-encrypt');
    const copyDecryptBtn = document.getElementById('copy-decrypt');
    
    copyEncryptBtn.addEventListener('click', () => {
        copyToClipboard(encryptResult);
    });
    
    copyDecryptBtn.addEventListener('click', () => {
        copyToClipboard(decryptResult);
    });
    
    function copyToClipboard(element) {
        const text = element.textContent;
        if (!text) {
            alert('No hay contenido para copiar');
            return;
        }
        
        navigator.clipboard.writeText(text)
            .then(() => {
                const originalText = element.textContent;
                element.textContent = '¡Copiado!';
                setTimeout(() => {
                    element.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar: ', err);
                alert('Error al copiar el texto');
            });
    }
});