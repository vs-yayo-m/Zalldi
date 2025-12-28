// src/hooks/useProducts.js

import { useState, useEffect } from 'react'
import productService from '@/services/product.service'

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchProducts()
  }, [JSON.stringify(filters)])
  
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getAll(filters)
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const refetch = () => {
    fetchProducts()
  }
  
  return { products, loading, error, refetch }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (!id) return
    
    fetchProduct()
  }, [id])
  
  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getById(id)
      setProduct(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const refetch = () => {
    fetchProduct()
  }
  
  return { product, loading, error, refetch }
}

export function useProductBySlug(slug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (!slug) return
    
    fetchProduct()
  }, [slug])
  
  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getBySlug(slug)
      setProduct(data)
      
      if (data) {
        productService.incrementViews(data.id)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const refetch = () => {
    fetchProduct()
  }
  
  return { product, loading, error, refetch }
}