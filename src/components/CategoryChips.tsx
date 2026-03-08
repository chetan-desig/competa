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
      className="flex gap-2 overflow-x-auto hide-scrollbar py-2"
    >
      {categories.map((cat, i) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, type: "spring", stiffness: 200 }}
          onClick={() => onSelect(cat.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-2xl text-sm font-semibold transition-all relative ${
            selected === cat.id
              ? "gradient-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {cat.label}
          {selected === cat.id && (
            <motion.div
              layoutId="chip-highlight"
              className="absolute inset-0 rounded-2xl gradient-primary -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryChips;
