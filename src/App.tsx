import { useState } from 'react';
import './App.css';

import type { ChangeEvent, FormEvent } from 'react';

function App() {
  const [asset, setAsset] = useState('');

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setAsset(target.value);
  };

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Should trim asset string
    console.log('onSubmit', event);
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
