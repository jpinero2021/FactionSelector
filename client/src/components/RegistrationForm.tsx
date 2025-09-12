import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUserRegistration } from "@/hooks/use-user-registration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Users } from "lucide-react";
import type { InsertFactionRegistration } from "@shared/schema";

interface RegistrationFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function RegistrationForm({ onClose, onSuccess }: RegistrationFormProps) {
  const [faction, setFaction] = useState<"efemeros" | "rosetta" | "">("");
  const [playerName, setPlayerName] = useState("");
  const [characterUuid, setCharacterUuid] = useState("");
  const [teamName, setTeamName] = useState("");
  const { toast } = useToast();
  const { saveRegistrationData } = useUserRegistration();
  const queryClient = useQueryClient();

  const registrationMutation = useMutation({
    mutationFn: async (data: InsertFactionRegistration) => {
      const response = await apiRequest("POST", "/api/registrations", data);
      return response.json();
    },
    onSuccess: (registrationData) => {
      // Save the registration ID and ownerSecret to localStorage
      if (registrationData && registrationData.id && registrationData.ownerSecret) {
        saveRegistrationData(registrationData.id, registrationData.ownerSecret);
      }
      
      toast({
        title: "¡Registro exitoso!",
        description: `Te has registrado exitosamente en la facción ${faction === "efemeros" ? "Efémeros" : "Rosetta"}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      setFaction("");
      setPlayerName("");
      setCharacterUuid("");
      setTeamName("");
      if (onSuccess) {
        onSuccess();
      } else if (onClose) {
        onClose();
      }
    },
    onError: (error) => {
      toast({
        title: "Error en el registro",
        description: "Hubo un problema al registrarte. Intenta de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!faction || !playerName) {
      toast({
        title: "Campos requeridos",
        description: "Por favor selecciona una facción e ingresa tu nombre.",
        variant: "destructive",
      });
      return;
    }

    registrationMutation.mutate({
      faction: faction as "efemeros" | "rosetta",
      playerName,
      characterUuid: characterUuid || undefined,
      teamName: teamName || undefined,
    });
  };

  return (
    <div 
      className="p-6 rounded-lg border border-slate-600 max-w-md mx-auto"
      style={{
        backgroundColor: "#2a2a2a"
      }}
    >
      <h2 className="text-xl font-bold text-white mb-6 text-center">Registro de Facción</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Facción */}
        <div className="space-y-3">
          <Label className="text-gray-300">
            Facción *
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFaction("efemeros")}
              className={`h-20 flex flex-col items-center justify-center border-2 transition-all ${
                faction === "efemeros"
                  ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                  : "border-slate-600 text-gray-300 hover:border-cyan-400 hover:bg-cyan-500/10"
              }`}
              data-testid="button-faction-efemeros"
            >
              <Shield className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">Efémeros</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFaction("rosetta")}
              className={`h-20 flex flex-col items-center justify-center border-2 transition-all ${
                faction === "rosetta"
                  ? "border-blue-500 bg-blue-500/20 text-blue-300"
                  : "border-slate-600 text-gray-300 hover:border-blue-400 hover:bg-blue-500/10"
              }`}
              data-testid="button-faction-rosetta"
            >
              <Users className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">Rosetta</span>
            </Button>
          </div>
        </div>

        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="playerName" className="text-gray-300">
            Nombre del Jugador *
          </Label>
          <Input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ingresa tu nombre"
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            data-testid="input-player-name"
            required
          />
        </div>

        {/* Colmena */}
        <div className="space-y-2">
          <Label htmlFor="teamName" className="text-gray-300">
            Colmena (opcional)
          </Label>
          <Input
            id="teamName"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Ingresa el nombre de tu colmena"
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            data-testid="input-team-name"
          />
        </div>

        {/* UUID del Personaje (opcional) */}
        <div className="space-y-2">
          <Label htmlFor="characterUuid" className="text-gray-300">
            UUID del Personaje (opcional)
          </Label>
          <Input
            id="characterUuid"
            type="text"
            value={characterUuid}
            onChange={(e) => setCharacterUuid(e.target.value)}
            placeholder="Ingresar UUID"
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            data-testid="input-character-uuid"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
              data-testid="button-cancel"
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={registrationMutation.isPending}
            className={`flex-1 font-semibold ${
              faction === "efemeros" 
                ? "bg-cyan-600 hover:bg-cyan-700 text-white" 
                : faction === "rosetta"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
            data-testid="button-register"
          >
            {registrationMutation.isPending ? "Registrando..." : "Registrarse"}
          </Button>
        </div>
      </form>
    </div>
  );
}