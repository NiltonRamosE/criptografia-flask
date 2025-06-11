# Proyecto de Criptografía y Compresión: DES + Huffman  

![Python](https://img.shields.io/badge/Python-3.7%2B-blue)
![Flask](https://img.shields.io/badge/Flask-2.0%2B-lightgrey)
![License](https://img.shields.io/badge/License-MIT-green)

Herramienta web que integra **cifrado DES** (seguridad) y **codificación Huffman** (compresión), desarrollada con Python y Flask.

## 🔍 Vista Previa  
**Interfaz principal**:  
![Captura de pantalla de la página index.html](static/images/home.jpg)  

**Cifrado DES**:  
![Captura de DES en acción](static/images/DES.jpg)  

**Compresión Huffman**:  
![Captura de Huffman](static/images/huffman.jpg)  

---

## 🛠️ Tecnologías  
- **Backend**:  
  - Python 3.13+
  - Flask (para la interfaz web)  
- **Frontend**:  
  - HTML/CSS/JavaScript  

---

## 📂 Estructura del Proyecto  
```plaintext
.
├── CRIPTOGRAFIA/
│   ├── cifrado_des/          # Módulo DES
│   │   ├── DES.py            # Lógica del cifrado
│   │   └── templates/        # HTML para DES
│   │
│   └── codificador_huffman/  # Módulo Huffman
│       ├── huffman.py        # Algoritmo de compresión
│       └── templates/        # HTML para Huffman
│
├── static/                   # Assets (CSS/JS)
│   ├── css/                  # Estilos
│   └── js/                   # Scripts interactivos
│
├── templates/                # Páginas base
│   └── index.html            # Página de inicio
│
└── app.py                    # Aplicación principal