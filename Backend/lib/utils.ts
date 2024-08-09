export const createJoiError = (e: any) => {
    const isJoiError = e?.details?.length;
    return isJoiError ? e.details[0].message : null;
};

export const USER_ROLES = {
    freelancer: "FREELANCER",
    client: "CLIENT",
};
