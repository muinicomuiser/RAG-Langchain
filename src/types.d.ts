// Aquí recopilar los tipos y exportar
// Ejemplo:
// export type Color = "blanco" | "azul" | "rojo" | "verde"

import { Collection } from 'chromadb'
import { NextFunction, Request, Response } from 'express'

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
interface ChatController {
  async newMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>
  async newRagMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

interface ChatService {
  async newMessage: (message: string) => Promise<string>
  async newRagMessage: (message: string, collectionName: string, resultNumber: number) => Promise<string>
}

/**
 * Embedding Interfaces
*/

interface EmbeddingController {
  async newQuery: (req: Request, res: Response, next: NextFunction) => Promise<void>

  async createCollection: (req: Request, res: Response, next: NextFunction) => Promise<void>
  async listCollections: (req: Request, res: Response, next: NextFunction) => Promise<void>
  async deleteCollection: (req: Request, res: Response, next: NextFunction) => Promise<void>

  async embedText: (req: Request, res: Response, next: NextFunction) => Promise<void>
  async embedDocument: (req: Request, res: Response, next: NextFunction) => Promise<void>
  async listDocuments: (req: Request, res: Response, next: NextFunction) => Promise<void>
  async deleteDocument: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

interface EmbeddingService {
  async newQuery: (query: string, collectionName: string, resultNumber: number) => Promise<Array<string | null>>

  async createCollection: (name: string, description: string) => Promise<void>
  async listCollections: () => Promise<Array<{ name: string, description: string }>>
  async deleteCollection: (collectionName: string) => Promise<void>

  async embedText: (text: string, documentTitle: string, collectionName: string) => Promise<string>
  async embedDocument: (collectionName: string, file: Express.Multer.File, chunkSize: number, chunkOverlap: number) => Promise <void>
  async listDocuments: (collectionName: string) => Promise<string[]>
  async deleteDocument: (collectionName: string, documentName: string) => Promise <void>
}

/** Mappers */

interface CollectionDto {
  name: string
  description: string
}

interface CollectionMapper {
  collectionToDto: (collection: Collection) => CollectionDto
  collectionsToDtoArray: (collections: Collection[]) => CollectionDto[]
}

/** Errors */

type CustomError = Error & { statusCode: number }
