import { ConlocaIcon } from "@conloca-design-system/components/conloca-icon"

export type HowItWorksBentoIcon =
  | "flash-off-1"
  | "database-01"
  | "globe-01"
  | "left-indent-02"

export interface HowItWorksBentoCard {
  icon: HowItWorksBentoIcon
  title: string
  description: string
}

export interface HowItWorksBentoContent {
  label: string
  heading: string
  cards: readonly HowItWorksBentoCard[]
}

export interface HowItWorksBentoProps {
  content: HowItWorksBentoContent
}

// Static "more than pages" bento grid.
export function HowItWorksBento({ content }: HowItWorksBentoProps) {
  return (
    <section className="hiw-bento" aria-labelledby="hiw-bento-heading">
      <div className="hiw-bento__grid">
        <h2 className="hiw-bento__heading" id="hiw-bento-heading">
          {content.heading}
        </h2>
        {content.cards.map((card) => (
          <article className="hiw-bento-card" key={card.title}>
            <ConlocaIcon
              className="hiw-bento-card__icon"
              name={card.icon}
              size={32}
            />
            <div className="hiw-bento-card__body">
              <h3 className="hiw-bento-card__title">{card.title}</h3>
              <p className="hiw-bento-card__description">{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
