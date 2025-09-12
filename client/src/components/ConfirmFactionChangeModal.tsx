import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUserRegistration } from "@/hooks/use-user-registration";

interface ConfirmFactionChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationId: string;
  playerName: string;
  currentFaction: "efemeros" | "rosetta";
  newFaction: "efemeros" | "rosetta";
}

export default function ConfirmFactionChangeModal({
  isOpen,
  onClose,
  registrationId,
  playerName,
  currentFaction,
  newFaction
}: ConfirmFactionChangeModalProps) {
  const { toast } = useToast();
  const { getOwnerSecret } = useUserRegistration();
  const queryClient = useQueryClient();

  const changeFactionMutation = useMutation({
    mutationFn: async () => {
      const ownerSecret = getOwnerSecret();
      
      if (!ownerSecret) {
        throw new Error("No se encontró el secreto de registro. Por favor, registrate nuevamente.");
      }
      
      const response = await apiRequest(
        "PUT", 
        `/api/registrations/${registrationId}/faction`, 
        { faction: newFaction },
        { "X-Registration-Secret": ownerSecret }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Facción cambiada exitosamente",
        description: `${playerName} ahora pertenece a la facción ${newFaction === "efemeros" ? "Efémeros" : "Rosetta"}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      onClose();
    },
    onError: (error) => {
      let errorMessage = "Hubo un problema al cambiar tu facción. Intenta de nuevo.";
      
      if (error instanceof Error) {
        if (error.message.includes("403")) {
          errorMessage = "No tienes autorización para cambiar esta facción.";
        } else if (error.message.includes("secreto de registro")) {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error al cambiar facción",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleConfirm = () => {
    changeFactionMutation.mutate();
  };

  const factionNames = {
    efemeros: "Efémeros",
    rosetta: "Rosetta"
  };

  const factionColors = {
    efemeros: "text-cyan-400",
    rosetta: "text-blue-400"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-lg border-slate-600 z-[60]"
        style={{ backgroundColor: "#2a2a2a" }}
      >
        <DialogHeader>
          <DialogTitle className="text-white font-bold">
            Confirmar Cambio de Facción
          </DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            Esta acción cambiará tu facción permanentemente. ¿Estás seguro de que quieres continuar?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="text-gray-300">
            <span className="font-medium">Jugador:</span>
            <span className="ml-2 text-white">{playerName}</span>
          </div>
          
          <div className="text-gray-300">
            <span className="font-medium">Cambio:</span>
            <div className="ml-2 mt-1">
              <span className={factionColors[currentFaction]}>
                {factionNames[currentFaction]}
              </span>
              <span className="mx-2 text-gray-500">→</span>
              <span className={factionColors[newFaction]}>
                {factionNames[newFaction]}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={changeFactionMutation.isPending}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
            data-testid="button-cancel-faction-change"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={changeFactionMutation.isPending}
            className={`font-semibold ${
              newFaction === "efemeros"
                ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            data-testid="button-confirm-faction-change"
          >
            {changeFactionMutation.isPending ? "Cambiando..." : "Confirmar Cambio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}