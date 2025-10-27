# boutique-api

🗂️ Modèle de données – API Boutiques
📘 Vue d’ensemble

L’API permet de gérer un ensemble de boutiques publiées par des administrateurs et consultées par des utilisateurs.
Les utilisateurs peuvent également mettre des boutiques en favoris pour les retrouver facilement.

🧩 Entités principales
1. Utilisateur (users)

Représente toute personne inscrite sur la plateforme.

Champ	Type	Description
id	UUID / ObjectId	Identifiant unique de l’utilisateur
nom	String	Nom complet de l’utilisateur
email	String (unique)	Adresse email utilisée pour la connexion
mot_de_passe	String (haché)	Mot de passe sécurisé
role	Enum(admin, user)	Rôle de l’utilisateur (administrateur ou simple utilisateur)
date_creation	DateTime	Date d’inscription de l’utilisateur
dernier_login	DateTime	Dernière connexion (optionnel)

Relations :

Un utilisateur peut avoir plusieurs favoris.

Un administrateur peut publier plusieurs boutiques.

2. Boutique (shops)

Représente une boutique physique ou en ligne.

Champ	Type	Description
id	UUID / ObjectId	Identifiant unique de la boutique
nom	String	Nom de la boutique
description	Text	Description de la boutique
adresse	String	Adresse physique (ou indication “en ligne”)
categorie	String	Catégorie (ex. vêtements, alimentation, high-tech…)
telephone	String	Numéro de contact de la boutique
email_contact	String	Email de contact (optionnel)
site_web	String	Lien vers le site web (optionnel)
images	Array(String)	Liste d’URLs d’images de la boutique
cree_par	FK → users.id	Référence vers l’administrateur qui l’a créée
date_publication	DateTime	Date de création ou de publication
est_active	Boolean	Indique si la boutique est visible au public

Relations :

Une boutique est créée par un administrateur.

Une boutique peut être ajoutée aux favoris de plusieurs utilisateurs.

3. Favori (favorites)

Représente le lien entre un utilisateur et une boutique qu’il a mise en favori.

Champ	Type	Description
id	UUID / ObjectId	Identifiant unique du favori
utilisateur_id	FK → users.id	Référence vers l’utilisateur
boutique_id	FK → shops.id	Référence vers la boutique
date_ajout	DateTime	Date à laquelle le favori a été ajouté

Relations :

Plusieurs utilisateurs peuvent aimer une même boutique.

Un utilisateur peut avoir plusieurs boutiques favorites.

Relations (diagramme logique simplifié)
   ┌───────────────┐          ┌───────────────┐          ┌───────────────┐
   │   UTILISATEUR │◄────────►│   FAVORI      │◄────────►│   BOUTIQUE    │
   └───────────────┘          └───────────────┘          └───────────────┘
         ▲
         │
         │ crée
         │
         └──────────────────────────────────────────►
                         BOUTIQUE

Exemple d’organisation de routes
Méthode	Route	Description	Accès
POST	/auth/register	Créer un compte utilisateur	Public
POST	/auth/login	Se connecter	Public
GET	/shops	Lister toutes les boutiques	Public
GET	/shops/:id	Voir une boutique spécifique	Public
POST	/shops	Créer une nouvelle boutique	Admin
PUT	/shops/:id	Modifier une boutique	Admin
DELETE	/shops/:id	Supprimer une boutique	Admin
POST	/favorites	Ajouter une boutique aux favoris	Utilisateur connecté
GET	/favorites	Lister les favoris de l’utilisateur connecté	Utilisateur connecté
DELETE	/favorites/:id	Supprimer un favori	Utilisateur connecté


