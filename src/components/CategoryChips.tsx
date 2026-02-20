import { useRef } from "react";
import { motion } from "framer-motion";

interface CategoryChipsProps {
  categories: { id: string; label: string }[];
  selected: string;
  onSelect: (id: string) => void;
}

const CategoryChips = ({ categories, selected, onSelect }: CategoryChipsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto hide-scrollbar px-5 py-2"
    >
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${
            selected === cat.id
              ? "gradient-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryChips;
