/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
export interface IButtonDisabler {
    disableThenExecute(ElementIdsToDisable:string[], doer: () => Promise<void>) : Promise<void>;
}