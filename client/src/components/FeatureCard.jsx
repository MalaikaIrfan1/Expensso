import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, desc, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="[perspective:1200px] h-56"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-full h-full"
      >
        <motion.div
          onClick={() => setFlipped((f) => !f)}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer"
        >
          {/* Front face */}
          <div className="absolute inset-0 [backface-visibility:hidden] bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm flex flex-col justify-center items-start">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange to-blue flex items-center justify-center mb-4">
              <Icon size={20} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Tap to learn more →</p>
          </div>

          {/* Back face */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-orange to-blue rounded-2xl p-6 shadow-sm flex flex-col justify-center">
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/90 leading-relaxed">{desc}</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}