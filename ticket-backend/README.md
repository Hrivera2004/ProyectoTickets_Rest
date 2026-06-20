# Ticket Backend

Backend en Node.js + Express + TypeScript que actúa como intermediario entre el frontend y Redmine. Así la API key de Redmine nunca queda expuesta en el código del cliente.

## Endpoints

| Método | Ruta          | Descripción                                      |
|--------|---------------|---------------------------------------------------|
| GET    | /api/issues   | Lista los tickets del proyecto configurado         |
| POST   | /api/issues   | Crea un ticket (con `subject` y, opcionalmente, una `image`) |

## Instalación

```bash
npm install
cp .env.example .env
```

Edita `.env` con tu URL de Redmine, tu API key y el ID de tu proyecto.

## Ejecución

Modo desarrollo (recarga automática):

```bash
npm run dev
```

Modo producción:

```bash
npm run build
npm start
```

El servidor queda escuchando en `http://localhost:4000` (o el puerto que definas en `.env`).

## Uso desde el frontend

Enviar un ticket de solo texto:

```javascript
const res = await fetch('http://localhost:4000/api/issues', {
  method: 'POST',
  body: (() => {
    const form = new FormData();
    form.append('subject', 'Ticket de prueba');
    return form;
  })()
});
```

Enviar un ticket con imagen adjunta:

```javascript
const form = new FormData();
form.append('subject', 'Ticket con captura de pantalla');
form.append('image', fileInput.files[0]); // input type="file"

const res = await fetch('http://localhost:4000/api/issues', {
  method: 'POST',
  body: form
});
```

## Pruebas con REST Client (VSCode)

Ver `requests/list.http` y `requests/send.http`.
