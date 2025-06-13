import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FormField } from "@/components/ui/form-field";
import { AuthLayout } from "@/layouts/AuthLayout";
import { signUp } from "@/services/userService";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password validation states
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationClass, setValidationClass] = useState("");

  useEffect(() => {
    // Check password validations
    const newValidations = {
      length: password.length >= 8 && password.length <= 64,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    setValidations(newValidations);

    // Calculate password strength (0-5)
    const strength = Object.values(newValidations).filter(Boolean).length;
    setPasswordStrength(strength);

    // Set validation class for input styling
    if (password.length === 0) {
      setValidationClass("");
    } else if (strength >= 4) {
      setValidationClass(
        "border-themison-success ring-1 ring-themison-success"
      );
    } else if (strength > 0) {
      setValidationClass("border-red-500 ring-1 ring-red-500");
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordStrength < 4) {
      toast({
        title: "Password requirements not met",
        description: "Please ensure your password meets all requirements",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use Supabase auth for real user registration
      const result = await signUp(email, password);

      if (result.error) {
        toast({
          title: "Registration failed",
          description: result.error.message || "Failed to create account",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials",
        variant: "success",
      });

      // Navigate to success page
      navigate("/register/success");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@email.com"
          required
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••••••"
          validationClass={validationClass}
          required
        />

        {password.length > 0 && (
          <div className="mt-3">
            {passwordStrength > 0 && (
              <div className="mb-2">
                <div className="text-xs text-themison-gray flex justify-between">
                  <span>
                    {passwordStrength < 3
                      ? "Weak"
                      : passwordStrength < 5
                      ? "Strong"
                      : "Very Strong"}
                  </span>
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-1 bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${passwordStrength * 20}%` }}
                  ></div>
                </div>
              </div>
            )}

            <ul className="space-y-1 text-sm mt-2">
              <li className="flex items-center">
                {validations.length ? (
                  <Check className="h-4 w-4 text-themison-success mr-2" />
                ) : (
                  <X className="h-4 w-4 text-destructive mr-2" />
                )}
                <span
                  className={
                    validations.length
                      ? "text-themison-success"
                      : "text-destructive"
                  }
                >
                  Between 8 and 64 characters
                </span>
              </li>
              <li className="flex items-center">
                {validations.uppercase ? (
                  <Check className="h-4 w-4 text-themison-success mr-2" />
                ) : (
                  <X className="h-4 w-4 text-destructive mr-2" />
                )}
                <span
                  className={
                    validations.uppercase
                      ? "text-themison-success"
                      : "text-destructive"
                  }
                >
                  At least one uppercase letter
                </span>
              </li>
              <li className="flex items-center">
                {validations.lowercase ? (
                  <Check className="h-4 w-4 text-themison-success mr-2" />
                ) : (
                  <X className="h-4 w-4 text-destructive mr-2" />
                )}
                <span
                  className={
                    validations.lowercase
                      ? "text-themison-success"
                      : "text-destructive"
                  }
                >
                  At least one lowercase letter
                </span>
              </li>
              <li className="flex items-center">
                {validations.number ? (
                  <Check className="h-4 w-4 text-themison-success mr-2" />
                ) : (
                  <X className="h-4 w-4 text-destructive mr-2" />
                )}
                <span
                  className={
                    validations.number
                      ? "text-themison-success"
                      : "text-destructive"
                  }
                >
                  At least one number
                </span>
              </li>
              <li className="flex items-center">
                {validations.special ? (
                  <Check className="h-4 w-4 text-themison-success mr-2" />
                ) : (
                  <X className="h-4 w-4 text-destructive mr-2" />
                )}
                <span
                  className={
                    validations.special
                      ? "text-themison-success"
                      : "text-destructive"
                  }
                >
                  At least one special character
                </span>
              </li>
            </ul>
          </div>
        )}

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover focus:bg-primary-selected text-white px-4 py-3 rounded transition-colors font-medium disabled:opacity-50"
          disabled={passwordStrength < 4 || isLoading}
        >
          {isLoading ? "Creating account..." : "Continue"}
        </button>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-primary hover:text-primary-hover text-sm"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export { RegisterPage };
