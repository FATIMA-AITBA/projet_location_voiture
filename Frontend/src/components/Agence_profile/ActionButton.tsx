import React from "react";

type Props = {
  loading: boolean;
  onClick: () => void;
  text: string;
  loadingText?: string;
  color: "green" | "red" | "gray" | "blue";
  // Ajout d'un type d'action spécifique pour l'agence
  actionType?: "submit" | "cancel" | "edit"; // Exemple de types d'actions spécifiques
};

const ActionButton: React.FC<Props> = ({
  loading,
  onClick,
  text,
  loadingText = "Chargement...",
  color,
  actionType = "submit", // Valeur par défaut "submit"
}) => {
  const baseColor = {
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    gray: "bg-gray-500 hover:bg-gray-600",
    blue: "bg-blue-600 hover:bg-blue-700",
  }[color];

  const disabledColor = "bg-gray-400";

  // Personnalisation du texte du bouton en fonction de l'action
  let actionText = text;
  if (actionType === "submit") {
    actionText = loading ? "Soumission en cours..." : text; 
  } else if (actionType === "cancel") {
    actionText = loading ? "Annulation en cours..." : "Annuler";
  } else if (actionType === "edit") {
    actionText = loading ? "Modification en cours..." : "Modifier";
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${
        loading ? disabledColor : baseColor
      } text-white px-6 py-2 rounded transition min-w-[120px] text-center flex justify-center items-center`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          {loadingText}
        </span>
      ) : (
        actionText // Afficher le texte personnalisé basé sur l'action
      )}
    </button>
  );
};

export default ActionButton;
