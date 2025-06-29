"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BookmarkFiltersProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function BookmarkFilters({ categories, selectedCategory, onCategoryChange }: BookmarkFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="capitalize"
        >
          {category}
          {category !== "all" && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {/* This would show count in real implementation */}
              {Math.floor(Math.random() * 10) + 1}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  )
}
