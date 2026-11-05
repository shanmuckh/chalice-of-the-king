import { FaGithub } from "react-icons/fa";

export const CREATOR_NAME = "Surakarapu Shanmukh Srinivas";
export const CREATOR_GITHUB_URL = "https://github.com/shanmuckh";

type Props = {
  heading?: string;
  className?: string;
};

/** Creator credit with a GitHub profile button, shown on end-of-game and credits screens. */
const CreatorCredit = ({ heading = "Created by", className = "" }: Props) => (
  <section
    className={`text-center space-y-3 border-t border-[#444] pt-5 ${className}`}
    aria-label="Game credits"
  >
    <h2 className="text-sm uppercase tracking-[0.25em] text-gray-400 font-cinzel">{heading}</h2>
    <p className="text-2xl md:text-3xl font-cinzel font-bold text-yellow-300 drop-shadow-[0_0_8px_#d4af37]">
      {CREATOR_NAME}
    </p>
    <a
      href={CREATOR_GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-black/60 hover:bg-black border border-yellow-500/60 hover:border-yellow-400 text-white font-cinzel font-semibold px-5 py-2 rounded shadow-lg transition duration-200"
    >
      <FaGithub className="text-xl" aria-hidden="true" />
      View GitHub Profile
    </a>
  </section>
);

export default CreatorCredit;
