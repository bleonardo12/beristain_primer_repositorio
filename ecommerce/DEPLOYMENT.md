# 🚀 Guía de Deployment - SockLoco al VPS

## 📋 Información del Servidor

- **IP:** 69.62.95.98
- **Puerto SSH:** 2222
- **Usuario:** root

## 🔐 Conectar al VPS

```bash
ssh root@69.62.95.98 -p 2222
```

## 📤 Subir el E-commerce al VPS

### Opción 1: Usar SCP (Desde tu máquina local)

```bash
# Subir toda la carpeta ecommerce
scp -P 2222 -r ecommerce/ root@69.62.95.98:/var/www/html/sockloco/

# O subir solo archivos específicos
scp -P 2222 ecommerce/index.html root@69.62.95.98:/var/www/html/sockloco/
```

### Opción 2: Usar Git (Recomendado)

En el VPS:

```bash
# Conectar al VPS
ssh root@69.62.95.98 -p 2222

# Ir al directorio web
cd /var/www/html/

# Clonar el repositorio
git clone https://github.com/bleonardo12/beristain_primer_repositorio.git sockloco

# Ir a la carpeta del e-commerce
cd sockloco/ecommerce

# Configurar permisos
chmod -R 755 /var/www/html/sockloco
```

### Opción 3: Usar SFTP

```bash
# Conectar con SFTP
sftp -P 2222 root@69.62.95.98

# Navegar y subir archivos
cd /var/www/html
put -r ecommerce
```

## 🌐 Configurar Apache/Nginx

### Apache

```bash
# Crear VirtualHost
nano /etc/apache2/sites-available/sockloco.conf
```

Agregar:

```apache
<VirtualHost *:80>
    ServerName sockloco.tudominio.com
    # O usar la IP directamente
    ServerName 69.62.95.98

    DocumentRoot /var/www/html/sockloco/ecommerce

    <Directory /var/www/html/sockloco/ecommerce>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/sockloco_error.log
    CustomLog ${APACHE_LOG_DIR}/sockloco_access.log combined
</VirtualHost>
```

Activar sitio:

```bash
sudo a2ensite sockloco.conf
sudo systemctl reload apache2
```

### Nginx

```bash
nano /etc/nginx/sites-available/sockloco
```

Agregar:

```nginx
server {
    listen 80;
    server_name 69.62.95.98 sockloco.tudominio.com;

    root /var/www/html/sockloco/ecommerce;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache de imágenes
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Activar sitio:

```bash
sudo ln -s /etc/nginx/sites-available/sockloco /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 📸 Subir Imágenes de Productos

### Desde tu máquina local:

```bash
# Subir imágenes optimizadas
scp -P 2222 ecommerce/img/products/optimized/* root@69.62.95.98:/var/www/html/sockloco/ecommerce/img/products/

# O subir todas las imágenes
scp -P 2222 -r ecommerce/img/ root@69.62.95.98:/var/www/html/sockloco/ecommerce/
```

### Optimizar imágenes antes de subir:

```bash
# 1. Colocar fotos originales en ecommerce/img/products/original/
cp tus_fotos/*.jpg ecommerce/img/products/original/

# 2. Ejecutar optimizador (requiere ImageMagick)
./ecommerce/optimize-images.sh

# 3. Subir solo las optimizadas
scp -P 2222 ecommerce/img/products/optimized/* root@69.62.95.98:/var/www/html/sockloco/ecommerce/img/products/
```

## 🔄 Actualizar Productos

1. Editar `ecommerce/data/products.json` localmente
2. Subir al VPS:

```bash
scp -P 2222 ecommerce/data/products.json root@69.62.95.98:/var/www/html/sockloco/ecommerce/data/
```

## 🔒 Configurar SSL (Opcional pero Recomendado)

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-apache  # Para Apache
# O
sudo apt install certbot python3-certbot-nginx   # Para Nginx

# Obtener certificado SSL
sudo certbot --apache  # Para Apache
# O
sudo certbot --nginx   # Para Nginx

# Seguir las instrucciones para tu dominio
```

## ✅ Verificar Instalación

1. Abrir navegador en: `http://69.62.95.98` o `http://tudominio.com`
2. Verificar que cargue correctamente
3. Probar agregar productos al carrito
4. Verificar que las imágenes carguen

## 🔧 Troubleshooting

### Las imágenes no cargan:

```bash
# Verificar permisos
chmod -R 755 /var/www/html/sockloco/ecommerce/img/

# Verificar que existen
ls -la /var/www/html/sockloco/ecommerce/img/products/
```

### Error 403 Forbidden:

```bash
# Verificar permisos del directorio
chmod -R 755 /var/www/html/sockloco/
chown -R www-data:www-data /var/www/html/sockloco/  # Apache
# O
chown -R nginx:nginx /var/www/html/sockloco/  # Nginx
```

### No carga el sitio:

```bash
# Verificar estado del servidor web
sudo systemctl status apache2  # Apache
# O
sudo systemctl status nginx    # Nginx

# Ver logs de error
tail -f /var/log/apache2/error.log  # Apache
# O
tail -f /var/log/nginx/error.log    # Nginx
```

## 📊 Monitoreo

```bash
# Ver logs de acceso en tiempo real
tail -f /var/log/apache2/access.log  # Apache
# O
tail -f /var/log/nginx/access.log    # Nginx
```

## 🔄 Actualizaciones Futuras

```bash
# Conectar al VPS
ssh root@69.62.95.98 -p 2222

# Ir al directorio
cd /var/www/html/sockloco

# Actualizar desde Git
git pull origin claude/ecommerce-clothing-store-Ut49S

# O subir archivos específicos con SCP desde local
```

---

## 🚀 Despliegue Rápido (Todo en uno)

```bash
# Desde tu máquina local
scp -P 2222 -r ecommerce/ root@69.62.95.98:/var/www/html/sockloco/

# Conectar al VPS
ssh root@69.62.95.98 -p 2222

# Configurar permisos
chmod -R 755 /var/www/html/sockloco/ecommerce
chown -R www-data:www-data /var/www/html/sockloco/ecommerce

# Listo!
```

Acceder a: `http://69.62.95.98/sockloco/ecommerce/`
