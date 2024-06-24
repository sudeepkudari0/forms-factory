import { FaFacebook, FaInstagram } from "react-icons/fa"
import { FaLinkedinIn } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export function SocialLinks() {
  return (
    <ul className="flex space-x-4 items-center md:ml-5">
      <li>
        <a target="_blank" rel="noreferrer" href="https://x.com/thinkRoman">
          <span className="sr-only">Twitter</span>
          <FaXTwitter size={22} className="fill-[#000000]" />
        </a>
      </li>
      <li>
        <a target="_blank" rel="noreferrer" href="https://www.instagram.com/tr.thinkroman">
          <span className="sr-only">Producthunt</span>
          <FaInstagram size={22} className="fill-[#ff7777]" />
        </a>
      </li>
      <li>
        <a target="_blank" rel="noreferrer" href="https://www.facebook.com/groups/thinkRoman">
          <span className="sr-only">Discord</span>
          <FaFacebook size={22} className="fill-[#4b7eff]" />
        </a>
      </li>
      <li>
        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/thinkromanllc">
          <span className="sr-only">LinkedIn</span>
          <FaLinkedinIn size={22} className="fill-[#5495ff]" />
        </a>
      </li>
    </ul>
  )
}
