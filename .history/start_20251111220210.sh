#!/bin/bash

# Script para iniciar la aplicación Knight's Tour
# Uso: ./start.sh

echo "🚀 Iniciando Knight's Tour Application..."
echo ""

# Limpiar y compilar
echo "📦 Compilando proyecto..."
mvn clean install -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Error en la compilación"
    exit 1
fi

echo ""
echo "✅ Compilación exitosa"
echo ""

# Detener instancia anterior si existe
echo "🔍 Buscando instancias previas..."
PID=$(lsof -ti:8080)
if [ ! -z "$PID" ]; then
    echo "⏹️  Deteniendo proceso anterior (PID: $PID)..."
    kill -9 $PID
    sleep 2
fi

# Iniciar la aplicación
echo "▶️  Iniciando aplicación en puerto 8080..."
echo ""
mvn spring-boot:run

echo ""
echo "✅ Aplicación disponible en: http://localhost:8080"

