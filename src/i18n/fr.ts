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
      },
      create: "Créer un client",
      edit: "Modifier le client",
      delete: "Supprimer le client",
    },
    products: {
      name: "Produit |||| Produits",
      fields: {
        name: "Nom",
        description: "Description",
        photo_url: "Photo",
      },
      create: "Créer un produit",
      edit: "Modifier le produit",
      delete: "Supprimer le produit",
    },
    purchases: {
      name: "Achat |||| Achats",
      fields: {
        customer_id: "Client",
        product_id: "Produit",
        price: "Prix",
        purchase_date: "Date d'achat",
        customer_fullname: "Nom du client",
      },
      create: "Créer un achat",
      edit: "Modifier l'achat",
      delete: "Supprimer l'achat",
    },
    audit_logs: {
      name: "Journal d'activité |||| Journaux d'activité",
      fields: {
        action: "Action",
        resource: "Ressource",
        date: "Date",
        user: "Utilisateur",
      },
    },
  },
  ra: {
    ...frenchMessages.ra,
    message: {
      ...frenchMessages.ra.message,
      created: "Élément créé",
      updated: "Élément mis à jour",
      deleted: "Élément supprimé",
      not_found: "Non trouvé",
      loading: "Chargement...",
      invalid_form: "Le formulaire n'est pas valide",
      error: "Une erreur est survenue",
    },
    notification: {
      ...frenchMessages.ra.notification,
      item_created: "%{item} créé",
      item_updated: "%{item} mis à jour",
      item_deleted: "%{item} supprimé",
    },
    action: {
      ...frenchMessages.ra.action,
      create: "Créer",
      edit: "Modifier",
      delete: "Supprimer",
      save: "Enregistrer",
      cancel: "Annuler",
      back: "Retour",
    },
    page: {
      ...frenchMessages.ra.page,
      create: "Créer %{name}",
      edit: "Modifier %{name}",
      show: "Détails de %{name}",
      list: "Liste des %{name}",
      dashboard: "Tableau de bord",
    },
  },
  buttons: {
    create_customer: "Nouveau client",
    create_product: "Nouveau produit",
    create_purchase: "Nouvel achat",
    upload_photo: "Télécharger une photo",
    change_photo: "Changer la photo",
  },
  dialogs: {
    delete: {
      title: "Confirmation de suppression",
      content: "Êtes-vous sûr de vouloir supprimer cet élément ?",
    },
    create: {
      customer: "Créer un nouveau client",
      product: "Créer un nouveau produit",
    },
  },
  validation: {
    required: "Obligatoire",
    email: "Adresse email invalide",
    price: {
      positive: "Le prix doit être positif",
      required: "Le prix est obligatoire",
    },
  },
  dashboard: {
    startDate: "Date de début",
    endDate: "Date de fin",
    apply: "Appliquer",
    clear: "Effacer",
  },
};

export default customFrenchMessages;
