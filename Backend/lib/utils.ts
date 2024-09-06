export const createJoiError = (e: any) => {
    const isJoiError = e?.details?.length;
    return isJoiError ? e.details[0].message : null;
};

export const USER_ROLES = {
    freelancer: "FREELANCER",
    client: "CLIENT",
};

export const channels = {
    PROJECT_UPDATE: "project_update",
};

export const events = {
    BID_UPDATE: "bid_update",
    BID_CREATE: "bid_create",
};
