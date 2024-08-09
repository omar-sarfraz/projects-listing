export const createJoiError = (e: any) => {
    const isJoiError = e?.details?.length;
    return isJoiError ? e.details[0].message : null;
};
