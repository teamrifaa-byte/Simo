import React from "react";
import { useParams, Link } from "react-router-dom";

const OrderTracking = () => {

    const { id } = useParams();

    return (

        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Commande confirmée 🎉
            </h1>

            <div className="bg-white shadow rounded p-6">

                <p className="mb-4">
                    Votre commande a été créée avec succès.
                </p>

                <p className="mb-4">
                    Numéro de commande :
                    <strong> #{id}</strong>
                </p>

                <p className="text-green-600 font-semibold">
                    Statut : En attente
                </p>

            </div>

            <Link
                to="/catalogue"
                className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded"
            >
                Retour au catalogue
            </Link>

        </div>

    );
};

export default OrderTracking;