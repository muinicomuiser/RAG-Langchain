import { CollectionMapper } from '../types'

const collectionMapper: CollectionMapper = {
  collectionToDto (collection) {
    return {
      name: collection.name,
      description: (collection.metadata !== undefined) ? ((collection.metadata.description !== undefined) ? collection.metadata.description as string : 'No info') : 'No info'
    }
  },
  collectionsToDtoArray (collections) {
    return collections.map(collection => this.collectionToDto(collection))
  }
}

export default collectionMapper
