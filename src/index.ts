import Collection from './packages/collection';
import AuthStore from './packages/authStore';

class PocketRestLib {
  public baseUrl: string;
  public authStore: AuthStore;

  private collections: { [key: string]: Collection } = {};

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.authStore = new AuthStore();
  }

  collection(collectionName: string) {
    if (this.collections[collectionName]) {
      return this.collections[collectionName];
    }
    this.collections[collectionName] = new Collection(
      this.baseUrl,
      collectionName,
      this.authStore
    );
    return this.collections[collectionName];
  }
}

export default PocketRestLib;
