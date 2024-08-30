# Bulcanizaciones Gomes hmnos e hijos y nietos - Proyecto de Visualización y Procesamiento de Imágenes Médicas

Proyecto del grupo **Bulcanizaciones Gomes hmnos e hijos y nietos**  
Repositorio de los Skeliers.

## Integrantes del Grupo

- **Vicente Luongo:** 202073637-k
- **José Vargas:** 202104687-9
- **Fabian Miranda:** 202030515-3
- **Cristóbal Tirado Morales:** 202104586-4

## Identificación del Proyecto Base (2024-1)

Este proyecto es una continuación del trabajo realizado en el semestre 2024-1, cuyo objetivo principal es desarrollar un software cuantitativo para la **visualización y procesamiento de imágenes médicas**. Durante el semestre anterior, se avanzó en la creación de una interfaz básica y la implementación inicial de la funcionalidad de visualización de imágenes en 2D, utilizando el estándar **DICOM** para garantizar la interoperabilidad en el almacenamiento y transmisión de imágenes médicas.

Este semestre, continuamos desarrollando y mejorando el sistema con nuevas funcionalidades avanzadas, como la visualización 3D y herramientas de medición anatómica.

## Autoevaluación del Estado del Proyecto (Basado en SEMAT)

### Oportunidad

- **Estado actual:** Oportunidad reconocida  
- **Justificación:** Existe una clara necesidad para este software en el ámbito médico, ya que tiene el potencial de mejorar significativamente la precisión del diagnóstico mediante herramientas cuantitativas.

### Partes Interesadas

- **Estado actual:** Partes interesadas identificadas  
- **Justificación:** Los médicos, hospitales y centros de investigación han sido identificados como las partes interesadas clave que se beneficiarán de este software.

### Equipo

- **Estado actual:** Equipo formado  
- **Justificación:** El equipo está compuesto por desarrolladores con experiencia en Python, React y tecnologías DICOM, aunque algunos miembros continúan desarrollando habilidades en procesamiento avanzado de imágenes.

### Trabajo

- **Estado actual:** Trabajo iniciado  
- **Justificación:** Se ha comenzado con la planificación del semestre y la implementación de funcionalidades adicionales. El equipo está avanzando en la implementación de herramientas de visualización y análisis.

### Sistema de Software

- **Estado actual:** Implementación inicial  
- **Justificación:** El sistema ya puede visualizar imágenes en 2D, pero las funcionalidades avanzadas, como la visualización en 3D y herramientas cuantitativas, siguen en desarrollo.

## Alphas Prioritarios y Medidas para Alcanzar el Siguiente Estado

### Sistema de Software

- **Objetivo siguiente:** Sistema usable

**Medidas a implementar:**

1. Completar las funcionalidades clave, como la **visualización 3D** y las **herramientas de medición anatómica**.
2. Validar el sistema con usuarios médicos para asegurar que cumple con los estándares de precisión necesarios para los diagnósticos.
3. Optimizar la interfaz de usuario para facilitar su uso en entornos médicos.

### Trabajo

- **Objetivo siguiente:** Trabajo en progreso

**Medidas a implementar:**

1. Establecer un plan de trabajo claro con tareas asignadas a cada miembro del equipo, utilizando metodologías ágiles como Scrum o Kanban.
2. Realizar revisiones de código regulares para asegurar la calidad del software y detectar errores temprano.
3. Definir hitos de entrega para medir el avance y asegurar que las funcionalidades críticas sean completadas a tiempo.

## Riesgos Identificados

### 1. Incompatibilidad de Archivos DICOM con Diferentes Sistemas de Imagenología Médica

- **Descripción del riesgo:** Existe el riesgo de que el software no sea completamente compatible con todas las variantes de archivos DICOM provenientes de diferentes sistemas de imagenología médica.
- **Objetivo afectado:** Procesamiento y visualización de imágenes.
- **Impacto:** Alto  
- **Probabilidad de ocurrencia:** Media  
- **Medidas de mitigación:** Realizar pruebas exhaustivas con archivos DICOM de distintas fuentes y mantener el software actualizado de acuerdo con los últimos estándares.
- **Estado del riesgo:** Activo y no mitigado.  
- **Exposición:** Alto (Impacto Alto x Probabilidad Media)

### 2. Retraso en la Implementación de la Visualización 3D

- **Descripción del riesgo:** Debido a la complejidad técnica de la visualización en 3D, existe el riesgo de que esta funcionalidad se retrase.
- **Objetivo afectado:** Cumplimiento del cronograma y entrega de funcionalidades clave.
- **Impacto:** Alto  
- **Probabilidad de ocurrencia:** Alta  
- **Medidas de mitigación:** Dividir las tareas en subtareas manejables y asignar recursos adicionales cuando sea necesario.
- **Estado del riesgo:** Activo y mitigado parcialmente.  
- **Exposición:** Muy alto (Impacto Alto x Probabilidad Alta)

### 3. Baja Adopción del Software por Parte de los Usuarios Finales

- **Descripción del riesgo:** El software podría no ser adoptado ampliamente por los médicos si la interfaz de usuario no es lo suficientemente intuitiva.
- **Objetivo afectado:** Uso del software en entornos clínicos.
- **Impacto:** Alto  
- **Probabilidad de ocurrencia:** Baja  
- **Medidas de mitigación:** Realizar pruebas de usabilidad y ajustar la interfaz según el feedback de los médicos.
- **Estado del riesgo:** Activo y mitigado.  
- **Exposición:** Medio (Impacto Alto x Probabilidad Baja)

### 4. Problemas de Desempeño en Sistemas con Recursos Limitados

- **Descripción del riesgo:** El software podría no funcionar correctamente en sistemas con hardware desactualizado.
- **Objetivo afectado:** Rendimiento del software.
- **Impacto:** Medio  
- **Probabilidad de ocurrencia:** Media  
- **Medidas de mitigación:** Optimizar el código para mejorar el rendimiento en hardware de gama baja y ofrecer configuraciones ajustables.
- **Estado del riesgo:** Activo y mitigado parcialmente.  
- **Exposición:** Media (Impacto Medio x Probabilidad Media)
