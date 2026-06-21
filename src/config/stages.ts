import { OrderStage } from '@prisma/client';

export const STAGE_ORDER: OrderStage[] = [
    OrderStage.PENDING_DESIGN,
    OrderStage.AWAITING_APPROVAL,
    OrderStage.PRINTING,
    OrderStage.FRAMING,
    OrderStage.PACKAGING,
    OrderStage.READY_FOR_PICKUP,
    OrderStage.DELIVERED
];

export function validateStageTransition(current: OrderStage, next: OrderStage): { valid: boolean; message?: string } {
    if (current === OrderStage.DELIVERED) {
        return { valid: false, message: "Delivered is the final stage and cannot be changed." };
    }

    const currentIndex = STAGE_ORDER.indexOf(current);
    const nextIndex = STAGE_ORDER.indexOf(next);

    if (nextIndex === -1) {
        return { valid: false, message: "The requested stage is invalid." };
    }

    if (nextIndex === currentIndex + 1) {
        return { valid: true };
    }

    if (nextIndex <= currentIndex) {
        return { valid: false, message: "Orders cannot move backwards." };
    }

    return { valid: false, message: "Orders cannot skip stages." };
}