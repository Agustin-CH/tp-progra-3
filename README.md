# Knight's Tour Problem - Trabajo Práctico Programación 3

## Descripción del Proyecto

Este proyecto implementa **tres soluciones diferentes** al problema clásico del **Knight's Tour** (Recorrido del Caballo) en Java, con una interfaz web interactiva para visualizar y comparar los algoritmos.

**Trabajo Práctico Obligatorio - Programación 3 - UADE 2025**

### Objetivos del Proyecto

1. **Implementar y comparar diferentes técnicas algorítmicas:**
   - Backtracking (búsqueda exhaustiva)
   - Heurística Greedy (Regla de Warnsdorff)
   - Programación Dinámica (maximización de puntos)

2. **Analizar complejidad temporal y espacial** de cada algoritmo

3. **Crear una aplicación web funcional** que demuestre los conceptos de forma visual e interactiva

## Tecnologías Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.1.5** - Framework web
- **Maven** - Gestión de dependencias

### Frontend
- **HTML5**
- **CSS3** (diseño responsive y moderno)
- **JavaScript** (sin frameworks)

## Estructura del Proyecto

```
Tp-progra-iii/
├── src/
│   ├── main/
│   │   ├── java/com/uade/progra3/knightstour/
│   │   │   ├── KnightsTourApplication.java      # Clase principal
│   │   │   ├── controller/
│   │   │   │   └── KnightsTourController.java   # REST API
│   │   │   ├── service/
│   │   │   │   ├── BacktrackingService.java     # Algoritmo Backtracking
│   │   │   │   ├── WarnsdorffService.java       # Algoritmo Greedy
│   │   │   │   └── DynamicProgrammingService.java # Algoritmo PD
│   │   │   └── model/
│   │   │       ├── Position.java
│   │   │       ├── SolutionResult.java
│   │   │       ├── ComplexityAnalysis.java
│   │   │       └── DynamicProgrammingRequest.java
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── index.html                   # Frontend
│   │       │   ├── styles.css
│   │       │   └── script.js
│   │       └── application.properties
├── pom.xml                                       # Configuración Maven
└── README.md
```

## Instalación y Ejecución

### Prerequisitos

- **Java 17 o superior**
- **Maven 3.6+** (o usar el wrapper incluido)
- **Navegador web moderno**

### Pasos para ejecutar el proyecto

1. **Clonar o descargar el repositorio**

```bash
cd Tp-progra-iii
```

2. **Compilar el proyecto**

```bash
mvn clean install
```

3. **Ejecutar la aplicación**

```bash
mvn spring-boot:run
```

O alternativamente:

```bash
java -jar target/knights-tour-1.0.0.jar
```

4. **Abrir en el navegador**

```
http://localhost:8080
```

La aplicación estará corriendo en el puerto **8080**.

## Cómo Usar la Aplicación

### Interfaz Web

1. **Seleccionar un algoritmo:**
   - Backtracking
   - Warnsdorff (Greedy)
   - Programación Dinámica
   - Comparar Algoritmos

2. **Configurar parámetros:**
   - Tamaño del tablero (varía según algoritmo: Backtracking hasta 8×8, Warnsdorff/PD hasta 20×20)
   - Posición inicial del caballo
   - Para PD: número de movimientos

3. **Hacer clic en "Resolver"**

4. **Visualizar resultados:**
   - Tablero con el recorrido numerado
   - Métricas de rendimiento
   - Análisis de complejidad

5. **Opcional: Animar la solución** paso a paso

### API REST

El backend expone los siguientes endpoints:

#### 1. Backtracking
```bash
GET http://localhost:8080/api/knights-tour/backtracking?boardSize=5&startRow=0&startCol=0
```

#### 2. Warnsdorff
```bash
GET http://localhost:8080/api/knights-tour/warnsdorff?boardSize=8&startRow=0&startCol=0
```

#### 3. Programación Dinámica
```bash
POST http://localhost:8080/api/knights-tour/dynamic-programming
Content-Type: application/json

{
  "boardSize": 8,
  "startRow": 0,
  "startCol": 0,
  "maxMoves": 10,
  "pointsBoard": null
}
```

#### 4. Comparar Algoritmos
```bash
GET http://localhost:8080/api/knights-tour/compare?boardSize=6&startRow=0&startCol=0
```

#### 5. Generar Tablero de Puntos
```bash
GET http://localhost:8080/api/knights-tour/generate-points-board?boardSize=8
```

