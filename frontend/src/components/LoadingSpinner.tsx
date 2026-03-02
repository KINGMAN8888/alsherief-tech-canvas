import { motion } from "framer-motion";

const LoadingSpinner = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <motion.div
                className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

export default LoadingSpinner;
