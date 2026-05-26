import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, AlertCircle } from "lucide-react";
import { Button, Input, Select } from "@/shared/components";
import { authService } from "@/features/auth/services/authService";
import { useAuth } from "@/core/auth/AuthContext";

const regionOptions = [
  { value: '1', label: 'Amazonas' },
  { value: '2', label: 'Ancash' },
  { value: '3', label: 'Apurímac' },
  { value: '4', label: 'Arequipa' },
  { value: '5', label: 'Ayacucho' },
  { value: '6', label: 'Cajamarca' },
  { value: '7', label: 'Callao' },
  { value: '8', label: 'Cusco' },
  { value: '9', label: 'Huancavelica' },
  { value: '10', label: 'Huánuco' },
  { value: '11', label: 'Ica' },
  { value: '12', label: 'Junín' },
  { value: '13', label: 'La Libertad' },
  { value: '14', label: 'Lambayeque' },
  { value: '15', label: 'Lima' },
  { value: '16', label: 'Loreto' },
  { value: '17', label: 'Madre de Dios' },
  { value: '18', label: 'Moquegua' },
  { value: '19', label: 'Pasco' },
  { value: '20', label: 'Piura' },
  { value: '21', label: 'Puno' },
  { value: '22', label: 'San Martín' },
  { value: '23', label: 'Tacna' },
  { value: '24', label: 'Tumbes' },
  { value: '25', label: 'Ucayali' },
]

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    regionId: "15",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: "VICTIM", label: "Víctima" },
    { value: "PSYCHOLOGIST", label: "Psicólogo/a" },
    { value: "DEFENDER", label: "Defensor Legal" },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.regionId ||
      !formData.password ||
      !formData.role
    ) {
      setError("Por favor completa todos los campos");
      return false;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.register({
        nombre: formData.name,
        apellido: formData.lastName,
        email: formData.email,
        password: formData.password,
        telefono: formData.phone,
        roles: formData.role as any,
        region: {
          id: formData.regionId,
          nombre: regionOptions.find((region) => region.value === formData.regionId)?.label || 'Lima',
        },
      });

      login(response.token, response.user);

      const dashboardMap: Record<string, string> = {
        VICTIM: "/dashboard/victim",
        PSYCHOLOGIST: "/dashboard/psychologist",
        DEFENDER: "/dashboard/defender",
      };

      navigate(dashboardMap[response.user.role] || "/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-xl shadow-lg mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SafeZone</h1>
          <p className="text-gray-600">Crea tu cuenta segura</p>
        </div>

        <div className="bg-white rounded-2xl shadow-warm p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-sm text-accent font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre"
              placeholder="Juan"
              value={formData.name}
              onChange={(value) => handleChange("name", value)}
              required
            />

            <Input
              label="Apellido"
              placeholder="Pérez"
              value={formData.lastName}
              onChange={(value) => handleChange("lastName", value)}
              required
            />

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              required
            />

            <Input
              label="Teléfono"
              type="tel"
              placeholder="999 999 999"
              value={formData.phone}
              onChange={(value) => handleChange("phone", value)}
              required
            />

            <Select
              label="Región"
              options={regionOptions}
              value={formData.regionId}
              onChange={(value) => handleChange("regionId", value)}
              required
            />

            <Select
              label="Tipo de usuario"
              options={roleOptions}
              value={formData.role}
              onChange={(value) => handleChange("role", value)}
              required
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(value) => handleChange("password", value)}
              required
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(value) => handleChange("confirmPassword", value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Crear cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Inicia sesión
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6 max-w-xs mx-auto">
          Al registrarte, aceptas nuestras políticas de privacidad y protección de datos
        </p>
      </div>
    </div>
  );
};
