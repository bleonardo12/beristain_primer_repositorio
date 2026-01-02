#!/bin/bash

# Script para optimizar imágenes de productos
# Requiere: ImageMagick

# Crear directorio para imágenes procesadas
mkdir -p ecommerce/img/products
mkdir -p ecommerce/img/products/original
mkdir -p ecommerce/img/products/optimized

echo "📸 Optimizador de Imágenes para SockLoco"
echo "========================================"
echo ""

# Función para procesar una imagen
process_image() {
    local input_file="$1"
    local output_dir="ecommerce/img/products/optimized"
    local filename=$(basename "$input_file")
    local name="${filename%.*}"
    local output_file="$output_dir/${name}.jpg"

    echo "Procesando: $filename"

    # Convertir y optimizar:
    # - Fondo blanco
    # - Redimensionar a 800x800 manteniendo aspecto
    # - Centrar en canvas blanco
    # - Comprimir con calidad 85%
    # - Eliminar metadata
    convert "$input_file" \
        -background white \
        -alpha remove \
        -resize 800x800 \
        -gravity center \
        -extent 800x800 \
        -quality 85 \
        -strip \
        "$output_file"

    echo "✅ Guardada en: $output_file"
    echo ""
}

# Verificar si ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick no está instalado"
    echo "Instalar con: sudo apt-get install imagemagick"
    exit 1
fi

echo "Instrucciones:"
echo "1. Coloca tus fotos en: ecommerce/img/products/original/"
echo "2. Ejecuta este script"
echo "3. Las imágenes optimizadas estarán en: ecommerce/img/products/optimized/"
echo ""
echo "Para procesar imágenes específicas:"
echo "./optimize-images.sh ruta/a/imagen.jpg"
echo ""

# Si se pasa un archivo como argumento, procesarlo
if [ $# -gt 0 ]; then
    for file in "$@"; do
        if [ -f "$file" ]; then
            process_image "$file"
        else
            echo "❌ Archivo no encontrado: $file"
        fi
    done
    exit 0
fi

# Procesar todas las imágenes en el directorio original
if [ -d "ecommerce/img/products/original" ]; then
    count=$(find ecommerce/img/products/original -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | wc -l)

    if [ $count -eq 0 ]; then
        echo "No se encontraron imágenes en ecommerce/img/products/original/"
        echo "Coloca tus fotos ahí y vuelve a ejecutar el script"
        exit 0
    fi

    echo "Encontradas $count imágenes para procesar"
    echo ""

    for file in ecommerce/img/products/original/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
        [ -f "$file" ] || continue
        process_image "$file"
    done

    echo "✅ Procesamiento completado!"
    echo "Imágenes optimizadas en: ecommerce/img/products/optimized/"
else
    mkdir -p ecommerce/img/products/original
    echo "Creado directorio: ecommerce/img/products/original/"
    echo "Coloca tus fotos ahí y vuelve a ejecutar el script"
fi
