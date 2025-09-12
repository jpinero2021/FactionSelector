import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUserRegistration } from "@/hooks/use-user-registration";

interface ConfirmDeleteRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationId: string;
  playerName: string;
  faction: "efemeros" | "rosetta";
}

export default function ConfirmDeleteRegistrationModal({
  isOpen,
  onClose,
  registrationId,
  playerName,
  faction
}: ConfirmDeleteRegistrationModalProps) {
  const { toast } = useToast();
  const { clearRegistrationId, getOwnerSecret } = useUserRegistration();
  const queryClient = useQueryClient();

  const deleteRegistrationMutation = useMutation({
    mutationFn: async () => {
      const ownerSecret = getOwnerSecret();
      
      if (!ownerSecret) {
        throw new Error("No se encontró el secreto de registro. Por favor, registrate nuevamente.");
      }
      
      const response = await apiRequest(
        "DELETE", 
        `/api/registrations/${registrationId}`,
        undefined,
        { "X-Registration-Secret": ownerSecret }
      );
      return response;
    },
    onSuccess: () => {
      // Clear the registration ID from localStorage since it's deleted
      clearRegistrationId();
      
      toast({
        title: "Registro eliminado",
        description: `El registro de ${playerName} ha sido eliminado exitosamente.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      onClose();
    },
    onError: (error) => {
      let errorMessage = "Hubo un problema al eliminar tu registro. Intenta de nuevo.";
      
      if (error instanceof Error) {
        if (error.message.includes("403")) {
          errorMessage = "No tienes autorización para eliminar este registro.";
        } else if (error.message.includes("secreto de registro")) {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error al eliminar registro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleConfirm = () => {
    deleteRegistrationMutation.mutate();
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
        className="sm:max-w-md border-slate-600"
        style={{ backgroundColor: "#2a2a2a" }}
      >
        <DialogHeader>
          <DialogTitle className="text-white font-bold">
            Confirmar Eliminación de Registro
          </DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            Esta acción no se puede deshacer. Tu registro será eliminado permanentemente de la base de datos.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="text-gray-300">
            <span className="font-medium">Jugador:</span>
            <span className="ml-2 text-white">{playerName}</span>
          </div>
          
          <div className="text-gray-300">
            <span className="font-medium">Facción:</span>
            <span className={`ml-2 ${factionColors[faction]}`}>
              {factionNames[faction]}
            </span>
          </div>

          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
            <div className="flex items-center">
              <div className="text-red-400 text-sm">
                <strong>⚠️ Advertencia:</strong> Esta acción eliminará tu registro de forma permanente. 
                Tendrás que registrarte nuevamente si quieres volver a participar.
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteRegistrationMutation.isPending}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
            data-testid="button-cancel-delete"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={deleteRegistrationMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            data-testid="button-confirm-delete"
          >
            {deleteRegistrationMutation.isPending ? "Eliminando..." : "Eliminar Registro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}