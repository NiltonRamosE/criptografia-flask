document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const encodeBtn = document.getElementById('encode-btn');
    const inputText = document.getElementById('input-text');
    const encodedOutput = document.getElementById('encoded-output');
    const copyBtn = document.getElementById('copy-btn');
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const codesTable = document.querySelector('#codes-table tbody');
    
    // Variables para el gráfico
    let compressionChart = null;
    
    // Event listeners
    encodeBtn.addEventListener('click', encodeText);
    copyBtn.addEventListener('click', copyEncodedText);
    
    // Tabs functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Función para codificar el texto
    function encodeText() {
        const text = inputText.value.trim();
        
        if (!text) {
            alert('Por favor ingresa un texto para codificar');
            return;
        }
        
        fetch('codificador_huffman/encode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        })
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al codificar el texto');
        });
    }
    
    // Mostrar los resultados
    function displayResults(data) {
        // Mostrar texto codificado
        encodedOutput.textContent = data.encoded_text || "No hay texto codificado";
        
        // Actualizar tabla de códigos
        updateCodesTable(data.codes, data.frequency);
        
        // Actualizar estadísticas
        updateStats(data);
        
        // Visualizar árbol
        visualizeTree(data.tree);
        
        // Mostrar proceso
        showEncodingProcess(data);
        
        // Activar el primer tab si no está activo
        if (!document.querySelector('.tab-btn.active')) {
            tabs[0].click();
        }
    }
    
    // Actualizar tabla de códigos
    function updateCodesTable(codes, frequency) {
        codesTable.innerHTML = '';
        
        // Ordenar por frecuencia descendente
        const sortedCodes = Object.entries(codes).sort((a, b) => {
            return frequency[b[0]] - frequency[a[0]];
        });
        
        sortedCodes.forEach(([char, code]) => {
            const row = document.createElement('tr');
            
            // Mostrar caracteres especiales correctamente
            let displayChar = char;
            if (char === ' ') {
                displayChar = '␣'; // Espacio visible
            } else if (char === '\n') {
                displayChar = '↵'; // Salto de línea
            } else if (char === '\t') {
                displayChar = '⇥'; // Tabulación
            }
            
            row.innerHTML = `
                <td><strong>${displayChar}</strong> <small>(${char.charCodeAt(0)})</small></td>
                <td>${frequency[char]}</td>
                <td><code>${code}</code></td>
                <td>${code.length}</td>
            `;
            
            codesTable.appendChild(row);
        });
    }
    
    // Actualizar estadísticas
    function updateStats(data) {
        document.getElementById('original-size').textContent = data.original_size;
        document.getElementById('compressed-size').textContent = data.compressed_size;
        
        const ratio = data.compression_ratio.toFixed(2);
        document.getElementById('compression-ratio').textContent = ratio + ":1";
        
        const savings = ((1 - (data.compressed_size / data.original_size)) * 100).toFixed(1);
        document.getElementById('savings').textContent = savings + "%";
        
        // Actualizar gráfico
        updateChart(data.original_size, data.compressed_size);
    }
    
    // Actualizar gráfico de compresión
    function updateChart(originalSize, compressedSize) {
        const ctx = document.getElementById('compression-chart').getContext('2d');
        
        if (compressionChart) {
            compressionChart.destroy();
        }
        
        compressionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Original', 'Comprimido'],
                datasets: [{
                    label: 'Tamaño en bits',
                    data: [originalSize, compressedSize],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Bits'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Visualizar árbol de Huffman (versión mejorada)
function visualizeTree(treeData) {
    const container = document.getElementById('tree-visualization');
    container.innerHTML = '';
    
    if (!treeData) {
        container.textContent = 'No hay árbol para mostrar';
        return;
    }
    
    // Configuración de dimensiones
    const nodeRadius = 20;
    const levelHeight = 100;
    const horizontalSpacing = 60; // Espacio mínimo entre nodos
    
    // Primero calculamos la estructura del árbol para determinar el ancho necesario
    const treeStructure = calculateTreeLayout(treeData, horizontalSpacing, nodeRadius);
    
    // Crear SVG para el árbol con dimensiones adecuadas
    const svgWidth = Math.max(container.clientWidth, treeStructure.width + 100);
    const svgHeight = (treeStructure.depth + 1) * levelHeight + 50;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
    container.appendChild(svg);
    
    // Dibujar el árbol usando la estructura calculada
    drawTree(svg, treeStructure, treeData, svgWidth / 2, 60, levelHeight, nodeRadius);
}

// Función para calcular el diseño del árbol (posición de los nodos)
function calculateTreeLayout(node, spacing, nodeRadius) {
    if (!node) return { width: 0, depth: 0 };
    
    // Calcular diseño de los subárboles izquierdo y derecho
    const left = calculateTreeLayout(node.left, spacing, nodeRadius);
    const right = calculateTreeLayout(node.right, spacing, nodeRadius);
    
    // El ancho total es la suma de los anchos de los subárboles más el espaciado
    const width = Math.max(
        left.width + right.width + spacing,
        2 * nodeRadius
    );
    
    // La profundidad es la máxima de los subárboles más 1
    const depth = Math.max(left.depth, right.depth) + 1;
    
    return {
        width: width,
        depth: depth,
        left: left,
        right: right
    };
}

// Función para dibujar el árbol basado en la estructura calculada
function drawTree(svg, structure, node, x, y, levelHeight, nodeRadius) {
    if (!node) return;
    
    // Dibujar nodo
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', nodeRadius);
    circle.setAttribute('fill', '#4a6fa5');
    circle.setAttribute('stroke', '#166088');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);
    
    // Texto del nodo
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', x);
    text.setAttribute('y', y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '12px');
    text.setAttribute('font-weight', 'bold');
    
    if (node.type === 'leaf') {
        text.textContent = node.char === ' ' ? '␣' : 
                          node.char === '\n' ? '↵' : 
                          node.char === '\t' ? '⇥' : node.char;
    } else {
        text.textContent = node.freq;
    }
    
    svg.appendChild(text);
    
    // Frecuencia debajo
    const freqText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    freqText.setAttribute('x', x);
    freqText.setAttribute('y', y + nodeRadius + 15);
    freqText.setAttribute('text-anchor', 'middle');
    freqText.setAttribute('fill', '#166088');
    freqText.setAttribute('font-size', '10px');
    freqText.textContent = node.freq;
    svg.appendChild(freqText);
    
    // Dibujar hijos con posiciones calculadas
    if (node.left && structure.left) {
        const leftX = x - structure.right.width / 2 - spacingBetweenSubtrees(structure) / 2;
        const leftY = y + levelHeight;
        
        // Línea al hijo izquierdo
        drawLine(svg, x, y + nodeRadius, leftX, leftY - nodeRadius, '0');
        
        // Dibujar subárbol izquierdo
        drawTree(svg, structure.left, node.left, leftX, leftY, levelHeight, nodeRadius);
    }
    
    if (node.right && structure.right) {
        const rightX = x + structure.left.width / 2 + spacingBetweenSubtrees(structure) / 2;
        const rightY = y + levelHeight;
        
        // Línea al hijo derecho
        drawLine(svg, x, y + nodeRadius, rightX, rightY - nodeRadius, '1');
        
        // Dibujar subárbol derecho
        drawTree(svg, structure.right, node.right, rightX, rightY, levelHeight, nodeRadius);
    }
}

// Función auxiliar para dibujar líneas entre nodos
function drawLine(svg, x1, y1, x2, y2, label) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#666');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
    
    // Texto en la línea (0 o 1)
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', (x1 + x2) / 2);
    text.setAttribute('y', (y1 + y2) / 2);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', label === '0' ? '#e74c3c' : '#2ecc71');
    text.setAttribute('font-size', '12px');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('dy', '0.3em');
    text.textContent = label;
    svg.appendChild(text);
}

// Calcular espaciado entre subárboles
function spacingBetweenSubtrees(structure) {
    return Math.max(60, structure.left.width * 0.2 + structure.right.width * 0.2);
}
    
    // Mostrar el proceso de codificación
    function showEncodingProcess(data) {
        const processSteps = document.getElementById('process-steps');
        processSteps.innerHTML = '';
        
        if (!data.frequency || !data.codes) {
            processSteps.textContent = 'No hay información de proceso disponible';
            return;
        }
        
        // Paso 1: Frecuencias
        const step1 = document.createElement('div');
        step1.className = 'step';
        step1.innerHTML = `
            <div class="step-title">Paso 1: Calcular frecuencias de caracteres</div>
            <div class="step-content">
                <p>Se analiza el texto y se cuenta cuántas veces aparece cada carácter:</p>
                <div class="frequency-list"></div>
            </div>
        `;
        processSteps.appendChild(step1);
        
        const freqList = step1.querySelector('.frequency-list');
        const sortedFreq = Object.entries(data.frequency).sort((a, b) => b[1] - a[1]);
        
        sortedFreq.forEach(([char, freq]) => {
            const freqItem = document.createElement('div');
            let displayChar = char;
            if (char === ' ') displayChar = '␣';
            else if (char === '\n') displayChar = '↵';
            else if (char === '\t') displayChar = '⇥';
            
            freqItem.innerHTML = `<strong>${displayChar}</strong>: ${freq} ocurrencia${freq !== 1 ? 's' : ''}`;
            freqList.appendChild(freqItem);
        });
        
        // Paso 2: Construcción del árbol
        const step2 = document.createElement('div');
        step2.className = 'step';
        step2.innerHTML = `
            <div class="step-title">Paso 2: Construcción del árbol de Huffman</div>
            <div class="step-content">
                <p>Se construye el árbol combinando los nodos con menor frecuencia:</p>
                <ul class="tree-construction-steps"></ul>
            </div>
        `;
        processSteps.appendChild(step2);
        
        // Paso 3: Asignación de códigos
        const step3 = document.createElement('div');
        step3.className = 'step';
        step3.innerHTML = `
            <div class="step-title">Paso 3: Asignación de códigos binarios</div>
            <div class="step-content">
                <p>A cada carácter se le asigna un código único basado en su posición en el árbol:</p>
                <ul class="code-assignment-steps"></ul>
            </div>
        `;
        processSteps.appendChild(step3);
        
        const codeSteps = step3.querySelector('.code-assignment-steps');
        const sortedCodes = Object.entries(data.codes).sort((a, b) => a[1].length - b[1].length);
        
        sortedCodes.forEach(([char, code]) => {
            const codeItem = document.createElement('li');
            let displayChar = char;
            if (char === ' ') displayChar = '␣';
            else if (char === '\n') displayChar = '↵';
            else if (char === '\t') displayChar = '⇥';
            
            codeItem.innerHTML = `<strong>${displayChar}</strong>: <code>${code}</code> (longitud: ${code.length})`;
            codeSteps.appendChild(codeItem);
        });
        
        // Paso 4: Codificación final
        const step4 = document.createElement('div');
        step4.className = 'step';
        step4.innerHTML = `
            <div class="step-title">Paso 4: Codificación del texto original</div>
            <div class="step-content">
                <p>Cada carácter del texto original es reemplazado por su código correspondiente:</p>
                <div class="original-text-example"></div>
                <div class="encoded-text-example"></div>
            </div>
        `;
        processSteps.appendChild(step4);
        
        // Mostrar ejemplo de codificación (primeros 50 caracteres)
        const exampleText = inputText.value.substring(0, 50);
        const exampleEncoded = data.encoded_text.substring(0, 50 * 8); // Asumiendo códigos de hasta 8 bits
        
        const originalExample = step4.querySelector('.original-text-example');
        originalExample.innerHTML = `<strong>Texto original:</strong> ${exampleText}${inputText.value.length > 50 ? '...' : ''}`;
        
        const encodedExample = step4.querySelector('.encoded-text-example');
        encodedExample.innerHTML = `<strong>Texto codificado:</strong> ${exampleEncoded}${data.encoded_text.length > exampleEncoded.length ? '...' : ''}`;
    }
    
    // Copiar texto codificado al portapapeles
    function copyEncodedText() {
        const text = encodedOutput.textContent;
        
        if (!text) {
            alert('No hay texto codificado para copiar');
            return;
        }
        
        navigator.clipboard.writeText(text)
            .then(() => {
                // Feedback visual
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar:', err);
                alert('Error al copiar el texto');
            });
    }
});