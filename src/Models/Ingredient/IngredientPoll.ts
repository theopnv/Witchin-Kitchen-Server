import { Ingredient } from './Ingredient';

export class IngredientPoll {
    constructor(ingredients: Ingredient[]) {
        this.ingredients = ingredients;
    }

    vote(eventId: number) {
        let idx = this.ingredients.findIndex(event => event.id == eventId);
        if (idx == -1)
            return false;
        this.ingredients[idx].votes += 1;
        return true;
    }

    ingredients: Ingredient[];
}