export function AboutPage() {
  return (
    <section className="space-y-8">
      <div className="grid gap-8 md:grid-cols-[1.2fr,0.8fr]">
        <img
          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
          alt="Friends enjoying the beach in RAKU outfits"
          className="h-full w-full rounded-lg object-cover shadow-sm"
        />
        <div className="space-y-4 rounded-lg bg-neutral-50 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">About Us</h2>
          <p className="text-neutral-700">
            At RAKU, we are passionate about bringing you the latest trends and styles in summer fashion. Our mission is
            to provide a curated collection of high-quality and comfortable clothing that ensures you look effortlessly
            chic.
          </p>
          <p className="text-neutral-700">
            From vibrant dresses to breezy swimwear and casual essentials, every piece is handpicked to elevate your
            wardrobe. With a commitment to style, quality, and customer satisfaction, we invite you to explore our
            online store and discover the perfect pieces to make every moment memorable.
          </p>
        </div>
      </div>
    </section>
  )
}
