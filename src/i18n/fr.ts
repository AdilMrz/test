import frenchMessages from "ra-language-french";

const customFrenchMessages = {
  ...frenchMessages,
  resources: {
    customers: {
      name: "Client |||| Clients",
      fields: {
        fullname: "Nom complet",
        email: "Email",
        address: "Adresse",
        created_at: "Créé le",
        updated_at: "Modifié le",
      },
      create: "Créer un client",
      edit: "Modifier le client",
      delete: "Supprimer le client",
      details: "Détails du client",
    },
    products: {
      name: "Produit |||| Produits",
      fields: {
        name: "Nom",
        description: "Description",
        photo_url: "Photo",
        created_at: "Créé le",
        updated_at: "Modifié le",
      },
      create: "Créer un produit",
      edit: "Modifier le produit",
      delete: "Supprimer le produit",
      details: "Détails du produit",
    },
    purchases: {
      name: "Achat |||| Achats",
      fields: {
        customer_id: "Client",
        product_id: "Produit",
        price: "Prix",
        purchase_date: "Date d'achat",
        customer_fullname: "Nom du client",
        created_at: "Créé le",
        updated_at: "Modifié le",
      },
      create: "Créer un achat",
      edit: "Modifier l'achat",
      delete: "Supprimer l'achat",
      details: "Détails de l'achat",
    },
    audit_logs: {
      name: "Journal d'activité |||| Journaux d'activité",
      fields: {
        action: "Action",
        resource: "Ressource",
        date: "Date",
        user: "Utilisateur",
        details: "Détails",
        created_at: "Créé le",
      },
    },
    maintenance: {
      name: "Maintenance",
      title: "Maintenance du système",
      description: "Maintenance et configuration du système",
    },
  },
  dashboard: {
    title: "Tableau de bord",
    welcome: "Bienvenue sur le tableau de bord",
    startDate: "Date de début",
    endDate: "Date de fin",
    apply: "Appliquer",
    clear: "Effacer",
    export: "Exporter en PDF",
    cards: {
      purchaseDistribution: "Distribution des achats",
      productRevenue: "Revenus par produit",
      recentPurchases: "Achats récents",
    },
  },
  common: {
    actions: "Actions",
    details: "Détails",
    edit: "Modifier",
    delete: "Supprimer",
    cancel: "Annuler",
    save: "Enregistrer",
    create: "Créer",
    search: "Rechercher",
    filter: "Filtrer",
    refresh: "Actualiser",
    back: "Retour",
    noData: "Aucune donnée disponible",
    areYouSure: "Êtes-vous sûr ?",
    startDate: "Date de début",
    endDate: "Date de fin",
    apply: "Appliquer",
    clear: "Effacer le filtre",
  },
  buttons: {
    create_customer: "Nouveau client",
    create_product: "Nouveau produit",
    create_purchase: "Nouvel achat",
    upload_photo: "Télécharger une photo",
    change_photo: "Changer la photo",
    export: "Exporter",
  },
  dialogs: {
    delete: {
      title: "Confirmation de suppression",
      content: "Êtes-vous sûr de vouloir supprimer cet élément ?",
    },
    create: {
      customer: "Créer un nouveau client",
      product: "Créer un nouveau produit",
      purchase: "Créer un nouvel achat",
    },
    edit: {
      customer: "Modifier le client",
      product: "Modifier le produit",
      purchase: "Modifier l'achat",
    },
  },
  validation: {
    required: "Obligatoire",
    email: "Adresse email invalide",
    price: {
      positive: "Le prix doit être positif",
      required: "Le prix est obligatoire",
    },
    date: {
      invalid: "Date invalide",
      future: "La date ne peut pas être dans le futur",
    },
  },
  notifications: {
    success: {
      create: "Création réussie",
      update: "Mise à jour réussie",
      delete: "Suppression réussie",
    },
    error: {
      create: "Erreur lors de la création",
      update: "Erreur lors de la mise à jour",
      delete: "Erreur lors de la suppression",
      general: "Une erreur est survenue",
    },
  },
};

export default customFrenchMessages;
