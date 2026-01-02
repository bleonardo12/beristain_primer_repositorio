# 🧦 SockLoco - E-commerce de Medias

E-commerce moderno y colorido para venta de medias online con integración de MercadoPago, carrito de compras, envío express y sistema de emails.

## 🎨 Características

- ✅ Diseño responsive y llamativo
- ✅ Más de 200 productos (ampliable)
- ✅ Sistema de carrito de compras con LocalStorage
- ✅ Filtros por categoría, talle y búsqueda
- ✅ Integración con MercadoPago
- ✅ Envío express para compras antes de las 15hs
- ✅ Sistema de emails post-compra
- ✅ Animaciones y efectos visuales
- ✅ Totalmente personalizable

## 📁 Estructura del Proyecto

```
ecommerce/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos compilados
├── scss/
│   └── style.scss         # Estilos fuente (SASS)
├── js/
│   ├── config.js          # Configuración general
│   ├── cart.js            # Sistema de carrito
│   ├── products.js        # Gestión de productos
│   ├── checkout.js        # Proceso de pago
│   └── app.js             # Funcionalidades generales
├── data/
│   └── products.json      # Catálogo de productos
├── img/                   # Imágenes (crear carpeta)
└── README.md              # Esta documentación
```

## 🚀 Instalación y Configuración

### 1. Configuración Básica

El sitio está listo para usar en modo demo. Para ponerlo en producción:

#### a) Configurar MercadoPago

1. Crear cuenta en [MercadoPago](https://www.mercadopago.com.ar)
2. Obtener credenciales en: https://www.mercadopago.com.ar/settings/account/credentials
3. Editar `js/config.js` y reemplazar:

```javascript
mercadoPago: {
    publicKey: 'TU-PUBLIC-KEY-AQUI',
}
```

#### b) Configurar Información de Contacto

Editar `js/config.js`:

```javascript
email: {
    vendedor: 'tu-email@ejemplo.com',
    nombre: 'Tu Nombre de Tienda',
    whatsapp: '+54 9 11 XXXX-XXXX',
    instagram: '@tu_instagram'
}
```

### 2. Backend para MercadoPago (Requerido para Producción)

Para procesar pagos reales, necesitas crear un backend que:

1. Cree preferencias de pago usando tu Access Token
2. Maneje webhooks de notificaciones
3. Procese el envío de emails

#### Ejemplo con Node.js + Express:

```javascript
// server.js
const express = require('express');
const mercadopago = require('mercadopago');

const app = express();
app.use(express.json());

// Configurar MercadoPago con tu Access Token
mercadopago.configure({
    access_token: 'TU-ACCESS-TOKEN'
});

// Crear preferencia de pago
app.post('/api/create-preference', async (req, res) => {
    try {
        const preference = {
            items: req.body.items,
            back_urls: req.body.back_urls,
            auto_return: 'approved',
            notification_url: 'https://tu-dominio.com/api/notifications'
        };

        const response = await mercadopago.preferences.create(preference);
        res.json({ id: response.body.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook para notificaciones
app.post('/api/notifications', async (req, res) => {
    // Procesar notificación de pago
    // Enviar email al comprador
    res.sendStatus(200);
});

app.listen(3000);
```

### 3. Configurar Servicio de Emails

Para enviar emails automáticos, integrar un servicio como:

- **SendGrid** (recomendado)
- **Mailgun**
- **AWS SES**
- **Resend**

Ejemplo con SendGrid:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendConfirmationEmail(buyerEmail, orderDetails) {
    const msg = {
        to: buyerEmail,
        from: 'ventas@sockloco.com.ar',
        subject: 'Confirmación de compra - SockLoco',
        html: `
            <h1>¡Gracias por tu compra!</h1>
            <p>Detalles del pedido...</p>
        `
    };

    await sgMail.send(msg);
}
```

## 📦 Agregar Productos

Editar `data/products.json`:

```json
{
    "id": 11,
    "name": "Nombre del producto",
    "description": "Descripción detallada",
    "price": 2500,
    "image": "url-de-la-imagen",
    "category": "categoria",
    "sizes": ["S", "M", "L"],
    "colors": ["Color1", "Color2"],
    "stock": 50
}
```

### Categorías disponibles:
- `fantasia`
- `geek`
- `musica`
- `comida`
- `naturaleza`
- `deportivas`
- `animales`
- `arte`

## 🎨 Personalización

### Cambiar Colores

Editar `scss/style.scss` o directamente `css/style.css`:

```scss
$primary-color: #FF1493;    // Color principal
$secondary-color: #FF69B4;  // Color secundario
$accent-color: #FFD700;     // Color de acento
```

### Cambiar Nombre de la Tienda

1. Editar `index.html` - Buscar "SockLoco" y reemplazar
2. Editar `js/config.js` - Cambiar `store.name`
3. Actualizar meta tags y título

### Cambiar Hora de Envío Express

Editar `js/config.js`:

```javascript
shipping: {
    expressHour: 15,  // Cambiar a la hora deseada
    expressAvailable: true
}
```

## 🌐 Desplegar en VPS

### Con Apache:

1. Subir carpeta `ecommerce` a `/var/www/html/`
2. Configurar VirtualHost:

```apache
<VirtualHost *:80>
    ServerName sockloco.tudominio.com
    DocumentRoot /var/www/html/ecommerce

    <Directory /var/www/html/ecommerce>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

3. Habilitar sitio: `sudo a2ensite sockloco`
4. Reiniciar Apache: `sudo systemctl restart apache2`

### Con Nginx:

```nginx
server {
    listen 80;
    server_name sockloco.tudominio.com;
    root /var/www/html/ecommerce;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## 📱 Características Principales

### Carrito de Compras
- Persistencia con LocalStorage
- Agregar/eliminar productos
- Modificar cantidades
- Cálculo automático de totales

### Filtros
- Por categoría
- Por talle
- Búsqueda por nombre
- Ordenamiento por precio

### Envío Express
- Countdown en tiempo real
- Verificación de horario (antes de 15hs)
- Banner dinámico

### Checkout
- Formulario de datos del comprador
- Resumen de compra
- Integración con MercadoPago
- Confirmación por email

## 🔧 Desarrollo

### Compilar SCSS (Opcional)

Si quieres modificar los estilos SCSS:

```bash
npm install -g sass
sass scss/style.scss css/style.css --watch
```

### Testing Local

Usar un servidor local:

```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx http-server

# Con PHP
php -S localhost:8000
```

Abrir: `http://localhost:8000`

## 📊 Analytics y SEO

### Agregar Google Analytics

En `index.html`, antes de `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Meta Tags para Redes Sociales

Ya incluido en `index.html`, personalizar:

```html
<meta property="og:title" content="SockLoco - Medias Locas">
<meta property="og:description" content="Las medias más divertidas de Argentina">
<meta property="og:image" content="url-imagen-preview">
```

## 🎯 Próximos Pasos

1. ✅ Obtener credenciales de MercadoPago
2. ✅ Configurar backend para pagos
3. ✅ Configurar servicio de emails
4. ✅ Agregar productos reales con imágenes
5. ✅ Subir a VPS
6. ✅ Configurar dominio
7. ✅ Configurar SSL (Let's Encrypt)
8. ✅ Testear proceso completo de compra

## 📞 Soporte

Para dudas o problemas:
- Email: tu-email@ejemplo.com
- WhatsApp: +54 9 11 XXXX-XXXX

## 📄 Licencia

Este proyecto es de uso libre para tu emprendimiento.

---

**Hecho con ❤️ para vender las medias más locas de Argentina** 🇦🇷🧦
