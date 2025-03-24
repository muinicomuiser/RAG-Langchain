// Aquí recopilar los tipos y exportar
// Ejemplo:
// export type Color = "blanco" | "azul" | "rojo" | "verde"

import { Request, Response } from 'express'

// Ejemplo
// export interface Persona {
//   nombre: string,
//   edad: number,
//   colorFavorito: Color
// }
// **el Midudev propone usar interfaces al extender

// Si se agregan enums, ya no puede ser .d.ts <--- Pueden usarse archivos separados para enums.
// el .d.ts es para definiciones, no se convierte a código js

/**
 * Chat Interfaces
*/
interface ChatGeminiController {
  async newMessage: (req: Request, res: Response) => Promise<void>
}

interface ChatGeminiService {
  async newMessage: (message: string) => Promise<string>
}

/**
 * Embedding Interfaces
*/

interface EmbeddingGeminiController {
  async embedText: (req: Request, res: Response, next: NextFunction) => Promise<void>
  async listCollections: (req: Request, res: Response) => Promise<void>
  async newQuery: (req: Request, res: Response) => Promise<void>
  async createCollection: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

interface EmbeddingGeminiService {
  async embedText: (text: string, documentTitle: string, collectionName: string) => Promise<string>
  async listCollections: () => Promise<Array<{ name: string, description: string }>>
  async newQuery: (query: string, collectionName: string, resultNumber: number) => Promise<Array<Array<string | null>>>
  async createCollection: (name: string, description: string) => Promise<void>
}
