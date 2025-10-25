import { motion } from 'framer-motion';

export function AILoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-32 h-32 mb-6">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Middle pulsing circle */}
        <motion.div
          className="absolute inset-4 bg-gradient-hero rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Inner dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-primary-foreground rounded-full" />
        </motion.div>

        {/* Warli-inspired decorative elements */}
        <motion.div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2"
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" className="text-accent" />
          </svg>
        </motion.div>
      </div>

      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-foreground">AI is crafting your story...</h3>
        <p className="text-muted-foreground">Analyzing images and description</p>
      </motion.div>

      <motion.div
        className="flex gap-2 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
