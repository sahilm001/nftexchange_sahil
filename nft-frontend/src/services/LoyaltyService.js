export const calculateLoyalty = (ownedNftCount) => {
    // Simple logic: 50 points per NFT owned
    const points = ownedNftCount * 50;

    let tier = 'Bronze';
    let tierColor = '#cd7f32'; // Bronze color

    if (points >= 500) {
        tier = 'Gold';
        tierColor = '#ffd700'; // Gold color
    } else if (points >= 100) {
        tier = 'Silver';
        tierColor = '#c0c0c0'; // Silver color
    }

    return { points, tier, tierColor };
};
