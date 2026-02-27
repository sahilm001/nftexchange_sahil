const generateNfts = () => {
  const nfts = [];
  const themes = ['Cyberpunk', 'Futuristic', 'Abstract 3D', 'Fantasy'];
  const adjectives = ['Cosmic', 'Neon', 'Ethereal', 'Quantum', 'Digital', 'Cyber', 'Astral', 'Galactic', 'Mystic', 'Void', 'Prismatic', 'Obsidian', 'Luminous'];
  const nouns = ['Voyager', 'Dreams', 'Forest', 'Core', 'Samurai', 'Punk', 'Ape', 'Dragon', 'Phoenix', 'Oracle', 'Entity', 'Ghost', 'Matrix'];

  for (let i = 1; i <= 60; i++) {
    const isListed = i % 5 !== 0; // 80% listed
    const price = (Math.random() * 5 + 0.1).toFixed(2);

    // Select Theme
    const category = themes[i % themes.length];

    // Using 100% stable Picsum image endpoints for each ID.
    // They will be transformed into "Cyberpunk", "Futuristic", etc via CSS filters in the UI!
    const imageUrl = `https://picsum.photos/seed/nft_art_${i * 99}/500/500`;

    nfts.push({
      id: i.toString(),
      name: `${adjectives[(i * 3) % adjectives.length]} ${nouns[(i * 7) % nouns.length]} #${i.toString().padStart(3, '0')}`,
      description: `A unique digital collectible from the highly sought-after ${category} collection.`,
      price: isListed ? price : '0',
      image: imageUrl,
      owner: isListed ? `0x${Math.floor(Math.random() * 16777215).toString(16)}...${Math.floor(Math.random() * 16777215).toString(16)}` : '0xUser...Address',
      seller: isListed ? `0x${Math.floor(Math.random() * 16777215).toString(16)}...${Math.floor(Math.random() * 16777215).toString(16)}` : '',
      isListed: isListed,
      category: category,
      themeClass: category.toLowerCase().replace(' ', '-')
    });
  }
  return nfts;
};

export const DUMMY_NFTS = generateNfts();

export const USER_PROFILE = {
  address: '0xUser...Address',
  balance: '4.5',
};
