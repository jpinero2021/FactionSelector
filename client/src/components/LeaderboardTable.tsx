import { useState } from "react";
import RankMedal from "./RankMedal";
import { Button } from "@/components/ui/button";
import { useUserRegistration } from "@/hooks/use-user-registration";
import ConfirmFactionChangeModal from "./ConfirmFactionChangeModal";
import ConfirmDeleteRegistrationModal from "./ConfirmDeleteRegistrationModal";
import EditRegistrationModal from "./EditRegistrationModal";
import { ArrowRightLeft, Trash2, Edit } from "lucide-react";

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  characterUuid: string;
  teamName: string;
  rank: number;
  registrationId: string; // Add this to link back to original registration
  faction: "efemeros" | "rosetta";
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  category: "efemeros" | "rosetta";
}

export default function LeaderboardTable({ entries, category }: LeaderboardTableProps) {
  // ALL HOOKS MUST BE CALLED FIRST - NO CONDITIONAL LOGIC BEFORE HOOKS
  const { currentRegistrationId } = useUserRegistration();
  const [factionChangeModal, setFactionChangeModal] = useState<{
    isOpen: boolean;
    entry: LeaderboardEntry | null;
  }>({ isOpen: false, entry: null });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    entry: LeaderboardEntry | null;
  }>({ isOpen: false, entry: null });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    entry: LeaderboardEntry | null;
  }>({ isOpen: false, entry: null });

  // Check if user owns this registration - MOVED AFTER ALL HOOKS
  const isUserRegistration = (entry: LeaderboardEntry) => {
    return currentRegistrationId === entry.registrationId;
  };

  const handleChangeFaction = (entry: LeaderboardEntry) => {
    setFactionChangeModal({ isOpen: true, entry });
  };

  const handleDeleteRegistration = (entry: LeaderboardEntry) => {
    setDeleteModal({ isOpen: true, entry });
  };

  const handleEditRegistration = (entry: LeaderboardEntry) => {
    setEditModal({ isOpen: true, entry });
  };

  const getNewFaction = (currentFaction: "efemeros" | "rosetta"): "efemeros" | "rosetta" => {
    return currentFaction === "efemeros" ? "rosetta" : "efemeros";
  };

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div 
          className="grid grid-cols-5 gap-6 px-8 py-4"
          style={{
            backgroundColor: "#1a1a1a"
          }}
        >
          <div className="text-gray-400 text-sm font-medium">Clasificación</div>
          <div className="text-gray-400 text-sm font-medium">Jugador</div>
          <div className="text-gray-400 text-sm font-medium">Colmena</div>
          <div className="text-gray-400 text-sm font-medium">UUID</div>
          <div className="text-gray-400 text-sm font-medium">Acciones</div>
        </div>

        {/* Entries */}
        <div>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="grid grid-cols-5 gap-6 px-8 py-4 hover:bg-gray-700/20 transition-colors"
              style={{
                backgroundColor: "#2a2a2a"
              }}
              data-testid={`row-player-${entry.rank}`}
            >
              {/* Rank */}
              <div className="flex items-center">
                <RankMedal rank={entry.rank} />
              </div>

              {/* Player Name */}
              <div className="flex items-center">
                <span className="text-white font-normal text-base">{entry.playerName}</span>
              </div>

              {/* Team Name */}
              <div className="flex items-center">
                <span className="text-gray-300 font-normal text-base">{entry.teamName}</span>
              </div>

              {/* Character UUID */}
              <div className="flex items-center">
                <span className="text-gray-300 font-normal text-base">{entry.characterUuid}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {isUserRegistration(entry) && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditRegistration(entry)}
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-900/20 hover:border-blue-400 text-xs"
                      data-testid={`button-edit-${entry.rank}`}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleChangeFaction(entry)}
                      className="border-slate-600 text-gray-300 hover:bg-slate-700 text-xs"
                      data-testid={`button-change-faction-${entry.rank}`}
                    >
                      <ArrowRightLeft className="w-3 h-3 mr-1" />
                      Cambiar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteRegistration(entry)}
                      className="border-red-500/50 text-red-400 hover:bg-red-900/20 hover:border-red-400 text-xs"
                      data-testid={`button-delete-${entry.rank}`}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faction Change Modal */}
      {factionChangeModal.entry && (
        <ConfirmFactionChangeModal
          isOpen={factionChangeModal.isOpen}
          onClose={() => setFactionChangeModal({ isOpen: false, entry: null })}
          registrationId={factionChangeModal.entry.registrationId}
          playerName={factionChangeModal.entry.playerName}
          currentFaction={factionChangeModal.entry.faction}
          newFaction={getNewFaction(factionChangeModal.entry.faction)}
        />
      )}

      {/* Edit Modal */}
      {editModal.entry && (
        <EditRegistrationModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, entry: null })}
          registrationId={editModal.entry.registrationId}
          currentData={{
            playerName: editModal.entry.playerName,
            teamName: editModal.entry.teamName,
            characterUuid: editModal.entry.characterUuid,
            faction: editModal.entry.faction,
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteModal.entry && (
        <ConfirmDeleteRegistrationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, entry: null })}
          registrationId={deleteModal.entry.registrationId}
          playerName={deleteModal.entry.playerName}
          faction={deleteModal.entry.faction}
        />
      )}
    </>
  );
}