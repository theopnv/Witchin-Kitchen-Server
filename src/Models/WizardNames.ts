export class WizardNames {
    names = new Set(['Wizard of Ozz']);
    namesTaken = new Set();

    useName(name: string) {
        if (this.names.has(name)) {
            this.names.delete(name);
            this.namesTaken.add(name);
        } else
            return false;
        return true;
    }

    releaseName(name: string) {
        if (this.namesTaken.has(name)) {
            this.namesTaken.delete(name);
            this.names.add(name);
        } else
            return false;
        return true;
    }
}