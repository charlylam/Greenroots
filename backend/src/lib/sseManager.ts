import type { Response } from 'express';

const clients = new Set<Response>();

export const sseManager = {
  addClient(res: Response) {
    clients.add(res);
  },

  removeClient(res: Response) {
    clients.delete(res);
  },

  broadcast(event: string, data: unknown) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    clients.forEach((res) => res.write(payload));
  },
};
