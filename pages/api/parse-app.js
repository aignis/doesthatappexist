import axios from 'axios';
import cheerio from 'cheerio';

export default async (req, res) => {
  const { appUrl } = req.body;

  try {
    const response = await axios.get(appUrl);
    const $ = cheerio.load(response.data);
    const scriptTagContent = $('script[type="application/ld+json"]').html();
    
    if (!scriptTagContent) {
      throw new Error('Script tag with type="application/ld+json" not found');
    }

    const jsonContent = JSON.parse(scriptTagContent);

    const appData = {
      title: jsonContent.name || 'N/A',
      description: jsonContent.description || 'N/A',
    };

    // Save appData to your database or any other desired action
    // For simplicity, we are just sending the data back to the client
    res.status(200).json(appData);
  } catch (error) {
    console.error('Error parsing app data:', error);
    res.status(500).send('Internal Server Error');
  }
};
