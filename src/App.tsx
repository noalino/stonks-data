import { useState } from 'react';
import { search } from './api';
import './App.css';

import type { ChangeEvent, FormEvent } from 'react';

function App() {
  const [asset, setAsset] = useState('');

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setAsset(target.value);
  };

  const handleOnSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedAsset = asset.trim();

    try {
      const assets = await search(trimmedAsset);
      console.log(assets);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        id="asset"
        name="asset"
        placeholder="Enter a product name or ISIN"
        value={asset}
        onChange={handleChange}
      />
      <button type="submit" disabled={asset.trim().length === 0}>
        Search
      </button>
    </form>
  );
}

export default App;
