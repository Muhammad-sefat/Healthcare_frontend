"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`relative w-full ${sizeClasses[size]} overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 flex flex-col max-h-[90vh]`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="mt-4 flex-1 overflow-y-auto pr-1 text-slate-600 dark:text-slate-300">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
