const ALPHA_URL = 'https://www.alphavantage.co/';

function Footer() {
  return (
    <footer className="h-[150px] self-stretch flex flex-col items-center justify-evenly">
      <div className="max-w-screen-sm text-center">
        This project depends on the{' '}
        <a href={ALPHA_URL} className="underline visited:underline">
          Alpha Vantage API
        </a>{' '}
        free tier, so the number of requests might be extremely limited.
      </div>
      <div>Copyright © 2024</div>
    </footer>
  );
}

export default Footer;
