


import type { Favorite, FavoriteRepistory, createdFavoriteInput } from "./favorite.model";
import { 
    MissingIdError, 
    InvalidFavoriteDataError, 
    DuplicateFavoriteError 
} from "@/lib/errorHandler";

/**
 * Service métier pour la gestion des favoris.
 * Ici, la validation stricte des données (schéma) reste côté route (rest), pas ici.
 * On se concentre sur la logique métier (unicité, vérifs Id, traitement d'erreur).
 */
export class FavoriteService {
    private repo: FavoriteRepistory;

    constructor(repository: FavoriteRepistory) {
        this.repo = repository;
    }

    /**
     * Crée un favori après vérification métier.
     * - Vérifie l'unicité: l'utilisateur ne peut pas avoir plusieurs favoris pour la même ressource.
     * - Retourne le favori créé ou lève une exception personnalisée en cas d'échec.
     */
    async createFavorite(input: createdFavoriteInput): Promise<Favorite> {
        // Vérification métier : unicité pour {userId, entityId}
        const exists = await this.repo.readOne(`${input.user_id}-${input.shop_id}`);
        if (exists) {
            throw new DuplicateFavoriteError(`Favori déjà existant pour l'utilisateur ${input.user_id}`);
        }

        const newFavorite: Favorite = {
            id: `${input.user_id}-${input.shop_id}`,
            ...input,
        };

        try {
            const created = await this.repo.create(newFavorite);
            // Typage fort : on vérifie qu'on retourne bien un Favorite
            if (!created || typeof created !== "object" || !created.id) {
                throw new InvalidFavoriteDataError("Erreur à la création du favori.");
            }
            // Log applicatif en option
            // console.info(`[Favorite] Création OK pour id=${created.id}`);
            return created;
        } catch (err) {
            // Log applicatif en option : console.error(...)
            throw new InvalidFavoriteDataError((err as Error).message || "Erreur inconnue lors de la création d'un favori.");
        }
    }

    /**
     * Retourne un favori à partir de son id.
     * Lève une erreur personnalisée si id manquant ou favori introuvable.
     */
    async readOneFavorite(id: string): Promise<Favorite> {
        if (!id) {
            throw new MissingIdError();
        }
        const favorite = await this.repo.readOne(id);
        if (!favorite) {
            throw new InvalidFavoriteDataError(`Aucun favori trouvé avec l'id ${id}`);
        }
        return favorite;
    }
  
    /**
     * Retourne tous les favoris, jamais undefined.
     */
    async readAllFavorites(): Promise<Favorite[]> {
        const favorites = await this.repo.readAll();
        if (!Array.isArray(favorites)) {
            throw new InvalidFavoriteDataError("Liste des favoris inaccessible.");
        }
        return favorites;
    }

    /**
     * Supprime un favori à partir de son id.
     * Retourne des informations enrichies sur la suppression.
     */
    async deleteFavorite(id: string): Promise<{ success: boolean, reason?: string }> {
        if (!id) {
            return { success: false, reason: "MissingId" };
        }
        const favoriteFound = await this.repo.readOne(id);

        if (!favoriteFound) {
            return { success: false, reason: "NotFound" };
        }
        try {
            await this.repo.delete(id);
            // Log optionnel : console.info(`[Favorite] Suppression OK pour id=${id}`);
            return { success: true };
        } catch (err) {
            // Log optionnel : console.error(`[Favorite] Suppression erreur`, err);
            return { success: false, reason: (err as Error).message || "DatabaseError" };
        }
    }
}

