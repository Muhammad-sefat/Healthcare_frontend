"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/authProvider";
import { CustomModal } from "@/components/ui/custom-modal";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string | null;
}

export function ReviewModal({ isOpen, onClose, appointmentId }: ReviewModalProps) {
  const { addReview } = useAuth();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReviewRating(5);
      setReviewComment("");
    }
  }, [isOpen]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId) return;
    addReview(appointmentId, reviewRating, reviewComment);
    toast.success("Review submitted successfully.");
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Write Consultation Review"
    >
      <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Rating Stars
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className="p-1 hover:scale-110 text-amber-400 transition-transform cursor-pointer"
              >
                <Star
                  className={`h-6 w-6 ${reviewRating >= star ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Review Comments
          </label>
          <textarea
            rows={4}
            required
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="How was your consultation experience? Write your comments here..."
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs resize-none focus:outline-hidden"
          />
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/95 text-white px-5 py-2 rounded-xl font-bold shadow-md cursor-pointer"
          >
            Submit Review
          </button>
        </div>
      </form>
    </CustomModal>
  );
}
