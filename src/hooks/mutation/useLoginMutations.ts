import { useMutation } from "@tanstack/react-query";

import { checkEmail, requestEmailVerification, signInByEmail } from "../../api/endpoints";

export const useLoginMutations = () => {
    const checkEmailMutation = useMutation({ mutationFn: checkEmail });
    const requestEmailVerificationMutation = useMutation({ mutationFn: requestEmailVerification });
    const loginMutation = useMutation({ mutationFn: signInByEmail });

    return {
        checkEmailMutation,
        requestEmailVerificationMutation,
        loginMutation
    };
};
