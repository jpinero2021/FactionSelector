import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserRegistration } from "@/hooks/use-user-registration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
        <div className="space-y-2">
          <Label htmlFor="faction" className="text-gray-300">
            Facción *
          </Label>
          <Select 
            value={faction} 
            onValueChange={(value) => setFaction(value as "efemeros" | "rosetta")}
          >
            <SelectTrigger 
              id="faction"
              className="bg-slate-700 border-slate-600 text-white"
              data-testid="select-faction"
            >
              <SelectValue placeholder="Selecciona una facción" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="efemeros" className="text-white hover:bg-slate-600">
                Efémeros
              </SelectItem>
              <SelectItem value="rosetta" className="text-white hover:bg-slate-600">
                Rosetta
              </SelectItem>
            </SelectContent>
          </Select>
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
            UUID del Personaje (puede ser numérico como 150464316)
          </Label>
          <Input
            id="characterUuid"
            type="text"
            value={characterUuid}
            onChange={(e) => setCharacterUuid(e.target.value)}
            placeholder="ej: 150464316 o abc-def-123"
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