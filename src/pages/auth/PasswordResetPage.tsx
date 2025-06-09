import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/services/userService";

const PasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use Supabase auth for real password reset
      const result = await resetPassword(email);

      if (result.error) {
        toast({
          title: "Password reset failed",
          description: result.error.message || "Failed to send reset email",
          variant: "destructive",
        });
        return;
      }

      setSubmitted(true);
      toast({
        title: "Password reset link sent",
        description: "Please check your email for further instructions",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider text-primary">
            Themison
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2">
          Reset your password
        </h2>
        <p className="text-center text-themison-gray mb-6">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover focus:bg-primary-selected text-white px-4 py-3 rounded transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </button>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-primary hover:text-primary-hover text-sm"
              >
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Check className="h-8 w-8 text-themison-success" />
            </div>
            <h3 className="text-lg font-medium mb-2">Check your email</h3>
            <p className="text-themison-gray mb-6">
              We've sent a password reset link to {email}
            </p>
            <p className="text-sm text-themison-gray mb-6">
              For local development, check: <br />
              <a
                href="http://127.0.0.1:54324"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-hover"
              >
                http://127.0.0.1:54324
              </a>
            </p>
            <Link to="/login" className="text-primary hover:text-primary-hover">
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export { PasswordResetPage };
