import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {

    const navigate = useNavigate();

    const handleCommander = async () => {

        try {

            const token =
                localStorage.getItem("marinfo_token") ||
                localStorage.getItem("token");

            const panier =
                JSON.parse(localStorage.getItem("marinfo_cart")) || [];

            const commandeData = {

                adresseLivraison: "Rue Mohammed V",

                villeLivraison: "Casablanca",

                methodePaiement: "CARTE_BANCAIRE",

                lignes: panier.map((item) => ({
                    articleId: item.id,
                    quantite: item.quantite || 1,
                })),
            };

            console.log("TOKEN =", token);
            console.log("PANIER =", panier);
            console.log("COMMANDE DATA =", commandeData);

            const response = await axios.post(
                "/api/commandes",
                commandeData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("COMMANDE CREEE =", response.data);

            localStorage.removeItem("marinfo_cart");

            navigate(`/commandes/${response.data.id}`);

        } catch (error) {

            console.error("ERREUR COMPLETE =", error);

            console.log(
                "ERREUR COMMANDE =",
                error.response?.status,
                error.response?.data
            );

            alert(
                "Erreur lors de la validation de la commande : " +
                JSON.stringify(
                    error.response?.data || "Erreur inconnue"
                )
            );
        }
    };

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Validation de commande
            </h1>

            <button
                onClick={handleCommander}
                className="bg-blue-600 text-white px-6 py-3 rounded"
            >
                Confirmer la commande
            </button>

        </div>
    );
};

export default Checkout;