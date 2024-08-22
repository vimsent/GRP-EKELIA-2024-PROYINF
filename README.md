# Proyecto de Visualización y Procesamiento de Imágenes Médicas

Proyecto del grupo **Bulcanizaciones Gomes hmnos e hijos y nietos**  

## Integrantes:
- **integrante faltante:** 123123123
- **Vicente Luongo:** 202073637-k
- **José Vargas:** 202104687-9
- **Fabian Miranda:** 202030515-3

## Descripción del Proyecto

Este proyecto tiene como objetivo desarrollar un software cuantitativo para la **visualización y procesamiento de imágenes médicas**. El software está diseñado para apoyar el diagnóstico médico, reduciendo errores derivados de la subjetividad en la interpretación de imágenes. Utiliza el estándar **DICOM** (Digital Imaging and Communications in Medicine) para garantizar la interoperabilidad en el almacenamiento y transmisión de imágenes médicas.

Este semestre continuamos el trabajo basado en los avances realizados en el semestre anterior, con el objetivo de mejorar y completar las funcionalidades existentes, así como añadir nuevas capacidades al sistema.

## Estado Actual del Proyecto (Autoevaluación basada en SEMAT)

### Oportunidad

- **Estado actual:** Oportunidad reconocida  
- **Justificación:** Existe una necesidad bien definida para este software en el ámbito médico, ya que tiene el potencial de mejorar significativamente la precisión del diagnóstico a través de imágenes médicas cuantitativas.

### Partes Interesadas

- **Estado actual:** Partes interesadas identificadas  
- **Justificación:** Las partes interesadas clave incluyen médicos, hospitales y centros de investigación que requieren herramientas más precisas y reproducibles para mejorar la imagenología médica.

### Equipo

- **Estado actual:** Equipo formado  
- **Justificación:** El equipo está compuesto por desarrolladores con experiencia en Python, visualización de imágenes y estándares médicos, aunque es necesario que adquieran habilidades adicionales en la gestión y procesamiento de archivos DICOM.

### Trabajo

- **Estado actual:** Trabajo iniciado  
- **Justificación:** El equipo ha comenzado con la planificación y la implementación inicial del software, pero quedan varias funcionalidades clave por desarrollar, como la visualización 3D y las herramientas cuantitativas.

### Sistema de Software

- **Estado actual:** Implementación inicial  
- **Justificación:** El sistema ya puede visualizar imágenes en 2D y leer información de cabeceras DICOM, pero las funcionalidades avanzadas como las herramientas de análisis y la visualización en 3D aún están en desarrollo.

## WIKI

Puede acceder a la [wiki](https://github.com/vimsent/GRP-EKELIA-2024-PROYINF/wiki) para conocer los detalles, objetivos y el estado actual de nuestro proyecto.

## INFORMACIÓN PROTOTIPO INTERFAZ DE USUARIO

El prototipo presentado fue creado en la plataforma FIGMA y puede ser visto con mayor detalle en el siguiente enlace:

[Prototipo Figma](https://www.figma.com/file/q4Eq5kdEaPJPOFDbUeS26A/SKELIERS?type=design&node-id=0%3A1&mode=design&t=Y94QbozGJY3uqXMI-1)

## STACK DE DESARROLLO

Utilizamos el framework **React**, ya que por su popularidad permite el encontrar mayor documentación para el desarrollo. Además, al funcionar como página web, permite que sea más accesible para los usuarios.

Es un avance del HU de imagen en negativo, siendo esta nuestra primera HU a implementar porque es la más básica pero útil para los doctores.

### Instrucciones de uso:

Al no estar implementado en internet aún, se debe usar desde el Local Host, mediante comandos de React, ejecutando `npm start` para iniciar el proyecto. Esto redireccionará automáticamente a la página web donde debe subir la imagen tipo **DICOM** a editar.

## VIDEO PROTOTIPO

Se adjunta el link para ver la prueba del prototipo:  
[Prototipo en YouTube](https://youtu.be/QlE-aquQXwM)

## Alphas Prioritarios y Medidas para Avanzar

### Sistema de Software

- **Objetivo siguiente:** Sistema usable

**Medidas a implementar:**

- Completar las funcionalidades clave, como la **visualización 3D** y las **herramientas de medición anatómica**.
- Validar el sistema con usuarios médicos para asegurar que cumple con las expectativas y necesidades del campo.
- Optimizar la interfaz de usuario para facilitar la adopción del software en entornos clínicos.

### Trabajo

- **Objetivo siguiente:** Trabajo en progreso

**Medidas a implementar:**

- Dividir claramente las tareas entre los miembros del equipo y realizar un seguimiento continuo a través de una **metodología ágil** (Scrum/Kanban).
- Establecer **revisiones de código regulares** y gestionar los riesgos potenciales de manera proactiva.
- Definir hitos intermedios para medir el avance del proyecto y garantizar que las funcionalidades se implementen dentro de los plazos establecidos.

## Riesgos Identificados

### 1. Incompatibilidad de Archivos DICOM con Diferentes Sistemas de Imagenología Médica

- **Descripción del riesgo:** Existe el riesgo de que el software no sea completamente compatible con todas las variantes de archivos DICOM provenientes de diferentes sistemas de imagenología médica.
- **Objetivo afectado:** Procesamiento y visualización de imágenes.
- **Impacto:** Alto  
- **Probabilidad de ocurrencia:** Media  
- **Medidas de mitigación:** Realizar pruebas exhaustivas con múltiples archivos DICOM provenientes de diversas máquinas de imagenología médica.  
- **Estado del riesgo:** Activo y no mitigado.

### 2. Retraso en la Implementación de la Visualización 3D

- **Descripción del riesgo:** Debido a la complejidad técnica de la visualización en 3D y la rotación de volúmenes, existe el riesgo de que esta funcionalidad se retrase.
- **Objetivo afectado:** Cumplimiento del cronograma y entrega de funcionalidades clave.
- **Impacto:** Alto  
- **Probabilidad de ocurrencia:** Alta  
- **Medidas de mitigación:** Dividir las tareas complejas en subtareas manejables.  
- **Estado del riesgo:** Activo y mitigado parcialmente.

## Cartas de Alphas

### Alpha: Sistema de Software

......
