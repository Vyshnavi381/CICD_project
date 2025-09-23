import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const requestReset = useMutation(api.users.requestPasswordReset);
  const resetPassword = useMutation(api.users.resetPassword);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestReset({ email });
      toast.success(result.message);
      
      // For demo purposes, show the reset token
      if (result.resetToken) {
        toast.info(`Demo: Your reset token is ${result.resetToken}`);
        setResetToken(result.resetToken);
        setShowResetForm(true);
      }
    } catch (error) {
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetToken || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPassword({ 
        token: resetToken, 
        newPassword 
      });
      toast.success(result.message);
      onBack();
    } catch (error) {
      toast.error("Failed to reset password. Please check your token and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResetForm) {
    return (
      <div className="w-full">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Reset Your Password</h3>
          <p className="text-white/70">Enter your reset token and new password</p>
        </div>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <input
            className="auth-input-field"
            type="text"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            placeholder="Reset Token"
            required
          />
          <input
            className="auth-input-field"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
          />
          <input
            className="auth-input-field"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
          />
          
          <button 
            className="auth-button" 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="text-center text-sm text-white/70 hover:text-white hover:underline"
          >
            Back to Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Forgot Password?</h3>
        <p className="text-white/70">Enter your email to receive reset instructions</p>
      </div>

      <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
        <input
          className="auth-input-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
        />
        
        <button 
          className="auth-button" 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Instructions"}
        </button>
        
        <button
          type="button"
          onClick={onBack}
          className="text-center text-sm text-white/70 hover:text-white hover:underline"
        >
          Back to Sign In
        </button>
      </form>
    </div>
  );
}
