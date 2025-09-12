import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useUserRegistration } from "@/hooks/use-user-registration";

interface EditRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationId: string;
  currentData: {
    playerName: string;
    teamName: string;
    characterUuid: string;
    faction: "efemeros" | "rosetta";
  };
}

export default function EditRegistrationModal({ 
  isOpen, 
  onClose, 
  registrationId, 
  currentData 
}: EditRegistrationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { getOwnerSecret } = useUserRegistration();

  const [formData, setFormData] = useState({
    playerName: currentData.playerName,
    teamName: currentData.teamName,
    characterUuid: currentData.characterUuid,
    faction: currentData.faction,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const ownerSecret = getOwnerSecret();
      if (!ownerSecret) {
        throw new Error("No tienes permisos para editar este registro");
      }

      return apiRequest(
        "PUT",
        `/api/registrations/${registrationId}`,
        data,
        {
          "x-registration-secret": ownerSecret,
        }
      );
    },
    onSuccess: () => {
      toast({
        title: "Registro actualizado",
        description: "Los datos de tu registro han sido actualizados exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      onClose();
    },
    onError: (error: any) => {
      console.error("Error updating registration:", error);
      
      let errorMessage = "No se pudo actualizar el registro. Inténtalo de nuevo.";
      let errorTitle = "Error";
      
      // Check if it's a 409 error (duplicate player)
      if (error instanceof Error && error.message.startsWith("409:")) {
        errorTitle = "Jugador ya registrado";
        errorMessage = "Ya existe un jugador con este nombre. Por favor usa un nombre diferente.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.playerName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del jugador es requerido.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-lg z-[60]" data-testid="modal-edit-registration">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Editar Registro
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Modifica los datos de tu registro en el sistema de facciones.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-white">
              Nombre del Jugador
            </Label>
            <Input
              id="playerName"
              value={formData.playerName}
              onChange={(e) => handleInputChange("playerName", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Ingresa tu nombre de jugador"
              required
              data-testid="input-edit-player-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamName" className="text-white">
              Nombre de la Colmena
            </Label>
            <Input
              id="teamName"
              value={formData.teamName}
              onChange={(e) => handleInputChange("teamName", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Ingresa el nombre de tu colmena"
              data-testid="input-edit-team-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="characterUuid" className="text-white">
              UUID del Personaje (puede ser numérico como 150464316)
            </Label>
            <Input
              id="characterUuid"
              value={formData.characterUuid}
              onChange={(e) => handleInputChange("characterUuid", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Ej: 150464316 o abc-def-123"
              data-testid="input-edit-character-uuid"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faction" className="text-white">
              Facción
            </Label>
            <Select 
              value={formData.faction} 
              onValueChange={(value) => handleInputChange("faction", value)}
            >
              <SelectTrigger 
                className="bg-gray-800 border-gray-600 text-white"
                data-testid="select-edit-faction"
              >
                <SelectValue placeholder="Selecciona tu facción" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="efemeros" className="text-white">
                  Efémeros
                </SelectItem>
                <SelectItem value="rosetta" className="text-white">
                  Rosetta
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              data-testid="button-cancel-edit"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={updateMutation.isPending}
              data-testid="button-save-edit"
            >
              {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}