#!/bin/bash

# Script para detener la aplicación Knight's Tour
# Uso: ./stop.sh

echo "⏹️  Deteniendo Knight's Tour Application..."

PID=$(lsof -ti:8080)

if [ -z "$PID" ]; then
    echo "ℹ️  No hay ninguna aplicación corriendo en el puerto 8080"
    exit 0
fi

echo "🔍 Proceso encontrado: PID $PID"
kill -9 $PID

if [ $? -eq 0 ]; then
    echo "✅ Aplicación detenida exitosamente"
else
    echo "❌ Error al detener la aplicación"
    exit 1
fi

