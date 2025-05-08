import React, { useState } from "react";
import Notification from "./Notification";
import ActionButton from "./ActionButton";

interface Agency {
  name: string;
  email: string;
  contact: string;
  adresse: string;
  description: string;
}

interface ProfileSectionProps {
  agency: Agency;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ agency }) => {
  const [agencyName, setAgencyName] = useState<string>(agency.name);
  const [email, setEmail] = useState<string>(agency.email);
  const [contact, setContact] = useState<string>(agency.contact);
  const [adresse, setAdresse] = useState<string>(agency.adresse);
  const [description, setDescription] = useState<string>(agency.description);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 18000);
  };

  const handleSave = async (): Promise<void> => {
    const updatedAgency = {
      nom: agencyName,
      email,
      contact,
      adresse,
      description,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/agences/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAgency),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Token invalide" || data.message === "Token expiré") {
          showNotification(data.message, "error");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login_agency";
        } else {
          showNotification(data.message || "Erreur serveur", "error");
        }
        return;
      }

      const updatedData = data.updatedData;
      showNotification(data.message, "success");

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: updatedData.id,
          nom: updatedData.nom,
          email: updatedData.email,
          contact: updatedData.contact,
          adresse: updatedData.adresse,
          description: updatedData.description,
          type: "agence",
        })
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      showNotification("Erreur serveur", "error");
    }
  };

  return (
    <section className="my-6 p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-medium mb-4">Profil de l'Agence</h3>

      <div className="mb-4">
        <label className="block font-medium mb-1">Nom de l'agence :</label>
        <input
          type="text"
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          disabled={!isEditing}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Email :</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          disabled={!isEditing}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Contact :</label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          disabled={!isEditing}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Adresse :</label>
        <input
          type="text"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          disabled={!isEditing}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Description :</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          disabled={!isEditing}
        />
      </div>

      {!isEditing ? (
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          onClick={() => setIsEditing(true)}
        >
          Modifier
        </button>
      ) : (
        <div className="flex gap-4">
          <ActionButton
            loading={saving}
            onClick={async () => {
              setSaving(true);
              await handleSave();
              setIsEditing(false);
              setSaving(false);
            }}
            text="Enregistrer"
            loadingText="Enregistrement..."
            color="blue"
          />
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => setIsEditing(false)}
          >
            Annuler
          </button>
        </div>
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </section>
  );
};

export default ProfileSection;
