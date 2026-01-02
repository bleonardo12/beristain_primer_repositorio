# 📸 Guía Rápida: Agregar Tus Fotos de Productos

## Paso 1: Preparar las fotos

### Tus fotos actuales:
✅ **adidas-blancas.jpg** - Media Adidas blanca con rayas negras
✅ **racing-celestes.jpg** - Medias Racing Club celestes con escudo

### Lo que necesitas hacer:

1. **Renombrar tus fotos** según los nombres en `products-real.json`:
   ```bash
   # Ejemplo de nombres que debes usar:
   adidas-blancas.jpg          # ID 1
   racing-celestes.jpg         # ID 2
   boca.jpg                    # ID 3
   river.jpg                   # ID 4
   independiente.jpg           # ID 5
   # ... y así sucesivamente
   ```

2. **Optimizar las fotos** (hacerlas más livianas):

   **Opción A: Online (Más fácil)**
   - Ir a: https://tinypng.com
   - Subir tus fotos
   - Descargar las comprimidas

   **Opción B: Con script (si tienes ImageMagick)**
   ```bash
   # Copiar fotos originales
   cp /ruta/a/tus/fotos/*.jpg ecommerce/img/products/original/

   # Optimizar
   ./ecommerce/optimize-images.sh

   # Las optimizadas estarán en:
   ecommerce/img/products/optimized/
   ```

3. **Copiar las fotos al lugar correcto**:
   ```bash
   # Copiar fotos optimizadas
   cp tus-fotos-optimizadas/*.jpg ecommerce/img/products/
   ```

## Paso 2: Actualizar el catálogo

Editar `ecommerce/data/products.json`:

Reemplazar el contenido actual con `products-real.json`:

```bash
# Hacer backup del original
cp ecommerce/data/products.json ecommerce/data/products-demo-backup.json

# Usar el catálogo real
cp ecommerce/data/products-real.json ecommerce/data/products.json
```

**O editarlo manualmente:**

```json
[
  {
    "id": 1,
    "name": "Medias Adidas Clásicas Blancas",
    "description": "Medias deportivas estilo Adidas...",
    "price": 3500,
    "image": "img/products/adidas-blancas.jpg",  ← Verificar este nombre
    "category": "deportivas",
    "sizes": ["S", "M", "L"],
    "colors": ["Blanco/Negro"],
    "stock": 25
  },
  {
    "id": 2,
    "name": "Medias Racing Club Oficiales",
    "description": "Medias celestes de Racing Club...",
    "price": 4500,
    "image": "img/products/racing-celestes.jpg",  ← Verificar este nombre
    "category": "futbol",
    "sizes": ["S", "M", "L"],
    "colors": ["Celeste/Blanco"],
    "stock": 30
  }
]
```

## Paso 3: Verificar que funcione

### En local:

```bash
cd ecommerce
python -m http.server 8000
```

Abrir http://localhost:8000 y verificar:
- ✅ Las fotos cargan correctamente
- ✅ Los precios son correctos
- ✅ Las descripciones están bien
- ✅ Los colores y talles disponibles son correctos

## Paso 4: Ajustar precios y detalles

Editar `products.json` con tus datos reales:

```json
{
  "id": 1,
  "price": 3500,        ← TU PRECIO REAL
  "stock": 25,          ← TU STOCK REAL
  "sizes": ["S", "M", "L"],  ← TALLES DISPONIBLES
  "colors": ["Blanco/Negro"]  ← COLORES DISPONIBLES
}
```

## Paso 5: Agregar más productos

Para cada producto nuevo:

1. Tomar/conseguir foto
2. Optimizarla
3. Guardarla en `ecommerce/img/products/` con nombre descriptivo
4. Agregar entrada en `products.json`:

```json
{
  "id": 16,  ← Siguiente ID disponible
  "name": "Nombre de tu producto",
  "description": "Descripción detallada",
  "price": 4000,
  "image": "img/products/nombre-foto.jpg",
  "category": "futbol",  ← Ver categorías disponibles abajo
  "sizes": ["S", "M", "L"],
  "colors": ["Color1", "Color2"],
  "stock": 15
}
```

### Categorías disponibles:

- `futbol` - ⚽ Equipos de Fútbol (Boca, River, Racing, etc.)
- `seleccion` - 🇦🇷 Selección Argentina
- `deportivas` - 🏃 Deportivas (Nike, Adidas, Puma)
- `casual` - 👔 Casuales
- `fantasia` - ✨ Fantasía
- `geek` - 🎮 Geek

### Talles:

- `S` (35-37)
- `M` (38-40)
- `L` (41-43)
- `XL` (44-46)

## Paso 6: Tips para fotos profesionales

### Con celular:
1. **Fondo blanco o neutro** - Usar una pared blanca o cartulina
2. **Buena luz** - Luz natural del día (cerca de ventana)
3. **Sin sombras** - Luz pareja
4. **Enfoque claro** - Limpiar lente del celular
5. **Foto cenital** (desde arriba) o lateral

### Edición básica:
- **Brillo/Contraste** - Ajustar para que se vea nítido
- **Recortar** - Dejar margen blanco alrededor
- **Comprimir** - Usar tinypng.com

### Estructura de foto ideal:
```
┌─────────────────┐
│                 │
│    [MEDIA]      │  ← Centrada
│                 │
└─────────────────┘
  800x800px aprox
```

## Paso 7: Probar antes de subir al VPS

Checklist:
- [ ] Todas las fotos cargan (no hay imágenes rotas)
- [ ] Los precios están correctos
- [ ] Las descripciones son claras
- [ ] Los stocks están actualizados
- [ ] Probado en celular (responsive)
- [ ] Carrito funciona
- [ ] Filtros funcionan

## Paso 8: Subir al VPS

Cuando esté todo listo:

```bash
# Commit de cambios
git add ecommerce/
git commit -m "Actualizar con productos reales y fotos"
git push

# Conectar al VPS
ssh root@69.62.95.98 -p 2222

# Actualizar en VPS
cd /var/www/html/sockloco
git pull

# O subir solo las fotos si ya está configurado:
scp -P 2222 ecommerce/img/products/*.jpg root@69.62.95.98:/var/www/html/sockloco/ecommerce/img/products/
```

## 🆘 Problemas Comunes

### Las fotos no cargan:
- Verificar que el nombre del archivo en `products.json` coincida exactamente
- Verificar que la foto esté en `ecommerce/img/products/`
- Verificar permisos: `chmod 644 ecommerce/img/products/*.jpg`

### Las fotos se ven pixeladas:
- Usar fotos de al menos 800x800px
- Optimizar pero no comprimir demasiado (calidad 80-90%)

### Las fotos pesan mucho:
- Usar tinypng.com
- O ImageMagick: `convert foto.jpg -quality 85 -resize 800x800 foto-optimizada.jpg`

---

## 📝 Nombres Sugeridos para Tus Fotos

Basado en tus productos actuales:

```
ecommerce/img/products/
├── adidas-blancas.jpg          ✅ (Ya la tenés)
├── racing-celestes.jpg         ✅ (Ya la tenés)
├── boca.jpg                    ← Pendiente
├── river.jpg                   ← Pendiente
├── independiente.jpg           ← Pendiente
├── sanlorenzo.jpg              ← Pendiente
├── nike-negras.jpg             ← Pendiente
├── puma.jpg                    ← Pendiente
├── argentina.jpg               ← Pendiente
├── adidas-performance.jpg      ← Pendiente
├── estudiantes.jpg             ← Pendiente
├── velez.jpg                   ← Pendiente
├── pack-3.jpg                  ← Pendiente
├── argentina-86.jpg            ← Pendiente
└── newells.jpg                 ← Pendiente
```

**Tip:** Si no tenés fotos de todos los productos, podés:
1. Usar fotos de stock temporalmente
2. Comentar esos productos en `products.json` (eliminarlos temporalmente)
3. Ir agregándolos a medida que conseguís las fotos
