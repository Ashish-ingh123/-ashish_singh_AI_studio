import type { CSSProperties } from "react";
import { cardClasses } from "@/components/card";
import { chipClasses } from "@/components/chip";
import { Orb } from "@/components/orb";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { Section } from "@/components/section";
import { profile, type SkillCategory } from "@/content/profile";

/**
 * A rough measure of how much room a group's chips need: the letters of every skill,
 * plus three for each chip's own padding.
 */
function weight(group: SkillCategory) {
  return group.items.reduce((sum, item) => sum + item.length + 3, 0);
}

// Heaviest first. sort() keeps groups of equal weight in the order they have in
// profile.ts. The copy ([...]) is there because sort() changes the array it is called on.
const byWeight = [...profile.skills].sort((a, b) => weight(b) - weight(a));
// The two heaviest groups get the large cells either side of the orb, and the third
// fills the full-width strip that closes the grid: one line of chips. at() is used
// because, unlike [0], it admits that the item may be missing.
const largeLeft = byWeight.at(0);
const largeRight = byWeight.at(1);
const strip = byWeight.at(2);
// The rest share the row in between, lightest first, so the narrowest cell is on the left.
const middle = byWeight.slice(3).reverse();

// A large cell: full width on a phone, half on a tablet, five of twelve columns from lg.
const largeCell = "col-span-2 sm:col-span-1 lg:col-span-5";

/**
 * How many of the twelve columns a cell of the middle row takes on a wide screen. Three
 * groups share the row 3 + 4 + 5, which follows their weights; one, two or four groups
 * share it equally, and more than four go three to a row. The class names are written out
 * in full because Tailwind only generates a class it can find as a whole word in the
 * source.
 */
function middleSpan(index: number) {
  if (middle.length === 3) {
    return ["lg:col-span-3", "lg:col-span-4", "lg:col-span-5"][index];
  }
  if (middle.length === 4) return "lg:col-span-3";
  if (middle.length === 2) return "lg:col-span-6";
  if (middle.length === 1) return "lg:col-span-12";
  return "lg:col-span-4";
}

/**
 * One group: its name and its skills as chips. The card is a Tailwind "group", so that
 * hovering it can restyle the chips inside (the group-hover: classes): they light up one
 * after another, each waiting 14ms longer than the one before (--n is the chip's place
 * in the list). Twelve chips are done within about 300ms. It is a change of colour only,
 * and under reduced motion all the chips change at once.
 */
function SkillCard({ group, strip = false }: { group: SkillCategory; strip?: boolean }) {
  return (
    <div
      className={`${cardClasses} group h-full p-5 sm:p-6 ${
        strip ? "lg:flex lg:items-center lg:gap-6" : ""
      }`}
    >
      <h3
        className={`mb-3 font-display text-lg font-semibold ${
          strip ? "lg:mb-0 lg:shrink-0" : ""
        }`}
      >
        {group.category}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {group.items.map((item, index) => (
          <li
            key={item}
            style={{ "--n": index } as CSSProperties}
            className={`${chipClasses} transition-colors delay-[calc(var(--n)*14ms)] duration-150 group-hover:border-accent/55 group-hover:bg-accent/15 motion-reduce:transition-none`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Every skill, as a grid of unequal cells (a "bento") sized by how much each group holds.
 *
 * Wide screens have twelve columns: a large cell, the orb and a large cell (5 + 2 + 5),
 * then the middle row, then the strip. Below that the grid has two columns: the orb moves
 * to the top, the large cells stack on a phone and pair up on a tablet, and the middle
 * row's cells go two to a row, with an odd one out taking a row of its own. On a phone
 * only the two lightest of them share a row; the heavier ones wait for a tablet's width.
 */
export function Skills() {
  return (
    <Section id="skills">
      <RevealGroup className="grid grid-cols-2 gap-6 lg:grid-cols-12">
        {largeLeft && (
          <RevealItem className={largeCell}>
            <SkillCard group={largeLeft} />
          </RevealItem>
        )}

        {/*
          The orb: decoration, hidden from screen readers by the Orb itself. It is written
          between the two large cells, which is where it sits from lg, in the two columns
          they leave free. Below lg, -order-1 moves it in front of everything else, onto a
          row of its own. Its glow reaches a little over its neighbours and nothing in it
          can be clicked, so clicks pass straight through it.
        */}
        <RevealItem className="pointer-events-none col-span-2 -order-1 grid place-items-center lg:order-none lg:col-span-2">
          <Orb className="size-[9.375rem]" />
        </RevealItem>

        {largeRight && (
          <RevealItem className={largeCell}>
            <SkillCard group={largeRight} />
          </RevealItem>
        )}

        {middle.map((group, index) => {
          // Below lg the cells go two to a row, and an odd one out at the end keeps a
          // row to itself. The two lightest sit side by side from 360px wide. The
          // groups after them hold longer names, which half a phone's width would
          // break onto two lines, so those pair up from sm.
          const alone = middle.length % 2 === 1 && index === middle.length - 1;
          const half = index < 2 ? "min-[22.5rem]:col-span-1" : "sm:col-span-1";
          return (
            <RevealItem
              key={group.category}
              className={`col-span-2 ${alone ? "" : half} ${middleSpan(index)}`}
            >
              <SkillCard group={group} />
            </RevealItem>
          );
        })}

        {strip && (
          <RevealItem className="col-span-2 lg:col-span-12">
            <SkillCard group={strip} strip />
          </RevealItem>
        )}
      </RevealGroup>
    </Section>
  );
}
