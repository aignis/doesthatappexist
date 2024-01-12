import React, { useState } from 'react';
import axios from 'axios';

export const runtime = 'edge';

const Home = () => {
  const [appUrl, setAppUrl] = useState('');
  const [appData, setAppData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/parse-app', { appUrl });
      setAppData(response.data);
    } catch (error) {
      console.error('Error parsing app data:', error);
    }
  };

  return (
    <div>
      <h1>App Data Parser</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="appUrl">Paste App Store URL:</label>
        <input
          type="text"
          id="appUrl"
          value={appUrl}
          onChange={(e) => setAppUrl(e.target.value)}
          required
        />
        <button type="submit">Parse and Save</button>
      </form>
      <hr />
      {appData && (
        <div>
          <h2>Stored App Data:</h2>
          <p>Title: {appData.title}</p>
          <p>Description: {appData.description}</p>
        </div>
      )}
    </div>
  );
};

export default Home;

