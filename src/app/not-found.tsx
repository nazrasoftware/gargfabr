import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-svh place-items-center bg-cotton px-4 text-center text-indigo">
      <div>
        <p className="font-hindi text-2xl text-sand-deep">धागा टूट गया</p>
        <h1 className="display-xl mt-3">404</h1>
        <p className="lede mt-4 text-muted">This thread came loose. The page you&apos;re looking for isn&apos;t here.</p>
        <Link href="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-indigo px-6 text-cotton">
          Back home
        </Link>
      </div>
    </div>
  );
}
