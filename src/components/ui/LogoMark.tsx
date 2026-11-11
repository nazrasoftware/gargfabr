/** Brand arch mark (transparent artwork). `light` = cream version for dark backgrounds. */
export function LogoMark({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={light ? "/brand/mark-sm-light.png" : "/brand/mark-sm-navy.png"} alt="" width={99} height={132} className={className} />
  );
}
