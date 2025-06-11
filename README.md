# Proyecto de Criptografía y Compresión: DES + Huffman  

![Python](https://img.shields.io/badge/Python-3.13%2B-blue)
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

## 🎯 Objetivo  
Este proyecto busca implementar dos algoritmos fundamentales en el procesamiento de datos:  
- **DES (Data Encryption Standard)**: Para garantizar confidencialidad en la transmisión de información.  
- **Codificación Huffman**: Para compresión eficiente de datos sin pérdida.  

Ambos integrados en una interfaz web accesible y fácil de usar.

---

## 🛠️ Tecnologías y Herramientas  
### Backend  
- **Python 3.13+**: Lenguaje principal para la lógica de los algoritmos.  
- **Flask 2.0+**: Framework para crear la aplicación web y manejar rutas.  
- **Bibliotecas clave**:  
  - `pycryptodome` (opcional, para funciones criptográficas auxiliares en DES)  

### Frontend  
- **HTML5/CSS3**: Estructura y diseño de las interfaces.  
- **JavaScript**: Interactividad en los formularios y visualizaciones.  

### Desarrollo  
- **Git**: Control de versiones.  
- **Visual Studio Code**: Editor principal.  

---

## 📂 Estructura del Proyecto  
```plaintext
.
├── CRIPTOGRAFIA/
│   ├── cifrado_des/          # Módulo DES
│   │   ├── DES.py            # Lógica del cifrado (permutaciones, subclaves, etc.)
│   │   └── templates/        # HTML específico para DES
│   │
│   └── codificador_huffman/  # Módulo Huffman
│       ├── huffman.py        # Construcción de árbol y codificación/decodificación
│       └── templates/        # HTML para Huffman
│
├── static/                   # Assets
│   ├── css/                  # Estilos generales y específicos
│   ├── js/                   # Scripts para interacción
│   └── images/               # Capturas de pantalla/iconos
│
├── templates/                # Plantillas base
│   └── index.html            # Página de inicio con navegación
│
└── app.py                    # Punto de entrada de la aplicación Flask