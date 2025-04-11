import Image from './Image'
import Link from './Link'
import SocialIcon from './social-icons'

const Card = ({ title, description, imgSrc, href, github, youtube }) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div
      className={`${
        imgSrc && 'h-full'
      }  overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60 dark:border-gray-700`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}` } className="underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
        <div className="flex space-x-3">
          {/* Add SocialIcon components here */}
          {/* Example: <SocialIcon kind="github" href="https://github.com/username" /> */}
          {github && (<SocialIcon kind='github' href={github} />)}
          {youtube && (<SocialIcon kind='youtube' href={youtube} />)}

        </div>
        
      </div>
    </div>
  </div>
)

export default Card
