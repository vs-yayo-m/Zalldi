import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  documentId,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { formatSlug } from '@/utils/formatters'

class ProductService {
  constructor() {
    this.collectionName = 'products'
  }

  async getAll(filters = {}) {
    try {
      const productsRef = collection(db, this.collectionName)
      let q = query(productsRef)

      if (filters.category) {
        q = query(q, where('category', '==', filters.category))
      }

      if (filters.supplierId) {
        q = query(q, where('supplierId', '==', filters.supplierId))
      }

      if (filters.active !== undefined) {
        q = query(q, where('active', '==', filters.active))
      }

      if (filters.featured) {
        q = query(q, where('featured', '==', true))
      }

      if (filters.sortBy) {
        const direction = filters.sortOrder === 'desc' ? 'desc' : 'asc'
        q = query(q, orderBy(filters.sortBy, direction))
      }

      if (filters.limit) {
        q = query(q, limit(filters.limit))
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) return null

      return {
        id: docSnap.id,
        ...docSnap.data()
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }

  async getBySlug(slug) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('slug', '==', slug),
        limit(1)
      )

      const snapshot = await getDocs(q)

      if (snapshot.empty) return null

      const d = snapshot.docs[0]
      return { id: d.id, ...d.data() }
    } catch (error) {
      console.error('Error fetching product by slug:', error)
      throw error
    }
  }

  async search(searchTerm, filters = {}) {
    const products = await this.getAll(filters)
    const term = searchTerm.toLowerCase().trim()

    return products.filter(p =>
      [
        p.name,
        p.description,
        p.category,
        p.subcategory,
        ...(p.tags || [])
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    )
  }

  async create(productData) {
    try {
      const slug = formatSlug(productData.name)

      const newProduct = {
        ...productData,
        slug,
        rating: 0,
        reviewCount: 0,
        soldCount: 0,
        views: 0,
        active: productData.active ?? true,
        featured: productData.featured ?? false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(
        collection(db, this.collectionName),
        newProduct
      )

      return { id: docRef.id, ...newProduct }
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async update(id, updates) {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async delete(id) {
    try {
      await deleteDoc(doc(db, this.collectionName, id))
      return { success: true }
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  async incrementViews(id) {
    const product = await this.getById(id)
    if (!product) return

    await this.update(id, {
      views: (product.views || 0) + 1
    })
  }

  async updateStock(id, quantity) {
    const product = await this.getById(id)
    if (!product) return { success: false }

    await this.update(id, {
      stock: Math.max(0, (product.stock || 0) + quantity)
    })

    return { success: true }
  }

  async getByCategory(category, limitCount = 20) {
    return this.getAll({ category, active: true, limit: limitCount })
  }

  async getFeatured(limitCount = 10) {
    return this.getAll({ featured: true, active: true, limit: limitCount })
  }

  async getRelated(productId, category, limitCount = 6) {
    const products = await this.getByCategory(category, limitCount + 1)
    return products.filter(p => p.id !== productId).slice(0, limitCount)
  }
}

/* ------------------------------------------------------------------ */
/* SINGLE SHARED INSTANCE (IMPORTANT)                                  */
/* ------------------------------------------------------------------ */

const productService = new ProductService()

export { productService }

/* ------------------------------------------------------------------ */
/* BACKWARD-COMPATIBLE NAMED EXPORTS (DO NOT REMOVE)                   */
/* ------------------------------------------------------------------ */

export const createProduct = async (data = {}) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid product data')
  }
  return productService.create(data)
}

export const updateProduct = async (productId, data = {}) => {
  if (!productId) {
    throw new Error('Product ID is required')
  }
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid product data')
  }
  return productService.update(productId, data)
}

/**
 * Backward-compatible product fetch by ID
 * Used by EditProduct and legacy pages
 */
export const getProductById = async (productId) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required')
    }

    return await productService.getById(productId)
  } catch (error) {
    console.error('getProductById error:', error)
    throw error
  }
}

/**
 * Fetch multiple products by IDs (Wishlist, Cart, etc.)
 */
export const getProductsByIds = async (ids = []) => {
  if (!ids.length) return []

  const productsRef = collection(db, 'products')
  const chunks = []

  for (let i = 0; i < ids.length; i += 10) {
    chunks.push(ids.slice(i, i + 10))
  }

  const results = []

  for (const chunk of chunks) {
    const q = query(productsRef, where(documentId(), 'in', chunk))
    const snapshot = await getDocs(q)

    snapshot.forEach(d => {
      results.push({ id: d.id, ...d.data() })
    })
  }

  return results
}

/* ------------------------------------------------------------------ */
/* DEFAULT EXPORT                                                      */
/* ------------------------------------------------------------------ */

export default productService