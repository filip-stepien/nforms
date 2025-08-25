/* eslint-disable */

try {
    const status = rs.status();
    if (!status.ok && status.codeName !== 'NotYetInitialized') {
        quit(1);
    }
} catch (_err) {
    try {
        rs.initiate();
    } catch (__err) {
        quit(1);
    }
}
