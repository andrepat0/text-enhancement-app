import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface RegistrationFormProps {
  email: string;
  setEmail: (email: string) => void;
  onRegister: () => void;
  error: string;
}

export const RegistrationForm = ({ email, setEmail, onRegister, error }: RegistrationFormProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8"
    >
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex flex-col gap-4 w-80">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="outline" onClick={onRegister}>
            Start
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          This is a demo version. Please register with your email to use the full version.
        </p>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </motion.div>
  );
};