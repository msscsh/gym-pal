self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : { title: 'Nova Notificação', body: 'Você recebeu uma nova mensagem!' };

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/home.png' // Opcional: caminho para um ícone
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Opcional: abrir uma página específica quando a notificação é clicada
  // event.waitUntil(clients.openWindow('/pagina-desejada'));
});