import { clarity } from "clarity-js";

const PROJECT_ID = "xptbci8ccp";

export const initializeClarity = () => {
  clarity.init(PROJECT_ID);
};