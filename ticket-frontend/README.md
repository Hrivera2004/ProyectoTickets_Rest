# Ticket Frontend — Widget de reporte

App de demostración (maqueta) con un widget flotante de "Reportar problema".
Al enviar, captura automáticamente una imagen del contenido de la app (sin la
navbar ni el widget) y la manda junto con el texto al backend.

## Requisito previo

El `ticket-backend` debe estar corriendo en `http://localhost:4000`.

## Instalación

```bash
npm install
npm run build
```

## Uso

Abre `index.html` directo en el navegador.

1. Dale clic al botón circular (☰) en la esquina inferior derecha.
2. Escribe la queja/reporte en el textbox.
3. Dale "Enviar reporte".

El widget se cierra al instante, se toma una captura automática del contenido
de la app, y todo se manda al backend como un ticket nuevo en Redmine (con
imagen adjunta).
