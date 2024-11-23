import { OidcConfigFilterSensitiveLog, } from "./models_2";
export const UpdateWorkforceRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.OidcConfig && { OidcConfig: OidcConfigFilterSensitiveLog(obj.OidcConfig) }),
});
