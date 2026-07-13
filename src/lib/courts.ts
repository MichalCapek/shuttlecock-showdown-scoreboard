import { COURT_IDS } from "@/constants";

export type CourtId = (typeof COURT_IDS)[keyof typeof COURT_IDS];

export const COURT_ID_LIST: readonly CourtId[] = [COURT_IDS.COURT_1, COURT_IDS.COURT_2];

export function isCourtId(id: string | undefined): id is CourtId {
    return COURT_ID_LIST.includes(id as CourtId);
}

export function getCourtLabel(courtId: CourtId): string {
    return courtId === COURT_IDS.COURT_1 ? "Kurt 1" : "Kurt 2";
}

export function getCourtNumber(courtId: CourtId): 1 | 2 {
    return courtId === COURT_IDS.COURT_1 ? 1 : 2;
}
