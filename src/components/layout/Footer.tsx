import { BsLinkedin } from "react-icons/bs"
import { IoLogoGithub } from "react-icons/io"

const Footer = () => {
    return (
        <footer>
            <div className="container mx-auto py-4 flex items-center gap-4 justify-center border-t border-muted">
                <a target="_blank" href="https://github.com/tarikCekirge"><IoLogoGithub /> </a>
                <a target="_blank" href="https://www.linkedin.com/in/tarikcekirge/"><BsLinkedin />  </a>
            </div>
        </footer>
    )
}

export default Footer