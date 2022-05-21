export const MAX_INT = 2147483647;
export const MIN_REQUESTED_MESSAGES = 10;
export const MAX_REQUESTED_MESSAGES = 100;
export const DEFAULT_REQUESTED_MESSAGES = 25;

export function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

// check if input is number, if so assume it's the channel id otherwise assume
// it's channel name (must start with `#` so add it in case it's not there)
export function figureOutChannel(queryInput) {
    const channelId = Number.parseInt(queryInput);
    if (Number.isNaN(channelId)) {
        return queryInput.startsWith("#") ? queryInput : `#${queryInput}`;
    } else {
        return channelId;
    }
}

// same as above, but without `#`
export function figureOutUser(queryInput) {
    const userId = Number.parseInt(queryInput);
    if (Number.isNaN(userId)) {
        return queryInput
    } else {
        return userId;
    }
}