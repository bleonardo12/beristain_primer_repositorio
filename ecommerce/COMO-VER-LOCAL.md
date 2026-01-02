# 👀 Cómo Ver la Página Localmente (Sin Dominio)

## 🖥️ Ver en tu computadora (Local)

### Opción 1: Con Python (Más fácil)

```bash
# Ir a la carpeta del e-commerce
cd /ruta/a/beristain_primer_repositorio/ecommerce

# Iniciar servidor
python -m http.server 8000

# O si tienes Python 2:
python -m SimpleHTTPServer 8000
```

Abrir navegador en: **http://localhost:8000**

### Opción 2: Con PHP

```bash
cd /ruta/a/beristain_primer_repositorio/ecommerce
php -S localhost:8000
```

Abrir navegador en: **http://localhost:8000**

### Opción 3: Con Node.js

```bash
# Instalar http-server (solo una vez)
npm install -g http-server

# Ejecutar
cd /ruta/a/beristain_primer_repositorio/ecommerce
http-server -p 8000
```

Abrir navegador en: **http://localhost:8000**

### Opción 4: Abrir directamente el archivo

Simplemente hacer doble clic en `index.html`

**IMPORTANTE:** Algunas funciones pueden no funcionar correctamente (como cargar products.json) debido a restricciones de CORS. Usar un servidor local es mejor.

---

## 🌐 Ver en el VPS (Por IP, sin dominio)

### Paso 1: Subir archivos al VPS

```bash
# Opción A: Con SCP (desde tu PC)
scp -P 2222 -r ecommerce/ root@69.62.95.98:/var/www/html/sockloco/

# Opción B: Con Git (desde el VPS)
ssh root@69.62.95.98 -p 2222
cd /var/www/html
git clone https://github.com/bleonardo12/beristain_primer_repositorio.git sockloco
cd sockloco/ecommerce
```

### Paso 2: Configurar Apache o Nginx

**Apache:**

```bash
# Conectar al VPS
ssh root@69.62.95.98 -p 2222

# Editar configuración por defecto
nano /etc/apache2/sites-available/000-default.conf
```

Modificar:

```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html/sockloco/ecommerce

    <Directory /var/www/html/sockloco/ecommerce>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Guardar y reiniciar:

```bash
systemctl reload apache2
```

**Nginx:**

```bash
nano /etc/nginx/sites-available/default
```

Modificar:

```nginx
server {
    listen 80 default_server;
    root /var/www/html/sockloco/ecommerce;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Guardar y reiniciar:

```bash
nginx -t
systemctl reload nginx
```

### Paso 3: Acceder por IP

Abrir navegador en: **http://69.62.95.98**

---

## 🔄 Workflow Recomendado

1. **Desarrollo Local** (tu PC)
   - Editar archivos
   - Ver cambios en `http://localhost:8000`
   - Probar todo funcione

2. **Subir al VPS** (cuando estés conforme)
   ```bash
   # Commit a git
   git add .
   git commit -m "Actualización de productos"
   git push

   # Actualizar en VPS
   ssh root@69.62.95.98 -p 2222
   cd /var/www/html/sockloco
   git pull
   ```

3. **Probar en VPS**
   - Abrir `http://69.62.95.98`
   - Compartir link con amigos/clientes para feedback

4. **Cuando esté listo** → Comprar dominio y configurarlo

---

## 📸 Agregar Tus Fotos

### Paso 1: Optimizar imágenes

```bash
# Copiar tus fotos al directorio
cp /ruta/a/tus/fotos/*.jpg ecommerce/img/products/original/

# Optimizar (si tienes ImageMagick instalado)
./ecommerce/optimize-images.sh

# O usar herramientas online:
# - tinypng.com
# - squoosh.app
# - iloveimg.com/es/comprimir-imagen
```

### Paso 2: Renombrar según el catálogo

Ejemplo basado en tus fotos:

```bash
# Renombrar tus fotos para que coincidan con products.json
mv foto1.jpg adidas-blancas.jpg
mv foto2.jpg racing-celestes.jpg
```

### Paso 3: Copiar a la carpeta correcta

```bash
cp *.jpg ecommerce/img/products/
```

### Paso 4: Actualizar products.json

Editar `ecommerce/data/products.json` con las rutas correctas:

```json
{
  "id": 1,
  "name": "Medias Adidas Clásicas Blancas",
  "image": "img/products/adidas-blancas.jpg",
  ...
}
```

---

## 🎨 Editar Productos

Archivo: `ecommerce/data/products.json`

```json
[
  {
    "id": 1,
    "name": "Nombre del producto",
    "description": "Descripción",
    "price": 3500,
    "image": "img/products/nombre-foto.jpg",
    "category": "deportivas",
    "sizes": ["S", "M", "L"],
    "colors": ["Color1", "Color2"],
    "stock": 25
  }
]
```

**Categorías disponibles:**
- `deportivas` - Medias deportivas (Nike, Adidas, Puma)
- `futbol` - Equipos argentinos
- `seleccion` - Selección Argentina
- `casual` - Medias casuales
- `fantasia` - Diseños divertidos

---

## ✅ Checklist Antes de Comprar Dominio

- [ ] Página funciona correctamente en local
- [ ] Todas las fotos están subidas y optimizadas
- [ ] Productos actualizados con precios reales
- [ ] Carrito funciona correctamente
- [ ] Probado en móvil (responsive)
- [ ] Datos de contacto actualizados (WhatsApp, email)
- [ ] Página funciona en VPS por IP
- [ ] MercadoPago configurado (opcional, se puede hacer después)

---

## 🚀 Acceso Rápido

**Local:** `python -m http.server 8000` → http://localhost:8000

**VPS:** http://69.62.95.98

**Cuando tengas dominio:** http://tudominio.com
