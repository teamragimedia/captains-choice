import "../styles/brandStrip.css";

function BrandStrip() {
  const brands = [
    "Cloud Kitchen Co.",
    "Spice Garden",
    "Biryani House",
    "Tandoor Nights",
  ];

  return (
    <section className="brand-strip">
      <div className="container brand-container">
        <div className="brand-left">TRUSTED BY LEADING RESTAURANTS:</div>

        <div className="brand-right">
          <div className="scroll-track">
            {[...brands, ...brands].map((brand, index) => (
              <span key={index}>{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandStrip;
