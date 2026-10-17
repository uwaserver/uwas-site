"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    name: "AGEZT",
    description: "An agentic operating system",
    href: "https://oxog.net/projects",
  },
  {
    name: "WrongStack",
    description: "AI coding orchestration",
    href: "https://oxog.net/projects",
  },
  {
    name: "WrongTrace",
    description: "Agent observability",
    href: "https://oxog.net/projects",
  },
  {
    name: "NineDeploy",
    description: "Self-hosted deployment",
    href: "https://ninedeploy.com",
  },
];

export function OxogStudio() {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      id="oxog-studio"
      className="container oxog-studio"
      aria-labelledby="oxog-heading"
    >
      <div className="oxog-glow" aria-hidden="true" />
      <div className="oxog-studio-grid">
        <a
          className="oxog-symbol"
          href="https://oxog.net"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit OXOGNET"
        >
          <svg
            viewBox="0 0 200 130"
            fill="none"
            aria-hidden="true"
            className={`oxog-signature${seen && !reducedMotion ? " is-drawing" : ""}`}
          >
            <path
              d="M93 56 72 35C49 13 14 24 9 53 3 84 23 104 46 103"
              stroke="#ed0878"
              strokeWidth="12"
            />
            <path
              d="M146 25c24-7 45 10 47 34 3 26-16 46-39 44-14-1-24-11-41-27"
              stroke="#ed0878"
              strokeWidth="12"
            />
            <path
              d="M76 18c30-20 75 1 77 40 1 12-1 24-6 33M53 36c-19 41 14 84 50 79 9-1 16-3 22-7"
              className="oxog-purple"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <path
              d="m74 87 54-51"
              stroke="#ed0878"
              strokeWidth="12"
              strokeLinecap="square"
            />
          </svg>
        </a>
        <div className="oxog-story">
          <span className="oxog-eyebrow">THE PEOPLE BEHIND THE SERVER</span>
          <p className="oxog-attribution">UWAS is built and maintained by</p>
          <h2 id="oxog-heading">
            <a
              href="https://oxog.net"
              target="_blank"
              rel="noreferrer"
              aria-label="OXOGNET studio"
            >
              oxog<span className="oxog-net">net</span>
              <span className="oxog-dot">.</span>
              <ArrowUpRight size={23} strokeWidth={1.5} />
            </a>
          </h2>
          <p className="oxog-description">
            A small studio in Estonia building AI agents, developer tools and
            the infrastructure behind them.
          </p>
          <a
            className="oxog-explore"
            href="https://oxog.net/projects"
            target="_blank"
            rel="noreferrer"
          >
            Explore the OXOGNET ecosystem
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="oxog-projects">
          <span className="oxog-eyebrow">MORE FROM OXOGNET</span>
          <ul>
            {projects.map((project) => (
              <li key={project.name}>
                <a href={project.href} target="_blank" rel="noreferrer">
                  <span>
                    <strong>{project.name}</strong>
                    <span>{project.description}</span>
                  </span>
                  <ArrowUpRight size={15} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="oxog-studio-bottom">
        <span>OXOGNET OÜ</span>
        <span>Made in Estonia. Built for the world.</span>
      </div>
    </section>
  );
}
