"use client"

import type { ProductCategory } from "@/lib/types"
import { categories } from "@/lib/mock-data"

interface CategoryTabsProps {
  selectedCategory: ProductCategory | "all"
  onCategoryChange: (category: ProductCategory | "all") => void
}

export function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-16 z-40 border-b border-border bg-black">
      <div className="container px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange("all")}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-[#e53935] text-white"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            Все
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-[#e53935] text-white"
                  : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
