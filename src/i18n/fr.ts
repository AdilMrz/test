import frenchMessages from "ra-language-french";

const customFrenchMessages = {
  ...frenchMessages,
  ra: {
    ...frenchMessages.ra,
    page: {
      ...frenchMessages.ra.page,
      create: "Créer %{name}",
      edit: "%{name} %{recordRepresentation}",
      list: "%{name}",
      show: "%{name} %{recordRepresentation}",
    },
    action: {
      ...frenchMessages.ra.action,
      create: "Créer",
      edit: "Modifier",
      delete: "Supprimer",
      show: "Afficher",
      list: "Liste",
      save: "Enregistrer",
      cancel: "Annuler",
      back: "Retour",
      refresh: "Actualiser",
      add_filter: "Ajouter un filtre",
      remove_filter: "Supprimer ce filtre",
      remove_all_filters: "Supprimer tous les filtres",
      export: "Exporter",
      search: "Rechercher",
      sort: "Trier",
      undo: "Annuler",
      expand: "Développer",
      close: "Fermer",
      open_menu: "Ouvrir le menu",
      close_menu: "Fermer le menu",
    },
    navigation: {
      ...frenchMessages.ra.navigation,
      page: "Aller à la page %{page}",
      current_page: "page %{page}",
      first: "Aller à la première page",
      last: "Aller à la dernière page",
      next: "Aller à la page suivante",
      previous: "Aller à la page précédente",
      page_rows_per_page: "Lignes par page :",
      skip_nav: "Aller au contenu",
    },
    message: {
      ...frenchMessages.ra.message,
      bulk_delete_content:
        "Êtes-vous sûr de vouloir supprimer cet élément ? |||| Êtes-vous sûr de vouloir supprimer ces %{smart_count} éléments ?",
      bulk_delete_title:
        "Supprimer %{name} |||| Supprimer %{smart_count} %{name}",
      delete_content: "Êtes-vous sûr de vouloir supprimer cet élément ?",
      delete_title: "Supprimer %{name} #%{id}",
      details: "Détails",
      error:
        "Une erreur s'est produite et votre demande n'a pas pu être traitée.",
      invalid_form:
        "Le formulaire n'est pas valide. Veuillez vérifier les erreurs",
      loading: "La page se charge, merci de patienter",
      no: "Non",
      not_found: "Vous avez tapé une mauvaise URL ou suivi un mauvais lien.",
      yes: "Oui",
      unsaved_changes:
        "Certaines de vos modifications n'ont pas été sauvegardées. Êtes-vous sûr de vouloir les ignorer ?",
    },
    input: {
      ...frenchMessages.ra.input,
      file: {
        upload_several:
          "Déposez des fichiers à télécharger, ou cliquez pour sélectionner.",
        upload_single:
          "Déposez un fichier à télécharger, ou cliquez pour sélectionner.",
      },
      image: {
        upload_several:
          "Déposez des images à télécharger, ou cliquez pour sélectionner.",
        upload_single:
          "Déposez une image à télécharger, ou cliquez pour sélectionner.",
      },
      references: {
        all_missing: "Impossible de trouver des données de références.",
        many_missing:
          "Au moins une des références associées n'est plus disponible.",
        single_missing: "La référence associée n'est plus disponible.",
      },
    },
  },
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
        image: "Image",
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
        timestamp: "Horodatage",
        operation: "Opération",
        user_fullname: "Utilisateur",
        status: "Statut",
      },
    },
    maintenance: {
      name: "Maintenance",
      title: "Maintenance du système",
      description: "Maintenance et configuration du système",
    },
    dashboard: {
      name: "Tableau de bord",
      title: "Tableau de bord",
      description: "Vue d'ensemble des données",
    },
  },
  maintenance: {
    storage: {
      title: "Gestion du stockage",
    },
    buttons: {
      clear_unused: "Nettoyer les images inutilisées",
      refresh: "Actualiser",
      delete: "Supprimer",
    },
    filters: {
      show_unused: "Afficher uniquement les images inutilisées",
    },
    table: {
      preview: "Aperçu",
      name: "Nom",
      size: "Taille",
      type: "Type",
      last_modified: "Dernière modification",
      status: "Statut",
      actions: "Actions",
    },
    status: {
      in_use: "Utilisé",
      unused: "Inutilisé",
    },
    messages: {
      no_files: "Aucun fichier trouvé",
    },
  },
  audit_logs: {
    details: {
      title: "Détails du journal d'activité",
    },
    fields: {
      timestamp: "Horodatage",
      operation: "Opération",
      resource: "Ressource",
      user: "Utilisateur",
      details: "Détails",
      status: "Statut",
    },
    filters: {
      search: "Rechercher",
    },
    operations: {
      create: "Créer",
      edit: "Modifier",
      delete: "Supprimer",
      bulk_delete: "Suppression en masse",
    },
    messages: {
      no_details: "Aucun détail disponible",
    },
    resources: {
      customers: "Clients",
      products: "Produits",
      purchases: "Achats",
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
    unknown: "Inconnu",
    purchaseDistribution: "Distribution des achats",
    productRevenue: "Revenus par produit",
    recentPurchases: "Achats récents",
    table: {
      date: "Date",
      customer: "Client",
      product: "Produit",
      price: "Prix",
      no_purchases: "Aucun achat récent trouvé",
    },
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
      customer: {
        title: "Supprimer le client",
        content:
          'Êtes-vous sûr de vouloir supprimer le client "%{name}" ? Cette action échouera si le client a des achats associés.',
      },
      customers: {
        title: "Supprimer les clients",
        content:
          "Êtes-vous sûr de vouloir supprimer ces clients ? Cette action échouera pour tout client ayant des achats associés.",
      },
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
    file: {
      size: "La taille du fichier doit être inférieure à 5 Mo",
      type: "Le fichier doit être une image",
    },
    image: {
      dimensions:
        "Les dimensions de l'image doivent être de 1920x1080 pixels ou moins",
      error: "Erreur lors du chargement de l'image",
    },
    required: {
      fields: "Le nom et la description sont requis",
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
