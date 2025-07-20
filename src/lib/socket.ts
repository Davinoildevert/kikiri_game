// Fichier socket temporaire pour éviter les erreurs de build
// Dans une implémentation réelle, vous utiliseriez socket.io-client

interface MockSocket {
  id: string | null;
  connect: () => void;
  emit: (event: string, data: any, callback?: (response: any) => void) => void;
}

export function getSocket(): MockSocket {
  return {
    id: null,
    connect: () => {
      console.log("Mock socket connected");
    },
    emit: (event: string, data: any, callback?: (response: any) => void) => {
      console.log("Mock socket emit:", event, data);
      if (callback) {
        // Simule une réponse pour éviter les erreurs
        callback({ success: false, error: "Socket non implémenté" });
      }
    }
  };
}
