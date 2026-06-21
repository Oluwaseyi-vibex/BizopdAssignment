import { OrderStage } from '../../generated/prisma/client';
export declare const STAGE_ORDER: OrderStage[];
export declare function validateStageTransition(current: OrderStage, next: OrderStage): {
    valid: boolean;
    message?: string;
};
//# sourceMappingURL=stages.d.ts.map