import { useEffect, useRef, useState } from 'react'

const looks = [
  { src: '/Lookbook/062c40b6-55ba-40cf-8477-1dc9ccabad9b.jpg', caption: 'City night, soft fleece' },
  { src: '/Lookbook/10008afa-016e-4873-a0bd-d9457f455633.jpg', caption: 'Neon glow statement' },
  { src: '/Lookbook/74947f56-f167-4946-b16c-409aab43e66d.jpg', caption: 'Winter trail layers' },
  { src: '/Lookbook/832a2b99-de7b-456f-b591-433c504f85f2.jpg', caption: 'Recharge in soft fleece' },
  { src: '/Lookbook/a9264262-d9dd-40e1-87d2-abbd36e16694.jpg', caption: 'Frosted street fit' },
  { src: '/Lookbook/a1ea777d-0c13-4d6b-a909-11ccec68429e.jpg', caption: 'Transit mirror fit' },
  { src: '/Lookbook/a8d3c029-dbe8-462f-bdcd-4354c788c4fa.jpg', caption: 'Summit hoodie moment' },
  { src: '/Lookbook/e0fe89be-88c2-445c-bf3f-07d69571bfeb.jpg', caption: 'Brick & bench hang' },
]

export function LookbookPage() {
  const [visible, setVisible] = useState(() => looks.map(() => false))
  const cardsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index)
          if (entry.isIntersecting) {
            setVisible((prev) => {
              if (prev[index]) return prev
              const next = [...prev]
              next[index] = true
              return next
            })
          }
        })
      },
      { threshold: 0.25 }
    )

    cardsRef.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#e6e6fa] via-white to-[#f7f7ff] px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,192,203,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(173,216,230,0.25),transparent_35%)]" aria-hidden />
      <div className="relative space-y-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-600">Lookbook</p>
          <h1 className="text-3xl font-semibold text-neutral-900">Seasonal looks, styled in real spaces.</h1>
          <p className="mx-auto max-w-2xl text-neutral-700">
            A scroll-through of our favorite outfits—shot in soft light and everyday rooms. Tap into relaxed layers,
            oversized cuts, and effortless color stories.
          </p>
        </div>

        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          {looks.map((item, idx) => (
            <figure
              key={item.src}
              data-index={idx}
              ref={(el) => {
                cardsRef.current[idx] = el
              }}
              className={`relative mx-auto w-full max-w-[760px] overflow-hidden rounded-2xl bg-white/90 p-4 pb-6 shadow-xl ring-1 ring-neutral-200 transition duration-700 ease-out ${
                idx % 2 === 0 ? '-rotate-1' : 'rotate-1'
              } ${visible[idx] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/40 opacity-0 transition duration-700 group-hover:opacity-100" aria-hidden />
              <div className="overflow-hidden rounded-md bg-neutral-100">
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  className="mx-auto max-h-[520px] w-full object-contain transition duration-700 ease-out hover:scale-105"
                />
              </div>
              <figcaption className="mt-3 text-center text-sm font-medium text-neutral-700">{item.caption}</figcaption>
              <div className="absolute -left-6 top-6 h-12 w-12 rounded-full bg-pink-200/60 blur-3xl" aria-hidden />
              <div className="absolute -right-8 bottom-4 h-14 w-14 rounded-full bg-blue-200/60 blur-3xl" aria-hidden />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
